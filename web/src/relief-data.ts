import { mapLocations, places } from './data'
import { mapFeatures } from './map-features'

export type UV = [number, number]
export const MAP_WIDTH = 8192
export const MAP_HEIGHT = 5668
export const WORLD_WIDTH = 120
export const WORLD_DEPTH = WORLD_WIDTH * MAP_HEIGHT / MAP_WIDTH
export const reliefSource = '10 Ekim 2026 · özgün 8K çizime bağlı, görsel ölçekte kabartma ve mimari yorum'
const pixels = (points: UV[]): UV[] => points.map(([x, y]) => [x / MAP_WIDTH, y / MAP_HEIGHT])
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

// Coast silhouettes traced from the drawing, not surveyed borders. Inland bays
// and Frostmere remain water; the immutable city anchors come from data.ts.
export const landBodies: UV[][] = [
  [[0,0],[2910,0],[3150,690],[2830,1560],[3010,2320],[2640,2500],[2040,2600],[1150,2470],[120,2660],[0,2380]],
  [[3180,0],[5080,0],[5160,1660],[4740,1880],[4020,2050],[3290,1740]],
  [[0,2660],[1260,2600],[1860,2820],[2780,2770],[3290,3080],[3120,3530],[3210,4010],[3400,4490],[3140,5668],[0,5668]],
  [[3020,2530],[3480,2540],[3960,2800],[4990,2930],[6110,3080],[7080,3090],[8192,3210],[8192,3520],[7950,3770],[8192,4310],[8192,5400],[7730,5580],[6910,5668],[3540,5668],[3480,5380],[3710,4890],[3370,4650],[3600,4110],[4010,3890],[4530,3690],[4760,3420],[4490,3280],[3890,3290],[3570,3150],[3260,3010],[3000,2840]],
  [[6030,0],[7080,0],[7990,150],[8110,830],[7880,1220],[7160,1400],[6510,1260],[5910,890]],
  [[7110,1130],[8080,1080],[8192,1580],[7610,1830],[7100,1610]],
  [[6200,1500],[7110,1440],[7800,1650],[8120,2210],[7440,2290],[6480,2120],[6150,1790]],
  [[5340,1120],[5790,1150],[5960,1520],[5530,1640],[5190,1450]],
  [[4800,2100],[5580,2090],[5880,2370],[5590,2660],[5030,2510]],
  [[5690,2140],[6320,1900],[6950,2020],[7100,2550],[6330,2720],[5890,2540]],
  [[7070,2290],[7660,2300],[8180,2200],[8192,2820],[7600,2800]],
].map(points => pixels(points as UV[]))
export const inlandWaters = [
  pixels([[4770,3440],[5190,3500],[5360,3720],[5190,3940],[4910,4020],[4710,3840],[4660,3650]]),
  pixels([[4220,4730],[4380,4670],[4540,4750],[4520,4860],[4380,4940],[4230,4870]]),
]
export const landAt = (point: UV) => landBodies.some(body => inPolygon(point, body)) && !inlandWaters.some(water => inPolygon(point, water))

export const ridges = [
  { id: 'karlan', points: pixels([[4490,4070],[4530,4330],[4790,4560],[4690,4830],[4700,5120],[5030,5590]]), width: 2.3, height: 6.2 },
  { id: 'dorvenhall', points: pixels([[6110,3060],[6450,3260],[6620,3400],[7110,3510]]), width: 1.65, height: 2.9 },
  { id: 'rydorn', points: pixels([[3580,2840],[3990,2980],[4460,3080],[4940,3130]]), width: 1.15, height: 1.2 },
  { id: 'garmirk', points: pixels([[6060,480],[6600,600],[6900,410],[7460,560],[7750,950]]), width: 2.3, height: 5.8 },
  { id: 'stoneclans', points: pixels([[7420,1240],[7740,1410],[7910,1600]]), width: 1.3, height: 3.4 },
  { id: 'honud-west', points: pixels([[40,2790],[840,2980],[980,3370],[610,3730],[660,4310],[680,4610]]), width: 1.8, height: 4.8 },
  { id: 'honud-center', points: pixels([[1570,2900],[1520,3280],[1960,3650],[1840,4100],[1720,4670],[1770,5180],[1450,5510]]), width: 2.1, height: 5.1 },
  { id: 'honud-east', points: pixels([[2490,2970],[2870,3340],[2660,3880],[2930,4310],[2890,4970]]), width: 1.5, height: 3.9 },
  { id: 'lakbar', points: pixels([[4110,110],[4190,530],[4220,900],[4510,1350]]), width: 2.9, height: 4.7 },
  { id: 'gurbin-north', points: pixels([[5480,1200],[5590,1440]]), width: 1.3, height: 3.1 },
  { id: 'gurbin-middle', points: pixels([[4990,2250],[5350,2310],[5670,2420]]), width: 1.3, height: 2.7 },
  { id: 'gurbin-east', points: pixels([[6060,2200],[6420,2420],[6790,2510]]), width: 1.4, height: 3.2 },
  { id: 'ariki', points: pixels([[6810,1630],[6940,1900],[7610,2090]]), width: 1.3, height: 2.2 },
  { id: 'eldrascar', points: pixels([[7420,2450],[7910,2560]]), width: 1.2, height: 2.8 },
]

