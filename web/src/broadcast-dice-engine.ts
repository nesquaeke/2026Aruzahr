export type BroadcastRoll = {
  id: string
  sides: number
  count: number
  modifier: number
  values: number[]
  total: number
  at: number
}

export const DICE_SIDES = [4, 6, 8, 10, 12, 20, 100] as const

const UINT32_RANGE = 0x1_0000_0000

function secureRandomSource(): Crypto {
  const source = globalThis.crypto
  if (!source || typeof source.getRandomValues !== 'function') {
    throw new Error('Güvenli zar atışı bu tarayıcıda kullanılamıyor.')
  }
  return source
}

/** Sample an integer in [1, sides] without introducing modulo bias. */
export function sampleDie(sides: number, cryptoSource?: Pick<Crypto, 'getRandomValues'>): number {
  if (!Number.isSafeInteger(sides) || sides < 2 || sides > UINT32_RANGE) {
    throw new RangeError('Zarın yüz sayısı 2 ile 4294967296 arasında bir tam sayı olmalı.')
  }

  const source = cryptoSource ?? secureRandomSource()
  // Discard the incomplete final bucket before taking a remainder. Every
  // remaining face then has exactly the same number of possible uint32 inputs.
  const limit = Math.floor(UINT32_RANGE / sides) * sides
  const buffer = new Uint32Array(1)
  do {
    source.getRandomValues(buffer)
  } while (buffer[0] >= limit)

  return buffer[0] % sides + 1
}

function secureRollId(source: Crypto): string {
  if (typeof source.randomUUID === 'function') return source.randomUUID()
  const bytes = source.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function createBroadcastRoll(sides: number, count: number, modifier: number): BroadcastRoll {
  if (!DICE_SIDES.some(option => option === sides)) {
    throw new RangeError('d4, d6, d8, d10, d12, d20 veya d100 seçin.')
  }
  if (!Number.isInteger(count) || count < 1 || count > 12) {
    throw new RangeError('Zar adedi 1 ile 12 arasında bir tam sayı olmalı.')
  }
  if (!Number.isInteger(modifier) || modifier < -99 || modifier > 99) {
    throw new RangeError('Ek değer -99 ile +99 arasında bir tam sayı olmalı.')
  }

  const source = secureRandomSource()
  const values = Array.from({ length: count }, () => sampleDie(sides, source))
  return {
    id: secureRollId(source),
    sides,
    count,
    modifier,
    values,
    total: values.reduce((sum, value) => sum + value, modifier),
    at: Date.now(),
  }
}

export function rollFormula(roll: Pick<BroadcastRoll, 'count' | 'sides' | 'modifier'>): string {
  const dice = `${roll.count}d${roll.sides}`
  if (roll.modifier === 0) return dice
  return `${dice} ${roll.modifier > 0 ? '+' : '-'} ${Math.abs(roll.modifier)}`
}
