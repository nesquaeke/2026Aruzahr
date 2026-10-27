import { mapLocations, regions } from './data'
import { mapFeatures } from './map-features'
import {
  heightAt,
  landAt,
  riverPaths,
  terrainNoise,
  valueNoise,
  worldPoint,
  WORLD_DEPTH,
  WORLD_WIDTH,
  type UV,
} from './relief-data'

export { WORLD_DEPTH, WORLD_WIDTH, worldPoint }
export const cinematicTargets = [...regions, ...mapLocations, ...mapFeatures]
export const cinematicCameraKey = 'aruzahr-cinematic-world-camera-v1'
export const cinematicSource =
  'Özgün kıyı referansı · yeniden oluşturulmuş kabartma'
export type CinematicField = {
  width: number
  height: number
  land: Uint8Array
  shore: Float32Array
}
// The Danstsud crop must not erase Gurbin's southern islands or Honud's
// eastern coastal settlements merely because their UVs overlap its rectangle.
export const inDanstsud = ([u, v]: UV) =>
  u >= 0.34 && v >= 2350 / 5668 &&
  (v >= 0.6 ? u >= 0.425 : v >= 0.48 || u < 0.7)
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
export function fieldIndex([u, v]: UV, field: CinematicField) {
  return (
    Math.round(clamp(v) * (field.height - 1)) * field.width +
    Math.round(clamp(u) * (field.width - 1))
  )
}
export const cinematicLandAt = (point: UV, field: CinematicField) =>
  Boolean(field.land[fieldIndex(point, field)])

/** Source label anchors are immutable. A model whose label lies over blue ink
 * may use a nearby real land cell, without inventing an island or moving its pin.
 * The bounded offset is recorded separately by the renderer for review. */
export function settlementGround(point: UV, field: CinematicField): UV | null {
  if (cinematicLandAt(point, field)) return [...point]
  const x = Math.round(point[0] * (field.width - 1)),
    y = Math.round(point[1] * (field.height - 1)),
    radius = Math.ceil(field.width * 0.022)
  let best: UV | null = null, distance = Infinity
  for (let dy = -radius; dy <= radius; dy++)
    for (let dx = -radius; dx <= radius; dx++) {
      const xx = x + dx, yy = y + dy
      if (xx < 0 || xx >= field.width || yy < 0 || yy >= field.height ||
          !field.land[yy * field.width + xx]) continue
      const candidate: UV = [xx / (field.width - 1), yy / (field.height - 1)],
        d = Math.hypot((candidate[0] - point[0]) * WORLD_WIDTH,
                      (candidate[1] - point[1]) * WORLD_DEPTH)
      if (d < distance && d <= WORLD_WIDTH * 0.022) {
        distance = d
        best = candidate
      }
    }
  return best
}

/** The bitmap is a technical coastline mask, never a painted terrain texture. */
export async function loadCinematicField(
  signal?: AbortSignal,
): Promise<CinematicField> {
  const response = await fetch(
    new URL('cinematic-map/land-mask.png', document.baseURI),
    { signal },
  )
  if (!response.ok) throw new Error('Kıyı verisi açılamadı.')
  const bitmap = await createImageBitmap(await response.blob())
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    bitmap.close()
    throw new Error('Kıyı verisi okunamadı.')
  }
  context.drawImage(bitmap, 0, 0)
  bitmap.close()
  return createCinematicField(
    context.getImageData(0, 0, canvas.width, canvas.height).data,
    canvas.width,
    canvas.height,
  )
}

/** Pure decoding also lets the build verify independent sea/city checkpoints. */
export function createCinematicField(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
): CinematicField {
  if (!Number.isInteger(width) || !Number.isInteger(height) ||
      width < 2 || height < 2 || rgba.length !== width * height * 4)
    throw new Error('Geçersiz kıyı alanı.')
  const land = new Uint8Array(width * height)
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const point: UV = [x / (width - 1), y / (height - 1)],
        i = y * width + x
      land[i] = inDanstsud(point)
        ? landAt(point) ? 1 : 0
        : rgba[i * 4] > 127 ? 1 : 0
    }
  const shore = new Float32Array(land.length)
  for (let i = 0; i < land.length; i++) shore[i] = land[i] ? 10000 : 0
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      if (x) shore[i] = Math.min(shore[i], shore[i - 1] + 1)
      if (y) shore[i] = Math.min(shore[i], shore[i - width] + 1)
    }
  for (let y = height - 1; y >= 0; y--)
    for (let x = width - 1; x >= 0; x--) {
      const i = y * width + x
      if (x < width - 1) shore[i] = Math.min(shore[i], shore[i + 1] + 1)
      if (y < height - 1) shore[i] = Math.min(shore[i], shore[i + width] + 1)
    }
  return { width, height, land, shore }
}

