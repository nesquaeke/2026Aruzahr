import type { Cover } from './types'
export async function redactImage(src: string, covers: Cover[]) {
  const image = new Image()
  image.src = src
  await image.decode()
  const c = document.createElement('canvas')
  c.width = image.naturalWidth
  c.height = image.naturalHeight
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error('Görsel işlenemedi.')
  ctx.drawImage(image, 0, 0)
  ctx.fillStyle = '#10151b'
  for (const r of covers)
    ctx.fillRect(
      (r.x / 100) * c.width,
      (r.y / 100) * c.height,
      (r.w / 100) * c.width,
      (r.h / 100) * c.height,
    )
  return c.toDataURL('image/webp', 0.92)
}
