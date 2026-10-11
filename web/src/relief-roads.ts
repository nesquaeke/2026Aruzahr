import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { danstsudPlaces, GEOGRAPHY_BOUNDS, groundHeightAt, landAt, mapPoint, mountainHeightAt, pixels, riverAt, shoreDistance, worldPoint } from './relief-data'
import type { UV } from './relief-data'
import { masonryMaterial } from './relief-materials'

export const hardlaneRoadExclusions=new Set(['frostbay','ternhaven','dranthol','vyssgard','kaldmere','harven','mavric'])
export const royalRoadCities=danstsudPlaces.filter(place=>!hardlaneRoadExclusions.has(place.id))
// Routing uses a stable source grid, independent of the presentation crop.
const STEP=30,GRID_TOP=2100,cols=Math.ceil((GEOGRAPHY_BOUNDS.right-GEOGRAPHY_BOUNDS.left)/STEP)+1,rows=Math.ceil((GEOGRAPHY_BOUNDS.bottom-GRID_TOP)/STEP)+1
const pointAt=(index:number):UV=>pixels([[Math.min(8192,GEOGRAPHY_BOUNDS.left+(index%cols)*STEP),Math.min(5668,GRID_TOP+Math.floor(index/cols)*STEP)]])[0]
class Queue {
  items:[number,number][]=[]
  push(id:number,cost:number){let i=this.items.length;this.items.push([id,cost]);while(i){const parent=(i-1)>>1;if(this.items[parent][1]<=cost)break;this.items[i]=this.items[parent];i=parent}this.items[i]=[id,cost]}
  pop(){const result=this.items[0],last=this.items.pop()!;if(this.items.length){let i=0;while(i*2+1<this.items.length){let c=i*2+1;if(c+1<this.items.length&&this.items[c+1][1]<this.items[c][1])c++;if(this.items[c][1]>=last[1])break;this.items[i]=this.items[c];i=c}this.items[i]=last}return result}
}
export type RoadPath={id:string;points:UV[]}
let cached:RoadPath[]|undefined,localCached:RoadPath[]|undefined
function networkPaths(cities:typeof danstsudPlaces,startId:string,royal:boolean):RoadPath[] {
  const size=cols*rows,costs=new Float32Array(size),heights=new Float32Array(size),dist=new Float64Array(size).fill(Infinity),parent=new Int32Array(size).fill(-1)
  for(let i=0;i<size;i++) {
    const p=pointAt(i),x=p[0]*8192,y=p[1]*5668
    // The royal network stops at the eastern Marhalden approach. It does not
    // create a second maintained crown crossing through western Hardlane.
    if(!landAt(p)||(royal?(y>3990&&x<4900&&!(x>4830&&y>4860&&y<5020)):(y<3930||x>5160))){costs[i]=Infinity;continue}
    const m=mountainHeightAt(p);heights[i]=groundHeightAt(p)
    costs[i]=1+m*m*(royal?5:2.5)+(riverAt(p,.05)?2.5:0)+(shoreDistance(p)<.2?3:0)
  }
  function node(p:UV){const gx=Math.round((p[0]*8192-GEOGRAPHY_BOUNDS.left)/STEP),gy=Math.round((p[1]*5668-GRID_TOP)/STEP);let nearest=-1,distance=Infinity;for(let y=Math.max(0,gy-4);y<=Math.min(rows-1,gy+4);y++)for(let x=Math.max(0,gx-4);x<=Math.min(cols-1,gx+4);x++){const n=y*cols+x,d=Math.hypot(x-gx,y-gy);if(Number.isFinite(costs[n])&&d<distance){nearest=n;distance=d}}return nearest}
  const capital=cities.find(place=>place.id===startId)!,start=node(capital.point!),queue=new Queue();dist[start]=0;queue.push(start,0)
  while(queue.items.length){const [i,d]=queue.pop();if(d!==dist[i])continue;const x=i%cols,y=Math.floor(i/cols)
    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]){
      const nx=x+dx,ny=y+dy;if(nx<0||nx>=cols||ny<0||ny>=rows)continue;const n=ny*cols+nx
      if(!Number.isFinite(costs[n])||(dx&&dy&&(!Number.isFinite(costs[y*cols+nx])||!Number.isFinite(costs[ny*cols+x]))))continue
      const next=d+Math.hypot(dx,dy)*((costs[i]+costs[n])*.5+Math.abs(heights[i]-heights[n])*8)
      if(next<dist[n]){dist[n]=next;parent[n]=i;queue.push(n,next)}
    }
  }
  return cities.map(city=>{
    let n=node(city.point!);const path:UV[]=[city.point!],seen=new Set<number>()
    if(!Number.isFinite(dist[n]))throw new Error(`No overland ${royal?'royal':'local'} route to ${city.id}`)
    while(n!==start&&!seen.has(n)){seen.add(n);path.push(pointAt(n));n=parent[n]}
    path.push(pointAt(start),capital.point!);return {id:city.id,points:path.reverse()}
  })
}
export function royalRoadPaths():RoadPath[]{return cached??=networkPaths(royalRoadCities,'valdareth',true)}
export function localRoadPaths():RoadPath[]{return localCached??=networkPaths(danstsudPlaces.filter(p=>hardlaneRoadExclusions.has(p.id)||p.id==='marhalden'),'frostbay',false)}
export function buildRoyalRoads(surface:(point:UV)=>number){return buildRoads(royalRoadPaths(),surface,true)}
export function buildLocalRoads(surface:(point:UV)=>number){return buildRoads(localRoadPaths(),surface,false)}
const roundedCorners=new Map<string,UV[]>()
// Round grid bends for presentation without changing routing or city anchors.
// Every candidate curve is checked against the actual coast before it is used.
export function roadDisplayPoints(points:UV[]):UV[]{
  if(points.length<3)return points
  const result:UV[]=[points[0]]
  for(let i=1;i<points.length-1;i++){
    const a=points[i-1],b=points[i],c=points[i+1],key=`${a.join(',')}|${b.join(',')}|${c.join(',')}`,cached=roundedCorners.get(key)
    if(cached){result.push(...cached);continue}
    const [ax,,az]=worldPoint(a),[bx,,bz]=worldPoint(b),[cx,,cz]=worldPoint(c)
    const before=Math.hypot(bx-ax,bz-az),after=Math.hypot(cx-bx,cz-bz)
    if(before<.001||after<.001||Math.abs((bx-ax)*(cz-bz)-(bz-az)*(cx-bx))<.00001){result.push(b);continue}
    const r=Math.min(.10,before*.22,after*.22),t=r/before,u=r/after
    const entry:UV=[b[0]+(a[0]-b[0])*t,b[1]+(a[1]-b[1])*t],exit:UV=[b[0]+(c[0]-b[0])*u,b[1]+(c[1]-b[1])*u]
    const curve:UV[]=Array.from({length:5},(_,j)=>{const v=j/4;return [(1-v)*(1-v)*entry[0]+2*(1-v)*v*b[0]+v*v*exit[0],(1-v)*(1-v)*entry[1]+2*(1-v)*v*b[1]+v*v*exit[1]]})
    const corner=curve.every(p=>landAt(p))?curve:[b];roundedCorners.set(key,corner);result.push(...corner)
  }
  result.push(points[points.length-1]);return result
}
function buildRoads(paths:RoadPath[],surface:(point:UV)=>number,royal:boolean){
  const group=new THREE.Group();group.name=royal?'royal-road-network':'hardlane-local-paths'
  const vertices:number[]=[],uvs:number[]=[],segments=new Set<string>(),bridges:THREE.BufferGeometry[]=[],bridgeSites=new Set<string>()
  for(const path of paths.map(path=>({...path,points:roadDisplayPoints(path.points)})))for(let i=1;i<path.points.length;i++){
    const a=path.points[i-1],b=path.points[i],key=[a.join(','),b.join(',')].sort().join('|');if(segments.has(key))continue;segments.add(key)
    const [ax,,az]=worldPoint(a),[bx,,bz]=worldPoint(b),length=Math.hypot(bx-ax,bz-az);if(length<.001)continue
    const across=royal?.054:.032,dx=-(bz-az)/length*across,dz=(bx-ax)/length*across,steps=Math.max(1,Math.ceil(length/.065))
    for(let step=0;step<steps;step++){
      const t=step/steps,u=(step+1)/steps,x=ax+(bx-ax)*t,z=az+(bz-az)*t,nx=ax+(bx-ax)*u,nz=az+(bz-az)*u
      const positions=[[x+dx,z+dz],[x-dx,z-dz],[nx+dx,nz+dz],[nx+dx,nz+dz],[x-dx,z-dz],[nx-dx,nz-dz]]
      for(const [px,pz]of positions){const p=mapPoint(px,pz);vertices.push(px,Math.max(.04,surface(p))+.037,pz);uvs.push(px*4,pz*4)}
    }
    const midpoint:UV=[(a[0]+b[0])/2,(a[1]+b[1])/2]
    if(riverAt(midpoint,.055)){
      const [x,,z]=worldPoint(midpoint),bridgeKey=`${Math.round(x*1.5)},${Math.round(z*1.5)}`
      if(!bridgeSites.has(bridgeKey)){
        bridgeSites.add(bridgeKey);const span=Math.max(.42,length),angle=Math.atan2(bx-ax,bz-az),y=Math.max(.08,surface(midpoint))+.075
        const deck=new THREE.BoxGeometry(royal?.2:.13,.06,span);deck.rotateY(angle);deck.translate(x,y,z);bridges.push(deck)
        for(const side of [-1,1]){const rail=new THREE.BoxGeometry(.019,.055,span);rail.rotateY(angle);rail.translate(x+Math.cos(angle)*side*.083,y+.051,z-Math.sin(angle)*side*.083);bridges.push(rail)}
        const arch=new THREE.TorusGeometry(span*.33,.024,6,16,Math.PI);arch.rotateY(angle-Math.PI/2);arch.translate(x,y-span*.33,z);bridges.push(arch)
      }
    }
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.computeVertexNormals()
  const material=masonryMaterial(royal?'#a29373':'#736b58',royal?'stone':'wood');material.side=THREE.DoubleSide;material.polygonOffset=true;material.polygonOffsetFactor=-1
  const roads=new THREE.Mesh(geometry,material);roads.receiveShadow=true;roads.name=royal?'crown-overland-roads':'rough-local-paths';group.add(roads)
  if(bridges.length){const merged=mergeGeometries(bridges)!;bridges.forEach(g=>g.dispose());const mesh=new THREE.Mesh(merged,new THREE.MeshStandardMaterial({color:'#b0aba0',roughness:1}));mesh.name='royal-river-bridges';mesh.castShadow=true;group.add(mesh)}
  group.userData.connectedCityIds=paths.map(p=>p.id);group.userData.paths=paths;group.userData.bridgeCount=bridgeSites.size
  return group
}

let corridorIndex:Map<string,number[][]>|undefined
export function inRoyalRoadCorridor(x:number,z:number) {
  const cell=.6,margin=.22
  if(!corridorIndex){
    corridorIndex=new Map();const seen=new Set<string>()
    for(const path of [...royalRoadPaths(),...localRoadPaths()])for(let i=1;i<path.points.length;i++){
      const a=path.points[i-1],b=path.points[i],key=[a.join(','),b.join(',')].sort().join('|');if(seen.has(key))continue;seen.add(key)
      const [ax,,az]=worldPoint(a),[bx,,bz]=worldPoint(b),dx=bx-ax,dz=bz-az,segment=[ax,az,dx,dz,dx*dx+dz*dz||1]
      for(let ix=Math.floor((Math.min(ax,bx)-margin)/cell);ix<=Math.floor((Math.max(ax,bx)+margin)/cell);ix++)for(let iz=Math.floor((Math.min(az,bz)-margin)/cell);iz<=Math.floor((Math.max(az,bz)+margin)/cell);iz++){
        const id=`${ix},${iz}`,list=corridorIndex.get(id)||[];list.push(segment);corridorIndex.set(id,list)
      }
    }
  }
  for(const [ax,az,dx,dz,length]of corridorIndex.get(`${Math.floor(x/cell)},${Math.floor(z/cell)}`)||[]){const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/length));if(Math.hypot(x-ax-dx*t,z-az-dz*t)<margin)return true}
  return false
}