function rawHeight(point: UV) {
  if (!landAt(point)) return 0
  let elevation = .17
  for (const ridge of ridges) {
    const d = lineDistance(point, ridge.points) / ridge.width
    if (d > 3.2) continue
    const texture = .77 + .14 * Math.sin(point[0] * 340 + point[1] * 87) + .09 * Math.cos(point[1] * 390 - point[0] * 110)
    elevation = Math.max(elevation, .17 + ridge.height * Math.exp(-d * d * 1.4) * texture)
  }
  return elevation
}
export const signatures: Record<string, { type: string; label: string; radius: number; scale: number }> = {
  valdareth: { type:'capital', label:'Beş sur · kraliyet kalesi · obsidyen mabedi · fener', radius:3.1, scale:1.65 },
  marhalden: { type:'twincastle', label:'İki kale · köprü · maden atölyeleri', radius:2, scale:1.5 },
  dorvenhall: { type:'highcastle', label:'Yüksek kale · mavi-mor çatı · sınır kuleleri', radius:1.9, scale:1.5 },
  elorwyn: { type:'temple', label:'Mabet · paladin avlusu · sur', radius:1.9, scale:1.45 },
  theramis: { type:'academy', label:'Araştırma kuleleri · arşiv · akademi', radius:1.7, scale:1.5 },
  lirendil: { type:'guild', label:'Çelik Kalkan salonu · kent · kıyı iskelesi', radius:1.7, scale:1.4 },
  frostbay: { type:'ruins', label:'Eski taş daireler · düzensiz kıyı yerleşimi', radius:1.5, scale:1.3 },
  dranthol: { type:'portfort', label:'Liman kalesi · deniz feneri', radius:1.4, scale:1.3 },
  ternhaven: { type:'springs', label:'Sıcak su havuzu · ocak evleri', radius:1.2, scale:1.2 },
  kaldmere: { type:'huts', label:'Ahşap barınaklar · küçük iskele', radius:.9, scale:1.1 },
  vyssgard: { type:'warehouses', label:'Yıpranmış depolar · kıyı iskeleleri', radius:1.2, scale:1.2 },
}
const foundations = places.filter(place => place.point).map(place => ({
  point: place.point!, height: Math.max(.17, rawHeight(place.point!)), radius: signatures[place.id]?.radius || (place.major ? 1.35 : .48),
}))
export function heightAt(point: UV) {
  let value = rawHeight(point)
  for (const foundation of foundations) {
    const distance = Math.hypot((point[0] - foundation.point[0]) * WORLD_WIDTH, (point[1] - foundation.point[1]) * WORLD_DEPTH)
    if (distance < foundation.radius * 1.7) value += (foundation.height - value) * (1 - smoothstep(foundation.radius * .95, foundation.radius * 1.7, distance))
  }
  return value
}
export function coldAt(point: UV, elevation = heightAt(point)) {
  if(point[0]>.37&&point[0]<.64&&point[1]<.4)return 0
  if (elevation > 3.65) return .65 + Math.min(.35, (elevation - 3.65) / 3)
  if (elevation > 2.65) return .35 + (elevation - 2.65) * .25
  const [u, v] = point
  if (u < .405 && v > .46) return .9
  if (u > .425 && u < .57 && v > .72) return .8
  if (u > .97 && v > .58) return .7
  return 0
}

