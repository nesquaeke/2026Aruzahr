import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { placeById } from './data'
import { mapFeatures } from './map-features'
import { buildLandmark, buildSettlement } from './relief-buildings'
import { createForest } from './relief-forests'
import { buildRoyalRoads, royalRoadPaths } from './relief-roads'
import { surfaceNoiseGLSL } from './relief-materials'
import { coldAt, danstsudPlaces, DANSTSUD_VIEW, GEOGRAPHY_BOUNDS, groundHeightAt, heightAt, lakeOutline, landAt, mapPoint, mountainHeightAt, pixels, riverAt, riverPaths, seededRandom, shoreDistance, signatures, smoothstep, snowAt, terrainNoise, WORLD_DEPTH, WORLD_WIDTH, worldPoint } from './relief-data'
import type { UV } from './relief-data'

const flowVertex = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`
function waterMaterial(color: string, opacity=.6) {
  return new THREE.ShaderMaterial({
    transparent:true,depthWrite:false,side:THREE.DoubleSide,
    uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(color)},uOpacity:{value:opacity}},
    vertexShader:flowVertex,
    fragmentShader:`uniform float uTime,uOpacity; uniform vec3 uColor; varying vec2 vUv;
      ${surfaceNoiseGLSL}
      void main(){float ripple=(atlasFbm(vec2(vUv.x*8.,vUv.y*12.-uTime*.22))-.5)*.035;
      float edge=smoothstep(0.0,.2,vUv.x)*(1.0-smoothstep(.8,1.0,vUv.x));
      gl_FragColor=vec4(uColor+vec3(ripple),uOpacity*edge);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}`,
  })
}
function ribbon(path: UV[],width: number,surface:(point:UV)=>number) {
  const curve=new THREE.CurvePath<THREE.Vector3>()
  for(let i=1;i<path.length;i++)curve.add(new THREE.LineCurve3(new THREE.Vector3(...worldPoint(path[i-1])),new THREE.Vector3(...worldPoint(path[i]))))
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
      vertices.push(x,surface(mapPoint(x,z))+.115,z);uvs.push(j/across,length/3)
    }
    if(i)for(let j=0;j<across;j++){const a=(i-1)*(across+1)+j,b=i*(across+1)+j;indices.push(a,a+1,b,a+1,b+1,b)}
  }
  const geometry=new THREE.BufferGeometry()
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2))
  geometry.setIndex(indices);geometry.computeVertexNormals()
  return geometry
}

export function buildReliefWorld(mobile: boolean) {
  const root=new THREE.Group();root.name='danstsud-new-geography'
  const cols=mobile?420:800,rows=Math.round(cols*DANSTSUD_VIEW.depth/DANSTSUD_VIEW.width)
  const terrainGeometry=new THREE.PlaneGeometry(DANSTSUD_VIEW.width,DANSTSUD_VIEW.depth,cols,rows)
  terrainGeometry.rotateX(-Math.PI/2)
  const centre=worldPoint(DANSTSUD_VIEW.point)
  terrainGeometry.translate(centre[0],0,centre[2])
  const positions=terrainGeometry.getAttribute('position'),snow:number[]=[],cold:number[]=[],colors:number[]=[]
  const grass=new THREE.Color('#52663d'),earth=new THREE.Color('#7e8058'),rock=new THREE.Color('#777974'),beach=new THREE.Color('#afa280'),bed=new THREE.Color('#193b49')
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
    shader.vertexShader='attribute float aSnow; attribute float aCold; varying float vSnow; varying float vCold; varying vec3 vGround; varying vec3 vGroundNormal;\n'+shader.vertexShader
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvSnow=aSnow;vCold=aCold;vGround=position;vGroundNormal=normal;')
    shader.fragmentShader=`uniform float uWinter; varying float vSnow; varying float vCold; varying vec3 vGround; varying vec3 vGroundNormal;
