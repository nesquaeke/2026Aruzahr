import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { coldAt, danstsudPlaces, inPolygon, landAt, mapPoint, mountainHeightAt, pixels, riverAt, seededRandom, shoreDistance, signatures, WORLD_DEPTH, WORLD_WIDTH, worldPoint } from './relief-data'
import { buildFarmstead } from './relief-buildings'
import { surfaceNoiseGLSL } from './relief-materials'
import type { UV } from './relief-data'

type XY=[number,number]
export type FarmParcel={id:string;center:UV;polygon:UV[];crop:number;angle:number}
let parcels:FarmParcel[]|undefined,index:Map<string,FarmParcel[]>|undefined
const farmZones=[{id:'valdareth',bounds:[5400,3780,7130,4810]},{id:'manorveil',bounds:[5350,4790,6030,5450]},{id:'lowvale',bounds:[7240,3790,7970,4870]},{id:'dorvenhall',bounds:[6000,3160,6890,3340]}]
function fertile(p:UV){return landAt(p)&&!riverAt(p,.24)&&shoreDistance(p)>.3&&mountainHeightAt(p)<.16&&coldAt(p)<.3&&!danstsudPlaces.some(c=>Math.hypot((p[0]-c.point![0])*WORLD_WIDTH,(p[1]-c.point![1])*WORLD_DEPTH)<(signatures[c.id]?.radius||.63)+.25)}
function clip(poly:XY[],nx:number,ny:number,limit:number){const result:XY[]=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],da=a[0]*nx+a[1]*ny-limit,db=b[0]*nx+b[1]*ny-limit;if(da<=0)result.push(a);if((da<=0)!==(db<=0)){const t=da/(da-db);result.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}}return result}
export function farmlandParcels(){
  if(parcels)return parcels
  parcels=[]
  for(const zone of farmZones){
    const random=seededRandom(`${zone.id}:parcels`),[left,top,right,bottom]=zone.bounds,sites:XY[]=[],step=87
    for(let y=top+step*.5;y<bottom;y+=step)for(let x=left+step*.5;x<right;x+=step)sites.push([x+(random()-.5)*step*.62,y+(random()-.5)*step*.62])
    for(const [i,site]of sites.entries()){
      let poly:XY[]=[[left,top],[right,top],[right,bottom],[left,bottom]]
      for(const other of sites){if(other===site||Math.hypot(other[0]-site[0],other[1]-site[1])>step*3.2)continue;poly=clip(poly,2*(other[0]-site[0]),2*(other[1]-site[1]),other[0]*other[0]+other[1]*other[1]-site[0]*site[0]-site[1]*site[1]);if(poly.length<3)break}
      if(poly.length<3)continue
      const center=pixels([site])[0],polygon=pixels(poly.map(p=>[site[0]+(p[0]-site[0])*.968,site[1]+(p[1]-site[1])*.968]))
      if(!fertile(center))continue
      // Sample the full triangle fan, not only the centre: a field must not
      // bridge a meandering river or cover a coastal indentation.
      let valid=true
      for(let edge=0;edge<polygon.length&&valid;edge++)for(let r=0;r<=6&&valid;r++)for(let s=0;s<=6-r;s++){
        const a=polygon[edge],b=polygon[(edge+1)%polygon.length],p:UV=[center[0]+(a[0]-center[0])*r/6+(b[0]-center[0])*s/6,center[1]+(a[1]-center[1])*r/6+(b[1]-center[1])*s/6]
        if(!fertile(p)){valid=false;break}
      }
      if(valid)parcels.push({id:`${zone.id}:${i}`,center,polygon,crop:Math.floor(random()*5),angle:random()*.9-.45})
    }
  }
  return parcels
}
export function inFarmland(p:UV){
  const [x,,z]=worldPoint(p),cell=2
  if(!index){index=new Map();for(const parcel of farmlandParcels()){const points=parcel.polygon.map(p=>worldPoint(p)),xs=points.map(p=>p[0]),zs=points.map(p=>p[2]);for(let ix=Math.floor(Math.min(...xs)/cell);ix<=Math.floor(Math.max(...xs)/cell);ix++)for(let iz=Math.floor(Math.min(...zs)/cell);iz<=Math.floor(Math.max(...zs)/cell);iz++){const key=`${ix},${iz}`,list=index.get(key)||[];list.push(parcel);index.set(key,list)}}}
  return (index.get(`${Math.floor(x/cell)},${Math.floor(z/cell)}`)||[]).some(parcel=>inPolygon(p,parcel.polygon))
}
export function buildFarms(surface:(p:UV)=>number,mobile:boolean){
  const group=new THREE.Group();group.name='valdareth-fields'
  const pieces:THREE.BufferGeometry[][]=[[],[],[],[],[]],borders:THREE.BufferGeometry[]=[],tracks:number[]=[]
  const colors=['#8c8655','#68734b','#a39569','#78814f','#6d7053']
  for(const [i,parcel]of farmlandParcels().entries()){
    const [cx,,cz]=worldPoint(parcel.center),vertices:number[]=[],uvs:number[]=[],n=mobile?4:8
    const add=(p:XY)=>{vertices.push(p[0],surface(mapPoint(...p))+.023,p[1]);uvs.push((p[0]-cx)*Math.cos(parcel.angle)-(p[1]-cz)*Math.sin(parcel.angle),(p[0]-cx)*Math.sin(parcel.angle)+(p[1]-cz)*Math.cos(parcel.angle))}
    for(let edge=0;edge<parcel.polygon.length;edge++){
      const [ax,,az]=worldPoint(parcel.polygon[edge]),[bx,,bz]=worldPoint(parcel.polygon[(edge+1)%parcel.polygon.length])
      const point=(r:number,s:number):XY=>[cx+(ax-cx)*r/n+(bx-cx)*s/n,cz+(az-cz)*r/n+(bz-cz)*s/n]
      for(let r=0;r<n;r++)for(let s=0;s<n-r;s++){add(point(r,s));add(point(r,s+1));add(point(r+1,s));if(r+s<n-1){add(point(r+1,s));add(point(r,s+1));add(point(r+1,s+1))}}
      const length=Math.hypot(bx-ax,bz-az),steps=Math.max(1,Math.ceil(length/.17))
      for(let step=0;step<steps;step++){
        const t=(step+.5)/steps,x=ax+(bx-ax)*t,z=az+(bz-az)*t,g=new THREE.BoxGeometry(length/steps*1.03,.035,.028);g.rotateY(-Math.atan2(bz-az,bx-ax));g.translate(x,surface(mapPoint(x,z))+.032,z);borders.push(g)
      }
      const dx=-(bz-az)/length*.035,dz=(bx-ax)/length*.035
      for(const [x,z]of [[ax+dx,az+dz],[bx+dx,bz+dz],[ax-dx,az-dz],[bx+dx,bz+dz],[bx-dx,bz-dz],[ax-dx,az-dz]])tracks.push(x,surface(mapPoint(x,z))+.021,z)
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.computeVertexNormals();pieces[parcel.crop].push(geometry)
    if(i%17===0)group.add(buildFarmstead(parcel.center,surface,i%34===0))
  }
  pieces.forEach((batch,i)=>{if(!batch.length)return;const geometry=mergeGeometries(batch)!;batch.forEach(g=>g.dispose());const material=new THREE.MeshStandardMaterial({color:colors[i],roughness:1,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1})
    material.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 vCrop;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvCrop=uv;');shader.fragmentShader='varying vec2 vCrop;\n'+surfaceNoiseGLSL+shader.fragmentShader
      shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float row=sin(vCrop.x*112.)*.5+.5,clod=atlasNoise(vCrop*93.);
        float grain=atlasFbm(vCrop*7.);diffuseColor.rgb*=.82+grain*.18+row*.035+clod*.025;
        float cropBump=row*.004+clod*.001;`)
      shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=atlasBump(-vViewPosition,normal,cropBump);')
    };material.customProgramCacheKey=()=> 'organic-crop-parcels-v1';const mesh=new THREE.Mesh(geometry,material);mesh.receiveShadow=true;group.add(mesh)
  })
  if(borders.length){const geometry=mergeGeometries(borders)!;borders.forEach(g=>g.dispose());const hedge=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:'#526046',roughness:1}));hedge.receiveShadow=true;group.add(hedge)}
  const trackGeo=new THREE.BufferGeometry();trackGeo.setAttribute('position',new THREE.Float32BufferAttribute(tracks,3));trackGeo.computeVertexNormals();group.add(new THREE.Mesh(trackGeo,new THREE.MeshStandardMaterial({color:'#8b7e60',roughness:1,side:THREE.DoubleSide})))
  group.userData.parcels=farmlandParcels();group.userData.count=farmlandParcels().length
  return group
}
