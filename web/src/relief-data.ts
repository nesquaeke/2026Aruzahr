import { mapLocations, places } from './data'
import { mapFeatures } from './map-features'

export type UV = [number, number]
export const MAP_WIDTH = 8192
export const MAP_HEIGHT = 5668
export const WORLD_WIDTH = 120
export const WORLD_DEPTH = WORLD_WIDTH * MAP_HEIGHT / MAP_WIDTH
export const reliefSource = 'Danstsud · özgün 8K harita üzerindeki dağ çizimleriyle sınırlı kabartma'
export const pixels = (points: UV[]): UV[] => points.map(([x, y]) => [x / MAP_WIDTH, y / MAP_HEIGHT])
export const worldPoint = ([u, v]: UV, height = 0): [number, number, number] => [(u - .5) * WORLD_WIDTH, height, (v - .5) * WORLD_DEPTH]
export const mapPoint = (x: number, z: number): UV => [x / WORLD_WIDTH + .5, z / WORLD_DEPTH + .5]
export const smoothstep = (a: number, b: number, value: number) => { const t = Math.max(0, Math.min(1, (value - a) / (b - a))); return t * t * (3 - 2 * t) }
export function inPolygon([x, y]: UV, polygon: UV[]) {
  let inside = false
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j]
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
export function lineDistance(point: UV, path: UV[]) {
  let nearest = Infinity
  for (let i = 1; i < path.length; i++) {
    const ax = path[i - 1][0] * WORLD_WIDTH, az = path[i - 1][1] * WORLD_DEPTH
    const bx = path[i][0] * WORLD_WIDTH, bz = path[i][1] * WORLD_DEPTH
    const x = point[0] * WORLD_WIDTH, z = point[1] * WORLD_DEPTH
    const dx = bx - ax, dz = bz - az
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1)))
    nearest = Math.min(nearest, Math.hypot(x - ax - t * dx, z - az - t * dz))
  }
  return nearest
}

export const danstsudPlaces = places.filter(place => place.region === 'danstsud' && place.point)
export const reliefTargets = [...mapLocations.filter(entry => entry.region === 'danstsud'), ...mapFeatures.filter(entry => entry.region === 'danstsud')]
export const DANSTSUD_VIEW = { point: pixels([[5596, 4144]])[0], width: 5392 / MAP_WIDTH * WORLD_WIDTH, depth: 3168 / MAP_HEIGHT * WORLD_DEPTH }
// These bounds frame the drawing, not a surveyed political boundary. The rest
// of Valhunar remains the untouched, flat source map. No guessed land polygons.
export const inDanstsudView = ([u,v]: UV) => u >= 2800 / MAP_WIDTH && v >= 2450 / MAP_HEIGHT

