import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { coldAt, danstsudPlaces, forestZones, inPolygon, landAt, mountainHeightAt, riverAt, seededRandom, shoreDistance, signatures, terrainNoise, WORLD_DEPTH, WORLD_WIDTH, worldPoint } from './relief-data'
import { inRoyalRoadCorridor } from './relief-roads'
import type { UV } from './relief-data'

// Spatial tiles keep detailed canopies out of the draw list when the camera
// visits a city. Distant geometry is deliberately simpler, never faceted.
export function createForest(mobile:boolean,surface:(p:UV)=>number) {
  type Tree={matrix:THREE.Matrix4;color:THREE.Color;pine:boolean;snow:boolean}
  const tiles=new Map<string,Tree[]>(),anchors:number[][]=[],dummy=new THREE.Object3D()
  for(const zone of forestZones){
    const random=seededRandom(zone.id),xs=zone.polygon.map(p=>p[0]),ys=zone.polygon.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),count=Math.round(zone.count*(mobile?.58:1))
    let added=0
    for(let tries=0;tries<count*24&&added<count;tries++){
      const p:UV=[minX+random()*(maxX-minX),minY+random()*(maxY-minY)]
      if(!inPolygon(p,zone.polygon)||!landAt(p)||shoreDistance(p)<.3||riverAt(p,.16)||mountainHeightAt(p)>.65)continue
      const [x,,z]=worldPoint(p)
      if(inRoyalRoadCorridor(x,z))continue
      if(terrainNoise(x*.7,z*.7)<-.24&&random()>.18)continue
      if(danstsudPlaces.some(c=>Math.hypot((p[0]-c.point![0])*WORLD_WIDTH,(p[1]-c.point![1])*WORLD_DEPTH)<(signatures[c.id]?.radius||(c.major?1.45:.4))))continue
      const size=.7+random()*.55,y=surface(p)
      dummy.position.set(x,y,z);dummy.scale.set(size*(.85+random()*.25),size*(.9+random()*.25),size);dummy.rotation.set(0,random()*Math.PI*2,0);dummy.updateMatrix()
      const key=`${Math.floor(x/7)},${Math.floor(z/7)}`,list=tiles.get(key)||[]
      list.push({matrix:dummy.matrix.clone(),color:new THREE.Color(zone.type==='autumn'&&random()>.28?'#657653':zone.color).multiplyScalar(.7+random()*.33),pine:zone.type==='pine',snow:zone.type==='pine'&&coldAt(p,y)>.4});tiles.set(key,list);anchors.push([x,y+.15*size,z]);added++
    }
  }
  function merge(parts:THREE.BufferGeometry[]){const g=mergeGeometries(parts)!;parts.forEach(p=>p.dispose());return g}
  function canopy(detail:boolean,pine:boolean){
    const parts:THREE.BufferGeometry[]=[]
    const lobe=(x:number,y:number,z:number,r:number,stretch:number)=>{const g=new THREE.SphereGeometry(r,detail?10:8,detail?7:5),p=g.getAttribute('position');for(let i=0;i<p.count;i++){const px=p.getX(i),py=p.getY(i),pz=p.getZ(i),grain=1+Math.sin(px*73+py*57)*Math.cos(pz*67+py*31)*.075;p.setXYZ(i,px*grain,py*grain,pz*grain)}g.scale(1,stretch,.93);g.translate(x,y,z);g.computeVertexNormals();parts.push(g)}
    if(pine){
      for(let level=0;level<(detail?5:4);level++){const radius=.18*(1-level*.17),y=.25+level*.105,n=detail?5:3;for(let branch=0;branch<n;branch++){const angle=branch*Math.PI*2/n+level*1.9;lobe(Math.cos(angle)*radius*.42,y,Math.sin(angle)*radius*.42,radius*.7,.52)}}
      lobe(0,.79,0,.035,1.9)
    }else{
      const centers=detail?[[0,.45,0,.18],[-.11,.37,.07,.135],[.11,.38,-.065,.14],[.02,.57,.025,.115],[-.025,.38,-.115,.125]]:[[0,.45,0,.18],[-.1,.38,.07,.13],[.1,.38,-.07,.13]]
      for(const [x,y,z,r] of centers)lobe(x,y,z,r,1.06)
    }
    return merge(parts)
  }
  const geometries={trunk:new THREE.CylinderGeometry(.021,.038,.4,12),highPine:canopy(true,true),lowPine:canopy(false,true),highLeaf:canopy(true,false),lowLeaf:canopy(false,false),snow:new THREE.CylinderGeometry(.008,.045,.14,12)}
  geometries.trunk.translate(0,.2,0);geometries.snow.translate(0,.77,0)
  const bark=new THREE.MeshStandardMaterial({color:'#504639',roughness:1}),foliage=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:1}),snow=new THREE.MeshStandardMaterial({color:'#d9e2e1',roughness:.95})
  foliage.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec3 vLeaf;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvLeaf=position;');shader.fragmentShader='varying vec3 vLeaf;\n'+shader.fragmentShader
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float leafGrain=fract(sin(dot(floor(vLeaf.xz*240.+vLeaf.y*83.),vec2(127.1,311.7)))*43758.5);
      diffuseColor.rgb*=mix(.62,1.05,smoothstep(.21,.66,vLeaf.y))*(.84+leafGrain*.22);`)
  }
  foliage.customProgramCacheKey=()=> 'foliage-clusters-2'
  const group=new THREE.Group();group.name='forests';const trunks=new THREE.Group();trunks.name='forest-trunks';group.add(trunks)
  const lod:THREE.InstancedMesh[]=[]
  function instances(g:THREE.BufferGeometry,mat:THREE.Material,trees:Tree[],parent:THREE.Group,detail?:string){if(!trees.length)return
    const mesh=new THREE.InstancedMesh(g,mat,trees.length);trees.forEach((t,i)=>{mesh.setMatrixAt(i,t.matrix);if(mat===foliage)mesh.setColorAt(i,t.color)});mesh.computeBoundingBox();mesh.computeBoundingSphere();mesh.receiveShadow=true;mesh.castShadow=detail==='high'&&!mobile;mesh.userData.detail=detail;parent.add(mesh);if(detail){mesh.visible=detail==='low';lod.push(mesh)}
  }
  for(const [id,list] of tiles){
    const tile=new THREE.Group();const [tx,tz]=id.split(',').map(Number);tile.userData.center=[tx*7+3.5,tz*7+3.5];group.add(tile);instances(geometries.trunk,bark,list,trunks)
    for(const pine of [true,false]){const trees=list.filter(t=>t.pine===pine);instances(pine?geometries.highPine:geometries.highLeaf,foliage,trees,tile,'high');instances(pine?geometries.lowPine:geometries.lowLeaf,foliage,trees,tile,'low')}
    instances(geometries.snow,snow,list.filter(t=>t.snow),tile)
  }
  group.userData.count=anchors.length;group.userData.anchors=anchors
  return {group,trunk:trunks,lod}
}
