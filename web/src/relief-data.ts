import { mapLocations, places } from './data'
import { mapFeatures } from './map-features'

export type UV = [number, number]
export const MAP_WIDTH = 8192
export const MAP_HEIGHT = 5668
export const WORLD_WIDTH = 120
export const WORLD_DEPTH = WORLD_WIDTH * MAP_HEIGHT / MAP_WIDTH
export const reliefSource = 'Danstsud · kaynak coğrafyadan sıfırdan modellenen arazi ve yerleşimler'
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
const distanceSegments=new WeakMap<UV[],number[][]>()
export function lineDistance(point: UV, path: UV[]) {
  let segments=distanceSegments.get(path)
  if(!segments){segments=[];for(let i=1;i<path.length;i++){const ax=path[i-1][0]*WORLD_WIDTH,az=path[i-1][1]*WORLD_DEPTH,dx=(path[i][0]-path[i-1][0])*WORLD_WIDTH,dz=(path[i][1]-path[i-1][1])*WORLD_DEPTH;segments.push([ax,az,dx,dz,dx*dx+dz*dz||1])}distanceSegments.set(path,segments)}
  const x=point[0]*WORLD_WIDTH,z=point[1]*WORLD_DEPTH
  let nearest=Infinity
  for(const [ax,az,dx,dz,length] of segments){const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/length)),sx=x-ax-t*dx,sz=z-az-t*dz;nearest=Math.min(nearest,sx*sx+sz*sz)}
  return Math.sqrt(nearest)
}

export const danstsudPlaces = places.filter(place => place.region === 'danstsud' && place.point)
export const reliefTargets = [...mapLocations.filter(entry => entry.region === 'danstsud'), ...mapFeatures.filter(entry => entry.region === 'danstsud')]
// Original pixels remain the coordinate system; the source bitmap is never
// used by this renderer. The scene is a new, cropped Danstsud geography.
export const GEOGRAPHY_BOUNDS = {left:2800,top:2450,right:8192,bottom:5668}
export const DANSTSUD_VIEW = { point: pixels([[5496, 4059]])[0], width: 5392 / MAP_WIDTH * WORLD_WIDTH, depth: 3218 / MAP_HEIGHT * WORLD_DEPTH }
export const inDanstsudView = ([u,v]: UV) => u >= 2800 / MAP_WIDTH && v >= 2450 / MAP_HEIGHT && u <= 1 && v <= 1

