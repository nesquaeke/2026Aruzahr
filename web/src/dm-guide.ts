export type DMQuickGuide = {
  where: string
  time: string
  goal: string
  next: string
}
export type DMBriefing = {
  previous: string
  arrival: string
  purpose: string
  stakes: string
  opening: string
  transition: string
  cast: {
    name: string
    role: string
    wants: string
    meeting: string
    line: string
  }[]
  backgroundId?: string
  portraitIds?: string[]
  publicTitle?: string
}
export type DMRunbook = {
  entry: string
  beats: { title: string; text: string; line: string }[]
  next: string
  questions: { question: string; answer: string }[]
}
export type DMEncounter = {
  name: string
  kind: 'combat' | 'hazard' | 'pursuit'
  trigger: string
  goal: string
  space: string
  rounds: string[]
  exits: string[]
  failure: string
  scale: string
  artId?: string
  units: {
    name: string
    count: number
    ac: number
    hp: number
    speed: string
    attack: string
    tactics: string
    morale: string
  }[]
}
export type DMPlay = {
  duration: string
  pressure: string
  continueWhen: string
  ifIdle: string
  dialogue: {
    speaker: string
    direction: string
    exchanges: { cue: string; line: string }[]
  }[]
  paths: { label: string; to: string }[]
  encounter?: DMEncounter
}
export type DMScene = {
  play?: DMPlay
  quick?: DMQuickGuide
  runbook?: DMRunbook
  id: string
  title: string
  summary: string
  readAloud: string
  actions: string[]
  checks: string[]
  choices: { label: string; result: string; echo: string }[]
  backgroundId: string
  portraitIds: string[]
  publicTitle: string
  publicNames?: Record<string, string>
  exits?: { label: string; sceneId: string }[]
}
export type DMQuest = {
  quick?: DMQuickGuide
  briefing?: DMBriefing
  id: string
  title: string
  body: string
  location?: string
  objective?: string
  people?: string[]
  steps?: DMScene[]
}
export type DMProgress = {
  quest: string
  steps: Record<string, number>
  done: string[]
  decisions: Record<string, string>
  skipped?: string[]
}
export type DMPack = {
  version: 1 | 2
  edition?: string
  title: string
  quests: DMQuest[]
  progress?: DMProgress
}
const obj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v)
const txt = (v: unknown, max = 120000): v is string =>
  typeof v === 'string' && v.length <= max
