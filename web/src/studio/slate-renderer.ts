export type SlateKind = 'starting' | 'ending'
export const slateDuration = 20
export const slateArt = (kind: SlateKind) => `/illustrations/broadcast-${kind}.webp`
const tau = Math.PI * 2
const random = (n: number) => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v) }

function tracked(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, spacing: number) {
  for (const char of text) { ctx.fillText(char, x, y); x += ctx.measureText(char).width + spacing }
}

/** Fixed camera; all movement is periodic and clipped to actual exterior openings. */
export function drawSlate(ctx: CanvasRenderingContext2D, art: HTMLImageElement, kind: SlateKind, seconds: number) {
  const w = ctx.canvas.width, h = ctx.canvas.height
  const phase = ((seconds % slateDuration) + slateDuration) % slateDuration / slateDuration
  ctx.save(); ctx.setTransform(w / 1920, 0, 0, h / 1080, 0, 0)
  ctx.clearRect(0, 0, 1920, 1080)
  const scale = Math.max(1920 / art.naturalWidth, 1080 / art.naturalHeight)
  ctx.drawImage(art, (1920 - art.naturalWidth * scale) / 2, (1080 - art.naturalHeight * scale) / 2, art.naturalWidth * scale, art.naturalHeight * scale)
  ctx.save()
  const opening = new Path2D()
  if (kind === 'starting') {
    opening.moveTo(757, 704); opening.lineTo(757, 303)
    opening.bezierCurveTo(845, 94, 985, 0, 1110, 0)
    opening.lineTo(1695, 0); opening.bezierCurveTo(1810, 34, 1861, 115, 1866, 227)
    opening.lineTo(1866, 704); opening.closePath()
  } else {
    opening.moveTo(1298, 531); opening.lineTo(1298, 31)
    opening.bezierCurveTo(1390, -15, 1510, -15, 1626, 22)
    opening.lineTo(1626, 531); opening.closePath()
  }
  ctx.clip(opening)
  for (let i = 0; i < (kind === 'starting' ? 52 : 24); i++) {
    const travel = (phase * (i % 3 === 0 ? 2 : 1) + random(i + 1)) % 1
    const x = (kind === 'starting' ? 730 : 1250) + random(i + 30) * (kind === 'starting' ? 1170 : 440) + Math.sin(tau * phase + i) * 12 + travel * 24
    const y = travel * 950 - 160
    ctx.fillStyle = `rgba(224,230,226,${.14 + random(i + 60) * .23})`
    ctx.beginPath(); ctx.ellipse(x, y, .55 + random(i + 80) * 1.2, 1.1 + random(i + 100) * 1.5, -.2, 0, tau); ctx.fill()
  }
  if (kind === 'starting') {
    for (let i = 0; i < 3; i++) {
      const x = 1190 + i * 190 + Math.sin(tau * phase + i) * 20, y = 610 + i * 18
      const mist = ctx.createRadialGradient(x, y, 0, x, y, 190)
      mist.addColorStop(0, `rgba(169,184,190,${.032 + .012 * Math.sin(tau * phase + i)})`); mist.addColorStop(1, 'rgba(169,184,190,0)')
      ctx.fillStyle = mist; ctx.fillRect(x - 190, y - 190, 380, 380)
    }
  }
  ctx.restore()
  const lampX = kind === 'starting' ? 1800 : 1720, lampY = kind === 'starting' ? 666 : 553
  const warmth = ctx.createRadialGradient(lampX, lampY, 0, lampX, lampY, 260)
  const light = .045 + .012 * Math.sin(tau * phase * 3) + .006 * Math.sin(tau * phase * 7)
  warmth.addColorStop(0, `rgba(232,158,66,${light})`); warmth.addColorStop(1, 'rgba(232,158,66,0)')
  ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = warmth; ctx.fillRect(lampX - 260, lampY - 260, 520, 520); ctx.globalCompositeOperation = 'source-over'
  const shade = ctx.createLinearGradient(0, 0, 960, 0)
  shade.addColorStop(0, 'rgba(7,9,11,.38)'); shade.addColorStop(.65, 'rgba(7,9,11,.12)'); shade.addColorStop(1, 'rgba(7,9,11,0)')
  ctx.fillStyle = shade; ctx.fillRect(0, 0, 960, 1080)
  ctx.fillStyle = '#e8dcc0'; ctx.font = '400 34px "Cormorant Garamond", Georgia, serif'
  tracked(ctx, 'ARUZAHR', 123, 146, 11)
  ctx.font = '400 12px "DM Sans", sans-serif'; ctx.fillStyle = '#b9ad96'; tracked(ctx, kind === 'starting' ? 'VALHUNAR GECELERİ' : 'YAYIN SONA ERDİ', 127, 187, 3)
  ctx.fillStyle = '#f0e7d4'; ctx.font = `400 ${kind === 'starting' ? 106 : 92}px "Cormorant Garamond", Georgia, serif`
  const lines = kind === 'starting' ? ['Yayın', 'başlıyor.'] : ['Bu gecelik', 'son sayfa.']
  lines.forEach((line, i) => ctx.fillText(line, 119, 440 + i * 102))
  ctx.strokeStyle = '#a7946c'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(126, 598); ctx.lineTo(175, 598); ctx.moveTo(191, 598); ctx.lineTo(321, 598); ctx.stroke()
  ctx.save(); ctx.translate(183, 598); ctx.rotate(Math.PI / 4); ctx.strokeRect(-3, -3, 6, 6); ctx.restore()
  ctx.font = '400 17px "DM Sans", sans-serif'; ctx.fillStyle = '#c3bcac'
  const subtitle = kind === 'starting' ? ['Birazdan Karlan’ın ötesine geçiyoruz.'] : ['Hikâye burada dinlenir.', 'Sonraki oturumda görüşürüz.']
  subtitle.forEach((line, i) => ctx.fillText(line, 126, 651 + i * 30))
  ctx.font = '400 10px "DM Sans", sans-serif'; ctx.fillStyle = '#b7ac91'
  tracked(ctx, kind === 'starting' ? 'MARHALDEN · KARLAN GEÇİDİ' : 'ATEŞ SÖNER. HİKÂYE KALIR.', 127, 984, 2.2)
  ctx.restore()
}
