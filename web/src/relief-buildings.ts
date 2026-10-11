import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import type { MappedPlace } from './data'
import { coldAt, heightAt, landAt, mapPoint, riverAt, seededRandom, signatures, worldPoint } from './relief-data'
import type { MapFeature } from './map-features'
import { masonryMaterial } from './relief-materials'
import type { UV } from './relief-data'

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
  houseCount=0
  streetCount=0
  anchor: number|null=null
  constructor(public lift:(x:number,z:number)=>number=()=>0){}
  at(x:number,z:number,draw:()=>void){const saved=this.anchor;this.anchor=saved??this.lift(x,z);draw();this.anchor=saved}
  arch(x:number,z:number,w:number,h:number,d:number,y=0,angle=0,finish:Finish='stone') {
    const r=w/2,inner=w*.36,stem=h-r,shape=new THREE.Shape()
    shape.moveTo(-r,0);shape.lineTo(-r,stem);shape.absarc(0,stem,r,Math.PI,0,true);shape.lineTo(r,0);shape.lineTo(inner,0);shape.lineTo(inner,stem);shape.absarc(0,stem,inner,0,Math.PI,false);shape.lineTo(-inner,0);shape.closePath()
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:d,steps:1,curveSegments:12,bevelEnabled:true,bevelSegments:1,bevelSize:.003,bevelThickness:.003});geometry.translate(0,0,-d/2)
    this.place(geometry,finish,x,y,z,angle)
  }
  column(x:number,z:number,r:number,h:number,y=0) {
    this.cylinder(x,z,r*1.4,.04,'stone',y,r*1.4,20);this.cylinder(x,z,r,h,'stone',y+.04,r*.82,20);this.cylinder(x,z,r*1.35,.04,'stone',y+h,r*1.35,20)
  }
  hall(x:number,z:number,w:number,d:number,h:number,roof:Finish='roof'){
    this.at(x,z,()=>{this.box(x,z,w,h,d);this.gable(x,z,w*1.1,d*1.06,w*.32,h,roof)
      for(let i=0;i<6;i++){const px=x-w*.4+i*w*.16;this.arch(px,z+d*.506,w*.105,h*.48,.018,h*.23);this.box(px,z+d*.507,w*.063,h*.24,.022,'dark',h*.28)}
      this.arch(x,z+d*.525,w*.22,h*.65,.025);this.box(x,z+d*.508,w*.16,h*.34,.01,'wood');this.box(x,z,w*1.06,.03,d*1.06,'stone',h*.78)})
  }
  fountain(x:number,z:number,r=.22){this.cylinder(x,z,r,.055,'stone');this.cylinder(x,z,r*.85,.015,'water',.06);this.column(x,z,r*.1,.25,.07);this.cylinder(x,z,r*.5,.03,'stone',.26,r*.6,24);this.cylinder(x,z,r*.42,.015,'water',.294)}
  banner(x:number,z:number,h=.44){this.cylinder(x,z,.007,h,'gold');this.box(x+.041,z,.082,.12,.006,'roof',h-.15);this.box(x+.041,z-.004,.013,.08,.004,'gold',h-.13)}
  lighthouse(x:number,z:number,h=1.3,r=.13){this.at(x,z,()=>{this.cylinder(x,z,r*1.45,.13,'stone');this.cylinder(x,z,r,h,'stone',.1,r*.68,24);for(let i=0;i<4;i++){this.cylinder(x,z,r*(1-i*.05),.035,'stone',.3+i*h*.18);this.box(x,z+r*.7,.026,.075,.008,'dark',.4+i*h*.18)}this.cylinder(x,z,r*1.15,.065,'stone',h);this.cylinder(x,z,r*.8,.12,'gold',h+.065,r*.8,20);this.roof(x,z,r*1.2,.12,h+.185,'roof',24)})}
  monumentalLighthouse(x:number,z:number){this.at(x,z,()=>{
    for(let step=0;step<5;step++)this.box(x,z,.67-step*.04,.045,.67-step*.04,'stone',step*.045)
    this.box(x,z,.46,1.0,.46,'stone',.22);this.box(x,z,.55,.085,.55,'stone',1.22)
    for(const side of [-1,1])for(let level=0;level<4;level++){
      this.arch(x+side*.234,z,.075,.12,.012,.35+level*.2,Math.PI/2)
      this.box(x+side*.237,z,.009,.08,.047,'dark',.36+level*.2)
      this.box(x,z+side*.237,.047,.08,.009,'dark',.36+level*.2)
    }
    for(const dx of [-1,1])for(const dz of [-1,1])this.column(x+dx*.22,z+dz*.22,.018,.2,1.3)
    this.cylinder(x,z,.22,.63,'stone',1.3,.2,8);this.cylinder(x,z,.257,.075,'stone',1.93,.257,8)
    for(let i=0;i<8;i++){const a=i*Math.PI/4;this.column(x+Math.sin(a)*.165,z+Math.cos(a)*.165,.016,.3,2.01)}
    this.cylinder(x,z,.084,.13,'dark',2.02);this.cylinder(x,z,.075,.075,'gold',2.15)
    this.roof(x,z,.23,.17,2.32,'stone',16);this.cylinder(x,z,.012,.12,'gold',2.49)
    for(const side of [-1,1])this.box(x+side*.31,z,.035,.12,.74,'stone',.13)
  })}
  lane(points:[number,number][],width=.075,finish:Finish='stone'){
    const vertices:number[]=[]
    for(let i=1;i<points.length;i++){
      const [ax,az]=points[i-1],[bx,bz]=points[i],length=Math.hypot(bx-ax,bz-az),steps=Math.max(1,Math.ceil(length/.09)),dx=-(bz-az)/length*width/2,dz=(bx-ax)/length*width/2
      for(let n=0;n<steps;n++){const t=n/steps,u=(n+1)/steps,x=ax+(bx-ax)*t,z=az+(bz-az)*t,nx=ax+(bx-ax)*u,nz=az+(bz-az)*u
        for(const [px,pz]of [[x+dx,z+dz],[nx+dx,nz+dz],[x-dx,z-dz],[nx+dx,nz+dz],[nx-dx,nz-dz],[x-dx,z-dz]])vertices.push(px,this.lift(px,pz)+.017,pz)
      }
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();this.pieces[finish].push(geometry);this.streetCount++
  }
  bridge(x:number,z:number,w=.9,d=.18,y=.15,angle=0){
    const saved=this.anchor,cos=Math.cos(angle),sin=Math.sin(angle)
    const deck=Math.max(this.lift(x,z)+y+.18,this.lift(x-w*.5*cos,z+w*.5*sin),this.lift(x+w*.5*cos,z-w*.5*sin))
    this.anchor=deck
    this.box(x,z,w,.06,d,'stone',0,angle)
    for(const side of [-1,1])this.box(x+side*d*.49*sin,z+side*d*.49*cos,w,.055,.026,'stone',.06,angle)
    for(const dx of [-w*.35,0,w*.35]){
      const px=x+dx*cos,pz=z-dx*sin,ground=this.lift(px,pz)
      this.box(px,pz,.035,Math.max(.08,deck-ground),d*.75,'stone',ground-deck,angle)
      this.arch(px,pz,w*.32,.24,d,-.235,angle)
    }
    this.anchor=saved
  }

  place(geometry: THREE.BufferGeometry, finish: Finish, x: number, y: number, z: number, angle = 0) {
    // Buildings use vertex normals and solid pigments; every piece must have
    // the same attributes when custom gables join Three's stock primitives.
    geometry.deleteAttribute('uv')
    geometry.rotateY(angle).translate(x,y+(this.anchor??this.lift(x,z)),z)
    this.pieces[finish].push(geometry.index ? geometry.toNonIndexed() : geometry)
    if (geometry.index) geometry.dispose()
  }
  box(x: number,z: number,w: number,h: number,d: number,finish: Finish='stone',y=0,angle=0) { this.place(new THREE.BoxGeometry(w,h,d),finish,x,y+h/2,z,angle) }
  cylinder(x: number,z: number,r: number,h: number,finish: Finish='stone',y=0,top=r,sides=24) { this.place(new THREE.CylinderGeometry(top,r,h,sides),finish,x,y+h/2,z) }
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
  house(x:number,z:number,size:number,cold=false,angle=0,roofFinish:Finish=cold?'snow':'roof',floors=1,worn=false) {
    const saved=this.anchor;this.anchor=this.lift(x,z)
    this.houseCount++
    const tall=size*.85*(1+(floors-1)*.55),depth=size*.85
    this.box(x,z,size,tall,depth,'stone',0,angle)
    this.gable(x,z,size*1.14,depth*1.12,size*.46,tall,roofFinish,angle)
    this.box(x,z,size*1.03,size*.045,depth*1.03,'wood',tall*.67,angle)
    const detail=(dx:number,w:number,h:number,y:number)=>this.box(x+dx*Math.cos(angle)+depth*.505*Math.sin(angle),z-dx*Math.sin(angle)+depth*.505*Math.cos(angle),w,h,size*.02,'dark',y,angle)
    detail(0,size*.18,tall*.48,0)
    for(const dx of [-size*.3,size*.3])detail(dx,size*.13,tall*.22,tall*.43)
    for(const dx of [-size*.43,size*.43])this.box(x+dx*Math.cos(angle)+depth*.513*Math.sin(angle),z-dx*Math.sin(angle)+depth*.513*Math.cos(angle),size*.035,tall,size*.025,'wood',0,angle)
    if(floors>1)for(const dx of [-size*.3,size*.3])detail(dx,size*.13,tall*.15,tall*.73)
    this.box(x+size*.24*Math.cos(angle),z-size*.24*Math.sin(angle),size*.085,size*.43,size*.09,'stone',tall*.93,angle)
    this.box(x,z,size*1.03,.06,depth*1.03,'stone',-.055,angle)
    if(worn){
      const patch=new THREE.PlaneGeometry(size*.28,size*.34);patch.rotateX(-Math.PI/2);patch.rotateZ(.55)
      this.place(patch,'wood',x-size*.24*Math.cos(angle),tall+size*.25,z+size*.13,angle)
      this.box(x+size*.4*Math.cos(angle),z-size*.4*Math.sin(angle),size*.025,tall*.85,size*.035,'dark',0,angle)
    }
    this.anchor=saved
  }
  tower(x: number,z: number,r: number,h: number,roof: Finish='roof') {
    this.at(x,z,()=>{
      this.cylinder(x,z,r*1.16,.075,'stone',-.035)
      this.cylinder(x,z,r,h,'stone',0,r*.96,24)
      for(const level of [.2,.55,.85])this.cylinder(x,z,r*1.09,.025,'stone',h*level)
      for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
        this.box(x+Math.sin(a)*r,z+Math.cos(a)*r,r*.11,h*.12,.008,'dark',h*.5,a)
        this.box(x+Math.sin(a)*r,z+Math.cos(a)*r,r*.11,h*.12,.008,'dark',h*.75,a)
      }
      this.roof(x,z,r*1.32,h*.27,h,roof,24,0)
    })
  }
  wall(radius: number,height: number,segments=24,finish: Finish='stone',gap=0,irregularity=0,phase=0) {
    for(let i=0;i<segments;i++) {
      if (gap && (i===0 || i===1)) continue
      if(this.features.includes('Beş sur kuşağı')&&Math.abs(Math.cos(i/segments*Math.PI*2)*radius-.33)<.12)continue
      const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2
      const r=radius*(1+irregularity*Math.sin(a*3+phase)+irregularity*.35*Math.cos(a*7+phase*.7)),next=radius*(1+irregularity*Math.sin(b*3+phase)+irregularity*.35*Math.cos(b*7+phase*.7))
      const ax=Math.sin(a)*r,az=Math.cos(a)*r,bx=Math.sin(b)*next,bz=Math.cos(b)*next
      this.box((ax+bx)/2,(az+bz)/2,Math.hypot(bx-ax,bz-az)*1.03,height,.075,finish,0,-Math.atan2(bz-az,bx-ax))
      for(let tooth=0;tooth<4;tooth++) {
        const t=(tooth+.5)/4
        this.box(ax+(bx-ax)*t,az+(bz-az)*t,.055,.055,.09,finish,height,-Math.atan2(bz-az,bx-ax))
      }
    }
  }
  castle(x: number,z: number,size: number) {
    const saved=this.anchor;this.anchor=this.lift(x,z)
    this.box(x,z,size*1.13,.16,size*.88,'stone',-.13)
    this.box(x,z,size,size*.6,size*.75)
    this.box(x,z,size*.65,size*.35,size*.48,'stone',size*.6)
    for(const dx of [-1,1]) for(const dz of [-1,1]) this.tower(x+dx*size*.46,z+dz*size*.34,size*.11,size*.9)
    this.gable(x,z,size*.72,size*.55,size*.28,size*.95)
    for(const dx of [-.2,0,.2])this.box(x+dx*size,z+size*.383,size*.07,size*.16,size*.018,'dark',size*.25)
    this.box(x,z+size*.39,size*.18,size*.28,size*.025,'dark')
    this.arch(x,z+size*.41,size*.28,size*.42,.055)
    for(const side of [-1,1])for(let n=0;n<4;n++)this.box(x+side*size*.39,z+size*.4,size*.06,size*.065,size*.065,'stone',n*size*.18)
    this.anchor=saved
  }
  pier(x: number,z: number,length=1,angle=0) {
    this.box(x,z,.16,.07,length,'wood',.025,angle)
    for(const end of [-1,1]) this.box(x+Math.sin(angle)*length*.4*end,z+Math.cos(angle)*length*.4*end,.065,.25,.065,'wood',-.14)
  }
  boat(x:number,z:number,length=.32,angle=0){
    this.at(x,z,()=>{
      const w=length*.22,shape=new THREE.Shape();shape.moveTo(-w,-length*.42);shape.quadraticCurveTo(-w*1.12,length*.25,0,length*.5);shape.quadraticCurveTo(w*1.12,length*.25,w,-length*.42);shape.closePath()
      const hull=new THREE.ExtrudeGeometry(shape,{depth:.045,steps:1,curveSegments:10,bevelEnabled:true,bevelSegments:2,bevelSize:.006,bevelThickness:.006});hull.rotateX(-Math.PI/2);this.place(hull,'wood',x,.015,z,angle)
      this.cylinder(x,z,.007,length*.95,'wood',.055)
      const sail=new THREE.Shape();sail.moveTo(-length*.22,0);sail.quadraticCurveTo(length*.025,length*.05,length*.22,0);sail.lineTo(length*.17,length*.52);sail.lineTo(-length*.16,length*.52);sail.closePath();this.place(new THREE.ShapeGeometry(sail,8),'roof',x,.12,z,angle)
      this.box(x,z,.012,.017,length*.7,'gold',length*.65,angle)
    })
  }
  finish(palette: Palette,targetId: string) {
    const group=new THREE.Group()
    group.userData={targetId, features:this.features,modelHouses:this.houseCount,modelStreets:this.streetCount}
    for(const [kind,pieces] of Object.entries(this.pieces) as [Finish,THREE.BufferGeometry[]][]) {
      if(!pieces.length) continue
      const geometry=mergeGeometries(pieces)
      pieces.forEach(piece=>piece.dispose())
      if(!geometry) continue
      const material=masonryMaterial(palette[kind],kind)
      const mesh=new THREE.Mesh(geometry,material)
      mesh.castShadow=kind!=='water';mesh.receiveShadow=true
      mesh.userData={targetId,part:kind}
      group.add(mesh)
    }
    return group
  }
}

