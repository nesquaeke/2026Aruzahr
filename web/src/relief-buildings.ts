import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import type { MappedPlace } from './data'
import { coldAt, heightAt, seededRandom, signatures, worldPoint } from './relief-data'
import type { MapFeature } from './map-features'

type Finish = 'stone' | 'dark' | 'roof' | 'wood' | 'gold' | 'water' | 'snow'
type Palette = Record<Finish, string>
const base: Palette = { stone:'#b6af98', dark:'#353945', roof:'#586779', wood:'#93836a', gold:'#bca16e', water:'#70a4ae', snow:'#d6e4e5' }
function paletteFor(region: string): Palette {
  if (region === 'xotar') return { ...base, stone:'#c6ad79', roof:'#4b938e', wood:'#907753' }
  if (region === 'murgul') return { ...base, stone:'#a09f87', roof:'#72765a', wood:'#775b48' }
  if (region === 'honud') return { ...base, stone:'#929fa9', roof:'#c6dbe0', wood:'#695f54' }
  if (region === 'lakbar') return { ...base, stone:'#56504a', dark:'#28282d', roof:'#883f37', gold:'#c47c43' }
  if (region === 'garmirk' || region === 'gurbin') return { ...base, stone:'#838d95', roof:'#765356' }
  return { ...base, roof:'#5c6287' }
}