function texts(v: unknown, max = 12): v is string[] {
  return Array.isArray(v) && v.length <= max && v.every((x) => txt(x, 2000))
}
const field = (v: Record<string, unknown>, key: string, max = 6000) => {
  if (!txt(v[key], max))
    throw new Error('Oynatım kitabı alanı geçersiz: ' + key)
  return v[key] as string
}
function list(v: unknown, max: number): Record<string, unknown>[] {
  if (!Array.isArray(v) || v.length > max || !v.every(obj))
    throw new Error('Oynatım kitabı listesi geçersiz.')
  return v
}
function briefing(v: unknown): DMBriefing {
  if (!obj(v)) throw new Error('Bölüm başlangıcı geçersiz.')
  const out: DMBriefing = {
    previous: field(v, 'previous'),
    arrival: field(v, 'arrival'),
    purpose: field(v, 'purpose'),
    stakes: field(v, 'stakes'),
    opening: field(v, 'opening', 12000),
    transition: field(v, 'transition'),
    cast: list(v.cast, 12).map((c) => ({
      name: field(c, 'name', 100),
      role: field(c, 'role', 2000),
      wants: field(c, 'wants', 2000),
      meeting: field(c, 'meeting', 3000),
      line: field(c, 'line', 2000),
    })),
  }
  if (v.backgroundId !== undefined) {
    out.backgroundId = field(v, 'backgroundId', 160)
    out.publicTitle = field(v, 'publicTitle', 120)
    if (!texts(v.portraitIds, 8)) throw new Error('Açılış portreleri geçersiz.')
    out.portraitIds = v.portraitIds
  }
  return out
}
function runbook(v: unknown): DMRunbook {
  if (!obj(v)) throw new Error('Sahne oynatımı geçersiz.')
  return {
    entry: field(v, 'entry'),
    next: field(v, 'next'),
    beats: list(v.beats, 8).map((b) => ({
      title: field(b, 'title', 160),
      text: field(b, 'text'),
      line: field(b, 'line', 3000),
    })),
    questions: list(v.questions, 12).map((q) => ({
      question: field(q, 'question', 500),
      answer: field(q, 'answer', 4000),
    })),
  }
}
function quick(v: unknown): DMQuickGuide {
  if (!obj(v)) throw new Error('Kısa hikâye rehberi geçersiz.')
  return {
    where: field(v, 'where', 600),
    time: field(v, 'time', 600),
    goal: field(v, 'goal', 1200),
    next: field(v, 'next', 1200),
  }
}
function play(v: unknown): DMPlay {
  if (!obj(v)) throw new Error('Sahne oynatım kartı geçersiz.')
  const out: DMPlay = {
    duration: field(v, 'duration', 160),
    pressure: field(v, 'pressure', 1600),
    continueWhen: field(v, 'continueWhen', 1200),
    ifIdle: field(v, 'ifIdle', 1200),
    dialogue: list(v.dialogue, 6).map((d) => ({
      speaker: field(d, 'speaker', 160),
      direction: field(d, 'direction', 1000),
      exchanges: list(d.exchanges, 5).map((e) => ({
        cue: field(e, 'cue', 400),
        line: field(e, 'line', 1600),
      })),
    })),
    paths: list(v.paths, 4).map((p) => ({
      label: field(p, 'label', 200),
      to: field(p, 'to', 160),
    })),
  }
  if (v.encounter !== undefined) {
    const e = v.encounter
    if (
      !obj(e) ||
      !['combat', 'hazard', 'pursuit'].includes(String(e.kind)) ||
      !texts(e.rounds, 8) ||
      !texts(e.exits, 6)
    )
      throw new Error('Karşılaşma kartı geçersiz.')
    const bounded = (n: unknown, max: number) => {
      if (!Number.isInteger(n) || Number(n) < 1 || Number(n) > max)
        throw new Error('Karşılaşma sayısı geçersiz.')
      return Number(n)
    }
    out.encounter = {
      name: field(e, 'name', 200),
      kind: e.kind as DMEncounter['kind'],
      trigger: field(e, 'trigger', 2000),
      goal: field(e, 'goal', 1200),
      space: field(e, 'space', 2500),
      rounds: e.rounds,
      exits: e.exits,
      failure: field(e, 'failure', 2000),
      scale: field(e, 'scale', 1800),
      ...(e.artId === undefined ? {} : { artId: field(e, 'artId', 160) }),
      units: list(e.units, 6).map((u) => ({
        name: field(u, 'name', 160),
        count: bounded(u.count, 20),
        ac: bounded(u.ac, 30),
        hp: bounded(u.hp, 1000),
        speed: field(u, 'speed', 200),
        attack: field(u, 'attack', 1000),
        tactics: field(u, 'tactics', 1600),
        morale: field(u, 'morale', 1200),
      })),
    }
  }
  return out
}
export function parseDMPack(value: unknown): DMPack {
  if (
    !obj(value) ||
    (value.version !== 1 && value.version !== 2) ||
    !txt(value.title, 240) ||
    !Array.isArray(value.quests) ||
    !value.quests.length ||
    value.quests.length > 30
  )
    throw new Error('DM paketi biçimi geçersiz.')
  const ids = new Set<string>()
  const quests: DMQuest[] = value.quests.map((q) => {
    if (
      !obj(q) ||
      !txt(q.id, 160) ||
      !q.id ||
      ids.has(q.id) ||
      !txt(q.title, 240) ||
      !txt(q.body)
    )
      throw new Error('DM görev kaydı geçersiz.')
    ids.add(q.id)
    const result: DMQuest = { id: q.id, title: q.title, body: q.body }
    if (q.quick !== undefined) result.quick = quick(q.quick)
    if (q.briefing !== undefined) result.briefing = briefing(q.briefing)
    if (txt(q.location, 160)) result.location = q.location
    if (txt(q.objective, 2000)) result.objective = q.objective
    if (texts(q.people)) result.people = q.people
    if (q.steps !== undefined) {
      if (!Array.isArray(q.steps) || !q.steps.length || q.steps.length > 24)
        throw new Error('Görev sahneleri geçersiz.')
      result.steps = q.steps.map((step) => {
        if (
          !obj(step) ||
          !txt(step.id, 160) ||
          !txt(step.title, 240) ||
          !txt(step.summary, 4000) ||
          !txt(step.readAloud, 8000) ||
          !texts(step.actions) ||
          !texts(step.checks) ||
          !texts(step.portraitIds, 8) ||
          !txt(step.backgroundId, 160) ||
          !txt(step.publicTitle, 120) ||
          !Array.isArray(step.choices) ||
          step.choices.length > 8
        )
          throw new Error('Sahne rehberi geçersiz.')
        const choices = step.choices.map((c) => {
          if (
            !obj(c) ||
            !txt(c.label, 500) ||
            !txt(c.result, 3000) ||
            !txt(c.echo, 3000)
          )
            throw new Error('Karar kaydı geçersiz.')
          return { label: c.label, result: c.result, echo: c.echo }
        })
        return {
          ...(step.play === undefined ? {} : { play: play(step.play) }),
          ...(step.quick === undefined ? {} : { quick: quick(step.quick) }),
          ...(step.runbook === undefined
            ? {}
            : { runbook: runbook(step.runbook) }),
          id: step.id,
          title: step.title,
          summary: step.summary,
          readAloud: step.readAloud,
          actions: step.actions,
          checks: step.checks,
          backgroundId: step.backgroundId,
          portraitIds: step.portraitIds,
          publicTitle: step.publicTitle,
          choices,
          ...(obj(step.publicNames)
            ? {
                publicNames: Object.fromEntries(
                  Object.entries(step.publicNames)
                    .filter(([k, v]) => k.length <= 160 && txt(v, 100))
                    .map(([k, v]) => [k, String(v)]),
                ),
              }
            : {}),
          ...(Array.isArray(step.exits)
            ? {
                exits: step.exits
                  .slice(0, 12)
                  .filter(
                    (e) => obj(e) && txt(e.label, 160) && txt(e.sceneId, 160),
                  )
                  .map((e) => ({
                    label: e.label as string,
                    sceneId: e.sceneId as string,
                  })),
              }
            : {}),
        }
      })
    }
    return result
  })
  const pack: DMPack = {
    version: value.version as 1 | 2,
    title: value.title,
    quests,
  }
  if (value.edition !== undefined) {
    if (!txt(value.edition, 100)) throw new Error('Hikâye baskısı geçersiz.')
    pack.edition = value.edition
  }
  for (const q of quests) {
    const sceneIds = new Set(q.steps?.map((s) => s.id) || [])
    for (const s of q.steps || [])
      for (const p of s.play?.paths || [])
        if (!sceneIds.has(p.to))
          throw new Error('Sahne bağlantısının hedefi bulunamadı.')
  }
  if (obj(value.progress)) pack.progress = parseProgress(value.progress, quests)
  return pack
}
export function parseProgress(value: unknown, quests: DMQuest[]): DMProgress {
  const p = obj(value) ? value : {},
    ids = new Set(quests.map((q) => q.id))
  return {
    skipped: Array.isArray(p.skipped)
      ? p.skipped
          .filter((v): v is string => typeof v === 'string')
          .slice(0, 360)
      : [],
    quest:
      typeof p.quest === 'string' && ids.has(p.quest)
        ? p.quest
        : quests[0]?.id || '',
    steps: Object.fromEntries(
      quests.map((q) => [
        q.id,
        obj(p.steps) && Number.isInteger(p.steps[q.id])
          ? Math.max(
              0,
              Math.min((q.steps?.length || 1) - 1, Number(p.steps[q.id])),
            )
          : 0,
      ]),
    ),
    done: Array.isArray(p.done)
      ? p.done.filter(
          (id): id is string => typeof id === 'string' && ids.has(id),
        )
      : [],
    decisions: Object.fromEntries(
      quests.map((q) => [
        q.id,
        obj(p.decisions) && txt(p.decisions[q.id], 10000)
          ? String(p.decisions[q.id])
          : '',
      ]),
    ),
  }
}
export function readPrivatePack(): DMPack | null {
  try {
    const raw = localStorage.getItem('aruzahr-director-pack')
    return raw ? parseDMPack(JSON.parse(raw)) : null
  } catch {
    return null
  }
}
export function downloadPrivateNotes() {
  const pack = readPrivatePack(),
    notes = localStorage.getItem('aruzahr-director-notes') || ''
  if (pack) {
    try {
      pack.progress = parseProgress(
        JSON.parse(localStorage.getItem('aruzahr-director-progress') || '{}'),
        pack.quests,
      )
    } catch {
      /* default progress */
    }
  }
  const blob = new Blob([pack ? JSON.stringify(pack, null, 2) : notes], {
    type: pack ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8',
  })
  const url = URL.createObjectURL(blob),
    a = document.createElement('a')
  a.href = url
  a.download = pack ? 'Aruzahr-Ozel-DM.json' : 'Aruzahr-DM-Notlari.txt'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function readSavedDMProgress(quests: DMQuest[]) {
  try {
    return parseProgress(
      JSON.parse(localStorage.getItem('aruzahr-director-progress') || '{}'),
      quests,
    )
  } catch {
    return parseProgress({}, quests)
  }
}