// Coastline manually traced on coordinate-labelled crops of the 8K reference.
// City sprites obscure some shoreline edges: these segments follow their
// visible land apron, rather than copying the oversized illustration silhouette.
export const coastline = pixels([
  [2800,2450],[3350,2450],[3420,2530],[3410,2620],[3450,2690],[3605,2700],[3650,2780],
  [3760,2800],[3840,2730],[4010,2690],[4080,2760],[4150,2750],[4270,2720],[4340,2790],
  [4500,2830],[4600,2800],[4750,2840],[4860,2935],[4925,2990],[5030,3010],[5080,3090],
  [5160,3115],[5270,3110],[5350,3060],[5500,3080],[5570,3110],[5690,3130],[5740,3090],
  [5820,3130],[5930,3160],[6030,3105],[6140,3100],[6280,3060],[6420,3020],[6500,3065],
  [6585,3080],[6670,3100],[6750,3210],[6880,3190],[7000,3135],[7120,3120],[7190,3170],
  [7240,3180],[7270,3255],[7390,3250],[7410,3185],[7560,3170],[7600,3230],[7720,3230],
  [7820,3240],[7940,3280],[8060,3245],[8170,3260],[8192,3320],[8192,3450],[8100,3510],
  [8130,3590],[8090,3700],[8050,3780],[8070,3910],[8140,3980],[8150,4050],[8100,4140],
  [7970,4160],[7990,4310],[8030,4470],[8040,4550],[8100,4610],[8170,4640],[8192,4710],
  [8192,4790],[8120,4830],[8120,4930],[8170,5070],[8110,5200],[8000,5370],[7950,5490],
  [7790,5530],[7670,5510],[7510,5560],[7350,5520],[7260,5530],[7170,5500],[7080,5550],
  [6980,5535],[6860,5590],[6780,5600],[6680,5640],[6630,5668],[3510,5668],[3530,5600],
  [3620,5580],[3600,5480],[3680,5400],[3850,5380],[3870,5260],[4020,5190],[4080,5160],
  [4110,5090],[4100,5040],[3980,5040],[3870,5120],[3760,5160],[3660,5140],[3620,5020],
  [3520,4980],[3500,4890],[3480,4820],[3610,4770],[3760,4785],[3890,4730],[3930,4660],
  [3840,4630],[3720,4640],[3640,4610],[3580,4560],[3600,4440],[3560,4375],[3730,4340],
  [3870,4340],[3940,4290],[3930,4210],[3920,4120],[3980,4050],[4030,3990],[4140,3930],
  [4220,3900],[4240,3980],[4230,4060],[4320,4080],[4380,4050],[4450,4020],[4470,3950],
  [4400,3920],[4410,3840],[4500,3810],[4550,3850],[4650,3850],[4660,3900],[4650,3970],
  [4740,3980],[4780,3900],[4800,3760],[4730,3730],[4610,3760],[4520,3790],[4420,3730],
  [4360,3620],[4420,3540],[4510,3530],[4580,3570],[4690,3570],[4850,3630],[4930,3680],
  [5010,3740],[5050,3830],[5060,3900],[5100,3980],[5170,4000],[5190,3930],[5140,3890],
  [5130,3780],[5260,3730],[5380,3710],[5480,3620],[5550,3600],[5450,3570],[5350,3580],
  [5290,3530],[5170,3530],[5080,3540],[5000,3490],[4920,3460],[4840,3410],[4810,3440],
  [4740,3400],[4650,3350],[4560,3360],[4480,3340],[4390,3310],[4300,3300],[4210,3290],
  [4170,3230],[4070,3190],[3980,3170],[3900,3180],[3830,3230],[3810,3300],[3770,3350],
  [3680,3340],[3610,3310],[3570,3200],[3490,3160],[3420,3130],[3350,3120],[3310,3160],
  [3240,3150],[3200,3100],[3210,3000],[3160,2960],[3100,2970],[3050,2920],[2980,2850],
  [2870,2810],[2810,2740],[2820,2650],[2850,2510]
])
export const lakeOutline = pixels([[4170,4690],[4280,4670],[4390,4730],[4510,4815],[4750,4800],[4740,4840],[4590,4870],[4510,4920],[4430,4890],[4320,4840],[4210,4750]])
const coastLoop = [...coastline,coastline[0]],lakeLoop = [...lakeOutline,lakeOutline[0]]
export const landAt = (point:UV) => inDanstsudView(point) && inPolygon(point,coastline) && !inPolygon(point,lakeOutline)
export const shoreDistance = (point:UV) => Math.min(lineDistance(point,coastLoop),lineDistance(point,lakeLoop))
// Smooth, deterministic pigment/relief variation; no satellite or atlas image.
export function terrainNoise(x:number,z:number) {
  return (Math.sin(x*.73+Math.cos(z*.39))*Math.cos(z*.61-x*.17)+Math.sin(x*2.31+z*1.73)*.28+Math.sin(x*6.81-z*3.1)*.09)/1.37
}