class Mason {
  pieces: Record<Finish, THREE.BufferGeometry[]> = {stone:[],dark:[],roof:[],wood:[],gold:[],water:[],snow:[]}
  features: string[] = []
  place(geometry: THREE.BufferGeometry, finish: Finish, x: number, y: number, z: number, angle = 0) {
    // Buildings use vertex normals and solid pigments; every piece must have
    // the same attributes when custom gables join Three's stock primitives.
    geometry.deleteAttribute('uv')
    geometry.rotateY(angle).translate(x,y,z)
    this.pieces[finish].push(geometry.index ? geometry.toNonIndexed() : geometry)
    if (geometry.index) geometry.dispose()
  }
  box(x: number,z: number,w: number,h: number,d: number,finish: Finish='stone',y=0,angle=0) { this.place(new THREE.BoxGeometry(w,h,d),finish,x,y+h/2,z,angle) }
  cylinder(x: number,z: number,r: number,h: number,finish: Finish='stone',y=0,top=r,sides=10) { this.place(new THREE.CylinderGeometry(top,r,h,sides),finish,x,y+h/2,z) }
  roof(x: number,z: number,r: number,h: number,y: number,finish: Finish='roof',sides=4,angle=Math.PI/4) { this.place(new THREE.ConeGeometry(r,h,sides),finish,x,y+h/2,z,angle) }
  gable(x:number,z:number,width:number,depth:number,height:number,y:number,finish:Finish='roof',angle=0) {
    const w=width/2,d=depth/2
    const vertices=[-w,0,-d,w,0,-d,0,height,-d,-w,0,d,0,height,d,w,0,d,
      -w,0,-d,0,height,-d,0,height,d,-w,0,-d,0,height,d,-w,0,d,
      w,0,-d,w,0,d,0,height,d,w,0,-d,0,height,d,0,height,-d,
      -w,0,-d,-w,0,d,w,0,d,-w,0,-d,w,0,d,w,0,-d]
    // These prism faces are listed from the inside. Reverse their winding so
    // the outward, upward slopes render with normal front-face culling.
    for(let i=0;i<vertices.length;i+=9)for(let axis=0;axis<3;axis++){
      const value=vertices[i+3+axis];vertices[i+3+axis]=vertices[i+6+axis];vertices[i+6+axis]=value
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals()
    this.place(geometry,finish,x,y,z,angle)
  }
  house(x:number,z:number,size:number,cold=false,angle=0,roofFinish:Finish=cold?'snow':'roof') {
    const tall=size*.85,depth=size*.85
    this.box(x,z,size,tall,depth,'stone',0,angle)
    this.gable(x,z,size*1.14,depth*1.12,size*.46,tall,roofFinish,angle)
    this.box(x,z,size*1.03,size*.045,depth*1.03,'wood',tall*.67,angle)
    const detail=(dx:number,w:number,h:number,y:number)=>this.box(x+dx*Math.cos(angle)+depth*.505*Math.sin(angle),z-dx*Math.sin(angle)+depth*.505*Math.cos(angle),w,h,size*.02,'dark',y,angle)
    detail(0,size*.18,tall*.48,0)
    for(const dx of [-size*.3,size*.3])detail(dx,size*.13,tall*.22,tall*.43)
    this.box(x+size*.24*Math.cos(angle),z-size*.24*Math.sin(angle),size*.085,size*.43,size*.09,'stone',tall*.93,angle)
  }
  tower(x: number,z: number,r: number,h: number,roof: Finish='roof') {
    this.cylinder(x,z,r,h)
    this.cylinder(x,z,r*1.16,.1,'stone',h*.8)
    this.roof(x,z,r*1.32,h*.27,h,roof,8,Math.PI/8)
  }
  wall(radius: number,height: number,segments=24,finish: Finish='stone',gap=0,irregularity=0) {
    for(let i=0;i<segments;i++) {
      if (gap && (i===0 || i===1)) continue
      const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2
      const r=radius*(1+irregularity*Math.sin(a*3)+irregularity*.35*Math.cos(a*7)),next=radius*(1+irregularity*Math.sin(b*3)+irregularity*.35*Math.cos(b*7))
      const ax=Math.sin(a)*r,az=Math.cos(a)*r,bx=Math.sin(b)*next,bz=Math.cos(b)*next
      this.box((ax+bx)/2,(az+bz)/2,Math.hypot(bx-ax,bz-az)*1.03,height,.075,finish,0,-Math.atan2(bz-az,bx-ax))
      for(let tooth=0;tooth<4;tooth++) {
        const t=(tooth+.5)/4
        this.box(ax+(bx-ax)*t,az+(bz-az)*t,.055,.055,.09,finish,height,-Math.atan2(bz-az,bx-ax))
      }
    }
  }
  castle(x: number,z: number,size: number) {
    this.box(x,z,size,size*.6,size*.75)
    this.box(x,z,size*.65,size*.35,size*.48,'stone',size*.6)
    for(const dx of [-1,1]) for(const dz of [-1,1]) this.tower(x+dx*size*.46,z+dz*size*.34,size*.11,size*.9)
    this.gable(x,z,size*.72,size*.55,size*.28,size*.95)
    for(const dx of [-.2,0,.2])this.box(x+dx*size,z+size*.383,size*.07,size*.16,size*.018,'dark',size*.25)
    this.box(x,z+size*.39,size*.18,size*.28,size*.025,'dark')
  }
  pier(x: number,z: number,length=1,angle=0) {
    this.box(x,z,.16,.07,length,'wood',.025,angle)
    for(const end of [-1,1]) this.box(x+Math.sin(angle)*length*.4*end,z+Math.cos(angle)*length*.4*end,.065,.25,.065,'wood',-.14)
  }
  finish(palette: Palette,targetId: string) {
    const group=new THREE.Group()
    group.userData={targetId, features:this.features}
    for(const [kind,pieces] of Object.entries(this.pieces) as [Finish,THREE.BufferGeometry[]][]) {
      if(!pieces.length) continue
      const geometry=mergeGeometries(pieces)
      pieces.forEach(piece=>piece.dispose())
      if(!geometry) continue
      const material=new THREE.MeshStandardMaterial({color:palette[kind],roughness:.94,metalness:kind==='gold'?.18:0,flatShading:false})
      const mesh=new THREE.Mesh(geometry,material)
      mesh.castShadow=kind!=='water';mesh.receiveShadow=true
      mesh.userData={targetId,part:kind}
      group.add(mesh)
    }
    return group
  }
}

export function buildSettlement(place: MappedPlace) {
  const builder=new Mason(), random=seededRandom(place.id)
  const signature=signatures[place.id], type=signature?.type
  const cold=coldAt(place.point)>.4
  const palette={...paletteFor(place.region),...(cold?{stone:'#afbab8',wood:'#87968f'}:{})}
  if(type==='capital') {
    builder.features=['Beş sur kuşağı','Kraliyet kalesi','Obsidyen mabedi','Eski deniz feneri','Liman savunması']
    for(const [index,radius] of [1.65,1.38,1.1,.8,.5].entries()) {
      builder.wall(radius,.11+index*.04,42,'stone',1,.12)
      for(let t=0;t<4;t++) {const a=t*Math.PI/2+.2;builder.tower(Math.sin(a)*radius,Math.cos(a)*radius,.06,.23+index*.055)}
    }
    builder.castle(-.19,-.16,.6)
    builder.box(.25,.18,.22,.58,.34,'dark')
    builder.cylinder(.25,.18,.074,1.23,'dark')
    builder.roof(.25,.18,.1,.27,1.23,'dark',6)
    builder.cylinder(-1.45,.65,.1,1.16)
    builder.cylinder(-1.45,.65,.145,.1,'gold',1.1)
    builder.roof(-1.45,.65,.18,.18,1.21)
    builder.box(-1.61,.8,.07,.27,.75,'stone',0,-.3)
    builder.pier(-1.75,1.1,.65,-.3)
    let homes=0
    for(let i=0;i<1300&&homes<220;i++) {const a=i*2.399,r=.62+random()*.96;if([.8,1.1,1.38,1.65].some(wall=>Math.abs(r-wall)<.055))continue;builder.house(Math.sin(a)*r,Math.cos(a)*r,.068+random()*.047,false,a,r>1.3?'wood':'roof');homes++}
  } else if(type==='twincastle') {
    builder.features=['Kıyının iki tarafında kale','Geçit köprüsü','Maden ve döküm atölyeleri']
    builder.castle(-.7,-.18,.72);builder.castle(.73,.3,.58)
    builder.box(0,0,1.1,.1,.19,'stone',.15)
    for(const x of [-.43,.43]) builder.box(x,0,.08,.32,.19,'stone',-.05)
    for(let i=0;i<7;i++) builder.house(-.55+(i%4)*.31,.8+Math.floor(i/4)*.27,.22,cold)
    for(let i=0;i<3;i++) {builder.box(-.5+i*.37,-.85,.24,.23,.3,'dark');builder.cylinder(-.5+i*.37,-.85,.05,.48,'dark')}
  } else if(type==='temple') {
    builder.features=['Paladin avlusu','Mabet ve çan kuleleri','Lordluk kalesi']
    builder.box(0,0,1,.1,.9,'stone',-.04)
    builder.box(0,-.17,.35,.5,.8)
    builder.box(0,-.13,.7,.28,.25)
    builder.gable(0,-.18,.45,.89,.35,.5,'roof')
    for(const side of [-1,1])for(let i=0;i<4;i++)builder.box(side*.179,-.45+i*.19,.015,.2,.085,'dark',.2)
    builder.box(0,.24,.11,.27,.018,'dark')
    for(const x of [-.3,.3]) builder.tower(x,.3,.085,.88,'gold')
    builder.wall(1.1,.24,24,'stone',1)
    builder.castle(-.78,-.47,.4)
    for(let i=0;i<12;i++){const a=i*Math.PI/6;builder.house(Math.sin(a)*.83,Math.cos(a)*.83,.19,false,a)}
  } else if(type==='academy') {
    builder.features=['Akademi ve arşiv','Araştırma kuleleri','Bağlı çalışma avluları']
    builder.box(0,0,.65,.34,.75)
    builder.gable(0,0,.72,.85,.34,.34)
    for(const side of [-1,1])for(let i=0;i<3;i++)builder.box(side*.33,-.22+i*.22,.018,.11,.07,'dark',.16)
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5;builder.tower(Math.sin(a)*.7,Math.cos(a)*.7,.12,.65+(i%3)*.14,'gold')}
    builder.box(.45,0,.8,.09,.09,'stone',.43)
    builder.box(-.35,.47,.55,.18,.34,'wood')
  } else if(type==='guild') {
    builder.features=['Çelik Kalkan salonu','Talim avlusu','Kent kıyısındaki iskeleler']
    builder.box(0,-.1,.65,.32,.9,'stone')
    builder.gable(0,-.1,.76,1.02,.35,.32)
    builder.box(0,.36,.2,.27,.018,'dark')
    for(const side of [-1,1])builder.box(side*.22,.36,.11,.12,.018,'dark',.14)
    builder.box(0,.59,.74,.075,.48,'dark')
    builder.tower(-.43,-.45,.085,.66)
    for(let i=0;i<11;i++){const a=i*2.399;builder.house(Math.sin(a)*(.6+random()*.45),Math.cos(a)*(.6+random()*.45),.2,false,a)}
    builder.pier(-1,.6,.75);builder.pier(-.78,.73,.62)
  } else if(type==='highcastle') {
    builder.features=['Yüksek sınır kalesi','Mavi-mor çatılar','Korucu gözetleme kuleleri']
    builder.castle(0,0,.92);builder.wall(.98,.3,20,'stone',1)
    for(let i=0;i<5;i++){const a=i*Math.PI*2/5;builder.tower(Math.sin(a)*.99,Math.cos(a)*.99,.095,.68)}
    for(let i=0;i<7;i++) builder.house((i%4-.5)*.27,.65+Math.floor(i/4)*.27,.2)
  } else if(type==='ruins') {
    builder.features=['Eski taş daire','Ayakta kalan idari yapılar','Düzensiz kıyı barınakları']
    builder.wall(.78,.31,24,'stone',1)
    for(let i=0;i<4;i++){const a=i*Math.PI/2;builder.cylinder(Math.sin(a)*.78,Math.cos(a)*.78,.08,.4+(i%2)*.18)}
    builder.box(-.13,-.18,.43,.38,.33)
    builder.roof(-.13,-.18,.33,.2,.38)
    for(let i=0;i<15;i++) {const a=i*2.399,r=.43+random()*.65;builder.house(Math.sin(a)*r,Math.cos(a)*r,.14+random()*.08,cold,a)}
    builder.pier(-1,.6,.63)
  } else if(type==='portfort') {
    builder.features=['Liman kalesi','Kıyı feneri','Korunan iskele']
    builder.castle(.15,-.1,.65);builder.wall(.75,.28,20,'stone',1)
    builder.tower(-.68,.45,.08,.8,'snow');builder.pier(-.92,.67,.85)
    for(let i=0;i<7;i++) builder.house((i%4-.8)*.27,.65+Math.floor(i/4)*.23,.19,cold)
  } else if(type==='springs') {
    builder.features=['Sıcak su havuzu','Ocak evleri','Kıyı iskelesi']
    builder.cylinder(0,0,.28,.03,'water',.01,.3,18)
    for(let i=0;i<9;i++){const a=i*2.399;builder.house(Math.sin(a)*.59,Math.cos(a)*.59,.18,cold,a)}
    builder.pier(-.75,.6,.58)
  } else if(type==='huts'||type==='warehouses') {
    builder.features=type==='huts'?['Ahşap barınaklar','Küçük iskele']:['Yıpranmış depolar','Kıyı iskeleleri']
    for(let i=0;i<(type==='huts'?12:9);i++)builder.house((random()-.5)*1.1,(random()-.5)*1.1,.15+random()*.09,cold,random()*.4)
    builder.pier(-.65,.68,.68)
    if(type==='warehouses'){builder.box(.4,.28,.32,.22,.55,'wood');builder.pier(-.38,.78,.87)}
  } else {
    const size=place.major?.95:.4
    builder.features=[place.major?'Yerleşim merkezi':'Evler · küçük meydan · yerel yapı']
    const count=place.major?18:7+Math.floor(random()*4)
    for(let i=0;i<count;i++){
      const a=i*2.399,r=size*(.25+random()*.65)
      builder.house(Math.sin(a)*r,Math.cos(a)*r,place.major?.19:.11+random()*.05,cold,a)
    }
    if(!place.major) {
      const variant=Math.floor(random()*4)
      if(variant===0){builder.tower(-.24,-.25,.05,.35,cold?'snow':'roof');builder.features.push('Gözetleme kulesi')}
      else if(variant===1){builder.box(-.1,-.2,.19,.18,.31);builder.gable(-.1,-.2,.22,.34,.13,.18,cold?'snow':'roof');builder.tower(-.1,-.38,.035,.3);builder.features.push('Şapel')}
      else if(variant===2){builder.cylinder(-.22,-.23,.055,.23,'stone');builder.roof(-.22,-.23,.075,.11,.23,cold?'snow':'roof',6);for(const angle of [.65,.65+Math.PI/2])builder.place(new THREE.BoxGeometry(.23,.018,.018).rotateZ(angle),'wood',-.22,.27,-.292);builder.features.push('Değirmen')}
      else {builder.box(-.23,-.2,.22,.12,.14,'wood');builder.gable(-.23,-.2,.25,.17,.09,.12);builder.features.push('Ambar')}
    }
    if(place.region==='xotar'&&place.major){builder.cylinder(0,0,.2,.25);builder.place(new THREE.SphereGeometry(.21,12,8,0,Math.PI*2,0,Math.PI/2),'roof',0,.25,0)}
    else if(place.major&&place.region==='honud') {builder.box(0,0,.3,.22,.65,'wood');builder.roof(0,0,.43,.27,.22,'snow',4)}
    else if(place.major&&place.region!=='murgul'){builder.castle(0,-.08,.43)}
    else if(place.region==='murgul'&&place.major){builder.box(0,0,.4,.32,.6,'wood');builder.roof(0,0,.47,.32,.32)}
  }
  // A major settlement is a town around its institutions, not a lone castle.
  // Distinct dense outskirts stay inside the coastal land apron at map scale.
  if(signature && !['capital','huts','warehouses','springs'].includes(type!)) {
    const count=type==='guild'?34:type==='highcastle'?44:type==='ruins'?22:30
    for(let i=0;i<count;i++){
      const angle=i*2.399+random()*.3,r=(type==='highcastle'?1.03:1.05)+random()*.38
      builder.house(Math.sin(angle)*r,Math.cos(angle)*r,.095+random()*.05,cold,angle,(!cold&&i%7===0)?'wood':cold?'snow':'roof')
    }
  }
  const group=builder.finish(palette,place.id)
  group.userData.modelScale=signature?.scale || (place.major?1.25:1)
  // Distant hamlets keep their full silhouettes without paying for dozens
  // of additional shadow-map passes in the kingdom overview.
  if(!place.major)group.traverse(object=>{if(object instanceof THREE.Mesh)object.castShadow=false})
  group.name=`settlement:${place.id}`
  group.position.set(...worldPoint(place.point,heightAt(place.point)+.025))
  return group
}

