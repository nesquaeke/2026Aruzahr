import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const source = new URL(
  '../../kaynaklar/haritalar/Aruzahr 8k (1).jpg',
  import.meta.url,
)
const folder = new URL('../public/cinematic-map/', import.meta.url)
await mkdir(folder, { recursive: true })
const width = 2048,
  height = 1417
const { data } = await sharp(fileURLToPath(source))
  .resize(width, height, { fit: 'fill' })
  .blur(0.7)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const raw = new Uint8Array(width * height)
for (let i = 0; i < raw.length; i++) {
  const r = data[i * 3],
    g = data[i * 3 + 1],
    b = data[i * 3 + 2]
  const water = b > r * 1.11 && g > r * 1.055 && b > g * 0.87 && b - r > 9
  raw[i] = water ? 0 : 255
}
// Closing only repairs the drawn grid and letters. It never supplies a height.
const close = await sharp(Buffer.from(raw), {
  raw: { width, height, channels: 1 },
})
  .blur(1.7)
  .threshold(126)
  .greyscale()
  .raw()
  .toBuffer()
const mask = new Uint8Array(close)
function inPoly(x, y, pts) {
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i],
      b = pts[j]
    if (
      a[1] > y != b[1] > y &&
      x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]
    )
      inside = !inside
  }
  return inside
}
// Honud's blue channels remain water; the following apron only bounds its
// snow/forest coast. The source's colour mask still distinguishes the islands.
const honud = [
  [0,0.475],[0.04,0.49],[0.09,0.54],[0.14,0.56],
  [0.175,0.515],[0.205,0.515],[0.23,0.48],[0.265,0.49],
  [0.29,0.53],[0.315,0.55],[0.32,0.6],[0.35,0.63],
  [0.36,0.67],[0.35,0.715],[0.37,0.75],[0.36,0.79],
  [0.40,0.81],[0.415,0.86],[0.415,1],[0,1],
]
// These broad masks exclude ocean whose green/grey paint resembles land.
// The mask inside them still follows the source's small inlets and islands.
const guides = [
  [
    [0, 0],
    [0.175, 0],
    [0.2, 0.02],
    [0.265, 0.05],
    [0.31, 0.1],
    [0.345, 0.16],
    [0.361, 0.23],
    [0.36, 0.27],
    [0.348, 0.28],
    [0.355, 0.3],
    [0.351, 0.323],
    [0.34, 0.344],
    [0.333, 0.38],
    [0.319, 0.405],
    [0.294, 0.431],
    [0.265, 0.454],
    [0.256, 0.478],
    [0.227, 0.474],
    [0.205, 0.46],
    [0.185, 0.463],
    [0.16, 0.46],
    [0.13, 0.459],
    [0.1, 0.45],
    [0.082, 0.442],
    [0.071, 0.46],
    [0.048, 0.454],
    [0.046, 0.468],
    [0.028, 0.475],
    [0, 0.47],
  ],
  [
    [0.421, 0],
    [0.47, 0],
    [0.52, 0.018],
    [0.55, 0.04],
    [0.568, 0.08],
    [0.567, 0.12],
    [0.585, 0.16],
    [0.599, 0.2],
    [0.612, 0.253],
    [0.603, 0.285],
    [0.587, 0.321],
    [0.56, 0.345],
    [0.53, 0.358],
    [0.5, 0.339],
    [0.465, 0.325],
    [0.44, 0.295],
    [0.418, 0.282],
    [0.401, 0.246],
    [0.394, 0.2],
    [0.396, 0.16],
    [0.403, 0.12],
    [0.415, 0.08],
  ],
  [
    [0.66, 0.055],
    [0.715, 0.035],
    [0.77, 0.014],
    [0.82, 0.014],
    [0.89, 0.019],
    [0.952, 0.029],
    [0.977, 0.07],
    [0.974, 0.12],
    [0.97, 0.17],
    [0.986, 0.21],
    [0.997, 0.25],
    [0.997, 0.32],
    [0.976, 0.35],
    [0.948, 0.37],
    [0.904, 0.38],
    [0.872, 0.396],
    [0.82, 0.399],
    [0.788, 0.385],
    [0.764, 0.365],
    [0.75, 0.34],
    [0.728, 0.3],
    [0.704, 0.266],
    [0.686, 0.22],
    [0.676, 0.18],
    [0.662, 0.15],
  ],
  [
    [0.624, 0.155],
    [0.652, 0.155],
    [0.68, 0.179],
    [0.696, 0.227],
    [0.708, 0.299],
    [0.699, 0.34],
    [0.67, 0.36],
    [0.643, 0.341],
    [0.625, 0.28],
  ],
  [
    [0.57, 0.346],
    [0.615, 0.335],
    [0.653, 0.35],
    [0.68, 0.387],
    [0.694, 0.428],
    [0.665, 0.45],
    [0.62, 0.445],
    [0.587, 0.426],
    [0.568, 0.392],
  ],
  [
    [0.69, 0.39],
    [0.735, 0.385],
    [0.778, 0.413],
    [0.798, 0.433],
    [0.855, 0.402],
    [0.903, 0.38],
    [0.949, 0.386],
    [0.983, 0.418],
    [0.998, 0.444],
    [0.99, 0.475],
    [0.966, 0.494],
    [0.94, 0.499],
    [0.912, 0.499],
    [0.861, 0.497],
    [0.824, 0.493],
    [0.783, 0.488],
    [0.746, 0.486],
    [0.712, 0.454],
  ],
  // The 3D Danstsud contour replaces this lower-right guide at runtime.
  [
    [0.34, 0.435],
    [1, 0.435],
    [1, 1],
    [0.34, 1],
  ],
  // Snowy northern Honud islands retain their separately drawn land aprons.
  [
    [0.115, 0.445],
    [0.195, 0.445],
    [0.2, 0.515],
    [0.115, 0.515],
  ],
  [
    [0.252, 0.485],
    [0.305, 0.485],
    [0.319, 0.564],
    [0.266, 0.566],
  ],
]
for (let y = 0; y < height; y++)
  for (let x = 0; x < width; x++) {
    const u = x / (width - 1),
      v = y / (height - 1),
      i = y * width + x
    if (!inPoly(u, v, honud) && !guides.some((poly) => inPoly(u, v, poly))) mask[i] = 0
  }