type Peak = { x: number; y: number; rx: number; ry: number; height: number }
type Mountain = { id: string; polygon: UV[]; peaks: Peak[]; boundary:UV[]; bounds: [number,number,number,number] }
function mountain(id: string, outline: UV[], peaks: number[][]): Mountain {
  const polygon=pixels(outline),xs=polygon.map(p=>p[0]),ys=polygon.map(p=>p[1])
  return {id,polygon,boundary:[...polygon,polygon[0]],bounds:[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)],peaks:peaks.map(([x,y,rx,ry,height])=>({x,y,rx,ry,height}))}
}
// Footprints and individual summits traced over coordinate-labelled source
// crops. Heights are display scale, never inferred metres. A closed footprint
// plus a zero-height buffer prevents the terrain grid spilling into water.
export const mountainFootprints: Mountain[] = [
  mountain('rydorn-west',[[3295,2810],[3400,2785],[3520,2860],[3610,2865],[3755,2980],[3895,2970],[3990,3060],[3980,3140],[3810,3150],[3690,3100],[3530,2995],[3360,2935],[3295,2885]],[[3435,2845,125,100,1.25],[3690,2980,130,110,1.05],[3890,3050,100,95,.8]]),
  mountain('rydorn-east',[[4260,3100],[4380,3025],[4470,3070],[4540,3200],[4650,3190],[4770,3240],[4880,3270],[5010,3300],[5110,3275],[5200,3350],[5240,3410],[5375,3420],[5440,3500],[5390,3560],[5260,3535],[5160,3470],[5000,3500],[4890,3420],[4780,3370],[4570,3340],[4390,3270],[4290,3220]],[[4430,3140,130,130,1.45],[4610,3260,105,100,.85],[4810,3290,100,90,.85],[5110,3370,135,130,1.2],[5360,3480,105,100,.7]]),
  mountain('dorvenhall-west',[[5770,3365],[5870,3315],[5985,3380],[6090,3350],[6170,3415],[6195,3510],[6080,3565],[5940,3550],[5790,3520]],[[5880,3390,120,140,1.85],[6090,3435,100,120,1.45]]),
  mountain('dorvenhall-south',[[6190,3370],[6290,3300],[6405,3340],[6545,3325],[6660,3375],[6780,3370],[6850,3445],[6785,3490],[6625,3485],[6490,3450],[6350,3485],[6230,3500],[6170,3450]],[[6290,3370,125,105,1.9],[6490,3380,110,100,1.35],[6680,3405,125,100,1.1]]),
  mountain('lowvale-west',[[6880,3330],[6970,3310],[7060,3350],[7135,3350],[7185,3405],[7250,3415],[7255,3470],[7180,3500],[7110,3540],[6980,3500],[6910,3500],[6870,3440]],[[7000,3385,95,95,1.55],[7110,3415,85,110,1.25]]),
  mountain('lowvale-east',[[7310,3360],[7390,3350],[7460,3330],[7540,3380],[7610,3390],[7670,3360],[7750,3405],[7800,3380],[7860,3400],[7940,3380],[8000,3410],[8070,3380],[8110,3480],[8050,3530],[7950,3540],[7850,3490],[7750,3530],[7640,3500],[7560,3520],[7440,3510],[7350,3510],[7300,3440]],[[7460,3405,100,130,1.5],[7670,3420,85,110,1.3],[7830,3430,80,100,1.2],[8000,3450,85,110,1.1]]),
  mountain('karlan-north',[[4410,4050],[4490,4005],[4580,4015],[4635,4070],[4730,4060],[4800,4135],[4850,4185],[4930,4230],[4930,4320],[5030,4380],[5100,4475],[5050,4520],[4890,4510],[4825,4570],[4700,4540],[4620,4595],[4540,4510],[4520,4420],[4430,4355],[4340,4340],[4375,4240]],[[4530,4130,140,175,3.8],[4730,4190,145,180,3.15],[4570,4300,165,160,2.25],[4850,4370,150,190,2.7],[4740,4500,145,120,1.6],[4975,4460,95,110,1.35]]),
  mountain('karlan-west-spurs',[[4070,4280],[4150,4240],[4230,4345],[4290,4380],[4350,4435],[4400,4530],[4390,4610],[4315,4550],[4240,4480],[4170,4480],[4065,4380]],[[4130,4320,95,95,1.3],[4295,4430,90,100,1.1],[4350,4530,65,90,.85]]),
  mountain('karlan-middle',[[5120,5170],[5220,5125],[5280,5150],[5380,5220],[5430,5300],[5360,5340],[5260,5300],[5170,5320],[5070,5245]],[[5250,5240,145,140,2.35],[5350,5300,80,100,1.0]]),
  mountain('karlan-south',[[5220,5405],[5310,5425],[5360,5500],[5430,5600],[5430,5668],[5070,5668],[5110,5560],[5180,5480]],[[5260,5525,145,150,2.5],[5340,5620,125,130,1.7]]),
  mountain('hardlane-ice-ridge',[[4305,5220],[4360,5185],[4400,5230],[4380,5290],[4320,5380],[4290,5440],[4240,5535],[4150,5580],[4100,5550],[4170,5450],[4210,5380],[4270,5310]],[[4330,5260,60,90,.95],[4265,5400,65,90,.85],[4160,5520,70,80,.8]]),
]
const foundations = danstsudPlaces.map(place=>({point:place.point!,radius:place.major?.8:.3}))
export function mountainHeightAt(point: UV,land=landAt(point)) {
  if(!land)return 0
  const x=point[0]*MAP_WIDTH,y=point[1]*MAP_HEIGHT
  let height=0
  for(const area of mountainFootprints) {
    const [left,top,right,bottom]=area.bounds
    if(point[0]<=left||point[0]>=right||point[1]<=top||point[1]>=bottom||!inPolygon(point,area.polygon))continue
    // 24 source pixels > the diagonal of a desktop/mobile terrain cell. Each
    // raised vertex is separated from the outline; interpolation stays inside.
    const edge=lineDistance(point,area.boundary)*MAP_WIDTH/WORLD_WIDTH
    if(edge<24)continue
    for(const peak of area.peaks) {
      const distance=Math.hypot((x-peak.x)/peak.rx,(y-peak.y)/peak.ry)
      if(distance>=1.65)continue
      const shape=Math.pow(Math.max(0,1-distance/1.65),1.5)
      const angle=Math.atan2(y-peak.y,x-peak.x)
      const ridges=.88+.12*Math.cos(angle*5+distance*2)
      height=Math.max(height,peak.height*shape*ridges*smoothstep(24,50,edge))
    }
  }
  if(!height)return 0
  // Foundations only lower the mountain surface. They cannot turn water into
  // land, and settlements elsewhere never introduce elevation.
  for(const foundation of foundations) {
    const distance=Math.hypot((point[0]-foundation.point[0])*WORLD_WIDTH,(point[1]-foundation.point[1])*WORLD_DEPTH)
    if(distance<foundation.radius)height*=smoothstep(foundation.radius*.45,foundation.radius,distance)
  }
  const waterClearance=Math.min(...riverPaths.map(river=>lineDistance(point,river.points)-river.width/2))
  return height*smoothstep(.12,.55,waterClearance)
}
export function groundHeightAt(point:UV,land=landAt(point),coast=shoreDistance(point),mountains=mountainHeightAt(point,land)) {
  if(!land)return -.18-Math.min(.85,coast*.5)
  const [x,,z]=worldPoint(point)
  let base=.32*smoothstep(0,.4,coast)
  // Broad pasture undulation stays modest. Town foundations remain level.
  const farFromCity=foundations.every(f=>Math.hypot((point[0]-f.point[0])*WORLD_WIDTH,(point[1]-f.point[1])*WORLD_DEPTH)>f.radius*2)
  if(farFromCity)base+=Math.max(0,terrainNoise(x*.25,z*.25))*.055*smoothstep(.5,1.5,coast)
  for(const river of riverPaths){const d=lineDistance(point,river.points);if(d<river.width*.7)base*=.32+.68*smoothstep(river.width*.22,river.width*.7,d)}
  return base+mountains
}
// Surface height is also valid for labels over water; seabed height is separate.
export const heightAt = (point:UV) => Math.max(0,groundHeightAt(point))
export const riverAt = (point:UV,margin=0) => riverPaths.some(river=>lineDistance(point,river.points)<river.width/2+margin)
export function snowAt(point:UV,elevation=heightAt(point),land=landAt(point)) {
  if(!land)return 0
  const [x,y]=[point[0]*MAP_WIDTH,point[1]*MAP_HEIGHT]
  const hardlane=(1-smoothstep(4710,4900,x))*smoothstep(3900,4090,y)
  return Math.max(hardlane*.94,smoothstep(1.35,2.8,elevation))
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
  dorvenhall:{type:'highcastle',label:'Yüksek kale · mavi-mor çatı · sınır kuleleri',radius:2.4,scale:1.5},
  elorwyn:{type:'temple',label:'Mabet · paladin avlusu · sur',radius:2.3,scale:1.45},
  theramis:{type:'academy',label:'Araştırma kuleleri · arşiv · akademi',radius:2.3,scale:1.5},
  lirendil:{type:'guild',label:'Çelik Kalkan salonu · kent · kıyı iskelesi',radius:2.2,scale:1.4},
  frostbay:{type:'ruins',label:'Eski taş daireler · düzensiz kıyı yerleşimi',radius:1.5,scale:1.3},
  dranthol:{type:'portfort',label:'Liman kalesi · deniz feneri',radius:1.4,scale:1.3},
  ternhaven:{type:'springs',label:'Sıcak su havuzu · ocak evleri',radius:1.2,scale:1.2},
  kaldmere:{type:'huts',label:'Ahşap barınaklar · küçük iskele',radius:.9,scale:1.1},
  vyssgard:{type:'warehouses',label:'Yıpranmış depolar · kıyı iskeleleri',radius:1.2,scale:1.2},
}