export function buildLandmark(feature: MapFeature) {
  const builder=new Mason(),kind=feature.id
  if(kind==='thural-kalkani') {
    builder.features=['Kapı ve savunma hattı']
    builder.box(-.62,0,.85,.25,.1);builder.box(.62,0,.85,.25,.1)
    builder.tower(-.15,0,.095,.5);builder.tower(.15,0,.095,.5)
  } else if(kind.includes('feneri')) {
    builder.features=['Deniz feneri'];builder.cylinder(0,0,.18,1.14,'stone',-1.1,.14,12);builder.cylinder(0,0,.1,.8);builder.cylinder(0,0,.14,.1,'gold',.76);builder.roof(0,0,.18,.16,.86)
  } else if(kind.includes('harabeleri')) {
    builder.features=['Ayakta kalan duvar parçaları']
    for(let i=0;i<6;i++)builder.box((i%3-.8)*.2,(Math.floor(i/3)-.5)*.35,.13,.18+(i%3)*.08,.12,'stone',0,i*.3)
  } else if(kind==='lakbar-lav-kalesi') {builder.features=['Volkan kıyısındaki dairesel kale'];builder.wall(.54,.34,20);builder.castle(0,0,.42)}
  else if(kind.startsWith('lakbar-')) {builder.features=['Koyu taş kule'];builder.tower(0,0,.14,kind==='lakbar-kara-kule'?1.2:.7,'dark');builder.wall(.32,.15,12)}
  else return null
  const group=builder.finish(paletteFor(feature.region),feature.id)
  group.name=`landmark:${feature.id}`
  group.position.set(...worldPoint(feature.point,heightAt(feature.point)+.015))
  return group
}
