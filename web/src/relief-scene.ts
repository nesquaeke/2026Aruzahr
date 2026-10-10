import * as THREE from 'three'
import { places, placeById } from './data'
import { mapFeatures } from './map-features'
import { buildLandmark, buildSettlement } from './relief-buildings'
import { coldAt, forestZones, heightAt, inPolygon, landAt, mapPoint, riverPaths, seededRandom, signatures, smoothstep, WORLD_DEPTH, WORLD_WIDTH, worldPoint } from './relief-data'
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
      if(!inPolygon(point,zone.polygon)||!landAt(point))continue
      const y=heightAt(point)
      if(y>3.4 || places.some(place=>place.point&&Math.hypot((point[0]-place.point[0])*WORLD_WIDTH,(point[1]-place.point[1])*WORLD_DEPTH)<(signatures[place.id]?.radius||(place.major?1.45:.4))))continue
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
  const root=new THREE.Group();root.name='valhunar-relief'
  const cols=mobile?160:240,rows=Math.round(cols*WORLD_DEPTH/WORLD_WIDTH)
  const terrainGeometry=new THREE.PlaneGeometry(WORLD_WIDTH,WORLD_DEPTH,cols,rows)
  terrainGeometry.rotateX(-Math.PI/2)
  const positions=terrainGeometry.getAttribute('position'),snow:number[]=[],cold:number[]=[],biomes:number[]=[]
  const mask=new Uint8Array((cols+1)*(rows+1))
  for(let i=0;i<positions.count;i++) {
    const point=mapPoint(positions.getX(i),positions.getZ(i)),y=heightAt(point)
    positions.setY(i,y);snow.push(point[0]>.37&&point[0]<.64&&point[1]<.4?0:smoothstep(2.85,5.1,y));cold.push(coldAt(point,y))
    const [u,v]=point
    let color=y<.06?'#486878':u<.38&&v<.45?(v<.225?'#bbae82':'#728472'):u<.415&&v>.46?'#c2d1d4':u>.37&&u<.64&&v<.4?'#716054':u>.7&&v<.26?'#929789':u>.73&&v<.41?'#88947a':u>.54&&v<.5?'#868a7d':u<.57&&v>.72?'#bac9ca':'#9caa85'
    if(y>.06){const zone=forestZones.find(zone=>inPolygon(point,zone.polygon));if(zone)color=zone.color}
    const paint=new THREE.Color(color)
    if(y>1.65)paint.lerp(new THREE.Color('#9b9b8c'),smoothstep(1.65,3.8,y)*.55)
    paint.multiplyScalar(.96+Math.sin(u*83+v*57)*.012+Math.cos(v*139-u*45)*.006)
    biomes.push(paint.r,paint.g,paint.b)
    const row=Math.floor(i/(cols+1)),col=i%(cols+1)
    mask[(rows-row)*(cols+1)+col]=y>.06?255:0
  }
  terrainGeometry.setAttribute('aSnow',new THREE.Float32BufferAttribute(snow,1))
  terrainGeometry.setAttribute('aCold',new THREE.Float32BufferAttribute(cold,1))
  terrainGeometry.setAttribute('aBiome',new THREE.Float32BufferAttribute(biomes,3))
  terrainGeometry.computeVertexNormals()
  const sampleHeight=(point:UV)=>{
    const gx=THREE.MathUtils.clamp(point[0],0,1)*cols,gy=THREE.MathUtils.clamp(point[1],0,1)*rows
    const x=Math.min(cols-1,Math.floor(gx)),y=Math.min(rows-1,Math.floor(gy)),fx=gx-x,fy=gy-y
    const a=positions.getY(y*(cols+1)+x),b=positions.getY((y+1)*(cols+1)+x),c=positions.getY((y+1)*(cols+1)+x+1),d=positions.getY(y*(cols+1)+x+1)
    return fx+fy<=1?a+(d-a)*fx+(b-a)*fy:c+(b-c)*(1-fx)+(d-c)*(1-fy)
  }
  const winter={value:0},paint={value:0}
  const terrainMaterial=new THREE.MeshStandardMaterial({map:texture,roughness:1,metalness:0})
  terrainMaterial.onBeforeCompile=shader=>{
    shader.uniforms.uWinter=winter
    shader.uniforms.uPaint=paint
    shader.vertexShader='attribute float aSnow; attribute float aCold; attribute vec3 aBiome; varying float vSnow; varying float vCold; varying vec3 vBiome; varying vec2 vReliefPos;\n'+shader.vertexShader
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSnow=aSnow;vCold=aCold;vBiome=aBiome;vReliefPos=position.xz;')
    shader.fragmentShader='uniform float uWinter; uniform float uPaint; varying float vSnow; varying float vCold; varying vec3 vBiome; varying vec2 vReliefPos;\n'+shader.fragmentShader
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nfloat fields=(sin(vReliefPos.x*1.73+vReliefPos.y*.71)+sin(vReliefPos.y*2.43-vReliefPos.x*.31)+sin(vReliefPos.x*.19+vReliefPos.y*1.37))*.003;diffuseColor.rgb=mix(diffuseColor.rgb,vBiome+fields,uPaint);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.88,.92,.94),min(.74,vSnow*.7+uWinter*vCold*.15));')
  }
  const terrain=new THREE.Mesh(terrainGeometry,terrainMaterial);terrain.name='terrain';terrain.receiveShadow=true;root.add(terrain)
  const frame=new THREE.Mesh(new THREE.BoxGeometry(WORLD_WIDTH+.5,.6,WORLD_DEPTH+.5),new THREE.MeshStandardMaterial({color:'#433a2d',roughness:.9}))
  frame.position.y=-.33;root.add(frame)
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(WORLD_WIDTH+.5,.6,WORLD_DEPTH+.5)),new THREE.LineBasicMaterial({color:'#a18452',transparent:true,opacity:.5}))
  edge.position.y=-.33;root.add(edge)

  const landMask=new THREE.DataTexture(mask,cols+1,rows+1,THREE.RedFormat)
  landMask.magFilter=THREE.LinearFilter;landMask.minFilter=THREE.LinearFilter
  landMask.needsUpdate=true
  const seaMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,
    uniforms:{uMask:{value:landMask},uTime:{value:0},uWinter:winter},vertexShader:flowVertex,
    fragmentShader:`uniform sampler2D uMask;uniform float uTime,uWinter;varying vec2 vUv;
    void main(){float shore=texture2D(uMask,vUv).r;if(shore>.55)discard;
      float frost=(vUv.x<.41&&vUv.y<.54)||(vUv.x>.97&&vUv.y<.42)?1.0:0.0;
      float wave=sin(vUv.x*173.0+vUv.y*81.0-uTime*.4)*.65+sin(vUv.y*257.0-vUv.x*97.0+uTime*.3)*.35;
      vec3 color=mix(vec3(.30,.50,.59),vec3(.73,.85,.87),frost*.6+uWinter*.12);
      gl_FragColor=vec4(color+wave*.012,.15*(1.0-smoothstep(.05,.55,shore)));}`,
  })
  const seaGeometry=new THREE.PlaneGeometry(WORLD_WIDTH,WORLD_DEPTH);seaGeometry.rotateX(-Math.PI/2)
  const sea=new THREE.Mesh(seaGeometry,seaMaterial);sea.name='sea-surface';sea.position.y=.025;root.add(sea)
  const waters=new THREE.Group();waters.name='rivers'
  const flows: THREE.ShaderMaterial[]=[seaMaterial]
  for(const river of riverPaths){const material=waterMaterial('#71a7b0',.62);const mesh=new THREE.Mesh(ribbon(river.points,river.width,sampleHeight),material);mesh.userData.targetId=river.id;mesh.name=`river:${river.id}`;waters.add(mesh);flows.push(material)}
  const lakeMaterial=waterMaterial('#7cabb7',.5)
  const lakeGeometry=new THREE.CircleGeometry(1,32);lakeGeometry.rotateX(-Math.PI/2)
  const lake=new THREE.Mesh(lakeGeometry,lakeMaterial);lake.position.set(...worldPoint([4380/8192,4820/5668],.047));lake.scale.set(2.0,1,1.45)
  lake.userData.targetId='frostmere-golu';waters.add(lake);flows.push(lakeMaterial)
  const iceMaterial=new THREE.MeshBasicMaterial({color:'#c9dfe1',transparent:true,opacity:.52,side:THREE.DoubleSide,depthWrite:false})
  const ice=new THREE.Mesh(lakeGeometry.clone(),iceMaterial);ice.position.copy(lake.position);ice.position.y+=.008;ice.scale.copy(lake.scale);ice.visible=false;ice.name='frostmere-ice';waters.add(ice)
  root.add(waters)

  const forests=createForest(mobile);root.add(forests.group)
  const lavaGlow=new THREE.PointLight('#f4a05b',1.8,10,1)
  const volcanicPoint:UV=[4190/8192,530/5668]
  lavaGlow.position.set(...worldPoint(volcanicPoint,heightAt(volcanicPoint)+2));lavaGlow.name='lakbar-warm-light';root.add(lavaGlow)
  const cities=places.filter(place=>place.point).map(place=>buildSettlement({...place,point:place.point!}))
  const monuments=mapFeatures.map(buildLandmark).filter((group):group is THREE.Group=>Boolean(group))
  for(const city of [...cities,...monuments])root.add(city)
  const routes=new THREE.Group();routes.name='trade-routes'
  for(const feature of mapFeatures.filter(feature=>feature.kind==='route')) {
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
  return {root,terrain,terrainMaterial,sampleHeight,winter,paint,sea,waters,flows,ice,forests,lavaGlow,cities,monuments,routes,ring,weather,weatherMaterial,landMask,columns:cols,rows,vertices:positions.count}
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