type Peak = { x: number; y: number; rx: number; ry: number; height: number }
type Mountain = { id: string; polygon: UV[]; peaks: Peak[]; bounds: [number,number,number,number] }
function mountain(id: string, outline: UV[], peaks: number[][]): Mountain {
  const polygon=pixels(outline),xs=polygon.map(p=>p[0]),ys=polygon.map(p=>p[1])
  return {id,polygon,bounds:[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)],peaks:peaks.map(([x,y,rx,ry,height])=>({x,y,rx,ry,height}))}
}
// Footprints and individual summits traced over coordinate-labelled source
// crops. Heights are display scale, never inferred metres. A closed footprint
// plus a zero-height buffer prevents the terrain grid spilling into water.
export const mountainFootprints: Mountain[] = [
  mountain('rydorn-west',[[3295,2810],[3400,2785],[3520,2860],[3610,2865],[3755,2980],[3895,2970],[3990,3060],[3980,3140],[3810,3150],[3690,3100],[3530,2995],[3360,2935],[3295,2885]],[[3435,2845,125,100,1.25],[3690,2980,130,110,1.05],[3890,3050,100,95,.8]]),
  mountain('rydorn-east',[[4260,3100],[4380,3025],[4470,3070],[4540,3200],[4650,3190],[4770,3240],[4880,3270],[5010,3300],[5110,3275],[5200,3350],[5240,3410],[5375,3420],[5440,3500],[5390,3560],[5260,3535],[5160,3470],[5000,3500],[4890,3420],[4780,3370],[4570,3340],[4390,3270],[4290,3220]],[[4430,3140,130,130,1.45],[4610,3260,105,100,.85],[4810,3290,100,90,.85],[5110,3370,135,130,1.2],[5360,3480,105,100,.7]]),
  mountain('dorvenhall-west',[[5770,3365],[5870,3315],[5985,3380],[6090,3350],[6170,3415],[6195,3510],[6080,3565],[5940,3550],[5790,3520]],[[5880,3390,120,140,1.85],[6090,3435,100,120,1.45]]),
  mountain('dorvenhall-south',[[6190,3370],[6290,3300],[6405,3340],[6545,3325],[6660,3375],[6780,3370],[6850,3445],[6785,3490],[6625,3485],[6490,3450],[6350,3485],[6230,3500],[6170,3450]],[[6290,3370,125,105,1.9],[6490,3380,110,100,1.35],[6680,3405,125,100,1.1]]),
  mountain('karlan-north',[[4410,4050],[4490,4005],[4580,4015],[4635,4070],[4730,4060],[4800,4135],[4850,4185],[4930,4230],[4930,4320],[5030,4380],[5100,4475],[5050,4520],[4890,4510],[4825,4570],[4700,4540],[4620,4595],[4540,4510],[4520,4420],[4430,4355],[4340,4340],[4375,4240]],[[4530,4130,140,175,3.8],[4730,4190,145,180,3.15],[4570,4300,165,160,2.25],[4850,4370,150,190,2.7],[4740,4500,145,120,1.6],[4975,4460,95,110,1.35]]),
  mountain('karlan-west-spurs',[[4070,4280],[4150,4240],[4230,4345],[4290,4380],[4350,4435],[4400,4530],[4390,4610],[4315,4550],[4240,4480],[4170,4480],[4065,4380]],[[4130,4320,95,95,1.3],[4295,4430,90,100,1.1],[4350,4530,65,90,.85]]),
  mountain('karlan-middle',[[5120,5170],[5220,5125],[5280,5150],[5380,5220],[5430,5300],[5360,5340],[5260,5300],[5170,5320],[5070,5245]],[[5250,5240,145,140,2.35],[5350,5300,80,100,1.0]]),
  mountain('karlan-south',[[5220,5405],[5310,5425],[5360,5500],[5430,5600],[5430,5668],[5070,5668],[5110,5560],[5180,5480]],[[5260,5525,145,150,2.5],[5340,5620,125,130,1.7]]),
  mountain('hardlane-ice-ridge',[[4305,5220],[4360,5185],[4400,5230],[4380,5290],[4320,5380],[4290,5440],[4240,5535],[4150,5580],[4100,5550],[4170,5450],[4210,5380],[4270,5310]],[[4330,5260,60,90,.95],[4265,5400,65,90,.85],[4160,5520,70,80,.8]]),
]
const foundations = danstsudPlaces.map(place=>({point:place.point!,radius:place.major?.8:.3}))
export function heightAt(point: UV) {
  if(!inDanstsudView(point))return 0
  const x=point[0]*MAP_WIDTH,y=point[1]*MAP_HEIGHT
  let height=0
  for(const area of mountainFootprints) {
    const [left,top,right,bottom]=area.bounds
    if(point[0]<=left||point[0]>=right||point[1]<=top||point[1]>=bottom||!inPolygon(point,area.polygon))continue
    // 40 source pixels > the diagonal of a desktop/mobile terrain cell. Each
    // raised vertex is separated from the outline; interpolation stays inside.
    const edge=lineDistance(point,[...area.polygon,area.polygon[0]])*MAP_WIDTH/WORLD_WIDTH
    if(edge<40)continue
    for(const peak of area.peaks) {
      const distance=Math.hypot((x-peak.x)/peak.rx,(y-peak.y)/peak.ry)
      if(distance>=1.65)continue
      const shape=Math.pow(Math.max(0,1-distance/1.65),1.5)
      height=Math.max(height,peak.height*shape*smoothstep(40,80,edge))
    }
  }
  if(!height)return 0
  // Foundations only lower the mountain surface. They cannot turn water into
  // land, and settlements elsewhere never introduce elevation.
  for(const foundation of foundations) {
    const distance=Math.hypot((point[0]-foundation.point[0])*WORLD_WIDTH,(point[1]-foundation.point[1])*WORLD_DEPTH)
    if(distance<foundation.radius)height*=smoothstep(foundation.radius*.45,foundation.radius,distance)
  }
  return height
}
export function coldAt(point: UV, elevation=heightAt(point)) {
  if(!inDanstsudView(point))return 0
  if(elevation>1.7)return Math.min(1,.55+(elevation-1.7)*.3)
  const [x,y]=[point[0]*MAP_WIDTH,point[1]*MAP_HEIGHT]
  if(x>=3600&&x<4750&&y>=3950)return .85
  if(x>8050&&y>3900)return .65
  return 0
}
export const signatures: Record<string, {type:string;label:string;radius:number;scale:number}> = {
  valdareth:{type:'capital',label:'Beş sur · kraliyet kalesi · obsidyen mabedi · fener',radius:3.1,scale:1.65},
  marhalden:{type:'twincastle',label:'İki kale · köprü · maden atölyeleri',radius:2,scale:1.5},
  dorvenhall:{type:'highcastle',label:'Yüksek kale · mavi-mor çatı · sınır kuleleri',radius:1.9,scale:1.5},
  elorwyn:{type:'temple',label:'Mabet · paladin avlusu · sur',radius:1.9,scale:1.45},
  theramis:{type:'academy',label:'Araştırma kuleleri · arşiv · akademi',radius:1.7,scale:1.5},
  lirendil:{type:'guild',label:'Çelik Kalkan salonu · kent · kıyı iskelesi',radius:1.7,scale:1.4},
  frostbay:{type:'ruins',label:'Eski taş daireler · düzensiz kıyı yerleşimi',radius:1.5,scale:1.3},
  dranthol:{type:'portfort',label:'Liman kalesi · deniz feneri',radius:1.4,scale:1.3},
  ternhaven:{type:'springs',label:'Sıcak su havuzu · ocak evleri',radius:1.2,scale:1.2},
  kaldmere:{type:'huts',label:'Ahşap barınaklar · küçük iskele',radius:.9,scale:1.1},
  vyssgard:{type:'warehouses',label:'Yıpranmış depolar · kıyı iskeleleri',radius:1.2,scale:1.2},
}

