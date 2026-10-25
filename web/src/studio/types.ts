import type { BroadcastAsset } from '../BroadcastLibrary'
import type { BroadcastState } from '../broadcast-state'
export type StudioChannel = {
  id: string
  label: string
  volume: number
  playing: boolean
  trigger: string
  loop: boolean
  at?: number
}
export type StudioRoll = {
  id: string
  who: string
  label: string
  expression: string
  mode: 'normal' | 'advantage' | 'disadvantage'
  onlyTotal: boolean
  critical: boolean
  total: number
  at: number
  terms: {
    sides: number
    sign: 1 | -1
    values: number[]
    used: number | null
  }[]
}
export type StudioMark = {
  id: string
  label: string
  x: number
  y: number
  kind: 'ping' | 'place' | 'route'
  expires: number
  color: string
  hidden?: boolean
}
export type StudioPublic = {
  revision: number
  epoch: string
  takenAt: number
  transition: 'cut' | 'fade' | 'dip'
  weather: 'none' | 'snow' | 'rain' | 'fog'
  layout: 'left' | 'bottom' | 'sides' | 'scene' | 'map' | 'combat'
  cameraSlots: number
  crop?: { x: number; y: number; fit: 'cover' | 'contain' }
  highlight?: string
  reveal?: { id: string; name: string; src: string }
  break?: {
    until: number | null
    paused: number | null
    summary: string
    campaign: string
    ambientId?: string
  }
  audio?: {
    owner: 'operator' | 'audience' | 'off'
    muted: boolean
    fadeMs: number
    music?: StudioChannel
    ambience?: StudioChannel
    effect?: StudioChannel
  }
  combat?: {
    round: number
    activeId: string
    showOrder: boolean
    showRound: boolean
    items: {
      id: string
      name: string
      active: boolean
      hpText?: string
      percent?: number
      conditions: string[]
      concentration: boolean
    }[]
  }
  roll?: StudioRoll
  markers?: StudioMark[]
  poll?: {
    id: string
    title: string
    code: string
    open: boolean
    options: { id: string; label: string; votes: number }[]
  }
}
export type Cover = { x: number; y: number; w: number; h: number }
export type SceneCard = {
  id: string
  name: string
  state: BroadcastState
  notes: string
  tag: string
  status: 'new' | 'prepared' | 'played' | 'skipped'
  favorite: boolean
  obsScene: string
  covers: Record<string, Cover[]>
}
export type StudioPerson = {
  id: string
  sourceId?: string
  realName: string
  knownName: string
  revealed: boolean
  src: string
  role: string
  city: string
  affiliation: string
  voice: string
  aim: string
  relationship: string
  notes: string
  kind: 'party' | 'ally' | 'enemy'
  hp: number
  maxHp: number
  ac: number
}
export type Combatant = {
  id: string
  castId: string
  name: string
  initiative: number
  hp: number
  maxHp: number
  tempHp: number
  ac: number
  conditions: string[]
  concentration: boolean
  hidden: boolean
  group: string
  notes: string
}
export type Encounter = {
  items: Combatant[]
  active: number
  round: number
  showOrder: boolean
  showRound: boolean
  hpDisplay: 'none' | 'status' | 'bar' | 'number'
  history: { active: number; round: number }[]
}
export type AudioAsset = {
  id: string
  name: string
  src: string
  license: string
  type: 'music' | 'ambience' | 'effect'
}
export type WorldFact = {
  id: string
  label: string
  value: string
  sceneIds: string[]
  questIds: string[]
  enabled: boolean
}
export type JournalEntry = {
  id: string
  at: number
  kind: 'event' | 'decision' | 'promise' | 'delivery' | 'relation' | 'roll'
  text: string
  publicText: string
  sceneId: string
}
export type StudioProject = {
  version: 3
  id: string
  name: string
  sessionName: string
  draft: BroadcastState
  program: BroadcastState
  previous: BroadcastState | null
  scenes: SceneCard[]
  trash: SceneCard[]
  activeScene: string
  cast: StudioPerson[]
  imageAssets: BroadcastAsset[]
  lastDraftHash: string
  audioAssets: AudioAsset[]
  covers: Record<string, Cover[]>
  journal: JournalEntry[]
  facts: WorldFact[]
  bookmarks: {
    id: string
    name: string
    camera: NonNullable<BroadcastState['camera']>
    kmPerSourceWidth: number | null
  }[]
  encounter: Encounter
  rolls: (StudioRoll & { secret: boolean })[]
  favorites: { who: string; label: string; expression: string }[]
  quick: string[]
  shortcuts: Record<string, string>
  usedAssets: string[]
  view: 'narration' | 'combat' | 'preparation'
  leftWidth: number
  rightWidth: number
  selectedActors: string[]
  selectedTokens: string[]
  mapScale: number | null
  dmStorage: Record<string, string>
  mediaVault: Record<string, string>
  mapMarkers: StudioMark[]
  combatOnAir: boolean
  routeProgress: number
}
export type OutputKind =
  'main' | 'map' | 'portraits' | 'dice' | 'initiative' | 'break'
