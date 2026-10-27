export type NightTrigger = 'all' | 'camp' | 'travel' | 'trespass'
export type NightCombat = {
  danger: string
  enemyGoal: string
  telegraph: string
  tactics: string[]
  escape: string
  morale: string
  combatants: {
    id: string
    name: string
    portraitId?: string
    ac: number
    hp: number
    initiative: number
    attack: string
    count: number
  }[]
}
export type NightEncounter = {
  id: string
  title: string
  region: string
  locationId: string
  triggers: Exclude<NightTrigger, 'all'>[]
  die: { min: number; max: number }
  mood: 'earth' | 'chaotic' | 'hostile' | 'formidable'
  portraitId: string
  sceneId?: string
  visibleName: string
  arrival: string
  readAloud: string
  dmTruth: string
  clues: { dc: number; skill: string; discovery: string }[]
  warnings: string[]
  choices: { id: string; label: string; result: string; echo: string }[]
  obstacle: {
    goal: string
    rounds: string[]
    success: string
    failure: string
    checks: string[]
  }
  voice: {
    speaker: string
    direction: string
    lines: { cue: string; line: string }[]
  }
  continuation: string
  combat?: NightCombat
}
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v)
const text = (v: Record<string, unknown>, key: string, max = 6000) => {
  if (typeof v[key] !== 'string' || (v[key] as string).length > max)
    throw Error('Karşılaşma alanı geçersiz: ' + key)
  return v[key] as string
}
const entries = (v: unknown, max: number) => {
  if (!Array.isArray(v) || v.length > max || !v.every(object))
    throw Error('Karşılaşma listesi geçersiz.')
  return v as Record<string, unknown>[]
}
const strings = (v: unknown, max = 12) => {
  if (
    !Array.isArray(v) ||
    v.length > max ||
    !v.every((s) => typeof s === 'string' && s.length <= 3000)
  )
    throw Error('Karşılaşma notu geçersiz.')
  return v as string[]
}
const id = (v: Record<string, unknown>, key: string) => {
  const t = text(v, key, 160)
  if (!/^[a-z0-9][a-z0-9-]*$/.test(t))
    throw Error('Karşılaşma kimliği geçersiz.')
  return t
}
function combat(value: unknown): NightCombat {
  if (!object(value)) throw Error('Karşılaşmanın savaş planı geçersiz.')
  const ids = new Set<string>()
  const bounded = (
    v: Record<string, unknown>,
    key: string,
    min: number,
    max: number,
  ) => {
    if (
      !Number.isInteger(v[key]) ||
      Number(v[key]) < min ||
      Number(v[key]) > max
    )
      throw Error('Savaş değeri geçersiz: ' + key)
    return Number(v[key])
  }
  const combatants = entries(value.combatants, 6).map((c) => {
    const key = id(c, 'id')
    if (ids.has(key)) throw Error('Yinelenen savaşçı kimliği.')
    ids.add(key)
    return {
      id: key,
      name: text(c, 'name', 160),
      ...(c.portraitId === undefined
        ? {}
        : { portraitId: id(c, 'portraitId') }),
      ac: bounded(c, 'ac', 5, 25),
      hp: bounded(c, 'hp', 1, 200),
      initiative: bounded(c, 'initiative', -5, 10),
      attack: text(c, 'attack', 1000),
      count: bounded(c, 'count', 1, 6),
    }
  })
  if (!combatants.length)
    throw Error('Savaş planında en az bir karşılaşma kişisi olmalı.')
  return {
    danger: text(value, 'danger', 2000),
    enemyGoal: text(value, 'enemyGoal', 2000),
    telegraph: text(value, 'telegraph', 3000),
    tactics: strings(value.tactics),
    escape: text(value, 'escape', 3000),
    morale: text(value, 'morale', 3000),
    combatants,
  }
}
export function parseNightEncounters(value: unknown): NightEncounter[] {
  if (!object(value)) throw Error('Gece ve yol kitabı geçersiz.')
  const ids = new Set<string>(),
    faces = new Set<number>()
  const cards = entries(value.cards, 12).map((c) => {
    const key = id(c, 'id')
    if (ids.has(key)) throw Error('Yinelenen karşılaşma.')
    ids.add(key)
    if (
      !object(c.die) ||
      !Number.isInteger(c.die.min) ||
      !Number.isInteger(c.die.max) ||
      Number(c.die.min) < 1 ||
      Number(c.die.max) > 12 ||
      Number(c.die.max) < Number(c.die.min)
    )
      throw Error('Karşılaşma zar aralığı geçersiz.')
    for (let n = Number(c.die.min); n <= Number(c.die.max); n++) {
      if (faces.has(n)) throw Error('Karşılaşma zar aralıkları çakışıyor.')
      faces.add(n)
    }
    const triggers = strings(c.triggers, 3)
    if (
      !triggers.length ||
      triggers.some((t) => !['camp', 'travel', 'trespass'].includes(t))
    )
      throw Error('Karşılaşma koşulu geçersiz.')
    if (
      !['earth', 'chaotic', 'hostile', 'formidable'].includes(String(c.mood)) ||
      !object(c.obstacle) ||
      !object(c.voice)
    )
      throw Error('Karşılaşma kartı geçersiz.')
    const choices = new Set<string>()
    return {
      id: key,
      title: text(c, 'title', 240),
      region: text(c, 'region', 160),
      locationId: text(c, 'locationId', 160),
      triggers: triggers as NightEncounter['triggers'],
      die: { min: Number(c.die.min), max: Number(c.die.max) },
      mood: c.mood as NightEncounter['mood'],
      portraitId: id(c, 'portraitId'),
      ...(c.sceneId === undefined ? {} : { sceneId: id(c, 'sceneId') }),
      visibleName: text(c, 'visibleName', 160),
      arrival: text(c, 'arrival', 6000),
      readAloud: text(c, 'readAloud', 10000),
      dmTruth: text(c, 'dmTruth', 10000),
      clues: entries(c.clues, 12).map((clue) => {
        if (
          !Number.isInteger(clue.dc) ||
          Number(clue.dc) < 0 ||
          Number(clue.dc) > 30
        )
          throw Error('İpucu zorluğu geçersiz.')
        return {
          dc: Number(clue.dc),
          skill: text(clue, 'skill', 240),
          discovery: text(clue, 'discovery', 5000),
        }
      }),
      warnings: strings(c.warnings),
      choices: entries(c.choices, 8).map((choice) => {
        const key = id(choice, 'id')
        if (choices.has(key)) throw Error('Yinelenen karşılaşma seçimi.')
        choices.add(key)
        return {
          id: key,
          label: text(choice, 'label', 500),
          result: text(choice, 'result', 5000),
          echo: text(choice, 'echo', 5000),
        }
      }),
      obstacle: {
        goal: text(c.obstacle, 'goal', 3000),
        rounds: strings(c.obstacle.rounds),
        success: text(c.obstacle, 'success', 4000),
        failure: text(c.obstacle, 'failure', 4000),
        checks: strings(c.obstacle.checks),
      },
      voice: {
        speaker: text(c.voice, 'speaker', 160),
        direction: text(c.voice, 'direction', 1600),
        lines: entries(c.voice.lines, 8).map((line) => ({
          cue: text(line, 'cue', 500),
          line: text(line, 'line', 3000),
        })),
      },
      continuation: text(c, 'continuation', 4000),
      ...(c.combat === undefined ? {} : { combat: combat(c.combat) }),
    }
  })
  if (cards.length !== 12 || faces.size !== 12)
    throw Error('Gece ve yol kitabında on iki zar yüzü bulunmalı.')
  return cards
}
let loaded: Promise<NightEncounter[]> | undefined
async function fetchNightEncounters(): Promise<NightEncounter[]> {
  const response = await fetch(
    new URL('dm/Night-Road-Encounters.json', document.baseURI),
    { cache: 'no-cache' },
  )
  if (!response.ok)
    throw Error(
      'Gece ve yol kartları açılamadı. Güncel site dosyalarını kontrol et.',
    )
  const source = await response.text()
  if (source.length > 500000) throw Error('Gece ve yol kitabı çok büyük.')
  return parseNightEncounters(JSON.parse(source))
}
export function loadNightEncounters(): Promise<NightEncounter[]> {
  if (!loaded)
    loaded = fetchNightEncounters().catch((error) => {
      loaded = undefined
      throw error
    })
  return loaded
}
export function chooseNightEncounter(
  cards: NightEncounter[],
  roll: number,
  trigger: NightTrigger,
) {
  return cards.find(
    (c) =>
      roll >= c.die.min &&
      roll <= c.die.max &&
      (trigger === 'all' || c.triggers.includes(trigger)),
  )
}
