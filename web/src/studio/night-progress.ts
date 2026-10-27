import type { DMNightProgress } from '../dm-guide'

/** Keep both operators' notes when two private campaign backups are merged. */
export function mergeNightProgress(a?: DMNightProgress, b?: DMNightProgress): DMNightProgress | undefined {
  if (!a) return b
  if (!b) return a
  const notes = { ...b.notes, ...a.notes }
  for (const id of new Set([...Object.keys(b.notes), ...Object.keys(b.choices)])) {
    const incoming = b.notes[id]
    const parts = [a.notes[id] || '']
    if (incoming && incoming !== a.notes[id]) parts.push('İçe alınan kampanya notu:\n' + incoming)
    if (b.choices[id] && a.choices[id] && b.choices[id] !== a.choices[id])
      parts.push('İçe alınan kampanyanın seçimi: ' + b.choices[id])
    if (parts.some(Boolean)) {
      const merged = parts.filter(Boolean).join('\n\n')
      if (merged.length > 10000) throw new Error('Birleşen karşılaşma notu 10.000 karakteri aşıyor. Notları korumak için kampanyaları ayrı aç veya önce notu kısalt.')
      notes[id] = merged
    }
  }
  const revealed = { ...b.revealed, ...a.revealed }
  for (const id of Object.keys(b.revealed))
    revealed[id] = [...new Set([...(a.revealed[id] || []), ...b.revealed[id]])].sort((x, y) => x - y)
  return { ...b, ...a, notes, choices: { ...b.choices, ...a.choices }, revealed }
}