`+surfaceNoiseGLSL+shader.fragmentShader
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float field=atlasFbm(vGround.xz*2.4),grain=atlasNoise(vGround.xz*65.);
      float strata=atlasFbm(vec2(vGround.x*5.+vGround.z*2.,vGround.y*13.));
      float slope=1.-clamp(normalize(vGroundNormal).y,0.,1.);
      float rockAmount=max(smoothstep(.42,1.8,vGround.y),smoothstep(.12,.52,slope));
      float snowAmount=clamp(vSnow+uWinter*vCold*.42,0.,.98)*(1.-smoothstep(.2,.72,slope)*.82);
      float exposedStone=(.6+strata*.53+grain*.08);
      diffuseColor.rgb*=.66+field*.52+grain*.09;
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.22,.245,.24)*exposedStone,rockAmount*.62);
      float drift=atlasFbm(vec2(vGround.x*8.+vGround.z*.7,vGround.z*1.3));
      vec3 snowPigment=mix(vec3(.53,.62,.67),vec3(.8,.84,.83),.38+drift*.62);
      diffuseColor.rgb=mix(diffuseColor.rgb,snowPigment,snowAmount);
      float terrainBump=mix((field*.006+grain*.0012),(strata*.03+grain*.004),rockAmount)*(1.-snowAmount*.7);`)
    shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=atlasBump(-vViewPosition,normal,terrainBump);')
    shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(.94,.73,snowAmount);')
  }
  terrainMaterial.customProgramCacheKey=()=> 'natural-danstsud-v5'
  const terrain=new THREE.Mesh(terrainGeometry,terrainMaterial);terrain.name='terrain';terrain.receiveShadow=true;terrain.castShadow=!mobile;root.add(terrain)

  // A genuine sea surface above the submerged seabed. Its pigment, waves and
  // shallows are generated from geometry; there is no source image or texture.
  const seaGeometry=new THREE.PlaneGeometry(DANSTSUD_VIEW.width*1.8,DANSTSUD_VIEW.depth*1.8,224,144)
  seaGeometry.rotateX(-Math.PI/2);seaGeometry.translate(centre[0],.015,centre[2])
  const seaPositions=seaGeometry.getAttribute('position'),shallows:number[]=[]
  for(let i=0;i<seaPositions.count;i++)shallows.push(1-smoothstep(.25,3.2,shoreDistance(mapPoint(seaPositions.getX(i),seaPositions.getZ(i)))))
  seaGeometry.setAttribute('aShallow',new THREE.Float32BufferAttribute(shallows,1))
  const oceanMaterial=new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0},uDetail:{value:1}},
    vertexShader:`attribute float aShallow; varying float vShallow; varying vec3 vWorld;void main(){vShallow=aShallow;vWorld=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`uniform float uTime,uDetail;varying float vShallow;varying vec3 vWorld;
      ${surfaceNoiseGLSL}
      float seaHeight(vec2 p){return atlasNoise(p*4.1+vec2(uTime*.034,uTime*.013))*.65+atlasNoise(p*10.7-vec2(uTime*.021,uTime*.037))*.35;}
      void main(){vec2 p=vWorld.xz;float h=seaHeight(p);
        vec3 n=normalize(vec3((h-seaHeight(p+vec2(.035,0.)))*1.2,1.,(h-seaHeight(p+vec2(0.,.035)))*1.2));
        vec3 eye=normalize(cameraPosition-vWorld),sun=normalize(vec3(-.4,.85,.32));
        float fresnel=pow(1.-max(0.,dot(n,eye)),4.);
        float sparkle=pow(max(0.,dot(reflect(-sun,n),eye)),70.);
        vec3 pigment=mix(vec3(.016,.065,.086),vec3(.07,.21,.20),pow(vShallow,5.)*.6);
        pigment+=vec3(.025,.05,.06)*fresnel+sparkle*.17*uDetail;
        pigment*=.93+h*.12*uDetail;
        float surf=smoothstep(.982,1.,vShallow)*smoothstep(.6,.86,atlasFbm(p*8.-uTime*.035));
        pigment=mix(pigment,vec3(.34,.43,.42),surf*.22*uDetail);
        gl_FragColor=vec4(pigment,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`
  })
  const ocean=new THREE.Mesh(seaGeometry,oceanMaterial);ocean.name='ocean';root.add(ocean)
  const waters=new THREE.Group();waters.name='rivers-and-lake'
  const flows:THREE.ShaderMaterial[]=[oceanMaterial]
  for(const river of riverPaths){
    const material=waterMaterial('#355a60',.93)
    const mesh=new THREE.Mesh(ribbon(river.points,river.width,p=>Math.max(.02,sampleHeight(p))),material)
    mesh.userData.targetId=river.id;mesh.name=`river:${river.id}`;waters.add(mesh);flows.push(material)
  }
  const shape=new THREE.Shape(lakeOutline.map(p=>{const [x,,z]=worldPoint(p);return new THREE.Vector2(x,-z)}))
  const lakeGeometry=new THREE.ShapeGeometry(shape);lakeGeometry.rotateX(-Math.PI/2)
  lakeGeometry.computeBoundingBox()
  const lakeBounds=lakeGeometry.boundingBox!,lakePositions=lakeGeometry.getAttribute('position'),lakeUV=lakeGeometry.getAttribute('uv')
  for(let i=0;i<lakePositions.count;i++)lakeUV.setXY(i,(lakePositions.getX(i)-lakeBounds.min.x)/(lakeBounds.max.x-lakeBounds.min.x),(lakePositions.getZ(i)-lakeBounds.min.z)/(lakeBounds.max.z-lakeBounds.min.z))
  const lakeMaterial=waterMaterial('#406e79',.92)
  const lake=new THREE.Mesh(lakeGeometry,lakeMaterial);lake.position.y=.035
  lake.userData.targetId='frostmere-golu';lake.name='frostmere-water';waters.add(lake);flows.push(lakeMaterial)
  const iceMaterial=new THREE.MeshBasicMaterial({color:'#d6e7e9',transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false})
  const ice=new THREE.Mesh(lakeGeometry.clone(),iceMaterial);ice.position.y=.045;ice.visible=false;ice.name='frostmere-ice';waters.add(ice)
  const falls=new THREE.Group();falls.name='marhalden-waterfalls'
  for(const [top,bottom] of ([[[4955,4785],[4935,4830]],[[4928,4875],[4905,4920]]] as [UV,UV][])){
    const a=pixels([top])[0],b=pixels([bottom])[0],[ax,,az]=worldPoint(a),[bx,,bz]=worldPoint(b),dx=bx-ax,dz=bz-az,length=Math.hypot(dx,dz),sx=-dz/length*.135,sz=dx/length*.135
    const geometry=new THREE.BufferGeometry(),v:number[]=[],uv:number[]=[]
    for(const [t,side] of [[0,-1],[0,1],[1,-1],[1,-1],[0,1],[1,1]]){const x=ax+dx*t+sx*side,z=az+dz*t+sz*side;v.push(x,Math.max(.02,sampleHeight(mapPoint(x,z)))+.095,z);uv.push((side+1)/2,t)}
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.computeVertexNormals()
    const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.DoubleSide,uniforms:{uTime:{value:0}},vertexShader:flowVertex,fragmentShader:`uniform float uTime;varying vec2 vUv;${surfaceNoiseGLSL}
      void main(){float flow=atlasFbm(vec2(vUv.x*18.,vUv.y*7.-uTime*1.7));float edge=smoothstep(0.,.17,vUv.x)*(1.-smoothstep(.83,1.,vUv.x));gl_FragColor=vec4(mix(vec3(.22,.41,.44),vec3(.83,.9,.87),flow*.8+.2),edge*.86);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`})
    const mesh=new THREE.Mesh(geometry,material);mesh.name='aldara-cascade';mesh.userData.targetId='bati-aldara';falls.add(mesh);flows.push(material)
  }
  waters.add(falls);root.add(waters)
  const forests=createForest(mobile,p=>Math.max(0,sampleHeight(p)));root.add(forests.group)
  const cities=danstsudPlaces.map(place=>buildSettlement({...place,point:place.point!},sampleHeight))
  const monuments=mapFeatures.filter(feature=>feature.region==='danstsud').map(buildLandmark).filter((group):group is THREE.Group=>Boolean(group))
  for(const city of [...cities,...monuments]){
    const point=mapPoint(city.position.x,city.position.z)
    city.position.y=Math.max(heightAt(point),sampleHeight(point))+.025
    root.add(city)
  }

  // Small fields give the fertile capital plain a purpose and a sense of scale.
  // They use the same land/water exclusions as trees, never cover settlements.
  const fields=new THREE.Group();fields.name='valdareth-fields'
  const fieldRandom=seededRandom('valdareth-fertile-plain')
  const fieldPalette=['#828661','#6f7950','#958a62','#748258']
  const patches:THREE.BufferGeometry[][]=[[],[],[],[]]
  for(let i=0;i<320;i++){
    const point=pixels([[5500+fieldRandom()*1500,3800+fieldRandom()*1500]])[0]
    if(!landAt(point)||riverAt(point,.7)||mountainHeightAt(point)>.05||shoreDistance(point)<.8)continue
    if(danstsudPlaces.some(p=>Math.hypot((point[0]-p.point![0])*WORLD_WIDTH,(point[1]-p.point![1])*WORLD_DEPTH)<(signatures[p.id]?.radius||.6)+.65))continue
    const [x,,z]=worldPoint(point),w=.35+fieldRandom()*.8,d=.3+fieldRandom()*.6,y=sampleHeight(point)+.018
    const geometry=new THREE.PlaneGeometry(w,d,2,2);geometry.rotateX(-Math.PI/2)
    geometry.rotateY(.2);geometry.translate(x,y,z)
    const pp=geometry.getAttribute('position');for(let j=0;j<pp.count;j++)pp.setY(j,sampleHeight(mapPoint(pp.getX(j),pp.getZ(j)))+.018);geometry.computeVertexNormals();patches[i%4].push(geometry)
  }
  patches.forEach((pieces,index)=>{
    if(!pieces.length)return
    const merged=mergeGeometries(pieces);pieces.forEach(g=>g.dispose());if(!merged)return
    const material=new THREE.MeshStandardMaterial({color:fieldPalette[index],roughness:1,polygonOffset:true,polygonOffsetFactor:-1})
    material.onBeforeCompile=shader=>{
      shader.vertexShader='varying vec2 vField;\n'+shader.vertexShader
      shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvField=position.xz;')
      shader.fragmentShader='varying vec2 vField;\n'+surfaceNoiseGLSL+shader.fragmentShader
      shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
        float furrow=sin(vField.x*110.+vField.y*25.)*.5+.5;
        diffuseColor.rgb*=.66+atlasFbm(vField*9.)*.32+furrow*.11;`)
    }
    material.customProgramCacheKey=()=> 'furrowed-fields-v1'
    const field=new THREE.Mesh(merged,material);field.receiveShadow=true;fields.add(field)
  })
  root.add(fields)
  const routes=new THREE.Group();routes.name='trade-routes'
  for(const feature of mapFeatures.filter(feature=>feature.region==='danstsud'&&feature.kind==='route')) {
    const paths=feature.id==='kralin-yolu'?royalRoadPaths().filter(path=>['lirendil','marhalden'].includes(path.id)).map(path=>path.points):feature.stops?[feature.stops.map(id=>placeById(id)?.point).filter((p):p is UV=>Boolean(p))]:feature.paths||[]
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
  const royalRoads=buildRoyalRoads(sampleHeight);root.add(royalRoads)
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
  return {root,terrain,terrainMaterial,sampleHeight,winter,ocean,oceanMaterial,waters,flows,ice,forests,cities,monuments,routes,royalRoads,ring,weather,weatherMaterial,columns:cols,rows,vertices:positions.count}
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
