import {
  newBroadcastState,
  validateBroadcastState,
  freshId,
} from '../broadcast-state'
import { parseDMPack, parseProgress } from '../dm-guide'
import type { BroadcastState } from '../broadcast-state'
import type {
  StudioProject,
  StudioPublic,
  Encounter,
  Combatant,
  AudioAsset,
  StudioPerson,
  SceneCard,
} from './types'
export const defaults = (): StudioPublic => ({
  revision: 0,
  epoch: 'local',
  takenAt: 0,
  transition: 'fade',
  weather: 'none',
  layout: 'scene',
  cameraSlots: 0,
  crop: { x: 50, y: 50, fit: 'cover' },
  audio: { owner: 'operator', muted: false, fadeMs: 800 },
  markers: [],
  break: { until: null, paused: null, summary: '', campaign: 'Aruzahr' },
})
export const encounter = (): Encounter => ({
  items: [],
  active: 0,
  round: 1,
  showOrder: true,
  showRound: true,
  hpDisplay: 'status',
  history: [],
})
export function newProject(initial?: BroadcastState): StudioProject {
  const state = initial || newBroadcastState()
  state.studio ||= defaults()
  return {
    version: 3,
    id: freshId('campaign'),
    name: 'Aruzahr kampanyam',
    sessionName: 'Yeni oturum',
    draft: state,
    program: state,
    previous: null,
    scenes: [],
    trash: [],
    activeScene: '',
    cast: [],
    imageAssets: state.customAssets,
    lastDraftHash: '',
    audioAssets: [],
    covers: {},
    journal: [],
    facts: [],
    bookmarks: [],
    encounter: encounter(),
    rolls: [],
    favorites: [],
    quick: ['take', 'break', 'mute', 'map', 'roll-d20', 'next'],
    shortcuts: {
      palette: 'Control+k',
      take: 'Alt+Enter',
      break: 'Alt+b',
      mute: 'Alt+m',
      next: 'Alt+n',
      previous: 'Alt+p',
      undo: 'Control+z',
      redo: 'Control+Shift+z',
    },
    usedAssets: [],
    view: 'narration',
    leftWidth: 245,
    rightWidth: 400,
    selectedActors: [],
    selectedTokens: [],
    mapScale: null,
    dmStorage: {},
    mediaVault: {},
    mapMarkers: [],
    combatOnAir: false,
    routeProgress: 0,
  }
}
export function localImage(src: string, vault: StudioProject['mediaVault']) {
  const id = src.match(/^\/__aruzahr-broadcast\/asset\/([a-f0-9]{64})$/)?.[1]
  return id && vault[id] ? vault[id] : src
}

/** Private previews must also work after an asset leaves the public program. */
export function localStage(
  state: BroadcastState,
  vault: StudioProject['mediaVault'],
): BroadcastState {
  return {
    ...state,
    scene: { ...state.scene, src: localImage(state.scene.src, vault) },
    actors: state.actors.map((a) => ({ ...a, src: localImage(a.src, vault) })),
    tokens: state.tokens.map((t) =>
      t.src ? { ...t, src: localImage(t.src, vault) } : t,
    ),
    studio: state.studio
      ? {
          ...state.studio,
          reveal: state.studio.reveal
            ? {
                ...state.studio.reveal,
                src: localImage(state.studio.reveal.src, vault),
              }
            : undefined,
        }
      : undefined,
  }
}

export function sceneCard(
  state: BroadcastState,
  name: string,
  covers: StudioProject['covers'] = {},
): SceneCard {
  return {
    id: freshId('scene'),
    name,
    state: validateBroadcastState(state),
    notes: '',
    tag: '',
    status: 'prepared',
    favorite: false,
    obsScene: '',
    covers,
  }
}
export function safeAudioSource(src: unknown): string {
  if (
    typeof src !== 'string' ||
    src.length > 23 * 1024 * 1024 ||
    !/^data:audio\/(wav|x-wav|mpeg|mp3|ogg|webm);base64,[A-Za-z0-9+/]+={0,2}$/.test(
      src,
    )
  )
    throw new Error(
      'Ses dosyası WAV, MP3, OGG veya WebM ve en çok 16 MB olmalı.',
    )
  const b = atob(src.split(',')[1].slice(0, 64))
  if (!(
    b.startsWith('RIFF') ||
    b.startsWith('ID3') ||
    b.startsWith('OggS') ||
    b.charCodeAt(0) === 0x1a ||
    (b.charCodeAt(0) === 255 && (b.charCodeAt(1) & 224) === 224)
  ))
    throw new Error('Ses dosyasının başlığı geçersiz.')
  return src
}
const text = (v: unknown, max = 10000) =>
  typeof v === 'string' && v.length <= max ? v : ''
