import { expect, test } from '@playwright/test'
import { createBroadcastRoll, DICE_SIDES, rollFormula, sampleDie } from '../src/broadcast-dice-engine'

/** A deterministic entropy source lets us exercise the rejected uint32 range. */
function entropy(values: number[]) {
  let reads = 0
  const source: Pick<Crypto, 'getRandomValues'> = {
    getRandomValues<T extends ArrayBufferView | null>(array: T): T {
      if (!(array instanceof Uint32Array)) throw new Error('Expected uint32 entropy request')
      if (reads >= values.length) throw new Error('Entropy sequence exhausted')
      array[0] = values[reads++]
      return array
    },
  }
  return { source, reads: () => reads }
}

test('zar örneklemesi bölünmeyen uint32 kuyruğunu yeniden örnekler', () => {
  // 2^32 % 6 = 4: all four values in the final incomplete bucket must be rejected.
  const cutoff = Math.floor(2 ** 32 / 6) * 6
  const sequence = entropy([cutoff, cutoff + 1, cutoff + 2, cutoff + 3, 5])
  expect(sampleDie(6, sequence.source)).toBe(6)
  expect(sequence.reads()).toBe(5)
})

test('yüzlü zarın son eksik aralığı reddedilir, 100 geçerli bir sonuçtur', () => {
  const cutoff = Math.floor(2 ** 32 / 100) * 100
  const sequence = entropy([2 ** 32 - 1, cutoff, cutoff - 1])
  expect(sampleDie(100, sequence.source)).toBe(100)
  expect(sequence.reads()).toBe(3)
})

test('desteklenen her zarın ilk ve son yüzü erişilebilirdir', () => {
  for (const sides of DICE_SIDES) {
    expect(sampleDie(sides, entropy([0]).source)).toBe(1)
    expect(sampleDie(sides, entropy([sides - 1]).source)).toBe(sides)
  }
})

test('atışlar bütün zarları, zamanını, benzersiz kimliğini ve ek değeri korur', () => {
  const before = Date.now()
  const positive = createBroadcastRoll(20, 12, 99)
  const negative = createBroadcastRoll(100, 12, -99)
  for (const roll of [positive, negative]) {
    expect(roll.id.length).toBeGreaterThanOrEqual(32)
    expect(roll.values).toHaveLength(12)
    expect(roll.values.every(value => Number.isInteger(value) && value >= 1 && value <= roll.sides)).toBe(true)
    expect(roll.total).toBe(roll.values.reduce((sum, value) => sum + value, roll.modifier))
    expect(roll.at).toBeGreaterThanOrEqual(before)
    expect(roll.at).toBeLessThanOrEqual(Date.now())
  }
  expect(positive.id).not.toBe(negative.id)
})

test('geçersiz yüz, adet ve ek değerler örneklemeden önce reddedilir', () => {
  for (const sides of [0, 1, 2.5, Number.NaN, Number.POSITIVE_INFINITY, 2 ** 32 + 1]) {
    expect(() => sampleDie(sides, entropy([]).source)).toThrow(RangeError)
  }
  for (const sides of [2, 3, 7, 19, 101]) expect(() => createBroadcastRoll(sides, 1, 0)).toThrow(RangeError)
  for (const count of [0, 13, 1.5, Number.NaN]) expect(() => createBroadcastRoll(20, count, 0)).toThrow(RangeError)
  for (const modifier of [-100, 100, 0.5, Number.NaN]) expect(() => createBroadcastRoll(20, 1, modifier)).toThrow(RangeError)
})

test('zar formülü sıfır, pozitif ve negatif ek değerleri açık gösterir', () => {
  expect(rollFormula({ count: 1, sides: 20, modifier: 0 })).toBe('1d20')
  expect(rollFormula({ count: 2, sides: 6, modifier: 3 })).toBe('2d6 + 3')
  expect(rollFormula({ count: 12, sides: 100, modifier: -7 })).toBe('12d100 - 7')
})
