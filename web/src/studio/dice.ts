import { createBroadcastRoll } from '../broadcast-dice-engine'
import type { StudioRoll } from './types'
/** Small grammar only: NdM +/- NdM +/- integer. Never evaluates code. */
export function rollExpression(
  expression: string,
  mode: StudioRoll['mode'] = 'normal',
  who = '',
  label = '',
  onlyTotal = false,
  critical = true,
): StudioRoll {
  const clean = expression.replace(/\s+/g, '').toLowerCase()
  if (
    !clean ||
    clean.length > 120 ||
    !/^[+-]?(?:\d*d(?:4|6|8|10|12|20|100)|\d+)(?:[+-](?:\d*d(?:4|6|8|10|12|20|100)|\d+))*$/.test(
      clean,
    )
  )
    throw new Error('Örnek zar ifadesi: 1d20+5 veya 2d6+1d4+3.')
  const parts = clean.match(/[+-]?[^+-]+/g)!
  let total = 0,
    dice = 0
  const terms: StudioRoll['terms'] = []
  for (const part of parts) {
    const sign = part.startsWith('-') ? -1 : 1,
      v = part.replace(/^[+-]/, '')
    if (v.includes('d')) {
      const [c, s] = v.split('d'),
        count = Number(c || 1),
        sides = Number(s)
      if (count < 1 || count > 12 || dice + count > 24)
        throw new Error(
          'Bir ifadede en fazla 24 zar, terim başına 12 zar kullanılabilir.',
        )
      dice += count
      if (
        mode !== 'normal' &&
        (parts.length !== 1 || count !== 1 || sides !== 20)
      )
        throw new Error(
          'Avantaj/dezavantaj için 1d20 kullan; ek değeri ayrı alana yaz.',
        )
      const values = createBroadcastRoll(
        sides,
        mode === 'normal' ? count : 2,
        0,
      ).values
      const used =
        mode === 'normal'
          ? null
          : values.indexOf(
              mode === 'advantage' ? Math.max(...values) : Math.min(...values),
            )
      total +=
        sign *
        (used === null ? values.reduce((a, b) => a + b, 0) : values[used])
      terms.push({ sides, sign, values, used })
    } else {
      const n = Number(v)
      if (n > 999) throw new Error('Ek değer 999’u aşamaz.')
      total += sign * n
    }
  }
  if (!terms.length || terms.length > 12)
    throw new Error('İfadede en az bir zar olmalı.')
  return {
    id: crypto.randomUUID(),
    expression: clean,
    mode,
    who: who.slice(0, 100),
    label: label.slice(0, 120),
    onlyTotal,
    critical,
    total,
    at: Date.now(),
    terms,
  }
}