type Forest={id:string;polygon:UV[];count:number;type:'broadleaf'|'pine'|'autumn';color:string}
export const forestZones:Forest[]=[
  {id:'rydorn',polygon:pixels([[3250,2740],[4500,2800],[5530,3190],[6000,3360],[5880,3650],[5260,3510],[4400,3340],[3620,3120]]),count:660,type:'broadleaf',color:'#547254'},
  {id:'dorvenhall-woods',polygon:pixels([[5680,3470],[6380,3340],[6760,3430],[6800,3780],[6190,3760],[5730,3610]]),count:400,type:'pine',color:'#496a58'},
  {id:'lowvale',polygon:pixels([[6800,3420],[8090,3290],[8192,4120],[7440,4100],[6840,3840]]),count:880,type:'broadleaf',color:'#557951'},
  {id:'lowvale-south',polygon:pixels([[7160,4230],[7970,4190],[8192,5100],[7970,5480],[7390,5310],[7160,4780]]),count:670,type:'broadleaf',color:'#6e8250'},
  {id:'manorveil-orchards',polygon:pixels([[4750,3650],[5260,3700],[5580,4580],[5670,5530],[5250,5668],[4980,4670]]),count:600,type:'autumn',color:'#ab874d'},
  {id:'elorwyn-groves',polygon:pixels([[5560,4570],[7190,4440],[7180,5610],[6450,5668],[5490,5470]]),count:770,type:'autumn',color:'#9c8151'},
  {id:'hardlane-pines',polygon:pixels([[3810,3970],[4400,3940],[4720,4600],[4700,5668],[3720,5668],[3560,4380]]),count:990,type:'pine',color:'#668b80'},
]
export const riverPaths=[
  // The broad northern branch between Othmar and Eldwen is visible in the
  // source. It belongs to the existing Serenith target, not a new lore place.
  {id:'serenith-nehri',name:'Serenith kuzey kolu',width:.64,points:pixels([[7250,3240],[7250,3310],[7290,3380],[7290,3440],[7320,3500],[7235,3590],[7220,3690],[7150,3850],[7150,3970],[7190,4070],[7190,4140]])},
  {id:'aldara-nehri',name:'Doğu Aldara',width:.34,points:pixels([[4940,4410],[5140,4440],[5340,4390],[5450,4330],[5530,4250],[5510,4160],[5400,4050]])},
  {id:'bati-aldara',name:'Batı Aldara',width:.3,points:pixels([[4880,4440],[4900,4690],[4900,4930],[4600,4890],[4390,4810]])},
  {id:'serenith-nehri',name:'Serenith',width:.46,points:pixels([[8110,4040],[7850,4120],[7550,4140],[7370,4150],[7190,4040],[7000,3970],[6840,3880],[6630,3840],[6450,3820],[6160,3850],[6020,3850]])},
  {id:'teyra-nehri',name:'Teyra',width:.34,points:pixels([[7430,4800],[7310,4770],[7270,4640],[7280,4500],[7210,4360],[7140,4250],[7060,4090]])},
]
export function seededRandom(seed:string) {
  let value=2166136261
  for(const char of seed)value=Math.imul(value^char.charCodeAt(0),16777619)
  return()=>{value|=0;value=value+0x6D2B79F5|0;let t=Math.imul(value^value>>>15,1|value);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}
}