// Broad mountain corridors visible in the source. These are display heights,
// not surveyed metres. No elevation can cross the technical land mask.
const ranges: { points: UV[]; width: number; height: number }[] = [
  {
    points: [
      [0.045, 0.022],
      [0.1, 0.042],
      [0.16, 0.045],
      [0.22, 0.065],
      [0.28, 0.105],
    ],
    width: 0.028,
    height: 1.65,
  },
  {
    points: [
      [0.724, 0.145],
      [0.765, 0.166],
      [0.796, 0.179],
      [0.831, 0.13],
      [0.87, 0.135],
      [0.912, 0.166],
    ],
    width: 0.034,
    height: 3.1,
  },
  {
    points: [
      [0.799, 0.347],
      [0.836, 0.311],
      [0.878, 0.31],
      [0.932, 0.275],
    ],
    width: 0.026,
    height: 2.1,
  },
  {
    points: [
      [0.65, 0.215],
      [0.665, 0.27],
      [0.675, 0.307],
    ],
    width: 0.026,
    height: 2.45,
  },
  {
    points: [
      [0.594, 0.378],
      [0.627, 0.39],
      [0.65, 0.419],
    ],
    width: 0.026,
    height: 1.5,
  },
  {
    points: [
      [0.741, 0.442],
      [0.773, 0.452],
      [0.832, 0.456],
      [0.887, 0.436],
      [0.94, 0.439],
    ],
    width: 0.025,
    height: 1.65,
  },
  {
    points: [
      [0.135, 0.707],
      [0.176, 0.759],
      [0.195, 0.818],
      [0.213, 0.877],
      [0.237, 0.951],
    ],
    width: 0.045,
    height: 3.7,
  },
  {
    points: [
      [0.067, 0.615],
      [0.105, 0.66],
      [0.148, 0.68],
      [0.19, 0.71],
    ],
    width: 0.029,
    height: 1.7,
  },
]
function distanceToLine([u, v]: UV, points: UV[]) {
  let d = Infinity
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1],
      b = points[i],
      dx = b[0] - a[0],
      dy = ((b[1] - a[1]) * WORLD_DEPTH) / WORLD_WIDTH
    const px = u - a[0],
      py = ((v - a[1]) * WORLD_DEPTH) / WORLD_WIDTH,
      t = clamp((px * dx + py * dy) / (dx * dx + dy * dy || 1))
    d = Math.min(d, Math.hypot(px - dx * t, py - dy * t))
  }
  return d
}
export function cinematicHeightAt(point: UV, field: CinematicField) {
  const i = fieldIndex(point, field)
  if (!field.land[i]) return -0.08
  if (inDanstsud(point)) return Math.max(0.06, heightAt(point))
  const [u, v] = point,
    x = u * WORLD_WIDTH,
    z = v * WORLD_DEPTH,
    coast = smooth(0, field.width / 205, field.shore[i])
  let h = 0.14 + terrainNoise(x, z) * 0.065
  for (const range of ranges) {
    const d = distanceToLine(point, range.points)
    if (d < range.width) {
      const shoulder = Math.pow(1 - d / range.width, 1.6)
      const ridge = 1 - Math.abs(terrainNoise(x * 1.6 + 17, z * 1.6))
      h += shoulder * range.height * (0.35 + ridge * 0.65)
    }
  }
  // Lakbar's visible central cone. Its hot basin is a shallow depression;
  // there are no arbitrary peaks on surrounding open water.
  if (u > 0.4 && u < 0.6 && v < 0.36) {
    const r = Math.hypot((u - 0.49) * 1.15, v - 0.245)
    h += Math.exp((-r * r) / 0.0012) * 4.4
    h -= Math.exp((-r * r) / 0.00004) * 1.25
  }
  return Math.max(0.055, h * coast)
}
export function cinematicColdAt([u, v]: UV, height = 0) {
  if (u < 0.34 && v > 0.49) return 0.76 + smooth(0.54, 0.96, v) * 0.24
  if (inDanstsud([u, v]))
    return clamp(
      smooth(0.68, 0.85, v) * (1 - smooth(0.54, 0.63, u)) * 0.9 +
        smooth(2, 4, height) * 0.7,
    )
  return smooth(1.6, 3.1, height) * 0.8
}
export function cinematicRiverAt(point: UV) {
  if (!inDanstsud(point)) return false
  const px = point[0] * WORLD_WIDTH,
    pz = point[1] * WORLD_DEPTH
  return riverPaths.some((r) => {
    for (let i = 1; i < r.points.length; i++) {
      const a = r.points[i - 1],
        b = r.points[i],
        ax = a[0] * WORLD_WIDTH,
        az = a[1] * WORLD_DEPTH,
        dx = (b[0] - a[0]) * WORLD_WIDTH,
        dz = (b[1] - a[1]) * WORLD_DEPTH
      const t = clamp(
        ((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz || 1),
      )
      if (Math.hypot(px - ax - dx * t, pz - az - dz * t) < r.width * 0.44)
        return true
    }
    return false
  })
}
export function cinematicColor(
  point: UV,
  height: number,
  cold: number,
): [number, number, number] {
  const [u, v] = point,
    n =
      valueNoise(u * 140, v * 100) * 0.12 +
      terrainNoise(u * 120, v * 83) * 0.035
  let color: [number, number, number] = [0.285, 0.32, 0.27]
  const mix = (to: [number, number, number], amount: number) => {
    color = color.map((c, i) => c * (1 - amount) + to[i] * amount) as typeof color
  }
  const west = 1 - smooth(0.34, 0.39, u),
    desert = west * (1 - smooth(0.17, 0.28, v)),
    islands = west * smooth(0.19, 0.28, v) * (1 - smooth(0.46, 0.51, v)),
    ash = smooth(0.38, 0.43, u) * (1 - smooth(0.58, 0.63, u)) *
      (1 - smooth(0.32, 0.37, v))
  mix([0.45, 0.395, 0.285], desert)
  mix([0.235, 0.29, 0.24], islands)
  mix([0.3, 0.272, 0.23], ash)
  const rock = smooth(1, 3.3, height)
  color = color.map(
    (c, i) => c * (1 - rock) + [0.33, 0.335, 0.32][i] * rock + n,
  ) as [number, number, number]
  const snow = clamp(cold * 0.91 + smooth(3, 4.8, height) * 0.3)
  color = color.map(
    (c, i) => c * (1 - snow) + [0.7, 0.715, 0.69][i] * snow,
  ) as [number, number, number]
  if (cinematicRiverAt(point)) return [0.155, 0.25, 0.265]
  return color.map((c) => clamp(c, 0.055, 0.82)) as [number, number, number]
}
