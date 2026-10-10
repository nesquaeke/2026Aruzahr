import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, access, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const source = fileURLToPath(new URL('../../Aruzahr 8k (1).jpg', import.meta.url))
const output = fileURLToPath(new URL('../public/atlas/', import.meta.url))
const checksum = createHash('sha256').update(await readFile(source)).digest('hex')
const version = 3
const crops = {
  xotar: [0, 0, 3000, 1650],
  murgul: [0, 1170, 2700, 1650],
  honud: [0, 2950, 3000, 1650],
  danstsud: [4770, 3100, 3000, 1650],
  garmirk: [5430, 0, 2700, 1485],
  ariki: [5480, 1100, 2700, 1485],
  gurbin: [4390, 1290, 3000, 1650],
  lakbar: [2930, 0, 2400, 1320],
}
// Remove only obsolete generated bitmap textures; 3D now uses new geometry.
for (const size of [2048, 4096]) await rm(path.join(output, `relief-${size}.webp`), { force: true })
try {
  const previous = JSON.parse(await readFile(path.join(output, '.generated.json'), 'utf8'))
  await access(path.join(output, 'aruzahr.dzi'))
  await access(path.join(output, 'aruzahr_files/13/0_0.jpeg'))
  for (const key of Object.keys(crops)) await access(path.join(output, `${key}.webp`))
  if (previous.checksum === checksum && previous.version === version) {
    console.log('Verified map assets are current; reusing the tile pyramid.')
    process.exit(0)
  }
} catch { /* Missing or stale generated assets are rebuilt from the original. */ }

await mkdir(output, { recursive: true })
sharp.concurrency(2)
await sharp(source)
  .jpeg({ quality: 87, chromaSubsampling: '4:4:4' })
  .tile({ size: 512, overlap: 1, layout: 'dz', depth: 'onepixel' })
  .toFile(path.join(output, 'aruzahr.dz'))
for (const [key, [left, top, width, height]] of Object.entries(crops)) {
  await sharp(source).extract({ left, top, width, height }).resize(960).webp({ quality: 85 }).toFile(path.join(output, `${key}.webp`))
}
await writeFile(path.join(output, '.generated.json'), JSON.stringify({ checksum, version, width: 8192, height: 5668 }))
console.log('Original 8192 × 5668 map prepared: local zoom tiles, eight region covers.')