type Forest = { id: string; polygon: UV[]; count: number; type: 'broadleaf' | 'pine' | 'autumn' | 'palm'; color: string }
export const forestZones: Forest[] = [
  { id:'murgul-west', polygon:pixels([[50,1360],[870,1300],[1110,2200],[220,2480]]), count:150, type:'broadleaf', color:'#527561' },
  { id:'murgul-east', polygon:pixels([[1160,1390],[2310,1390],[2660,2190],[1770,2500],[1110,2230]]), count:180, type:'broadleaf', color:'#4c7454' },
  { id:'xotar-oasis', polygon:pixels([[750,180],[970,110],[1140,570],[720,830]]), count:38, type:'palm', color:'#68835a' },
  { id:'xotar-east-grove', polygon:pixels([[2120,400],[2450,300],[2590,750],[2300,1000]]), count:40, type:'palm', color:'#788658' },
  { id:'rydorn-woods', polygon:pixels([[3420,2750],[3930,2830],[4720,3150],[4260,3240],[3600,3030]]), count:170, type:'broadleaf', color:'#68773f' },
  { id:'dorvenhall-west', polygon:pixels([[5380,3060],[6110,3130],[6320,3480],[5760,3570]]), count:120, type:'pine', color:'#496846' },
  { id:'lowvale-north', polygon:pixels([[7050,3140],[7940,3200],[8140,3480],[7410,3700],[7000,3510]]), count:190, type:'broadleaf', color:'#637641' },
  { id:'lowvale-east', polygon:pixels([[7730,3660],[8160,3720],[8180,4510],[7690,4450]]), count:130, type:'broadleaf', color:'#6b7b3b' },
  { id:'elorwyn-woods', polygon:pixels([[5650,4750],[6170,4660],[6500,4860],[6360,5380],[5510,5330]]), count:110, type:'autumn', color:'#ae7835' },
  { id:'teyra-woods', polygon:pixels([[6550,4530],[7010,4470],[7240,4760],[7090,5210],[6660,5130]]), count:150, type:'autumn', color:'#827142' },
  { id:'theramis-woods', polygon:pixels([[7580,4800],[8140,4780],[8090,5530],[7680,5520]]), count:105, type:'broadleaf', color:'#667449' },
  { id:'manorveil-coast', polygon:pixels([[5210,3740],[5540,3670],[5670,4290],[5230,4520]]), count:145, type:'autumn', color:'#bb822d' },
  { id:'hardlane-west', polygon:pixels([[3530,4260],[3720,4070],[4160,4230],[4050,4670],[3600,4730]]), count:90, type:'pine', color:'#697970' },
  { id:'hardlane-south', polygon:pixels([[3710,4890],[4130,4910],[4520,5310],[4170,5610],[3690,5520]]), count:100, type:'pine', color:'#6c8076' },
  { id:'honud-west-pines', polygon:pixels([[40,3680],[350,3580],[690,4460],[450,5230],[10,5080]]), count:130, type:'pine', color:'#738881' },
  { id:'honud-east-pines', polygon:pixels([[2540,3440],[3030,3450],[3200,4220],[3090,4700],[2630,4590]]), count:140, type:'pine', color:'#7c9187' },
  { id:'garmirk-pines', polygon:pixels([[6360,270],[6980,250],[7500,560],[7500,1120],[6700,1110]]), count:120, type:'pine', color:'#627663' },
  { id:'ariki-grove', polygon:pixels([[6530,1570],[7130,1540],[7370,2010],[6650,2000]]), count:65, type:'broadleaf', color:'#6b7859' },
].map(zone => ({ ...zone, type: zone.type as Forest['type'] }))

export const riverPaths = [
  { id:'aldara-nehri', name:'Doğu Aldara', width:.13, points:pixels([[4820,4550],[5140,4590],[5420,4510],[5630,4450],[5880,4280],[6220,4210],[6440,4070]]) },
  { id:'bati-aldara', name:'Batı Aldara', width:.11, points:pixels([[4820,4550],[4940,4730],[4900,4930],[4690,4920],[4500,4850],[4380,4820]]) },
  { id:'serenith-nehri', name:'Serenith', width:.12, points:pixels([[8110,3940],[7810,4050],[7520,4040],[7240,4110],[7020,4160],[6720,4140],[6450,4100]]) },
  { id:'teyra-nehri', name:'Teyra', width:.1, points:pixels([[7330,5380],[7260,5050],[7240,4810],[7150,4640],[7090,4490],[7010,4350],[6770,4280],[6500,4240]]) },
]
export const reliefTargets = [...mapLocations, ...mapFeatures]
export function seededRandom(seed: string) {
  let value = 2166136261
  for (const char of seed) value = Math.imul(value ^ char.charCodeAt(0), 16777619)
  return () => { value |= 0; value = value + 0x6D2B79F5 | 0; let t = Math.imul(value ^ value >>> 15, 1 | value); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
}
