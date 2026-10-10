import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { placeById } from './data'
import { mapFeatures } from './map-features'
import { buildLandmark, buildSettlement } from './relief-buildings'
import { coldAt, danstsudPlaces, DANSTSUD_VIEW, forestZones, GEOGRAPHY_BOUNDS, groundHeightAt, heightAt, inPolygon, lakeOutline, landAt, lineDistance, mapPoint, mountainHeightAt, pixels, riverAt, riverPaths, seededRandom, shoreDistance, signatures, smoothstep, snowAt, terrainNoise, WORLD_DEPTH, WORLD_WIDTH, worldPoint } from './relief-data'
import type { UV } from './relief-data'

const flowVertex = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`
function waterMaterial(color: string, opacity=.6) {
  return new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,side:THREE.DoubleSide,
    uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(color)},uOpacity:{value:opacity}},
    vertexShader:flowVertex,
    fragmentShader:`uniform float uTime,uOpacity; uniform vec3 uColor; varying vec2 vUv;
      void main(){float ripple=sin(vUv.y*100.0-uTime*1.3+sin(vUv.x*8.0))*.012;
      float edge=smoothstep(0.0,.2,vUv.x)*(1.0-smoothstep(.8,1.0,vUv.x));
      gl_FragColor=vec4(uColor+vec3(ripple),uOpacity*edge);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}`,
  })
}
function ribbon(path: UV[],width: number,surface:(point:UV)=>number) {
  const curve=new THREE.CatmullRomCurve3(path.map(point=>new THREE.Vector3(...worldPoint(point))))
  // Sample more finely than the terrain cells: a long chord between river
  // vertices can otherwise disappear inside a raised city bank or mountain.
  const samples=curve.getSpacedPoints(Math.max(128,Math.ceil(curve.getLength()/.06))),vertices:number[]=[],uvs:number[]=[],indices:number[]=[]
  const across=8
  let length=0
  for(let i=0;i<samples.length;i++) {
    const current=samples[i],before=samples[Math.max(0,i-1)],after=samples[Math.min(samples.length-1,i+1)]
    const tangent=new THREE.Vector3().subVectors(after,before).normalize()
    const side=new THREE.Vector3(-tangent.z,0,tangent.x).multiplyScalar(width/2)
    if(i)length+=current.distanceTo(samples[i-1])
    for(let j=0;j<=across;j++) {
      const sign=j/across*2-1,x=current.x+side.x*sign,z=current.z+side.z*sign
      vertices.push(x,surface(mapPoint(x,z))+.085,z);uvs.push(j/across,length/3)
    }
    if(i)for(let j=0;j<across;j++){const a=(i-1)*(across+1)+j,b=i*(across+1)+j;indices.push(a,a+1,b,a+1,b+1,b)}
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2))
  geometry.setIndex(indices);geometry.computeVertexNormals()
  return geometry
}

function createForest(mobile: boolean,surface:(point:UV)=>number) {
  const pines: THREE.Matrix4[]=[],leaves: THREE.Matrix4[]=[],trunks: THREE.Matrix4[]=[],caps: THREE.Matrix4[]=[]
  const pineColors:THREE.Color[]=[],leafColors:THREE.Color[]=[]
  const dummy=new THREE.Object3D()
  const roads=mapFeatures.filter(f=>f.region==='danstsud'&&f.kind==='route'&&f.status!=='planned').flatMap(f=>f.stops?[f.stops.map(id=>placeById(id)?.point).filter((p):p is UV=>Boolean(p))]:f.paths||[])
  for(const zone of forestZones) {
    const random=seededRandom(zone.id),xs=zone.polygon.map(p=>p[0]),ys=zone.polygon.map(p=>p[1])
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys)
    const count=Math.round(zone.count*(mobile?.58:1))
    let added=0
    for(let tries=0;tries<count*24&&added<count;tries++) {
      const point:UV=[minX+random()*(maxX-minX),minY+random()*(maxY-minY)]
      if(!inPolygon(point,zone.polygon)||!landAt(point)||shoreDistance(point)<.3||riverAt(point,.16)||roads.some(path=>lineDistance(point,path)<.15))continue
      // Soft clustering leaves natural openings instead of uniformly filling polygons.
      const [wx,,wz]=worldPoint(point)
      if(terrainNoise(wx*.7,wz*.7)<-.24&&random()>.18)continue
      const y=surface(point)
      if(mountainHeightAt(point)>.65 || danstsudPlaces.some(place=>place.point&&Math.hypot((point[0]-place.point[0])*WORLD_WIDTH,(point[1]-place.point[1])*WORLD_DEPTH)<(signatures[place.id]?.radius||(place.major?1.45:.4))))continue
      const [x,,z]=worldPoint(point),size=.7+random()*.55
      dummy.position.set(x,y+.15*size,z);dummy.scale.set(size*(.85+random()*.25),size*(.9+random()*.25),size);dummy.rotation.set(0,random()*Math.PI,0);dummy.updateMatrix();trunks.push(dummy.matrix.clone())
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
  const pineLower=new THREE.ConeGeometry(.18,.42,7),pineUpper=new THREE.ConeGeometry(.13,.35,7);pineLower.translate(0,-.08,0);pineUpper.translate(0,.15,0)
  const pine=mergeGeometries([pineLower,pineUpper])!;pineLower.dispose();pineUpper.dispose()
  instances(pine,'#ffffff',pines,pineColors)
  const crowns=[new THREE.IcosahedronGeometry(.2,0),new THREE.IcosahedronGeometry(.17,0),new THREE.IcosahedronGeometry(.16,0)]
  crowns[0].translate(0,.08,0);crowns[1].translate(-.1,-.015,.055);crowns[2].translate(.1,-.03,-.05)
  const crown=mergeGeometries(crowns)!;crowns.forEach(g=>g.dispose())
  instances(crown,'#ffffff',leaves,leafColors)
  instances(new THREE.ConeGeometry(.064,.16,7),'#d5e1e3',caps)
  group.userData.count=trunks.length
  group.userData.anchors=trunks.map(matrix=>new THREE.Vector3().setFromMatrixPosition(matrix).toArray())
  return {group,trunk}
}

export function buildReliefWorld(mobile: boolean) {
  const root=new THREE.Group();root.name='danstsud-new-geography'
  const cols=mobile?360:640,rows=Math.round(cols*DANSTSUD_VIEW.depth/DANSTSUD_VIEW.width)
  const terrainGeometry=new THREE.PlaneGeometry(DANSTSUD_VIEW.width,DANSTSUD_VIEW.depth,cols,rows)
  terrainGeometry.rotateX(-Math.PI/2)
  const centre=worldPoint(DANSTSUD_VIEW.point)
  terrainGeometry.translate(centre[0],0,centre[2])
  const positions=terrainGeometry.getAttribute('position'),snow:number[]=[],cold:number[]=[],colors:number[]=[]
  const grass=new THREE.Color('#799476'),earth=new THREE.Color('#9a9676'),rock=new THREE.Color('#797e79'),beach=new THREE.Color('#b6b098'),bed=new THREE.Color('#1d5366')
  const paint=new THREE.Color()
  for(let i=0;i<positions.count;i++) {
    const x=positions.getX(i),z=positions.getZ(i),point=mapPoint(x,z),land=landAt(point),coast=shoreDistance(point),mountain=mountainHeightAt(point,land),y=groundHeightAt(point,land,coast,mountain)
    positions.setY(i,y)
    const grain=terrainNoise(x,z)
    snow.push(snowAt(point,y,land));cold.push(land?coldAt(point,y):0)
    if(land){
      paint.copy(grass).lerp(earth,.25+grain*.18).lerp(rock,smoothstep(.5,1.4,mountain))
      paint.lerp(beach,1-smoothstep(0,.55,coast))
      paint.multiplyScalar(.95+grain*.065)
    }else paint.copy(bed)
    colors.push(paint.r,paint.g,paint.b)
  }
  terrainGeometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
  terrainGeometry.setAttribute('aSnow',new THREE.Float32BufferAttribute(snow,1))
  terrainGeometry.setAttribute('aCold',new THREE.Float32BufferAttribute(cold,1))
  terrainGeometry.computeVertexNormals()
  const sampleHeight=(point:UV)=>{
    const gx=THREE.MathUtils.clamp((point[0]*8192-GEOGRAPHY_BOUNDS.left)/(GEOGRAPHY_BOUNDS.right-GEOGRAPHY_BOUNDS.left),0,1)*cols
    const gy=THREE.MathUtils.clamp((point[1]*5668-GEOGRAPHY_BOUNDS.top)/(GEOGRAPHY_BOUNDS.bottom-GEOGRAPHY_BOUNDS.top),0,1)*rows
    const x=Math.min(cols-1,Math.floor(gx)),y=Math.min(rows-1,Math.floor(gy)),fx=gx-x,fy=gy-y
    const a=positions.getY(y*(cols+1)+x),b=positions.getY((y+1)*(cols+1)+x),c=positions.getY((y+1)*(cols+1)+x+1),d=positions.getY(y*(cols+1)+x+1)
    return fx+fy<=1?a+(d-a)*fx+(b-a)*fy:c+(b-c)*(1-fx)+(d-c)*(1-fy)
  }
  const winter={value:0}
  const terrainMaterial=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0})
  terrainMaterial.onBeforeCompile=shader=>{
    shader.uniforms.uWinter=winter
    shader.vertexShader='attribute float aSnow; attribute float aCold; varying float vSnow; varying float vCold; varying vec3 vGround;\n'+shader.vertexShader
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSnow=aSnow;vCold=aCold;vGround=position;')
    shader.fragmentShader=`uniform float uWinter; varying float vSnow; varying float vCold; varying vec3 vGround;
      float hashGround(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float pigmentNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hashGround(i),hashGround(i+vec2(1,0)),f.x),mix(hashGround(i+vec2(0,1)),hashGround(i+vec2(1,1)),f.x),f.y);}
      `+shader.fragmentShader
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float brush=(pigmentNoise(vGround.xz*vec2(31.0,17.0))-.5)*.045;
      diffuseColor.rgb*=1.0+brush;
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.78,.85,.85),clamp(vSnow+uWinter*vCold*.42,0.0,.97));`)
  }
  terrainMaterial.customProgramCacheKey=()=> 'painted-danstsud-v3'
  const terrain=new THREE.Mesh(terrainGeometry,terrainMaterial);terrain.name='terrain';terrain.receiveShadow=true;root.add(terrain)
  const frame=new THREE.Mesh(new THREE.BoxGeometry(DANSTSUD_VIEW.width+.45,.5,DANSTSUD_VIEW.depth+.45),new THREE.MeshStandardMaterial({color:'#273e45',roughness:1}))
  frame.position.set(centre[0],-1.25,centre[2]);root.add(frame)
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(frame.geometry),new THREE.LineBasicMaterial({color:'#a18452',transparent:true,opacity:.45}))
  edge.position.copy(frame.position);root.add(edge)

  // A genuine sea surface above the submerged seabed. Its pigment, waves and
  // shallows are generated from geometry; there is no source image or texture.
  const seaGeometry=new THREE.PlaneGeometry(DANSTSUD_VIEW.width,DANSTSUD_VIEW.depth,160,96)
  seaGeometry.rotateX(-Math.PI/2);seaGeometry.translate(centre[0],.015,centre[2])
  const seaPositions=seaGeometry.getAttribute('position'),shallows:number[]=[]
  for(let i=0;i<seaPositions.count;i++)shallows.push(1-smoothstep(.25,3.2,shoreDistance(mapPoint(seaPositions.getX(i),seaPositions.getZ(i)))))
  seaGeometry.setAttribute('aShallow',new THREE.Float32BufferAttribute(shallows,1))
  const oceanMaterial=new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0},uDetail:{value:1}},
    vertexShader:`attribute float aShallow; varying float vShallow; varying vec3 vWorld;void main(){vShallow=aShallow;vWorld=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`uniform float uTime,uDetail;varying float vShallow;varying vec3 vWorld;
      void main(){float wave=sin(vWorld.x*1.8+vWorld.z*.5-uTime*.21)+sin(vWorld.z*2.6+sin(vWorld.x*.9)-uTime*.16);
      float lines=pow(max(0.0,sin(vWorld.x*7.0+vWorld.z*3.4+sin(vWorld.z*2.0)-uTime*.6)),18.0)*.014;
      vec3 pigment=mix(vec3(.035,.125,.18),vec3(.17,.38,.41),vShallow*.84);
      pigment+=wave*.006*uDetail+lines*uDetail*(.35+.65*max(0.0,sin(vWorld.x*.41)*cos(vWorld.z*.33)));
      gl_FragColor=vec4(pigment,1.0);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`
  })
  const ocean=new THREE.Mesh(seaGeometry,oceanMaterial);ocean.name='ocean';root.add(ocean)
  const waters=new THREE.Group();waters.name='rivers-and-lake'
  const flows:THREE.ShaderMaterial[]=[oceanMaterial]
  for(const river of riverPaths){
    const material=waterMaterial('#689ea5',.82)
    const mesh=new THREE.Mesh(ribbon(river.points,river.width,p=>Math.max(.02,sampleHeight(p))),material)
    mesh.userData.targetId=river.id;mesh.name=`river:${river.id}`;waters.add(mesh);flows.push(material)
  }
  const shape=new THREE.Shape(lakeOutline.map(p=>{const [x,,z]=worldPoint(p);return new THREE.Vector2(x,-z)}))
  const lakeGeometry=new THREE.ShapeGeometry(shape);lakeGeometry.rotateX(-Math.PI/2)
  lakeGeometry.computeBoundingBox()
  const lakeBounds=lakeGeometry.boundingBox!,lakePositions=lakeGeometry.getAttribute('position'),lakeUV=lakeGeometry.getAttribute('uv')
  for(let i=0;i<lakePositions.count;i++)lakeUV.setXY(i,(lakePositions.getX(i)-lakeBounds.min.x)/(lakeBounds.max.x-lakeBounds.min.x),(lakePositions.getZ(i)-lakeBounds.min.z)/(lakeBounds.max.z-lakeBounds.min.z))
  const lakeMaterial=waterMaterial('#779faa',.8)
  const lake=new THREE.Mesh(lakeGeometry,lakeMaterial);lake.position.y=.035
  lake.userData.targetId='frostmere-golu';lake.name='frostmere-water';waters.add(lake);flows.push(lakeMaterial)
  const iceMaterial=new THREE.MeshBasicMaterial({color:'#d6e7e9',transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false})
  const ice=new THREE.Mesh(lakeGeometry.clone(),iceMaterial);ice.position.y=.045;ice.visible=false;ice.name='frostmere-ice';waters.add(ice)
  root.add(waters)
  const forests=createForest(mobile,p=>Math.max(0,sampleHeight(p)));root.add(forests.group)
  const cities=danstsudPlaces.map(place=>buildSettlement({...place,point:place.point!}))
  const monuments=mapFeatures.filter(feature=>feature.region==='danstsud').map(buildLandmark).filter((group):group is THREE.Group=>Boolean(group))
  for(const city of [...cities,...monuments]){
    const point=mapPoint(city.position.x,city.position.z)
    city.position.y=Math.max(heightAt(point),sampleHeight(point))+.025
    if(city.userData.targetId==='marhalden'){city.position.y=Math.max(.345,city.position.y);city.rotation.y=-.98}
    root.add(city)
  }

  // Small fields give the fertile capital plain a purpose and a sense of scale.
  // They use the same land/water exclusions as trees, never cover settlements.
  const fields=new THREE.Group();fields.name='valdareth-fields'
  const fieldRandom=seededRandom('valdareth-fertile-plain')
  const fieldPalette=['#9b9b6a','#85966e','#aba477','#7e986e']
  const patches:THREE.BufferGeometry[][]=[[],[],[],[]]
  for(let i=0;i<320;i++){
    const point=pixels([[5500+fieldRandom()*1500,3800+fieldRandom()*1500]])[0]
    if(!landAt(point)||riverAt(point,.7)||mountainHeightAt(point)>.05||shoreDistance(point)<.8)continue
    if(danstsudPlaces.some(p=>Math.hypot((point[0]-p.point![0])*WORLD_WIDTH,(point[1]-p.point![1])*WORLD_DEPTH)<(signatures[p.id]?.radius||.6)+.65))continue
    const [x,,z]=worldPoint(point),w=.35+fieldRandom()*.8,d=.3+fieldRandom()*.6,y=sampleHeight(point)+.018
    const geometry=new THREE.PlaneGeometry(w,d);geometry.rotateX(-Math.PI/2)
    geometry.rotateY(.2);geometry.translate(x,y,z);patches[i%4].push(geometry)
  }
  patches.forEach((pieces,index)=>{
    if(!pieces.length)return
    const merged=mergeGeometries(pieces);pieces.forEach(g=>g.dispose());if(!merged)return
    const material=new THREE.MeshStandardMaterial({color:fieldPalette[index],roughness:1,polygonOffset:true,polygonOffsetFactor:-1})
    const field=new THREE.Mesh(merged,material);field.receiveShadow=true;fields.add(field)
  })
  root.add(fields)
  const routes=new THREE.Group();routes.name='trade-routes'
  for(const feature of mapFeatures.filter(feature=>feature.region==='danstsud'&&feature.kind==='route')) {
    const paths=feature.stops?[feature.stops.map(id=>placeById(id)?.point).filter((p):p is UV=>Boolean(p))]:feature.paths||[]
    const group=new THREE.Group();group.name=`route:${feature.id}`;group.userData.targetId=feature.id
    for(const path of paths) {
      const curve=new THREE.CurvePath<THREE.Vector3>()
      for(let i=1;i<path.length;i++)curve.add(new THREE.LineCurve3(new THREE.Vector3(...worldPoint(path[i-1])),new THREE.Vector3(...worldPoint(path[i]))))
      const points=curve.getSpacedPoints(Math.max(64,Math.ceil(curve.getLength()/.1))).map(p=>new THREE.Vector3(p.x,Math.max(0,sampleHeight(mapPoint(p.x,p.z)))+.11,p.z))
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
  return {root,terrain,terrainMaterial,sampleHeight,winter,ocean,oceanMaterial,waters,flows,ice,forests,cities,monuments,routes,ring,weather,weatherMaterial,columns:cols,rows,vertices:positions.count}
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