export function buildSettlement(place: MappedPlace,surface?: (point:UV)=>number) {
  const scale=signatures[place.id]?.scale|| (place.major?1.25:1), origin=worldPoint(place.point), baseline=Math.max(heightAt(place.point),surface?.(place.point)||0)+.025
  const builder=new Mason(surface?(x,z)=>(Math.max(.025,surface(mapPoint(origin[0]+x*scale,origin[2]+z*scale)))-baseline)/scale:()=>0), random=seededRandom(place.id)
  const dry=(x:number,z:number)=>{const point=mapPoint(origin[0]+x*scale,origin[2]+z*scale);return landAt(point)&&!riverAt(point,.025)}
  const signature=signatures[place.id], type=signature?.type
  const cold=coldAt(place.point)>.4
  const palette={...paletteFor(place.region),...(cold?{stone:'#afbab8',wood:'#87968f'}:{})}
  if(type==='capital') {
    builder.features=['Beş sur kuşağı','Kraliyet kalesi','Obsidyen mabedi','Eski deniz feneri','Liman savunması','Derinkilit hapishanesi','Nehir köprüleri','Mavi-mor çatı mahalleleri']
    palette.roof='#555580';palette.stone='#9f9a86';palette.dark='#292b32'
    for(const [index,radius] of [1.77,1.45,1.16,.84,.51].entries()) {
      builder.wall(radius,.12+index*.05,64,'stone',1,.075,index*.45)
      for(let t=0;t<8;t++) {const a=t*Math.PI/4+.2,r=radius*(1+.075*Math.sin(a*3+index*.45)+.075*.35*Math.cos(a*7+index*.315));builder.tower(Math.sin(a)*r,Math.cos(a)*r,.045,.22+index*.06)}
      builder.arch(0,radius, .2,.22+index*.05,.13);builder.banner(.13,radius,.35)
    }
    builder.castle(-.19,-.16,.6)
    builder.hall(-.22,-.57,.55,.35,.4)
    builder.at(.27,-.12,()=>{
      builder.box(.27,-.12,.25,.56,.44,'dark');builder.gable(.27,-.12,.28,.48,.22,.56,'dark')
      for(const side of [-1,1])for(let i=0;i<4;i++){builder.box(.27+side*.142,-.27+i*.09,.018,.35,.029,'stone');builder.box(.27+side*.13,-.27+i*.09,.015,.16,.04,'gold',.28)}
      builder.cylinder(.27,-.12,.075,1.2,'dark');builder.roof(.27,-.12,.11,.26,1.2,'dark',24);builder.arch(.27,.115,.16,.33,.018,0,0,'gold')
    })
    builder.at(.83,.73,()=>{builder.box(.83,.73,.38,.32,.46,'dark');builder.box(.83,.73,.42,.09,.5,'stone',.32);for(const dx of [-1,1])for(const dz of [-1,1])builder.tower(.83+dx*.22,.73+dz*.24,.06,.54);for(let n=0;n<5;n++)builder.box(.69+n*.07,.968,.025,.06,.01,'dark',.2)})
    builder.hall(1.02,-.59,.32,.56,.25);builder.hall(.52,-.95,.46,.3,.27);builder.fountain(.12,-.73,.12)
    builder.lighthouse(-1.55,-.28,1.4,.105)
    builder.box(-1.72,.38,.075,.27,.8,'stone',0,-.16)
    for(const z of [-.18,0,.17]){builder.pier(-1.96,z,.66,Math.PI/2);builder.hall(-1.52,z,.18,.14,.15,'wood')}
    for(const [x,z] of [[-2.45,-.19],[-2.52,-.02],[-2.61,.1]])builder.boat(x,z,.3,.4)
    builder.bridge(.08,.34,.52,.17,.15);builder.bridge(.94,.29,.36,.17,.15)
    let homes=0
    for(let ix=-17;ix<=17;ix++)for(let iz=-17;iz<=17;iz++){
      const x=ix*.098+(random()-.5)*.018,z=iz*.098+(random()-.5)*.018,r=Math.hypot(x,z),a=Math.atan2(x,z)
      if(r<.55||r>1.75||[.84,1.16,1.45,1.77].some(wall=>Math.abs(r-wall*(1+.075*Math.sin(a*3+[.84,1.16,1.45,1.77].indexOf(wall)*.45)))<.043)||Math.abs(z-.34)<.12||!dry(x,z)||(Math.abs(x-.83)<.27&&Math.abs(z-.73)<.3)||(Math.abs(x-1.02)<.2&&Math.abs(z+.59)<.33)||(Math.abs(x-.52)<.27&&Math.abs(z+.95)<.2))continue
      if(r>.9&&Math.abs(Math.sin(a*3+.4))*r<.046)continue
      builder.house(x,z,.065+random()*.026,false,a*.18,r>1.45&&homes%3===0?'wood':'roof');homes++
    }
    for(let n=0;n<65;n++){const a=n*2.399,r=1.89+random()*.3,x=Math.sin(a)*r,z=Math.cos(a)*r;if(dry(x,z))builder.house(x,z,.075,false,a,'wood')}
    builder.features.push(`${homes} yoğun mahalle yapısı`)
  } else if(type==='twincastle') {
    builder.features=['Kıyının iki tarafında kale','Geçit köprüsü','Maden ve döküm atölyeleri','Dağ terasları','Aldara şelalesi','Köprübaşı kuleleri']
    palette.stone='#939b9b';palette.roof='#506971';palette.dark='#343c41'
    builder.castle(-.72,-.22,.72);builder.castle(.73,.28,.65)
    // Cross the straight reach just above the westward bend. Its perpendicular
    // is derived from the source segment (4930,4870) -> (4900,4930).
    builder.bridge(.20,-.39,1.05,.22,.29,Math.atan2(30,60))
    builder.tower(-.30,-.14,.07,.48,'roof');builder.tower(.70,-.64,.07,.48,'roof')
    builder.lane([[-.72,-.22],[-.48,-.25],[-.27,-.155]],.095)
    builder.lane([[.73,.28],[.86,-.06],[.70,-.60]],.095)
    for(let i=0;i<52;i++){const bank=i%2?-1:1,x=bank*(.45+random()*.85),z=-1.1+random()*2.25;if(dry(x,z))builder.house(x,z,.11+random()*.06,true,random()*.25)}
    for(const bank of [-1,1])for(let t=0;t<5;t++){const z=-1.1+t*.5;builder.box(bank*1.21,z,.08,.24,.54,'stone',-.15);if(t%2===0)builder.tower(bank*1.27,z,.065,.5,'snow')}
    for(let i=0;i<5;i++){const x=-.8+i*.39;builder.hall(x,1.26,.23,.34,.22,'wood');builder.cylinder(x,1.26,.035,.46,'dark')}
    builder.hall(.92,-1.02,.23,.32,.25);builder.banner(-.5,-.24,.62);builder.banner(.57,.28,.63)
  } else if(type==='temple') {
    builder.features=['Paladin avlusu','Mabet ve çan kuleleri','Lordluk kalesi','Ruhban okulları','Geniş caddeler','Altın amblemler']
    palette.stone='#dfd7bb';palette.roof='#677477';palette.gold='#cfa85c'
    builder.box(0,0,2.45,.015,2.5,'stone',-.012)
    builder.hall(0,-.28,.48,1,.6)
    builder.hall(0,-.29,.87,.32,.32)
    for(const side of [-1,1]){builder.tower(side*.3,.25,.1,1.08,'gold');builder.hall(side*.89,-.44,.35,.87,.31);builder.hall(side*.92,.59,.33,.62,.27);for(let i=0;i<5;i++)builder.column(side*.61,-.72+i*.29,.025,.31);builder.banner(side*.35,.56,.57)}
    builder.arch(0,.38,.24,.46,.05,0,0,'gold');builder.fountain(0,.79,.18)
    builder.castle(-.94,-1.07,.37);builder.wall(1.44,.17,42,'stone',1,.035)
    for(const side of [-1,1])for(let i=0;i<6;i++)builder.house(side*(.58+(i%2)*.33),.15+(i%3)*.24,.105,false,0)
  } else if(type==='academy') {
    builder.features=['Akademi ve arşiv','Araştırma kuleleri','Bağlı çalışma avluları','Kuvars sütunlu meydan','Çeşmeler','Mavi işlemeler']
    palette.stone='#e4e3d2';palette.roof='#356d9c';palette.gold='#609cb8'
    builder.box(0,0,2.45,.022,2.25,'stone',-.015)
    builder.hall(0,-.59,1.08,.62,.37)
    for(let n=0;n<10;n++)builder.column(-.48+n*.108,-.18,.025,.33)
    builder.gable(0,-.17,1.15,.19,.15,.38,'roof')
    for(const side of [-1,1]){builder.hall(side*.84,.1,.37,.82,.32);for(let n=0;n<6;n++)builder.column(side*.6,-.23+n*.16,.022,.28);builder.hall(side*.72,.84,.5,.35,.3);builder.tower(side*.99,-.73,.09,.66,'roof')}
    builder.fountain(0,.21,.25);builder.fountain(.3,.85,.13)
    builder.at(0,-.68,()=>{builder.cylinder(0,-.68,.19,.3,'stone',.39,.19,24);builder.place(new THREE.SphereGeometry(.2,24,12,0,Math.PI*2,0,Math.PI/2),'roof',0,.7,-.68)})
    for(let i=0;i<12;i++){const a=i*Math.PI/6;builder.house(Math.sin(a)*1.38,Math.cos(a)*1.38,.13,false,0)}
  } else if(type==='guild') {
    builder.features=['Çelik Kalkan salonu','Talim avlusu','Kent kıyısındaki iskeleler','Büyük kütüphane','Büyük deniz feneri','Kervan avlusu','Anıtsal üç katlı fener','Kütüphane galerileri','Çarşı sokakları']
    builder.hall(-.28,-.38,.91,.96,.54);builder.hall(-.28,-.38,1.1,.32,.39)
    for(let n=0;n<8;n++)builder.column(-.72+n*.13,.13,.022,.22)
    builder.arch(-.28,.135,.22,.32,.032);builder.fountain(-.23,.3,.12)
    for(const x of [-.68,.13])builder.tower(x,-.4,.075,.79)
    builder.hall(.71,.18,.4,.7,.29);builder.box(.71,.68,.55,.025,.32,'stone');builder.banner(.45,.49)
    builder.monumentalLighthouse(-.36,-1.51)
    builder.lane([[-.36,-1.27],[-.36,-.94],[-.72,-.8],[-1.02,-.28],[-1.1,.6]],.13)
    for(const x of [-.73,-.4,-.1])builder.pier(x,-1.94,.5)
    for(let i=0;i<21;i++){const a=i*2.399,x=Math.sin(a)*(.68+random()*.48),z=.15+Math.cos(a)*(.56+random()*.43);if((Math.abs(x+.28)<.48&&z<.07)||Math.abs(x-.71)<.23&&Math.abs(z-.18)<.4||!dry(x,z))continue;builder.house(x,z,.12+random()*.03,false,a)}
    for(let n=0;n<5;n++)builder.at(-.2+n*.19,.82,()=>{const x=-.2+n*.19;builder.box(x,.82,.09,.055,.17,'wood');builder.gable(x,.82,.1,.18,.06,.055,'snow');for(const dx of [-.05,.05])for(const dz of [-.045,.045])builder.place(new THREE.CylinderGeometry(.022,.022,.012,16).rotateZ(Math.PI/2),'dark',x+dx,.02,.82+dz)})
  } else if(type==='highcastle') {
    builder.features=['Yüksek sınır kalesi','Mavi-mor çatılar','Korucu gözetleme kuleleri','Dökümhaneler','Büyük ve küçük atölyeler','Askeri yerleşke']
    palette.stone='#ada792';palette.roof='#555d74'
    builder.castle(-.68,-.65,.65)
    for(const side of [-1,1])for(let i=0;i<4;i++){const x=side*.67,z=-.15+i*.33;builder.hall(x,z,.31,.27,.21,'wood');builder.cylinder(x-.11,z-.08,.029,.49,'dark');builder.box(x,z,.37,.032,.33,'stone',-.016)}
    builder.hall(0,-.59,.38,.69,.28);builder.hall(.7,-.7,.37,.4,.26)
    for(let i=0;i<4;i++){const a=i*Math.PI/2;builder.tower(Math.sin(a)*1.2,Math.cos(a)*1.2,.076,.68);builder.banner(Math.sin(a)*1.1,Math.cos(a)*1.1)}
    for(let i=0;i<33;i++){const a=i*2.399,r=.42+random()*.9,x=Math.sin(a)*r,z=Math.cos(a)*r;if(Math.abs(x)<.35&&z<0||!dry(x,z))continue;builder.house(x,z,.09+random()*.05,false,a)}
  } else if(type==='ruins') {
    builder.features=['Eski taş daire','Ayakta kalan idari yapılar','Düzensiz kıyı barınakları','Kadim büyük harabeler','Kırık kemerler']
    palette.stone='#8d9a97';palette.wood='#5b635c';palette.roof='#505e62'
    builder.at(0,-.35,()=>{builder.box(0,-.35,.91,.13,.73,'stone',-.06);for(const side of [-1,1]){builder.box(side*.45,-.35,.09,.78,.73);for(let n=0;n<4;n++)builder.arch(side*.45,-.63+n*.18,.13,.32,.09,.38,Math.PI/2)}builder.box(0,-.71,.95,.67,.09);builder.gable(-.26,-.41,.35,.48,.14,.77,'snow')})
    for(let i=0;i<9;i++){const a=i*Math.PI/6;builder.column(Math.sin(a)*1.07,Math.cos(a)*1.07,.06,.43+(i%4)*.19)}
    builder.arch(-.74,.27,.42,.78,.15);builder.arch(.65,.64,.35,.56,.13);builder.lighthouse(-1.11,-.01,.6,.07)
    for(const [x,z]of [[.94,-.74],[-.89,.68]])builder.at(x,z,()=>{
      builder.box(x,z,.47,.065,.54,'stone',-.02)
      for(let n=0;n<5;n++){builder.box(x-.2+n*.1,z-.26,.08,.15+(n%3)*.095,.035);builder.column(x-.2+n*.1,z+.25,.023,.21+(n%2)*.14)}
      builder.box(x-.24,z,.04,.29,.5);builder.arch(x+.18,z,.16,.33,.055,0,Math.PI/2)
    })
    for(let i=0;i<39;i++){const a=i*2.399,r=.42+random()*.85,x=Math.sin(a)*r,z=.2+Math.cos(a)*r;if(dry(x,z)&&!(Math.abs(x)<.55&&z<0))builder.house(x,z,.09+random()*.045,cold,a,i%4===0?'snow':'wood',1,true)}
    builder.pier(-1.1,.62,.76)
  } else if(type==='portfort') {
    builder.features=['Liman kalesi','Kıyı feneri','Korunan iskele','Düzenli garnizon sokakları']
    builder.castle(.22,-.47,.67);builder.wall(1.1,.22,32,'stone',1,.05)
    builder.lighthouse(-.8,-.39,.97,.075)
    for(const side of [-1,1])for(let n=0;n<5;n++)builder.house(side*.43,.02+n*.22,.13,true)
    builder.hall(.81,.38,.25,.59,.21,'snow');builder.pier(-1,.17,.9,Math.PI/2);builder.pier(-1,.48,.7,Math.PI/2)
  } else if(type==='springs') {
    builder.features=['Sıcak su havuzu','Ocak evleri','Kıyı iskelesi','Düzenli yerel sokaklar','Yıpranmış eski mahalleler']
    palette.stone='#8c9690';palette.wood='#63665b';palette.roof='#5c625b'
    builder.fountain(0,0,.3)
    for(const side of [-1,1])for(let n=0;n<5;n++)builder.house(side*.53,-.6+n*.3,.16,true,0,n%3===0?'snow':'wood',1,true)
    builder.hall(0,-.73,.36,.29,.28,'wood');builder.pier(-.89,.35,.65,Math.PI/2)
    for(let i=0;i<8;i++)builder.house((i%4-1.5)*.31,.76+Math.floor(i/4)*.28,.125,true,0,'wood',1,true)
  } else if(type==='huts'||type==='warehouses') {
    builder.features=type==='huts'?['Ahşap barınaklar','Küçük iskele']:['Yıpranmış depolar','Kıyı iskeleleri','Kırık eski duvarlar']
    palette.stone='#88948c';palette.wood='#718077'
    for(let i=0;i<(type==='huts'?33:34);i++){const x=(random()-.5)*1.8,z=(random()-.5)*1.8;if(dry(x,z))builder.house(x,z,.1+random()*.055,cold,random()*Math.PI,'snow')}
    builder.pier(-.9,.44,.77,Math.PI/2)
    if(type==='warehouses'){for(let n=0;n<3;n++)builder.hall(-.57+n*.43,.78,.31,.46,.22,'wood');builder.pier(-.91,.77,.87,Math.PI/2);builder.arch(.45,-.6,.35,.5,.13);builder.box(.52,-.49,.45,.19,.075,'stone',0,.3)}
  } else {
    const size=place.major?1.1:.61
    builder.features=[place.major?'Yerleşim merkezi':'Evler · küçük meydan · yerel yapı']
    const count=place.major?34:19+Math.floor(random()*11)
    for(let i=0;i<count;i++){
      const a=i*2.399,r=size*(.25+random()*.65)
      const x=Math.sin(a)*r,z=Math.cos(a)*r;if(dry(x,z))builder.house(x,z,place.major?.17:.075+random()*.035,cold,a,cold?'snow':'roof',i%7===0?2:1)
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
  // Districts grow around the institutions rather than leaving a few houses
  // around one oversized roof. The same seed gives stable street blocks.
  if(type&&type!=='capital'){
    const extents=type==='guild'?[1.52,1.48]:type==='academy'||type==='temple'?[1.86,1.8]:type==='highcastle'?[1.48,1.43]:type==='twincastle'?[1.32,1.27]:type==='ruins'?[1.43,1.3]:[1.13,1.2]
    const spacing=type==='academy'||type==='temple'?.18:.155,worn=['ruins','springs','huts','warehouses'].includes(type)
    for(let ix=-Math.floor(extents[0]/spacing);ix<=Math.floor(extents[0]/spacing);ix++)for(let iz=-Math.floor(extents[1]/spacing);iz<=Math.floor(extents[1]/spacing);iz++){
      const x=ix*spacing+(random()-.5)*.025,z=iz*spacing+(random()-.5)*.025
      if(!dry(x,z)||Math.abs(x)<.065||Math.abs(z-.43)<.06)continue
      if(type==='guild'&&((x>-.93&&x<.35&&z<.35)||(x>.36&&z>-.23&&z<.69)||(z>.73&&z<1.02&&Math.abs(x)<.58)||z<-.64))continue
      if(['academy','temple'].includes(type)&&(Math.abs(x)<1.25&&Math.abs(z)<1.2||Math.hypot(x,z)>2.05))continue
      if(type==='twincastle'&&(Math.abs(x)<.46||Math.abs(x+.72)<.46&&Math.abs(z+.22)<.39||Math.abs(x-.73)<.43&&Math.abs(z-.28)<.37))continue
      if(type==='highcastle'&&(Math.abs(x)<.99&&Math.abs(z)<.95)||type==='ruins'&&(Math.abs(x)<.59&&z<.1||Math.abs(x-.94)<.28&&z<-.4||Math.abs(x+.89)<.28&&z>.37))continue
      if(['springs','portfort'].includes(type)&&Math.abs(x)<.77&&Math.abs(z)<.86)continue
      if(random()<.25)continue
      builder.house(x,z,.085+random()*.04,cold,Math.sin(z*2.)*.1,worn?(cold&&ix%4===0?'snow':'wood'):cold?'snow':'roof',!worn&&random()>.65?2:1,worn)
    }
    if(type==='twincastle')for(const side of [-1,1])builder.lane([[side*.47,-1.21],[side*.63,-.6],[side*.52,0],[side*.82,.63],[side*.95,1.32]],.09,'wood')
    else {
      builder.lane([[0,-extents[1]],[0,.24],[.19,.43],[0,extents[1]]],worn?.065:.11,worn?'wood':'stone')
      builder.lane([[-extents[0],.43],[-.6,.38],[0,.43],[.7,.51],[extents[0],.43]],worn?.065:.1,worn?'wood':'stone')
      if(['guild','highcastle','academy','temple'].includes(type))for(const side of [-1,1])builder.lane([[side*1.3,-.86],[side*1.31,.4],[side*1.38,1.3]],.07)
    }
  }else if(type==='capital'){
    builder.lane([[-1.7,.4],[-.85,.37],[0,.34],[.83,.31],[1.72,.34]],.1)
    for(const side of [-1,1])builder.lane([[side*.23,.7],[side*.54,1.03],[side*.98,1.68]],.07)
  }else builder.lane([[-.54,.13],[0,0],[.55,-.1]],.055,'wood')
  const group=builder.finish(palette,place.id)
  group.userData.modelScale=signature?.scale || (place.major?1.25:1)
  // Distant hamlets keep their full silhouettes without paying for dozens
  // of additional shadow-map passes in the kingdom overview.
  if(!place.major)group.traverse(object=>{if(object instanceof THREE.Mesh)object.castShadow=false})
  group.name=`settlement:${place.id}`
  group.position.set(...worldPoint(place.point,baseline))
  return group
}

export function buildFarmstead(point:UV,surface:(p:UV)=>number,mill:boolean){
  const origin=worldPoint(point),baseline=surface(point),builder=new Mason((x,z)=>surface(mapPoint(origin[0]+x,origin[2]+z))-baseline)
  builder.house(0,0,.14,false,0,'wood');builder.hall(.19,.1,.13,.22,.11,'wood')
  if(mill){builder.cylinder(-.17,.03,.055,.3);builder.roof(-.17,.03,.08,.1,.3,'wood',8);for(const a of [.5,.5+Math.PI/2])builder.place(new THREE.BoxGeometry(.29,.025,.015).rotateZ(a),'wood',-.17,.31,-.035)}
  const group=builder.finish({...base,stone:'#9f957b',wood:'#7f7054'},'farmstead');group.position.set(origin[0],baseline+.027,origin[2]);group.name=mill?'rural-windmill':'rural-barn';return group
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