// Tiny disconnected ornaments and boats are not islands. True small islands
// near the northern city remain when they have a substantive land apron.
const visited = new Uint8Array(mask.length),
  queue = new Int32Array(mask.length)
for (let start = 0; start < mask.length; start++) {
  if (!mask[start] || visited[start]) continue
  let front = 0,
    end = 1
  queue[0] = start
  visited[start] = 1
  while (front < end) {
    const i = queue[front++],
      x = i % width,
      y = (i / width) | 0
    for (const n of [
      x > 0 ? i - 1 : -1,
      x < width - 1 ? i + 1 : -1,
      y > 0 ? i - width : -1,
      y < height - 1 ? i + width : -1,
    ])
      if (n >= 0 && mask[n] && !visited[n]) {
        visited[n] = 1
        queue[end++] = n
      }
  }
  if (end < 130 * 4) for (let k = 0; k < end; k++) mask[queue[k]] = 0
}
// Small enclosed holes are lettering/city paint, not surveyed inland seas.
visited.fill(0)
for (let start = 0; start < mask.length; start++) {
  if (mask[start] || visited[start]) continue
  let front = 0,
    end = 1,
    edge = false
  queue[0] = start
  visited[start] = 1
  while (front < end) {
    const i = queue[front++],
      x = i % width,
      y = (i / width) | 0
    if (!x || !y || x === width - 1 || y === height - 1) edge = true
    for (const n of [
      x > 0 ? i - 1 : -1,
      x < width - 1 ? i + 1 : -1,
      y > 0 ? i - width : -1,
      y < height - 1 ? i + width : -1,
    ])
      if (n >= 0 && !mask[n] && !visited[n]) {
        visited[n] = 1
        queue[end++] = n
      }
  }
  if (!edge && end < 900 * 4) for (let k = 0; k < end; k++) mask[queue[k]] = 255
}
const smooth = await sharp(Buffer.from(mask), {
  raw: { width, height, channels: 1 },
})
  .blur(1)
  .threshold(122)
  .greyscale()
  .png()
  .toBuffer()
await writeFile(new URL('land-mask.png', folder), smooth)
const hash = createHash('sha256')
  .update(await readFile(source))
  .digest('hex')
await writeFile(
  new URL('source.json', folder),
  JSON.stringify(
    {
      sourceWidth: 8192,
      sourceHeight: 5668,
      maskWidth: width,
      maskHeight: height,
      sourceChecksum: hash,
      kind: 'technical-land-mask',
      notes:
        'Color-derived shoreline guide; source grid/labels cleaned. Honud uses a traced outer guide while retaining source-blue water channels. Danstsud replaces this mask with its previously traced source contour at runtime. The source painting is not a terrain texture.',
    },
    null,
    2,
  ) + '\n',
)
console.log('Cinematic land mask prepared', width, height)