type Forest={id:string;polygon:UV[];count:number;type:'broadleaf'|'pine'|'autumn';color:string}
export const forestZones:Forest[]=[
  {id:'rydorn-north',polygon:pixels([[3540,2860],[3640,2840],[4440,3070],[4340,3140],[3600,2925]]),count:155,type:'broadleaf',color:'#6d7746'},
  {id:'rydorn-south',polygon:pixels([[3690,2990],[4050,3075],[4460,3220],[4350,3260],[3810,3140],[3660,3060]]),count:140,type:'broadleaf',color:'#768151'},
  {id:'dorvenhall-west',polygon:pixels([[5740,3500],[6040,3490],[6160,3610],[5950,3640],[5770,3590]]),count:130,type:'pine',color:'#536e50'},
  {id:'lowvale-north',polygon:pixels([[6980,3450],[7500,3430],[7620,3590],[7380,3700],[7040,3620]]),count:180,type:'broadleaf',color:'#708351'},
  {id:'lowvale-east',polygon:pixels([[7700,3430],[8060,3460],[8080,3800],[7880,3760],[7690,3610]]),count:190,type:'broadleaf',color:'#74814b'},
  {id:'elorwyn-south',polygon:pixels([[5500,5470],[5970,5530],[6500,5460],[6600,5630],[5580,5668],[5450,5580]]),count:150,type:'autumn',color:'#b4884c'},
  {id:'teyra-west',polygon:pixels([[6520,4430],[6670,4430],[6890,4490],[6920,4630],[6770,4650],[6510,4540]]),count:170,type:'autumn',color:'#a87964'},
  {id:'theramis-east',polygon:pixels([[8030,4800],[8130,4780],[8170,5160],[8090,5530],[7960,5420],[8040,5080]]),count:115,type:'broadleaf',color:'#738252'},
  {id:'manorveil-west',polygon:pixels([[4930,3930],[5090,4000],[5080,4180],[5190,4350],[5200,4640],[5070,4700],[4980,4460],[5000,4240],[4860,4090]]),count:215,type:'autumn',color:'#b58a39'},
  {id:'manorveil-south',polygon:pixels([[5370,4600],[5510,4550],[5500,4880],[5600,5150],[5580,5350],[5470,5340],[5390,5110],[5380,4850]]),count:190,type:'autumn',color:'#ad813c'},
  {id:'hardlane-west',polygon:pixels([[4060,4130],[4270,4120],[4240,4690],[4110,4720],[3990,4490]]),count:155,type:'pine',color:'#7d9288'},
  {id:'hardlane-spine',polygon:pixels([[4390,4070],[4480,4080],[4540,4470],[4560,4920],[4480,5190],[4410,5090],[4450,4600],[4370,4340]]),count:170,type:'pine',color:'#7e938b'},
  {id:'hardlane-south',polygon:pixels([[3990,5040],[4220,5000],[4370,5250],[4330,5490],[4130,5550],[3970,5420]]),count:195,type:'pine',color:'#81968d'},
]
export const riverPaths=[
  {id:'aldara-nehri',name:'Doğu Aldara',width:.085,points:pixels([[4940,4410],[5140,4440],[5340,4390],[5450,4330],[5530,4250],[5510,4160],[5400,4050]])},
  {id:'bati-aldara',name:'Batı Aldara',width:.08,points:pixels([[4880,4440],[4900,4690],[4900,4930],[4600,4890],[4390,4810]])},
  {id:'serenith-nehri',name:'Serenith',width:.08,points:pixels([[8110,4040],[7850,4120],[7550,4140],[7370,4150],[7190,4040],[7000,3970],[6840,3880],[6630,3840],[6450,3820],[6160,3850],[6020,3850]])},
  {id:'teyra-nehri',name:'Teyra',width:.075,points:pixels([[7430,4800],[7310,4770],[7270,4640],[7280,4500],[7210,4360],[7140,4250],[7060,4090]])},
]
export function seededRandom(seed:string) {
  let value=2166136261
  for(const char of seed)value=Math.imul(value^char.charCodeAt(0),16777619)
  return()=>{value|=0;value=value+0x6D2B79F5|0;let t=Math.imul(value^value>>>15,1|value);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
}