const num = (v: unknown, min: number, max: number, fallback: number) =>
  typeof v === 'number' && Number.isFinite(v)
    ? Math.min(max, Math.max(min, v))
    : fallback
const array = (v: unknown, max: number) => {
  if (!Array.isArray(v) || v.length > max)
    throw new Error('Kampanya koleksiyonu sınırı aşıyor.')
  return v
}
const object = (v: unknown): Record<string, any> => {
  if (!v || typeof v !== 'object' || Array.isArray(v))
    throw new Error('Kampanya biçimi geçersiz.')
  return v as Record<string, any>
}
export function validateProject(input: unknown): StudioProject {
  const v = object(input)
  if (v.version !== 3) throw new Error('Bu kampanya sürümü desteklenmiyor.')
  const base = newProject(),
    state = (x: unknown) => {
      const checked = validateBroadcastState(x)
      checked.studio ||= defaults()
      return checked
    }
  const person = (entry: unknown): StudioPerson => {
    const x = object(entry)
    const pic = state({
      ...newBroadcastState(),
      actors: [
        {
          id: 'check',
          name: 'Resim',
          kind: 'image',
          src: x.src,
          x: 0,
          y: 0,
          w: 20,
          h: 30,
          hidden: false,
        },
      ],
    }).actors[0].src
    return {
      id: text(x.id, 160) || freshId('person'),
      sourceId: text(x.sourceId, 160),
      realName: text(x.realName, 100),
      knownName: text(x.knownName, 100),
      revealed: !!x.revealed,
      src: pic,
      role: text(x.role, 500),
      city: text(x.city, 160),
      affiliation: text(x.affiliation, 500),
      voice: text(x.voice, 1000),
      aim: text(x.aim, 2000),
      relationship: text(x.relationship, 2000),
      notes: text(x.notes),
      kind: ['party', 'ally', 'enemy'].includes(x.kind) ? x.kind : 'ally',
      hp: num(x.hp, 0, 100000, 10),
      maxHp: num(x.maxHp, 1, 100000, 10),
      ac: num(x.ac, 0, 100, 10),
    }
  }
  const covers = (raw: unknown): StudioProject['covers'] => {
    if (!raw) return {}
    const out: StudioProject['covers'] = {}
    for (const [id, rows] of Object.entries(object(raw)).slice(0, 40))
      out[id] = array(rows, 12).map((row) => {
        const r = object(row)
        return {
          x: num(r.x, 0, 100, 0),
          y: num(r.y, 0, 100, 0),
          w: num(r.w, 0, 100, 100),
          h: num(r.h, 0, 100, 20),
        }
      })
    return out
  }
  const card = (raw: unknown): SceneCard => {
    const x = object(raw)
    return {
      id: text(x.id, 160) || freshId('scene'),
      name: text(x.name, 160) || 'Sahne',
      state: state(x.state),
      notes: text(x.notes),
      tag: text(x.tag, 160),
      status: ['new', 'prepared', 'played', 'skipped'].includes(x.status)
        ? x.status
        : 'new',
      favorite: !!x.favorite,
      obsScene: text(x.obsScene, 160),
      covers: covers(x.covers),
    }
  }
  const enc = object(v.encounter),
    items = array(enc.items, 80).map((raw): Combatant => {
      const x = object(raw)
      return {
        id: text(x.id, 160) || freshId('combatant'),
        castId: text(x.castId, 160),
        name: text(x.name, 100),
        initiative: num(x.initiative, -100, 1000, 0),
        hp: num(x.hp, 0, 100000, 10),
        maxHp: num(x.maxHp, 1, 100000, 10),
        tempHp: num(x.tempHp, 0, 100000, 0),
        ac: num(x.ac, 0, 100, 10),
        conditions: array(x.conditions, 15).map((c) => text(c, 60)),
        concentration: !!x.concentration,
        hidden: !!x.hidden,
        group: text(x.group, 160),
        notes: text(x.notes),
      }
    })
  const marks =
    v.mapMarkers === undefined
      ? []
      : array(v.mapMarkers, 100).map((raw) => {
          const x = object(raw),
            m = state({
              ...base.draft,
              studio: { ...defaults(), markers: [x] },
            }).studio!.markers![0]
          return { ...m, hidden: !!x.hidden }
        })
  const out: StudioProject = {
    ...base,
    id: text(v.id, 160) || base.id,
    name: text(v.name, 160) || base.name,
    sessionName: text(v.sessionName, 160),
    draft: state(v.draft),
    program: state(v.program),
    previous: v.previous ? state(v.previous) : null,
    scenes: array(v.scenes, 150).map(card),
    trash: array(v.trash, 30).map(card),
    activeScene: text(v.activeScene, 160),
    cast: array(v.cast, 200).map(person),
    imageAssets: state({
      ...base.draft,
      customAssets: v.imageAssets || object(v.draft).customAssets || [],
    }).customAssets,
    lastDraftHash: text(v.lastDraftHash, 64),
    audioAssets: array(v.audioAssets, 64).map((raw) => {
      const a = object(raw)
      if (!/^[a-f0-9]{64}$/.test(a.id)) throw new Error('Ses kimliği geçersiz.')
      return {
        id: a.id,
        name: text(a.name, 160),
        src: safeAudioSource(a.src),
        license: text(a.license, 1000),
        type: ['music', 'ambience', 'effect'].includes(a.type)
          ? a.type
          : 'effect',
      } as AudioAsset
    }),
    covers: covers(v.covers),
    journal: array(v.journal, 1500).map((raw) => {
      const x = object(raw)
      return {
        id: text(x.id, 160),
        at: num(x.at, 0, 8640000000000000, Date.now()),
        kind: [
          'event',
          'decision',
          'promise',
          'delivery',
          'relation',
          'roll',
        ].includes(x.kind)
          ? x.kind
          : 'event',
        text: text(x.text),
        publicText: text(x.publicText),
        sceneId: text(x.sceneId, 160),
      }
    }),
    facts: array(v.facts, 300).map((raw) => {
      const x = object(raw)
      return {
        id: text(x.id, 160),
        label: text(x.label, 300),
        value: text(x.value, 3000),
        sceneIds: array(x.sceneIds, 150).map((i) => text(i, 160)),
        questIds: array(x.questIds, 100).map((i) => text(i, 160)),
        enabled: !!x.enabled,
      }
    }),
    bookmarks: array(v.bookmarks, 100).map((raw) => {
      const x = object(raw),
        c = state({ ...base.draft, camera: x.camera }).camera!
      return {
        id: text(x.id, 160),
        name: text(x.name, 160),
        camera: c,
        kmPerSourceWidth:
          x.kmPerSourceWidth === null
            ? null
            : num(x.kmPerSourceWidth, 0.001, 1000000, 100),
      }
    }),
    encounter: {
      ...encounter(),
      items,
      active: num(enc.active, 0, Math.max(0, items.length - 1), 0),
      round: num(enc.round, 1, 10000, 1),
      showOrder: !!enc.showOrder,
      showRound: !!enc.showRound,
      hpDisplay: ['none', 'status', 'bar', 'number'].includes(enc.hpDisplay)
        ? enc.hpDisplay
        : 'status',
      history: array(enc.history || [], 50).map((r) => ({
        active: num(r.active, 0, 79, 0),
        round: num(r.round, 1, 10000, 1),
      })),
    },
    rolls: [],
    favorites: array(v.favorites || [], 40).map((x) => ({
      who: text(x.who, 100),
      label: text(x.label, 120),
      expression: text(x.expression, 160),
    })),
    quick: array(v.quick || [], 24).map((x) => text(x, 160)),
    shortcuts: Object.fromEntries(
      Object.entries(object(v.shortcuts || {}))
        .slice(0, 20)
        .map(([k, x]) => [k, text(x, 80)]),
    ),
    usedAssets: array(v.usedAssets || [], 500).map((x) => text(x, 160)),
    view: ['narration', 'combat', 'preparation'].includes(v.view)
      ? v.view
      : 'narration',
    leftWidth: num(v.leftWidth, 200, 400, 245),
    rightWidth: num(v.rightWidth, 320, 650, 400),
    selectedActors: [],
    selectedTokens: [],
    mapScale: v.mapScale === null ? null : num(v.mapScale, 0.001, 1000000, 100),
    dmStorage: {},
    mediaVault: {},
    mapMarkers: marks,
    combatOnAir: !!v.combatOnAir,
    routeProgress: num(v.routeProgress, 0, 100, 0),
  }
  for (const [key, value] of Object.entries(object(v.dmStorage || {})))
    if (
      /^aruzahr-director-(pack|notes|progress)$/.test(key) &&
      typeof value === 'string' &&
      value.length < 2 * 1024 * 1024
    )
      out.dmStorage[key] = value
  for (const [key, src] of array(
    Object.entries(object(v.mediaVault || {})),
    400,
  )) {
    if (!/^[a-f0-9]{64}$/.test(key))
      throw new Error('Görsel arşivi kimliği geçersiz.')
    if (typeof src !== 'string' || !src.startsWith('data:image/'))
      throw new Error('Görsel arşivi dosya verisi içermeli.')
    out.mediaVault[key] = state({
      ...base.draft,
      scene: { ...base.draft.scene, src },
    }).scene.src
  }
  for (const raw of array(v.rolls || [], 200)) {
    const x = object(raw),
      r = state({
        ...base.draft,
        studio: { ...defaults(), roll: { ...x, onlyTotal: false } },
      }).studio!.roll!
    out.rolls.push({ ...r, onlyTotal: !!x.onlyTotal, secret: !!x.secret })
  }
  for (const list of [out.scenes, out.cast, out.encounter.items])
    if (new Set(list.map((i) => i.id)).size !== list.length)
      throw new Error('Kampanyada yinelenen kimlikler var.')
  const check = (v: unknown) => {
    if (typeof v === 'string') {
      const m = v.match(/^\/__aruzahr-broadcast\/asset\/([a-f0-9]{64})$/)
      if (m && !out.mediaVault[m[1]])
        throw new Error('Kampanya paketinde bir sahne görseli eksik.')
    } else if (Array.isArray(v)) v.forEach(check)
    else if (v && typeof v === 'object') Object.values(v).forEach(check)
  }
  check([out.draft, out.program, out.previous, out.scenes, out.trash, out.cast])
  out.draft = localStage(out.draft, out.mediaVault)
  out.cast = out.cast.map((c) => ({
    ...c,
    src: localImage(c.src, out.mediaVault),
  }))
  return out
}
export function combatPublic(e: Encounter): StudioPublic['combat'] {
  const active = e.items[e.active]
  return {
    round: e.round,
    activeId: active?.hidden ? '' : active?.castId || active?.id || '',
    showOrder: e.showOrder,
    showRound: e.showRound,
    items: e.items
      .filter((i) => !i.hidden)
      .map((i) => {
        const percent = Math.max(0, Math.min(100, (i.hp / i.maxHp) * 100))
        return {
          id: i.castId || i.id,
          name: i.name,
          active: i === active,
          conditions: i.conditions,
          concentration: i.concentration,
          ...(e.hpDisplay === 'none'
            ? {}
            : e.hpDisplay === 'number'
              ? {
                  hpText: `${i.hp}/${i.maxHp}${i.tempHp ? ` (+${i.tempHp})` : ''}`,
                }
              : e.hpDisplay === 'bar'
                ? { percent }
                : {
                    hpText:
                      i.hp === 0
                        ? 'Yerde'
                        : percent <= 25
                          ? 'Ağır yaralı'
                          : percent <= 65
                            ? 'Yaralı'
                            : 'İyi',
                  }),
        }
      }),
  }
}
export function privateDMStorage() {
  return Object.fromEntries(
    [
      'aruzahr-director-pack',
      'aruzahr-director-notes',
      'aruzahr-director-progress',
    ].map((k) => [k, localStorage.getItem(k) || '']),
  )
}
export function restoreDMStorage(v: Record<string, string>) {
  for (const key of [
    'aruzahr-director-pack',
    'aruzahr-director-notes',
    'aruzahr-director-progress',
  ]) {
    const value = v[key]
    if (value) localStorage.setItem(key, value)
    else localStorage.removeItem(key)
  }
}
const DB = 'aruzahr-studio-v3'
async function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const r = indexedDB.open(DB, 1)
    r.onupgradeneeded = () => r.result.createObjectStore('data')
    r.onsuccess = () => {
      r.result.onversionchange = () => r.result.close()
      resolve(r.result)
    }
    r.onerror = () => reject(r.error)
  })
}
export async function storeProject(value: StudioProject) {
  const db = await database()
  try {
    await new Promise<void>((res, rej) => {
      const tx = db.transaction('data', 'readwrite')
      tx.objectStore('data').put(value, 'current')
      tx.oncomplete = () => res()
      tx.onerror = () => rej(tx.error)
      tx.onabort = () => rej(tx.error)
    })
  } finally {
    db.close()
  }
}
export async function loadProject(): Promise<StudioProject | null> {
  const db = await database()
  try {
    return await new Promise((res, rej) => {
      const tx = db.transaction('data'),
        r = tx.objectStore('data').get('current')
      tx.oncomplete = () => {
        try {
          res(r.result ? validateProject(r.result) : null)
        } catch (e) {
          rej(e)
        }
      }
      tx.onerror = () => rej(tx.error)
    })
  } finally {
    db.close()
  }
}
export function downloadFile(
  name: string,
  value: string,
  type = 'application/json',
) {
  const url = URL.createObjectURL(new Blob([value], { type })),
    a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function packageSummary(p: StudioProject) {
  return `${p.scenes.length} sahne · ${p.cast.length} kişi · ${p.draft.customAssets.length} yerel görsel · ${p.audioAssets.length} ses · ${p.journal.length} oturum kaydı`
}
export function mergeProjects(current: StudioProject, incoming: StudioProject) {
  const castIds = new Map(
    incoming.cast.map((c) => [
      c.id,
      current.cast.some((x) => x.id === c.id) ? freshId('person') : c.id,
    ]),
  )
  const imageIds = new Map(
    incoming.imageAssets.map((a) => [
      a.id,
      current.imageAssets.some((x) => x.id === a.id && x.src !== a.src)
        ? freshId('image')
        : a.id,
    ]),
  )
  const questIds = new Map<string, string>(),
    stepIds = new Map<string, string>(),
    eventIds = new Map<string, string>(),
    dmStorage = { ...current.dmStorage }
  const parse = (v: string | undefined) => {
    try {
      return v ? JSON.parse(v) : null
    } catch {
      return null
    }
  }
  const aRaw = parse(current.dmStorage['aruzahr-director-pack']),
    bRaw = parse(incoming.dmStorage['aruzahr-director-pack'])
  if (bRaw) {
    const b = parseDMPack(bRaw)
    if (!aRaw) {
      Object.assign(dmStorage, incoming.dmStorage)
      for (const q of b.quests) questIds.set(q.id, q.id)
    } else {
      const a = parseDMPack(aRaw),
        usedQuestIds = new Set(a.quests.map((q) => q.id)),
        usedStepIds = new Set(
          a.quests.flatMap((q) => q.steps?.map((s) => s.id) || []),
        ),
        usedEventIds = new Set(
          a.quests.flatMap((q) => q.events?.map((event) => event.id) || []),
        )
      const uniqueId = (id: string, used: Set<string>, prefix: string) => {
        let next = id
        while (used.has(next)) next = freshId(prefix)
        used.add(next)
        return next
      }
      if (a.quests.length + b.quests.length > 30)
        throw new Error(
          'Birleştirme 30 görev sınırını aşıyor. Ayrı kampanya olarak aç.',
        )
      for (const q of b.quests) {
        questIds.set(q.id, uniqueId(q.id, usedQuestIds, 'quest'))
        for (const step of q.steps || [])
          stepIds.set(step.id, uniqueId(step.id, usedStepIds, 'step'))
        for (const event of q.events || [])
          eventIds.set(event.id, uniqueId(event.id, usedEventIds, 'event'))
      }
      const quests = b.quests.map((q) => ({
        ...q,
        id: questIds.get(q.id)!,
        events: q.events?.map((event) => ({
          ...event,
          id: eventIds.get(event.id)!,
          at: stepIds.get(event.at) || event.at,
          followup: {
            ...event.followup,
            questId:
              questIds.get(event.followup.questId) || event.followup.questId,
            sceneId:
              stepIds.get(event.followup.sceneId) || event.followup.sceneId,
          },
        })),
        steps: q.steps?.map((step) => ({
          ...step,
          id: stepIds.get(step.id)!,
          play: step.play
            ? {
                ...step.play,
                paths: step.play.paths.map((path) => ({
                  ...path,
                  to: stepIds.get(path.to) || path.to,
                })),
              }
            : undefined,
          exits: step.exits?.map((e) => ({
            ...e,
            sceneId: stepIds.get(e.sceneId) || e.sceneId,
          })),
        })),
      }))
      const ap = parseProgress(
          parse(current.dmStorage['aruzahr-director-progress']) || a.progress,
          a.quests,
        ),
        bp = parseProgress(
          parse(incoming.dmStorage['aruzahr-director-progress']) || b.progress,
          b.quests,
        )
      const combinedQuests = [...a.quests, ...quests]
      const mergedProgress = parseProgress(
        {
          quest: ap.quest,
          steps: {
            ...ap.steps,
            ...Object.fromEntries(
              Object.entries(bp.steps).map(([id, n]) => [
                questIds.get(id) || id,
                n,
              ]),
            ),
          },
          done: [...ap.done, ...bp.done.map((id) => questIds.get(id) || id)],
          decisions: {
            ...ap.decisions,
            ...Object.fromEntries(
              Object.entries(bp.decisions).map(([id, value]) => [
                questIds.get(id) || id,
                value,
              ]),
            ),
          },
          skipped: [
            ...(ap.skipped || []),
            ...(bp.skipped || []).map((id) => stepIds.get(id) || id),
          ],
          ...(ap.eventChoices || bp.eventChoices
            ? {
                eventChoices: {
                  ...ap.eventChoices,
                  ...Object.fromEntries(
                    Object.entries(bp.eventChoices || {}).map(([id, value]) => [
                      eventIds.get(id) || id,
                      value,
                    ]),
                  ),
                },
              }
            : {}),
          ...(ap.eventNotes || bp.eventNotes
            ? {
                eventNotes: {
                  ...ap.eventNotes,
                  ...Object.fromEntries(
                    Object.entries(bp.eventNotes || {}).map(([id, value]) => [
                      eventIds.get(id) || id,
                      value,
                    ]),
                  ),
                },
              }
            : {}),
          ...(ap.pinnedPeople || bp.pinnedPeople
            ? {
                pinnedPeople: [
                  ...new Set([
                    ...(ap.pinnedPeople || []),
                    ...(bp.pinnedPeople || []),
                  ]),
                ],
              }
            : {}),
        },
        combinedQuests,
      )
      dmStorage['aruzahr-director-pack'] = JSON.stringify({
        ...a,
        version: Math.max(a.version, b.version),
        quests: combinedQuests,
        progress: mergedProgress,
      })
      dmStorage['aruzahr-director-progress'] = JSON.stringify(mergedProgress)
    }
  }
  const remapDMScene = (id: string) => {
    for (const [quest, next] of questIds)
      if (id.startsWith('dm:' + quest + ':')) {
        const step = id.slice(('dm:' + quest + ':').length)
        const eventPrefix = 'journey-event:'
        const mapped = step.startsWith(eventPrefix)
          ? eventPrefix +
            (eventIds.get(step.slice(eventPrefix.length)) ||
              step.slice(eventPrefix.length))
          : stepIds.get(step) || step
        return 'dm:' + next + ':' + mapped
      }
    return id
  }
  const sceneIds = new Map(
    incoming.scenes.map((s) => {
      const id = remapDMScene(s.id)
      return [
        s.id,
        current.scenes.some((x) => x.id === id) ? freshId('scene') : id,
      ]
    }),
  )
  const remapCovers = (covers: StudioProject['covers']) =>
    Object.fromEntries(
      Object.entries(covers).map(([id, rows]) => [
        castIds.get(id) || imageIds.get(id) || id,
        rows,
      ]),
    )
  const remapState = (s: BroadcastState) => ({
    ...s,
    actors: s.actors.map((a) => ({
      ...a,
      id: castIds.get(a.id) || a.id,
      assetId: a.assetId ? imageIds.get(a.assetId) || a.assetId : undefined,
    })),
    tokens: s.tokens.map((t) => ({ ...t, id: castIds.get(t.id) || t.id })),
    customAssets: s.customAssets.map((a) => ({
      ...a,
      id: imageIds.get(a.id) || a.id,
    })),
    studio: s.studio
      ? {
          ...s.studio,
          highlight: s.studio.highlight
            ? castIds.get(s.studio.highlight) || s.studio.highlight
            : undefined,
          reveal: s.studio.reveal
            ? {
                ...s.studio.reveal,
                id:
                  castIds.get(s.studio.reveal.id) ||
                  imageIds.get(s.studio.reveal.id) ||
                  s.studio.reveal.id,
              }
            : undefined,
        }
      : undefined,
  })
  const extraNotes = incoming.dmStorage['aruzahr-director-notes']
  const noteEntry = extraNotes
    ? [
        {
          id: freshId('entry'),
          at: Date.now(),
          kind: 'event' as const,
          text: 'İçe aktarılan özel DM notları: ' + extraNotes.slice(0, 9500),
          publicText: '',
          sceneId: '',
        },
      ]
    : []
  return {
    ...current,
    dmStorage,
    cast: [
      ...current.cast,
      ...incoming.cast.map((c) => ({
        ...c,
        id: castIds.get(c.id)!,
        sourceId: c.sourceId
          ? imageIds.get(c.sourceId) || c.sourceId
          : undefined,
      })),
    ],
    imageAssets: [
      ...current.imageAssets,
      ...incoming.imageAssets
        .filter(
          (a) =>
            !current.imageAssets.some((x) => x.id === a.id && x.src === a.src),
        )
        .map((a) => ({ ...a, id: imageIds.get(a.id)! })),
    ],
    scenes: [
      ...current.scenes,
      ...incoming.scenes.map((s) => ({
        ...s,
        id: sceneIds.get(s.id)!,
        state: remapState(s.state),
        covers: remapCovers(s.covers),
      })),
    ],
    audioAssets: [
      ...current.audioAssets,
      ...incoming.audioAssets.filter(
        (a) => !current.audioAssets.some((b) => b.id === a.id),
      ),
    ],
    journal: [
      ...current.journal,
      ...incoming.journal.map((j) => ({
        ...j,
        id: freshId('entry'),
        sceneId: sceneIds.get(j.sceneId) || remapDMScene(j.sceneId),
      })),
      ...noteEntry,
    ],
    facts: [
      ...current.facts,
      ...incoming.facts.map((f) => ({
        ...f,
        id: freshId('fact'),
        sceneIds: f.sceneIds.map((id) => sceneIds.get(id) || remapDMScene(id)),
        questIds: f.questIds.map((id) => questIds.get(id) || id),
      })),
    ],
    mediaVault: { ...current.mediaVault, ...incoming.mediaVault },
  }
}
