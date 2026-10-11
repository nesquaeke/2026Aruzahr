import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { coldAt, danstsudPlaces, forestZones, inPolygon, landAt, mountainHeightAt, riverAt, seededRandom, shoreDistance, signatures, terrainNoise, WORLD_DEPTH, WORLD_WIDTH, worldPoint } from './relief-data'
import { inRoyalRoadCorridor } from './relief-roads'
import { inFarmland } from './relief-farms'
import { foliageMap } from './relief-foliage'
import type { UV } from './relief-data'

export function createForest(mobile:boolean,surface:(p:UV)=>number) {
  type Tree={matrix:THREE.Matrix4;shadow:THREE.Matrix4;color:THREE.Color;pine:boolean;snow:boolean}
  const tiles=new Map<string,Tree[]>(),anchors:number[][]=[],dummy=new THREE.Object3D(),shade=new THREE.Object3D()
  for(const zone of forestZones){
    const random=seededRandom(`${zone.id}:dense-remaster`),xs=zone.polygon.map(p=>p[0]),ys=zone.polygon.map(p=>p[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),count=Math.round(zone.count*(mobile?.84:1.75))
    let added=0
    for(let tries=0;tries<count*34&&added<count;tries++){
      const p:UV=[minX+random()*(maxX-minX),minY+random()*(maxY-minY)]
      if(!inPolygon(p,zone.polygon)||!landAt(p)||shoreDistance(p)<.3||riverAt(p,.16)||mountainHeightAt(p)>.95||inFarmland(p))continue
      const [x,,z]=worldPoint(p)
      if(inRoyalRoadCorridor(x,z))continue
      if(terrainNoise(x*.7,z*.7)<-.13&&random()>.06)continue
      if(danstsudPlaces.some(c=>Math.hypot((p[0]-c.point![0])*WORLD_WIDTH,(p[1]-c.point![1])*WORLD_DEPTH)<(signatures[c.id]?.radius||(c.major?1.45:.66))))continue
      const size=.64+random()*.76,y=surface(p)
      dummy.position.set(x,y,z);dummy.scale.set(size*(.85+random()*.25),size*(.85+random()*.4),size);dummy.rotation.set(0,random()*Math.PI*2,0);dummy.updateMatrix()
      shade.position.set(x+.08,y+.013,z+.05);shade.scale.set(size,size,size);shade.rotation.set(-Math.PI/2,0,0);shade.updateMatrix()
      const key=`${Math.floor(x/7)},${Math.floor(z/7)}`,list=tiles.get(key)||[]
      list.push({matrix:dummy.matrix.clone(),shadow:shade.matrix.clone(),color:new THREE.Color(zone.type==='autumn'&&random()>.22?'#6a7c4f':zone.color).multiplyScalar(.85+random()*.35),pine:zone.type==='pine',snow:zone.type==='pine'&&coldAt(p,y)>.4});tiles.set(key,list);anchors.push([x,y+.15*size,z]);added++
    }
  }
  function merge(parts:THREE.BufferGeometry[]){const g=mergeGeometries(parts)!;parts.forEach(p=>p.dispose());return g}
  function canopy(detail:boolean,pine:boolean){
    const parts:THREE.BufferGeometry[]=[]
    if(pine){
      // A solid, smoothly shaded crown remains a tree from every camera angle.
      // Overlapping rounded whorls give it a conifer silhouette without cones
      // or flat crossed billboards dominating the map's overhead view.
      const segments=detail?18:12,rings=detail?24:10,vertices:number[]=[],uvs:number[]=[],indices:number[]=[]
      for(let j=0;j<=rings;j++){
        const t=j/rings,y=.16+t*.84,tier=(t*5.2)%1
        const skirt=.78+.22*Math.sin(Math.PI*tier)
        for(let i=0;i<=segments;i++){
          const a=i/segments*Math.PI*2,r=(.028+.31*Math.pow(1-t,.79))*skirt*(.94+.07*Math.sin(a*5+t*11)+.045*Math.cos(a*9-t*17))
          vertices.push(Math.cos(a)*r+.02*Math.sin(t*5),y,Math.sin(a)*r+.013*Math.cos(t*7));uvs.push(i/segments*3,t*3)
          if(j<rings&&i<segments){const n=j*(segments+1)+i;indices.push(n,n+segments+1,n+1,n+1,n+segments+1,n+segments+2)}
        }
      }
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();parts.push(g)
    }else{
      const lobes=detail?[[0,.62,0,.26,.30,.25],[-.15,.49,.045,.21,.22,.19],[.15,.51,-.04,.20,.24,.20],[-.09,.72,-.08,.20,.22,.18],[.1,.72,.09,.18,.23,.18]]:[[0,.6,0,.29,.35,.27]]
      for(const [x,y,z,rx,ry,rz]of lobes){
        const g=new THREE.SphereGeometry(1,detail?14:12,detail?10:8),p=g.getAttribute('position'),normals=g.getAttribute('normal')
        for(let i=0;i<p.count;i++){const px=p.getX(i),py=p.getY(i),pz=p.getZ(i),r=.97+terrainNoise(px*5+y*3,pz*5+py*3)*(detail?.075:.025);p.setXYZ(i,x+px*rx*r,y+py*ry*r,z+pz*rz*r);if(!detail){const n=new THREE.Vector3(px/rx,py/ry,pz/rz).normalize();normals.setXYZ(i,n.x,n.y,n.z)}}
        if(detail)g.computeVertexNormals();parts.push(g)
      }
    }
    const g=merge(parts),p=g.getAttribute('position'),colors:number[]=[]
    for(let i=0;i<p.count;i++){const shade=.72+Math.max(0,p.getY(i))*.23+terrainNoise(p.getX(i)*12,p.getZ(i)*12)*.035;colors.push(shade,shade,shade)}
    g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));return g
  }
  const stems:THREE.BufferGeometry[]=[]
  const trunk=new THREE.CylinderGeometry(.012,.033,.54,9);trunk.translate(0,.27,0);stems.push(trunk)
  for(let i=0;i<5;i++){const a=i*2.399,start=new THREE.Vector3(0,.26+i*.025,0),end=new THREE.Vector3(Math.sin(a)*.16,.52+i*.023,Math.cos(a)*.16),delta=end.clone().sub(start),g=new THREE.CylinderGeometry(.004,.013,delta.length(),6);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.clone().normalize()));g.translate(...start.add(end).multiplyScalar(.5).toArray());stems.push(g)}
  const simpleStem=new THREE.CylinderGeometry(.012,.031,.54,5);simpleStem.translate(0,.27,0)
  const geometries={trunk:merge(stems),simpleStem,leafHigh:canopy(true,false),leafLow:canopy(false,false),pineHigh:canopy(true,true),pineLow:canopy(false,true)}
  const bark=new THREE.MeshStandardMaterial({color:'#50463a',roughness:1})
  const leafMaterial=(pine:boolean,snow:boolean)=>{
    const map=foliageMap(pine),m=new THREE.MeshStandardMaterial({map,color:'#ffffff',vertexColors:true,roughness:1})
    if(snow){m.onBeforeCompile=shader=>{
      shader.vertexShader='varying float vTreeHeight;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvTreeHeight=position.y;');shader.fragmentShader='varying float vTreeHeight;\n'+shader.fragmentShader
      shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>\ndiffuseColor.rgb=mix(diffuseColor.rgb,vec3(.63,.72,.73),smoothstep(.45,.96,vTreeHeight)*.64);`)
    };m.customProgramCacheKey=()=> 'snow-dusted-branches-v1'}
    return m
  }
  const materials={leaf:leafMaterial(false,false),pine:leafMaterial(true,false),snow:leafMaterial(true,true)}
  const shadowMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;void main(){float d=length((vUv-.5)*2.);gl_FragColor=vec4(.035,.045,.033,exp(-d*d*4.)*.19*(1.-smoothstep(.8,1.,d)));}'})
  const group=new THREE.Group();group.name='forests';const trunks=new THREE.Group();trunks.name='forest-trunks';group.add(trunks)
  const lod:THREE.InstancedMesh[]=[]
  function instances(g:THREE.BufferGeometry,mat:THREE.Material,trees:Tree[],parent:THREE.Group,detail?:string){if(!trees.length)return
    const mesh=new THREE.InstancedMesh(g,mat,trees.length);trees.forEach((t,i)=>{mesh.setMatrixAt(i,mat===shadowMaterial?t.shadow:t.matrix);if(mat!==bark&&mat!==shadowMaterial)mesh.setColorAt(i,t.color)});mesh.computeBoundingBox();mesh.computeBoundingSphere();mesh.receiveShadow=true;mesh.castShadow=detail==='high'&&!mobile;mesh.userData.detail=detail;parent.add(mesh);if(detail){mesh.visible=detail==='low';lod.push(mesh)}
  }
  const groundShadow=new THREE.PlaneGeometry(.7,.8)
  for(const [id,list] of tiles){
    const tile=new THREE.Group(),stemTile=new THREE.Group();const [tx,tz]=id.split(',').map(Number);tile.userData.center=stemTile.userData.center=[tx*7+3.5,tz*7+3.5];group.add(tile);trunks.add(stemTile)
    instances(geometries.trunk,bark,list,stemTile,'high');instances(geometries.simpleStem,bark,list,stemTile,'low');instances(groundShadow,shadowMaterial,list,tile)
    for(const type of ['leaf','pine','snow'] as const){const trees=list.filter(t=>type==='leaf'?!t.pine:type==='snow'?t.snow:t.pine&&!t.snow);instances(type==='leaf'?geometries.leafHigh:geometries.pineHigh,materials[type],trees,tile,'high');instances(type==='leaf'?geometries.leafLow:geometries.pineLow,materials[type],trees,tile,'low')}
  }
  group.userData.count=anchors.length;group.userData.anchors=anchors;group.userData.assetStyle='volumetric-branched-crowns'
  return {group,trunk:trunks,lod}
}
