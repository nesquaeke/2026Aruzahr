import * as THREE from 'three'
import { placeById } from './data'
import { mapFeatures } from './map-features'
import { buildLandmark, buildSettlement } from './relief-buildings'
import { coldAt, danstsudPlaces, forestZones, heightAt, inPolygon, mapPoint, pixels, riverPaths, seededRandom, signatures, smoothstep, WORLD_DEPTH, WORLD_WIDTH, worldPoint } from './relief-data'
import type { UV } from './relief-data'

const flowVertex = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`
function waterMaterial(color: string, opacity=.6) {
  return new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,side:THREE.DoubleSide,
    uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(color)},uOpacity:{value:opacity}},
    vertexShader:flowVertex,
    fragmentShader:`uniform float uTime,uOpacity; uniform vec3 uColor; varying vec2 vUv;
      void main(){float ripple=sin(vUv.y*100.0-uTime*1.3+sin(vUv.x*8.0))*.065;
      float edge=smoothstep(0.0,.2,vUv.x)*(1.0-smoothstep(.8,1.0,vUv.x));
      gl_FragColor=vec4(uColor+vec3(ripple),uOpacity*edge);}`,
  })
}
function ribbon(path: UV[],width: number,surface:(point:UV)=>number) {
  const curve=new THREE.CatmullRomCurve3(path.map(point=>new THREE.Vector3(...worldPoint(point))))
  // Sample more finely than the terrain cells: a long chord between river
  // vertices can otherwise disappear inside a raised city bank or mountain.
  const samples=curve.getSpacedPoints(Math.max(128,Math.ceil(curve.getLength()/.06))),vertices:number[]=[],uvs:number[]=[],indices:number[]=[]
  let length=0
  for(let i=0;i<samples.length;i++) {
    const current=samples[i],before=samples[Math.max(0,i-1)],after=samples[Math.min(samples.length-1,i+1)]
    const tangent=new THREE.Vector3().subVectors(after,before).normalize()
    const side=new THREE.Vector3(-tangent.z,0,tangent.x).multiplyScalar(width/2)
    if(i)length+=current.distanceTo(samples[i-1])
    for(const sign of [-1,1]) {
      const x=current.x+side.x*sign,z=current.z+side.z*sign
      vertices.push(x,surface(mapPoint(x,z))+.085,z);uvs.push(sign<0?0:1,length/3)
    }
    if(i){const a=(i-1)*2;indices.push(a,a+1,a+2,a+1,a+3,a+2)}
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2))
  geometry.setIndex(indices);geometry.computeVertexNormals()
  return geometry
}

function createForest(mobile: boolean) {
  const pines: THREE.Matrix4[]=[],leaves: THREE.Matrix4[]=[],trunks: THREE.Matrix4[]=[],caps: THREE.Matrix4[]=[]
  const pineColors:THREE.Color[]=[],leafColors:THREE.Color[]=[]
  const dummy=new THREE.Object3D()
  for(const zone of forestZones) {
    const random=seededRandom(zone.id),xs=zone.polygon.map(p=>p[0]),ys=zone.polygon.map(p=>p[1])
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys)
    const count=Math.round(zone.count*(mobile?.58:1))
    let added=0
    for(let tries=0;tries<count*24&&added<count;tries++) {
      const point:UV=[minX+random()*(maxX-minX),minY+random()*(maxY-minY)]
      if(!inPolygon(point,zone.polygon))continue
      const y=heightAt(point)
      if(y>.5 || danstsudPlaces.some(place=>place.point&&Math.hypot((point[0]-place.point[0])*WORLD_WIDTH,(point[1]-place.point[1])*WORLD_DEPTH)<(signatures[place.id]?.radius||(place.major?1.45:.4))))continue
      const [x,,z]=worldPoint(point),size=.7+random()*.55
      dummy.position.set(x,y+.15*size,z);dummy.scale.setScalar(size);dummy.rotation.set(0,random()*Math.PI,0);dummy.updateMatrix();trunks.push(dummy.matrix.clone())
      dummy.position.y=y+.46*size;dummy.updateMatrix()
      const color=new THREE.Color(zone.color).multiplyScalar(.82+random()*.33)
      if(zone.type==='pine'){pines.push(dummy.matrix.clone());pineColors.push(color)}else{leaves.push(dummy.matrix.clone());leafColors.push(color)}
      if(zone.type==='pine'&&coldAt(point,y)>.4){dummy.position.y=y+.68*size;dummy.updateMatrix();caps.push(dummy.matrix.clone())}
      added++
    }
  }
  const group=new THREE.Group();group.name='forests'
  function instances(geometry: THREE.BufferGeometry,color: string,matrices: THREE.Matrix4[],colors?:THREE.Color[]) {
    const material=new THREE.MeshStandardMaterial({color,roughness:1,flatShading:true})
    const mesh=new THREE.InstancedMesh(geometry,material,matrices.length)
    matrices.forEach((matrix,index)=>{mesh.setMatrixAt(index,matrix);if(colors)mesh.setColorAt(index,colors[index])})
    mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true
    mesh.computeBoundingSphere();mesh.receiveShadow=true;group.add(mesh)
    return mesh
  }
  const trunk=instances(new THREE.CylinderGeometry(.025,.042,.3,5),'#74614d',trunks)
  instances(new THREE.ConeGeometry(.18,.65,7),'#ffffff',pines,pineColors)
  instances(new THREE.IcosahedronGeometry(.25,1),'#ffffff',leaves,leafColors)
  instances(new THREE.ConeGeometry(.064,.16,7),'#d5e1e3',caps)
  group.userData.count=trunks.length
  return {group,trunk}
}

export function buildReliefWorld(texture: THREE.Texture,mobile: boolean) {
  const root=new THREE.Group();root.name='danstsud-relief'
  const cols=mobile?320:512,rows=Math.round(cols*WORLD_DEPTH/WORLD_WIDTH)
  const terrainGeometry=new THREE.PlaneGeometry(WORLD_WIDTH,WORLD_DEPTH,cols,rows)
  terrainGeometry.rotateX(-Math.PI/2)
  const positions=terrainGeometry.getAttribute('position'),snow:number[]=[],cold:number[]=[]
  for(let i=0;i<positions.count;i++) {
    const point=mapPoint(positions.getX(i),positions.getZ(i)),y=heightAt(point)
    positions.setY(i,y);snow.push(smoothstep(1.9,3.8,y));cold.push(coldAt(point,y))
  }
  terrainGeometry.setAttribute('aSnow',new THREE.Float32BufferAttribute(snow,1))
  terrainGeometry.setAttribute('aCold',new THREE.Float32BufferAttribute(cold,1))
  terrainGeometry.computeVertexNormals()
  const sampleHeight=(point:UV)=>{
    const gx=THREE.MathUtils.clamp(point[0],0,1)*cols,gy=THREE.MathUtils.clamp(point[1],0,1)*rows
    const x=Math.min(cols-1,Math.floor(gx)),y=Math.min(rows-1,Math.floor(gy)),fx=gx-x,fy=gy-y
    const a=positions.getY(y*(cols+1)+x),b=positions.getY((y+1)*(cols+1)+x),c=positions.getY((y+1)*(cols+1)+x+1),d=positions.getY(y*(cols+1)+x+1)
    return fx+fy<=1?a+(d-a)*fx+(b-a)*fy:c+(b-c)*(1-fx)+(d-c)*(1-fy)
  }
  const winter={value:0}
  const terrainMaterial=new THREE.MeshStandardMaterial({map:texture,roughness:1,metalness:0})
  // The original coastline, fields, labels and forests survive every zoom.
  // Snow is a restrained local tint; zoom never substitutes invented biomes.
  terrainMaterial.onBeforeCompile=shader=>{
    shader.uniforms.uWinter=winter
    shader.vertexShader='attribute float aSnow; attribute float aCold; varying float vSnow; varying float vCold;\n'+shader.vertexShader
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSnow=aSnow;vCold=aCold;')
    shader.fragmentShader='uniform float uWinter; varying float vSnow; varying float vCold;\n'+shader.fragmentShader
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.rgb=mix(diffuseColor.rgb,vec3(.88,.92,.94),vSnow*.14+uWinter*vCold*.08);')
  }
  const terrain=new THREE.Mesh(terrainGeometry,terrainMaterial);terrain.name='terrain';terrain.receiveShadow=true;root.add(terrain)
  const frame=new THREE.Mesh(new THREE.BoxGeometry(WORLD_WIDTH+.5,.6,WORLD_DEPTH+.5),new THREE.MeshStandardMaterial({color:'#433a2d',roughness:.9}))
  frame.position.y=-.33;root.add(frame)
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(WORLD_WIDTH+.5,.6,WORLD_DEPTH+.5)),new THREE.LineBasicMaterial({color:'#a18452',transparent:true,opacity:.5}))
  edge.position.y=-.33;root.add(edge)

  const waters=new THREE.Group();waters.name='rivers'
  const flows:THREE.ShaderMaterial[]=[]
  for(const river of riverPaths){const material=waterMaterial('#8db4b8',.32);const mesh=new THREE.Mesh(ribbon(river.points,river.width,sampleHeight),material);mesh.userData.targetId=river.id;mesh.name=`river:${river.id}`;waters.add(mesh);flows.push(material)}
  const lakeOutline=pixels([[4170,4690],[4280,4670],[4390,4730],[4510,4815],[4750,4800],[4740,4840],[4590,4870],[4510,4920],[4430,4890],[4320,4840],[4210,4750]])
  const shape=new THREE.Shape(lakeOutline.map(p=>{const [x,,z]=worldPoint(p);return new THREE.Vector2(x,-z)}))
  const lakeGeometry=new THREE.ShapeGeometry(shape);lakeGeometry.rotateX(-Math.PI/2)
  const lakeMaterial=waterMaterial('#94bdc0',.2)
  const lake=new THREE.Mesh(lakeGeometry,lakeMaterial);lake.position.y=.03
  lake.userData.targetId='frostmere-golu';lake.name='frostmere-water';waters.add(lake);flows.push(lakeMaterial)
  const iceMaterial=new THREE.MeshBasicMaterial({color:'#d6e7e9',transparent:true,opacity:.24,side:THREE.DoubleSide,depthWrite:false})
  const ice=new THREE.Mesh(lakeGeometry.clone(),iceMaterial);ice.position.y=.04;ice.visible=false;ice.name='frostmere-ice';waters.add(ice)
  root.add(waters)
  const forests=createForest(mobile);root.add(forests.group)
  const cities=danstsudPlaces.map(place=>buildSettlement({...place,point:place.point!}))
  const monuments=mapFeatures.filter(feature=>feature.region==='danstsud').map(buildLandmark).filter((group):group is THREE.Group=>Boolean(group))
  for(const city of [...cities,...monuments])root.add(city)
  const routes=new THREE.Group();routes.name='trade-routes'
  for(const feature of mapFeatures.filter(feature=>feature.region==='danstsud'&&feature.kind==='route')) {
    const paths=feature.stops?[feature.stops.map(id=>placeById(id)?.point).filter((p):p is UV=>Boolean(p))]:feature.paths||[]
    const group=new THREE.Group();group.name=`route:${feature.id}`;group.userData.targetId=feature.id
    for(const path of paths) {
      const curve=new THREE.CatmullRomCurve3(path.map(point=>new THREE.Vector3(...worldPoint(point))))
      const points=curve.getSpacedPoints(Math.max(64,Math.ceil(curve.getLength()/.1))).map(p=>new THREE.Vector3(p.x,sampleHeight(mapPoint(p.x,p.z))+.11,p.z))
      const geometry=new THREE.BufferGeometry().setFromPoints(points)
      const material=feature.status==='planned'?new THREE.LineDashedMaterial({color:'#c3b69d',dashSize:.27,gapSize:.22,transparent:true,opacity:.8}):new THREE.LineBasicMaterial({color:feature.status==='dangerous'?'#d58c68':'#e8c583',transparent:true,opacity:.9})
      const line=new THREE.Line(geometry,material);line.computeLineDistances();group.add(line)
    }
    routes.add(group)
  }
  root.add(routes)
  const ring=new THREE.Mesh(new THREE.RingGeometry(.26,.34,48),new THREE.MeshBasicMaterial({color:'#ffe0a5',transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false}))
  ring.geometry.rotateX(-Math.PI/2);ring.visible=false;ring.renderOrder=4;root.add(ring)

  const particles=mobile?180:340,random=seededRandom('local-weather'),points:number[]=[],phases:number[]=[]
  for(let i=0;i<particles;i++){points.push(random()*2-1,random()*8,random()*2-1);phases.push(random())}
  const weatherGeometry=new THREE.BufferGeometry();weatherGeometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));weatherGeometry.setAttribute('aPhase',new THREE.Float32BufferAttribute(phases,1))
  const weatherMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,
    uniforms:{uTime:{value:0},uOpacity:{value:0},uSteam:{value:0},uSize:{value:mobile?3:3.4}},
    vertexShader:`uniform float uTime,uSteam,uSize;attribute float aPhase;varying float vFade;
    void main(){vec3 p=position;p.y=mod(position.y-uTime*(.45+aPhase*.55)*(1.0-uSteam*2.0),8.0);
    p.x+=sin(uTime*.3+aPhase*11.0)*.08;p.z+=cos(uTime*.21+aPhase*8.0)*.05;
    vFade=smoothstep(0.0,1.0,p.y)*(1.0-smoothstep(6.5,8.0,p.y));
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);gl_PointSize=uSize*(.5+aPhase*.5)*(1.0+uSteam);}`,
    fragmentShader:`uniform float uOpacity,uSteam;varying float vFade;void main(){float d=length(gl_PointCoord-.5);float a=(1.0-smoothstep(.15,.5,d))*uOpacity*vFade;gl_FragColor=vec4(mix(vec3(.9,.97,1.0),vec3(.77,.85,.84),uSteam),a);}`,
  })
  const weather=new THREE.Points(weatherGeometry,weatherMaterial);weather.frustumCulled=false;weather.name='local-snow-and-steam';root.add(weather)
  return {root,terrain,terrainMaterial,sampleHeight,winter,waters,flows,ice,forests,cities,monuments,routes,ring,weather,weatherMaterial,columns:cols,rows,vertices:positions.count}
}

export function disposeWorld(root: THREE.Object3D) {
  const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>()
  root.traverse(object=>{
    const drawable=object as THREE.Mesh
    if(drawable.geometry)geometries.add(drawable.geometry)
    if(drawable.material)for(const material of Array.isArray(drawable.material)?drawable.material:[drawable.material]){
      materials.add(material)
      if('map' in material&&material.map instanceof THREE.Texture)textures.add(material.map)
    }
  })
  geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose())
}
