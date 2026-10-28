import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  Check,
  Clapperboard,
  Command,
  Copy,
  Dices,
  Eye,
  FolderOpen,
  Image as ImageIcon,
  Map as MapIcon,
  Mic,
  MonitorPlay,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Radio,
  RotateCcw,
  Save,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import BroadcastStage, { type BroadcastTool } from '../BroadcastStage'
import { broadcastAssets, type BroadcastAsset } from '../BroadcastLibrary'
import BroadcastQuestDirector from '../BroadcastQuestDirector'
import DMPreparation from './DMPreparation'
import { StudioDirectory } from './StudioFinder'
import { ensureBuiltinCampaign } from '../builtin-campaign'
import { characters } from '../lore/characters'
import { powerFor } from '../character-card-profiles'
import { placeById, locationById } from '../data'
import {
  loadBroadcast,
  newBroadcastState,
  freshId,
  imageAsset,
  validateBroadcastState,
} from '../broadcast-state'
import type { BroadcastState, StageActor } from '../broadcast-state'
import {
  parseDMPack,
  parseProgress,
  readSavedDMProgress,
  readPrivatePack,
  downloadPrivateNotes,
  type DMScene,
} from '../dm-guide'
import { clearAruzahrData } from '../broadcast-reset'
import { StudioContext, type StudioActions } from './context'
import {
  newProject,
  loadProject,
  storeProject,
  defaults,
  sceneCard,
  privateDMStorage,
  restoreDMStorage,
  validateProject,
  mergeProjects,
  packageSummary,
  combatPublic,
  localImage,
  localStage,
} from './model'
import type {
  StudioProject,
  StudioPublic,
  SceneCard,
  StudioPerson,
} from './types'
import { useStudioConnection, digest } from './connection'
import { prepareProgram } from './media'
import { exportCampaign, parseCampaign } from './package'
import StudioAudio from './StudioAudio'
import {
  ScenePanel,
  LibraryPanel,
  PeoplePanel,
  MapPanel,
  CombatPanel,
  DicePanel,
  SoundPanel,
  JournalPanel,
  BroadcastPanel,
  updateEncounter,
} from './StudioPanels'
import { OBSConnection } from './obs'
import { rollExpression } from './dice'
import '../broadcast-workspace.css'
import './studio.css'
const panels = [
  ['quests', 'Görev', BookOpen],
  ['finder', 'Kişi / yer bul', Search],
  ['scene', 'Sahne', Clapperboard],
  ['library', 'Görsel', ImageIcon],
  ['people', 'Kişi', Users],
  ['map', 'Harita', MapIcon],
  ['combat', 'Savaş', Shield],
  ['dice', 'Zar', Dices],
  ['sound', 'Ses', Volume2],
  ['journal', 'Defter', BookOpen],
  ['broadcast', 'Yayın', Settings],
] as const
const panelHelp: Record<string, {title:string;text:string}> = {
  finder:{title:'Kim, nerede ve hangi olayda?',text:'Bütün kişileri, yaratıkları ve mekânları aynı aramadan bul. Karşılaşma kartına gitmek özel rehberi açar; resmi hazırlamak yayını değiştirmez.'},
  quests:{title:'Oyunu buradan yürüt',text:'Ortadan bölümü ve adımı seç; sağda hazırladığın resmi kontrol et. Hazırlamak oyuncuların ekranını değiştirmez.'},
  scene:{title:'Sahnenin görünüşü',text:'Arka planı, portreleri ve yerleşimi hazırlıkta düzenle. Bu düzeni tekrar kullanmak için Sahneyi kaydet; oyunculara geçirmek için Yayına al.'},
  library:{title:'Resmi bul ve kullan',text:'Sahneyi arka plan yap, kişiyi portre olarak ekle. Göz simgesi açıkça seçtiğin görseli oyunculara gösterir.'},
  people:{title:'Sahnede kim var?',text:'Kişilerin görünen adını, portresini ve durumunu ayarla. Gizli kimlik ile DM notu oyuncuların ekranında görünmez.'},
  map:{title:'Yolculuğu göster',text:'Bir konuma git, taşları hareket ettir veya çizim yap. Hazırlık haritasını Yayına al; dikkat halkası doğrudan canlı işaret verir.'},
  combat:{title:'Çatışmayı takip et',text:'İnisiyatifi ve canları burada tut. Gizli düşmanları açmadıkça oyuncular görmez; yayınlanan sayısal bilgiyi kendin seçersin.'},
  dice:{title:'Zarı burada at',text:'Zar ifadesini ve görünürlüğünü seç. Açık atış ekrana gider; gizli atış yalnız bu masada kalır.'},
  sound:{title:'Sahnenin sesi',text:'Hazır dokuyu ya da kendi sesini seç; ses düzeyini ayarla. Önce tarayıcıda sesi etkinleştir, sonra OBS ses kaynağını kontrol et.'},
  journal:{title:'Verdiğiniz sözleri unutma',text:'Özel kararları ve oturum notlarını kaydet. Hatırlatmalar uygun sahneye bağlanabilir; özel not kendiliğinden yayımlanmaz.'},
  broadcast:{title:'Yayın, yedek ve sıfırlama',text:'Temiz OBS adresini ve ölçüyü buradan al. Tam kampanya yedeği kişisel notları içerir; sıfırlamadan önce bu yedeği indir.'},
}
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const storyFrameKey = (state: BroadcastState) =>
  JSON.stringify([
    state.studio?.revision,
    state.studio?.takenAt,
    state.title,
    state.mode,
    state.blackout,
    state.intermission,
  ])
export default function StudioWorkspace() {
  const [project, setProject] = useState<StudioProject | null>(null),
    [fatal, setFatal] = useState(''),
    [campaignReady, setCampaignReady] = useState(false),
    [panel, setPanel] = useState(
      location.hash.endsWith('/reset') ? 'broadcast' : 'quests',
    ),
    [message, setMessage] = useState(''),
    [saved, setSaved] = useState('Hazırlanıyor'),
    [tool, setTool] = useState<BroadcastTool>('pan'),
    [color, setColor] = useState('#e4bc74'),
    [brush, setBrush] = useState(14),
    [busy, setBusy] = useState(false),
    [palette, setPalette] = useState(false),
    [query, setQuery] = useState(''),
    [sceneQuery, setSceneQuery] = useState(''),
    [dmRevision, setDMRevision] = useState(0),
    [imported, setImported] = useState<StudioProject | null>(null),
    [reset, setReset] = useState(false),
    [resetWord, setResetWord] = useState(''),
    [obsStatus, setObsStatus] = useState('Bağlı değil'),
    [obsScenes, setObsScenes] = useState<string[]>([]),
    [obsConnected, setObsConnected] = useState(false),
    [showQuick, setShowQuick] = useState(false),
    [draftHash, setDraftHash] = useState('')
  useEffect(() => {
    try { localStorage.removeItem('aruzahr-studio-layout') } catch { /* optional preference */ }
  }, [])
  const current = useRef(project)
  current.current = project
  const commandRef = useRef<(id: string, value?: string) => void>(() => {}),
    saveQueue = useRef(Promise.resolve()),
    resetting = useRef(false),
    undoStack = useRef<BroadcastState[]>([]),
    redoStack = useRef<BroadcastState[]>([]),
    lastUndo = useRef(0),
    obsClient = useRef(new OBSConnection()),
    saveFile = useRef<HTMLInputElement>(null),
    ownerRef = useRef(false),
    timerNotified = useRef(0),
    taking = useRef(false)
  const notify = useCallback((text: string) => setMessage(text), [])
  const change = useCallback(
    (fn: (p: StudioProject) => StudioProject) => {
      if (resetting.current || !ownerRef.current || !current.current) return
      const next = fn(current.current)
      const checks: [[unknown[], number], ...[unknown[], number][]] = [
        [next.scenes, 150],
        [next.cast, 200],
        [next.audioAssets, 64],
        [next.imageAssets, 40],
        [next.facts, 300],
        [next.encounter.items, 80],
        [next.draft.actors, 40],
        [next.draft.tokens, 200],
      ]
      if (checks.some(([items, max]) => items.length > max)) {
        notify(
          'Koleksiyon sınırına ulaşıldı. Kullanılmayan kayıtları kaldır veya ayrı kampanyaya aç.',
        )
        return
      }
      current.current = next
      setProject(next)
    },
    [notify],
  )
  useEffect(() => {
    if (!project || !crypto.subtle) return
    let cancelled = false
    const t = setTimeout(() => {
      void digest(JSON.stringify({ ...project.draft, customAssets: [] })).then(
        (hash) => {
          if (!cancelled) setDraftHash(hash)
        },
      )
    }, 150)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [project?.draft])
  const onRemote = useCallback(
    (action: string, value: string) => commandRef.current(action, value),
    [],
  )
  const onPoll = useCallback(
    (poll: any) =>
      change((p) => {
        const previous = p.program.studio?.poll
        if (
          !previous ||
          previous.id !== poll.id ||
          (JSON.stringify(previous.options) === JSON.stringify(poll.options) &&
            previous.open === poll.open)
        )
          return p
        return {
          ...p,
          program: {
            ...p.program,
            studio: {
              ...p.program.studio!,
              poll: { ...previous, options: poll.options, open: poll.open },
            },
          },
        }
      }),
    [change],
  )
  const connection = useStudioConnection(project, onRemote, onPoll)
  ownerRef.current = connection.state.owner
  useEffect(() => {
    let cancelled = false
    loadProject()
      .then(async (p) => {
        if (!p) {
          p = newProject((await loadBroadcast()) || undefined)
          p.dmStorage = privateDMStorage()
        } else {
          for (const [key, value] of Object.entries(p.dmStorage))
            if (value && !localStorage.getItem(key))
              localStorage.setItem(key, value)
        }
        if (!cancelled) {
          setProject(p)
          setSaved('Yerel kayıt hazır')
        }
      })
      .catch((e) => {
        if (!cancelled) setFatal(e.message || 'Kayıt açılamadı.')
      })
    return () => {
      cancelled = true
    }
  }, [])
  useEffect(() => {
    if (!project || !connection.state.owner || campaignReady) return
    let cancelled = false
    // Restore the saved project first; only its owner may seed an absent book.
    ensureBuiltinCampaign()
      .then(() => {
        if (cancelled) return
        change((p) => ({ ...p, dmStorage: privateDMStorage() }))
        setDMRevision((v) => v + 1)
        setCampaignReady(true)
      })
      .catch((e) => {
        if (cancelled) return
        notify('Hazır hikâye açılamadı: ' + (e as Error).message)
        setCampaignReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [!!project, connection.state.owner, campaignReady, change, notify])
  useEffect(() => {
    if (!project || !connection.state.owner || resetting.current) return
    setSaved('Kaydediliyor')
    const timer = setTimeout(() => {
      const snapshot = current.current!
      try {
        const lease = JSON.parse(
          localStorage.getItem('aruzahr-studio-owner') || 'null',
        )
        if (lease && lease.id !== connection.id.current) return
      } catch {}
      saveQueue.current = saveQueue.current
        .catch(() => {})
        .then(() => storeProject(snapshot))
        .then(() => {
          if (!resetting.current) setSaved('Kaydedildi')
        })
        .catch((e) => {
          setSaved('Kayıt başarısız')
          notify(
            'Kampanya kaydedilemedi. Özel kampanya paketini indirerek koru. ' +
              e.message,
          )
        })
    }, 700)
    return () => clearTimeout(timer)
  }, [project, connection.state.owner, notify])
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(''), 6500)
    return () => clearTimeout(t)
  }, [message])
  useEffect(() => {
    const onDM = () => change((p) => ({ ...p, dmStorage: privateDMStorage() }))
    const fact = (e: Event) => {
      const d = (e as CustomEvent<{ label: string; value: string }>).detail
      change((p) => ({
        ...p,
        facts: [
          ...p.facts,
          {
            id: freshId('fact'),
            label: d.label.slice(0, 300),
            value: d.value.slice(0, 3000),
            sceneIds: [],
            questIds: [],
            enabled: true,
          },
        ],
      }))
      notify(
        'Karar özel hatırlatmaya dönüştü. Defter panelinden sonraki sahnelere bağlayabilirsin.',
      )
    }
    if (connection.state.owner) onDM()
    window.addEventListener('studio-dm-change', onDM)
    window.addEventListener('studio-fact', fact)
    return () => {
      window.removeEventListener('studio-dm-change', onDM)
      window.removeEventListener('studio-fact', fact)
    }
  }, [change, connection.state.owner])
  useEffect(() => () => obsClient.current.disconnect(), [])
  useEffect(() => {
    const until = project?.program.studio?.break?.until
    if (!until || !project?.program.intermission) return
    const timer = setTimeout(
      () => {
        if (timerNotified.current !== until) {
          timerNotified.current = until
          notify('Mola süresi tamamlandı. Hazır olduğunda Moladan dön seç.')
        }
      },
      Math.max(0, until - Date.now()),
    )
    return () => clearTimeout(timer)
  }, [
    project?.program.studio?.break?.until,
    project?.program.intermission,
    notify,
  ])
  const draft = useCallback(
    (patch: Partial<BroadcastState>) => {
      change((p) => {
        const now = Date.now()
        if (now - lastUndo.current > 350) {
          undoStack.current = [...undoStack.current, p.draft].slice(-35)
          redoStack.current = []
          lastUndo.current = now
        }
        if (patch.strokes && patch.strokes.length > 500) {
          notify('500 çizim sınırına ulaşıldı.')
          return p
        }
        return {
          ...p,
          imageAssets: patch.customAssets || p.imageAssets,
          draft: {
            ...p.draft,
            ...patch,
            customAssets: patch.customAssets || p.imageAssets,
          },
        }
      })
    },
    [change, notify],
  )
  const extras = (patch: Partial<StudioPublic>) =>
    draft({ studio: { ...current.current!.draft.studio!, ...patch } })
  const live = (patch: Partial<BroadcastState>) =>
    change((p) => {
      const studio = {
        ...(patch.studio || p.program.studio!),
        revision: (p.program.studio?.revision || 0) + 1,
      }
      if (studio.audio) {
        studio.audio = { ...studio.audio }
        for (const c of ['music', 'ambience', 'effect'] as const) {
          const channel = studio.audio[c]
          if (channel && p.audioAssets.some((a) => a.id === channel.id))
            studio.audio[c] = {
              ...channel,
              label:
                c === 'music' ? 'Müzik' : c === 'ambience' ? 'Ortam' : 'Efekt',
            }
        }
      }
      return { ...p, program: { ...p.program, ...patch, studio } }
    })
  function undo() {
    change((p) => {
      const previous = undoStack.current.pop()
      if (!previous) return p
      redoStack.current.push(p.draft)
      return { ...p, draft: previous }
    })
  }
  function redo() {
    change((p) => {
      const next = redoStack.current.pop()
      if (!next) return p
      undoStack.current.push(p.draft)
      return { ...p, draft: next }
    })
  }
  function makePerson(
    asset: BroadcastAsset,
    kind: StudioPerson['kind'] = 'ally',
  ) {
    const source = characters.find((c) => c.id === asset.id),
      c: StudioPerson = {
        id: freshId('person'),
        sourceId: asset.id,
        realName: asset.name,
        knownName: asset.name,
        revealed: true,
        src: asset.src,
        role: source?.role || '',
        city: source?.city || '',
        affiliation: source?.affiliation || '',
        voice: '',
        aim: '',
        relationship: '',
        notes: '',
        kind,
        hp: 10,
        maxHp: 10,
        ac: 10,
      }
    return c
  }
  function addPerson(
    asset: BroadcastAsset,
    kind: StudioPerson['kind'] = 'ally',
  ) {
    const c = makePerson(asset, kind)
    change((p) => ({ ...p, cast: [...p.cast, c] }))
    return c
  }
  function addAsset(
    asset: BroadcastAsset,
    kind: 'portrait' | 'image' | 'background' | 'reveal',
  ) {
    const p = current.current!
    const allowed = [...broadcastAssets, ...p.imageAssets].find(
      (a) => a.id === asset.id,
    )
    if (!allowed) {
      notify('Görsel kütüphanede bulunamadı.')
      return
    }
    asset = allowed
    change((p) => ({
      ...p,
      usedAssets: [
        asset.id,
        ...p.usedAssets.filter((id) => id !== asset.id),
      ].slice(0, 500),
    }))
    if (kind === 'background') {
      draft({
        scene: {
          ...asset,
          name: asset.kind === 'image' ? 'Yeni mekân' : asset.name,
        },
        mode: 'scene',
        sceneZoom: 1,
      })
      return
    }
    if (kind === 'reveal') {
      extras({
        reveal: {
          id: asset.id,
          name: asset.kind === 'image' ? 'Bulunan görsel' : asset.name,
          src: asset.src,
        },
      })
      return
    }
    if (p.draft.actors.length >= 40) {
      notify('Sahnede en fazla 40 katman olabilir.')
      return
    }
    const actor: StageActor = {
      id: freshId('layer'),
      assetId: asset.id,
      name: asset.kind === 'image' ? 'Bulunan görsel' : asset.name,
      src: asset.src,
      kind: kind === 'portrait' ? 'portrait' : 'image',
      x: kind === 'portrait' ? 4 + (p.draft.actors.length % 5) * 15 : 25,
      y: kind === 'portrait' ? 55 : 12,
      w: kind === 'portrait' ? 13 : 50,
      h: kind === 'portrait' ? 38 : 74,
      hidden: false,
      tier: kind === 'portrait' ? powerFor(asset.id) : undefined,
    }
    draft({ actors: [...p.draft.actors, actor] })
  }
  async function upload(files: File[]) {
    const p = current.current!
    if (p.imageAssets.length + files.length > 40) {
      notify('En fazla 40 yerel görsel saklanabilir.')
      return
    }
    const list: BroadcastAsset[] = []
    for (const f of files) {
      try {
        list.push(await imageAsset(f))
      } catch (e) {
        notify((e as Error).message)
      }
    }
    draft({ customAssets: [...current.current!.imageAssets, ...list] })
    if (list.length) notify(`${list.length} görsel kütüphaneye eklendi.`)
  }
  function saveScene() {
    const p = current.current!,
      existing = p.scenes.find((s) => s.id === p.activeScene)
    const state = validateBroadcastState(p.draft)
    if (existing) {
      change((p) => ({
        ...p,
        scenes: p.scenes.map((s) =>
          s.id === existing.id
            ? { ...s, state, covers: p.covers, status: 'prepared' }
            : s,
        ),
      }))
      notify('Sahne kaydı güncellendi.')
    } else {
      const card = sceneCard(state, p.draft.title || 'Yeni sahne', p.covers)
      change((p) => ({
        ...p,
        scenes: [...p.scenes, card],
        activeScene: card.id,
      }))
      notify('Sahne kaydedildi.')
    }
  }
  function loadScene(id: string) {
    const card = current.current!.scenes.find((s) => s.id === id)
    if (!card) return
    const prepared = localStage(card.state, current.current!.mediaVault)
    undoStack.current.push(current.current!.draft)
    change((p) => ({
      ...p,
      draft: {
        ...prepared,
        customAssets: p.imageAssets,
        actors: prepared.actors.map((a) => {
          const c = p.cast.find((c) => c.id === a.id)
          return c
            ? {
                ...a,
                name: c.revealed
                  ? c.realName
                  : c.knownName || 'Bilinmeyen kişi',
              }
            : a
        }),
      },
      covers: card.covers,
      activeScene: id,
      selectedActors: [],
      view: 'preparation',
    }))
    notify('Sahne hazırlığa açıldı. Yayın korunuyor.')
  }
  async function take(): Promise<boolean> {
    if (
      taking.current ||
      !current.current ||
      !connection.state.owner ||
      !connection.state.online
    ) {
      notify('Yayına almak için ana masanın röle bağlantısı gerekli.')
      return false
    }
    taking.current = true
    setBusy(true)
    try {
      const p = current.current
      const startingProgram = p.program, startingEpoch = connection.epoch.current
      const { frame, vault } = await prepareProgram(p)
      const lastDraftHash = await digest(
        JSON.stringify({ ...p.draft, customAssets: [] }),
      )
      frame.blackout = false
      frame.intermission = false
      if (frame.studio?.audio?.effect?.playing)
        frame.studio.audio.effect = {
          ...frame.studio.audio.effect,
          trigger: freshId('sound'),
          at: Date.now(),
        }
      frame.studio = {
        ...frame.studio!,
        revision: (p.program.studio?.revision || 0) + 1,
        takenAt: Date.now(),
        epoch: connection.epoch.current,
        ...(p.combatOnAir
          ? { combat: combatPublic(p.encounter) }
          : { combat: undefined }),
        poll: p.program.studio?.poll,
      }
      if (!ownerRef.current || resetting.current || connection.epoch.current !== startingEpoch || current.current?.program !== startingProgram)
        throw new Error('Hazırlık sırasında canlı kontrolü değişti. Yeniden gözden geçirip göster.')
      const acceptedFrame = await connection.publishProgram({ ...p, program: frame, mediaVault: vault })
      if (!ownerRef.current || resetting.current || connection.epoch.current !== startingEpoch || current.current?.program !== startingProgram)
        throw new Error('Canlı kontrolü veya görüntü değişti. Hazırlık yeniden gösterilmedi; son canlı komut korundu.')
      const card = p.scenes.find((c) => c.id === p.activeScene)
      change((p) => ({
        ...p,
        previous: p.program,
        program: acceptedFrame,
        lastDraftHash,
        mediaVault: vault,
        scenes: p.scenes.map((s) =>
          s.id === p.activeScene ? { ...s, status: 'played' } : s,
        ),
        journal: [
          ...p.journal,
          {
            id: freshId('entry'),
            at: Date.now(),
            kind: 'event' as const,
            text: `Yayına alındı: ${card?.name || p.draft.title}`,
            publicText: '',
            sceneId: p.activeScene,
          },
        ].slice(-1500),
      }))
      if (card?.obsScene && obsConnected)
        try {
          await obsClient.current.request('SetCurrentProgramScene', {
            sceneName: card.obsScene,
          })
        } catch (e) {
          notify('Sahne hazır; OBS geçişi başarısız: ' + (e as Error).message)
        }
      return true
    } catch (e) {
      notify((e as Error).message)
      return false
    } finally {
      taking.current = false
      setBusy(false)
    }
  }
  function prepareDM(cue: DMScene, questId?: string) {
    if (!current.current || !ownerRef.current || resetting.current) {
      notify('Bu sahneyi hazırlamak için yönetimi bu pencereye al.')
      return false
    }
    const p = current.current!,
      background = broadcastAssets.find((a) => a.id === cue.backgroundId)
    if (
      !background ||
      cue.portraitIds.some((id) => !broadcastAssets.some((a) => a.id === id))
    ) {
      notify('Görev görselleri eksik. Güncel siteyi kullan.')
      return false
    }
    const cast = [...p.cast]
    const actors: StageActor[] = cue.portraitIds.map((id, i) => {
      const asset = broadcastAssets.find((a) => a.id === id)!
      let person = cast.find((c) => c.sourceId === id)
      if (!person) {
        person = makePerson(asset)
        person.knownName = cue.publicNames?.[id] || person.realName
        person.revealed = person.knownName === person.realName
        cast.push(person)
      }
      return {
        id: person.id,
        name: person.revealed ? person.realName : person.knownName,
        src: asset.src,
        kind: 'portrait',
        x: 4 + (i % 4) * 16,
        y: cue.portraitIds.length > 4 ? 10 + Math.floor(i / 4) * 44 : 56,
        w: 13,
        h: 38,
        hidden: false,
        tier: powerFor(id),
      }
    })
    draft({
      mode: 'scene',
      title: cue.publicTitle,
      scene: background,
      sceneZoom: 1,
      actors,
      roll: null,
      blackout: false,
      intermission: false,
      studio: { ...p.draft.studio!, reveal: undefined, roll: undefined },
    })
    change((p) => ({
      ...p,
      cast,
      activeScene: 'dm:' + (questId || 'quest') + ':' + cue.id,
      covers: {},
    }))
    notify(
      'Sahne hazırlığa yerleştirildi. Oyunculara göstermek için “Oyunculara göster” düğmesine bas.',
    )
    return true
  }
  function importQuestScenes() {
    const pack = readPrivatePack()
    if (!pack) {
      notify('Önce özel DM paketini aç.')
      return
    }
    const p = current.current!,
      cards: SceneCard[] = [],
      cast = [...p.cast]
    for (const q of pack.quests)
      for (const step of q.steps || []) {
        const background = broadcastAssets.find(
          (a) => a.id === step.backgroundId,
        )
        if (
          !background ||
          step.portraitIds.some(
            (id) => !broadcastAssets.some((a) => a.id === id),
          )
        )
          continue
        const state = {
          ...p.draft,
          mode: 'scene' as const,
          scene: background,
          title: step.publicTitle,
          sceneZoom: 1,
          actors: step.portraitIds.map((id, i) => {
            const a = broadcastAssets.find((a) => a.id === id)!
            let c = cast.find((c) => c.sourceId === id)
            if (!c) {
              c = makePerson(a)
              c.knownName = step.publicNames?.[id] || c.realName
              c.revealed = c.knownName === c.realName
              cast.push(c)
            }
            return {
              id: c.id,
              name: c.revealed ? c.realName : c.knownName,
              src: a.src,
              kind: 'portrait' as const,
              x: 4 + (i % 4) * 16,
              y: step.portraitIds.length > 4 ? 10 + Math.floor(i / 4) * 44 : 56,
              w: 13,
              h: 38,
              hidden: false,
              tier: powerFor(id),
            }
          }),
          studio: { ...p.draft.studio!, roll: undefined, reveal: undefined },
        }
        cards.push({
          ...sceneCard(state, q.title + ' · ' + step.title),
          id: 'dm:' + q.id + ':' + step.id,
          tag: q.title,
          notes: step.summary,
          status: 'new',
        })
      }
    change((p) => ({
      ...p,
      cast,
      scenes: [
        ...p.scenes.filter((s) => !cards.some((c) => c.id === s.id)),
        ...cards,
      ],
    }))
    notify(`${cards.length} görev sahnesi kayıtlı sahnelere eklendi.`)
  }
  async function exportProject() {
    if (!current.current) return
    try {
      await exportCampaign(current.current)
      notify(
        'Özel kampanya paketi indirildi. Gizli verileri içerir; yayın dosyası değildir.',
      )
    } catch (e) {
      notify((e as Error).message)
    }
  }
  async function importFile(file: File) {
    try {
      if (file.size > 180 * 1024 * 1024)
        throw new Error('Paket en fazla 180 MB olabilir.')
      const raw = JSON.parse(await file.text())
      if (raw.version === 1 && raw.mode) {
        const state = validateBroadcastState(raw)
        draft({ ...state, studio: state.studio || defaults() })
        notify('Eski oturum hazırlığa açıldı. Yayına al ile göster.')
        return
      }
      if ([1, 2].includes(raw.version) && Array.isArray(raw.quests)) {
        const pack = parseDMPack(raw)
        localStorage.setItem('aruzahr-director-pack', JSON.stringify(pack))
        localStorage.setItem(
          'aruzahr-director-progress',
          JSON.stringify(
            parseProgress(
              pack.progress || readSavedDMProgress(pack.quests),
              pack.quests,
            ),
          ),
        )
        localStorage.setItem(
          'aruzahr-director-notes',
          pack.quests[0]?.body || '',
        )
        setDMRevision((n) => n + 1)
        change((p) => ({ ...p, dmStorage: privateDMStorage() }))
        setPanel('quests')
        notify('DM paketi açıldı.')
        return
      }
      setImported(await parseCampaign(raw))
    } catch (e) {
      notify((e as Error).message || 'Dosya açılamadı.')
    }
  }
  function importApply(merge: boolean) {
    if (!imported) return
    try {
      const next = merge
        ? validateProject(mergeProjects(current.current!, imported))
        : imported
      restoreDMStorage(next.dmStorage)
      setDMRevision((n) => n + 1)
      change(() => next)
      setImported(null)
      undoStack.current = []
      redoStack.current = []
      notify(
        merge
          ? 'Kampanyaya eklendi. Çakışan kişi/sahne kimlikleri ayrıldı.'
          : 'Kampanya açıldı. Kaydedilmiş yayın görüntüsü geri yüklendi.',
      )
    } catch (e) {
      notify((e as Error).message)
    }
  }
  function perform(action: string, value = '') {
    const p = current.current
    if (!p) return
    if (action.startsWith('scene:')) {
      loadScene(action.slice(6))
      return
    }
    if (action.startsWith('person:')) {
      const a = broadcastAssets.find((a) => a.id === action.slice(7))
      if (a) addAsset(a, 'portrait')
      return
    }
    if (action === 'new-campaign') {
      const next = newProject()
      next.program = p.program
      next.mediaVault = p.mediaVault
      next.audioAssets = p.audioAssets.filter((a) =>
        ['music', 'ambience', 'effect'].some(
          (key) => p.program.studio?.audio?.[key as 'music']?.id === a.id,
        ),
      )
      setImported(next)
      return
    }
    if (action === 'take') {
      void take()
      return
    }
    if (action === 'prepare') {
      loadScene(value)
      return
    }
    if (action === 'break') {
      live({ intermission: !p.program.intermission })
      return
    }
    if (action === 'mute') {
      live({
        studio: {
          ...p.program.studio!,
          audio: {
            ...p.program.studio!.audio!,
            muted: !p.program.studio!.audio?.muted,
          },
        },
      })
      return
    }
    if (action === 'close-map') {
      if (p.draft.mode !== 'map') return
      draft({ mode: 'scene' })
      setTool('pan')
      notify(
        'Harita kapandı. Hazırlıktaki sahneye döndün; canlı görüntü değişmedi.',
      )
      return
    }
    if (action === 'map') {
      setPanel('map')
      draft({ mode: 'map' })
      return
    }
    if (action === 'sound') {
      const sound = p.audioAssets.find((a) => a.id === value)
      if (sound)
        live({
          studio: {
            ...p.program.studio!,
            audio: {
              ...p.program.studio!.audio!,
              effect: {
                id: sound.id,
                label: sound.name,
                volume: 0.35,
                playing: true,
                trigger: freshId('sound'),
                at: Date.now(),
                loop: false,
              },
            },
          },
        })
      return
    }
    if (action === 'roll-d20') {
      const roll = rollExpression('1d20')
      change((p) => ({
        ...p,
        rolls: [{ ...roll, secret: false }, ...p.rolls].slice(0, 200),
        program: {
          ...p.program,
          studio: {
            ...p.program.studio!,
            roll,
            audio: {
              ...p.program.studio!.audio!,
              effect: {
                id: 'builtin-dice',
                label: 'Zar',
                volume: 0.35,
                playing: true,
                loop: false,
                trigger: roll.id,
                at: Date.now(),
              },
            },
          },
        },
      }))
      return
    }
    if (action === 'previous-program') {
      if (p.previous)
        change((p) => ({
          ...p,
          previous: p.program,
          program: {
            ...p.previous!,
            studio: {
              ...p.previous!.studio!,
              takenAt: Date.now(),
              revision: (p.program.studio?.revision || 0) + 1,
            },
          },
        }))
      return
    }
    if (action === 'next' || action === 'previous') {
      if (p.activeScene.startsWith('dm:'))
        window.dispatchEvent(
          new CustomEvent('studio-step', {
            detail: action === 'next' ? 1 : -1,
          }),
        )
      else {
        const index = p.scenes.findIndex((s) => s.id === p.activeScene),
          next = p.scenes[index + (action === 'next' ? 1 : -1)]
        if (next) loadScene(next.id)
        else if (readPrivatePack())
          window.dispatchEvent(
            new CustomEvent('studio-step', {
              detail: action === 'next' ? 1 : -1,
            }),
          )
      }
      return
    }
    if (action === 'undo') {
      undo()
      return
    }
    if (action === 'redo') {
      redo()
      return
    }
    if (action === 'palette') {
      setPalette((v) => !v)
      setQuery('')
      return
    }
    if (action === 'reset') {
      setReset(true)
      setResetWord('')
      return
    }
  }
  commandRef.current = perform
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPalette(false)
        if (!document.querySelector('[role="dialog"]'))
          commandRef.current('close-map')
        return
      }
      if (
        (e.target as HTMLElement)?.matches(
          'input,textarea,select,[contenteditable]',
        )
      )
        return
      const p = current.current
      if (!p) return
      const chord = [
        e.ctrlKey ? 'control' : '',
        e.metaKey ? 'meta' : '',
        e.altKey ? 'alt' : '',
        e.shiftKey ? 'shift' : '',
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join('+')
      for (const [action, binding] of Object.entries(p.shortcuts))
        if (chord === binding.toLowerCase()) {
          e.preventDefault()
          commandRef.current(action)
          break
        }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])
  function mapPoint(x: number, y: number, kind: 'ping' | 'mark') {
    const p = current.current!,
      mark = {
        id: freshId('mark'),
        label: kind === 'ping' ? '' : `Yer işareti ${p.mapMarkers.length + 1}`,
        x,
        y,
        kind: kind === 'ping' ? ('ping' as const) : ('place' as const),
        color,
        expires: kind === 'ping' ? Date.now() + 6000 : 0,
        hidden: kind !== 'ping',
      }
    change((p) => ({
      ...p,
      mapMarkers: [
        ...p.mapMarkers.filter((m) => !m.expires || m.expires > Date.now()),
        mark,
      ].slice(-100),
    }))
    if (kind === 'ping')
      live({
        studio: {
          ...p.program.studio!,
          markers: [
            ...(p.program.studio?.markers || []).filter(
              (m) => !m.expires || m.expires > Date.now(),
            ),
            mark,
          ],
        },
      })
  }
  async function resetAll() {
    if (resetWord !== 'SIFIRLA') return
    resetting.current = true
    setBusy(true)
    try {
      await saveQueue.current.catch(() => {})
      const clean = newBroadcastState()
      clean.studio = {
        ...defaults(),
        epoch: connection.epoch.current,
        revision: Date.now(),
      }
      await connection.request('frame', {
        epoch: connection.epoch.current,
        state: clean,
      })
      await connection.release()
      setProject(null)
      try {
        await fetch('/__aruzahr-voices/reset', {
          method:'POST',
          headers:{'X-Aruzahr-Voice':'1','Content-Type':'application/json'},
          body:'{}',
          signal:AbortSignal.timeout(3000),
        })
      } catch { /* Static/offline installations have no voice cache. */ }
      await clearAruzahrData()
      location.hash = '/broadcast'
      location.reload()
    } catch (e) {
      resetting.current = false
      setBusy(false)
      notify((e as Error).message)
    }
  }
  if (fatal)
    return (
      <main className="studio-error">
        <h1>Kampanya kaydı açılamadı</h1>
        <p>{fatal}</p>
        <p>
          Mevcut kayıt otomatik olarak silinmedi. Sayfayı yeniden açmayı veya
          klasik masadaki yedeğini kullanmayı deneyebilirsin.
        </p>
        <a href="#/broadcast/classic">Klasik masa</a>
      </main>
    )
  if (!project)
    return (
      <div className="broadcast-loading">Yönetmen masası hazırlanıyor…</div>
    )
  const p = project,
    dirty = draftHash !== p.lastDraftHash,
    activeCard = p.scenes.find((s) => s.id === p.activeScene),
    assetList = [...broadcastAssets, ...p.imageAssets],
    sceneMatches = p.scenes.filter((s) =>
      `${s.name} ${s.tag}`
        .toLocaleLowerCase('tr')
        .includes(sceneQuery.toLocaleLowerCase('tr')),
    ),
    commands = [
      ...Object.entries({
        take: 'Hazırlığı yayına al',
        break: 'Ara ver / devam et',
        mute: 'Tüm sesleri sustur / aç',
        map: 'Haritayı hazırlığa aç',
        'roll-d20': 'd20 at',
        next: 'Sonraki adımı hazırla',
        previous: 'Önceki adımı hazırla',
        undo: 'Son düzenlemeyi geri al',
        redo: 'Düzenlemeyi yinele',
      }).map(([id, name]) => ({ id, name })),
      ...p.scenes.map((s) => ({
        id: 'scene:' + s.id,
        name: 'Sahne: ' + s.name,
      })),
      ...broadcastAssets
        .filter((a) => a.kind === 'portrait')
        .map((a) => ({ id: 'person:' + a.id, name: 'Portre: ' + a.name })),
    ]
      .filter((c) =>
        c.name.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')),
      )
      .slice(0, 45)
  const actions: StudioActions = {
    p,
    change,
    draft,
    extras,
    live,
    notify,
    take: async () => { await take() },
    saveScene,
    loadScene,
    addAsset,
    addPerson,
    upload,
    request: connection.request,
    setPanel,
    perform,
    undo,
    redo,
    exportProject,
    importFile,
    connection: connection.state,
    release: connection.release,
    obs: {
      connected: obsConnected,
      status: obsStatus,
      scenes: obsScenes,
      connect: async (url, password) => {
        obsClient.current.onStatus = (text) => {
          setObsStatus(text)
          if (text.includes('kapalı')) setObsConnected(false)
        }
        try {
          await obsClient.current.connect(url, password)
          const result = await obsClient.current.request('GetSceneList')
          setObsScenes(result.scenes.map((s: any) => s.sceneName))
          setObsConnected(true)
        } catch (e) {
          setObsStatus((e as Error).message)
          setObsConnected(false)
          throw e
        }
      },
      disconnect: () => {
        obsClient.current.disconnect()
        setObsConnected(false)
        setObsStatus('Bağlı değil')
      },
    },
  }
  return (
    <StudioContext.Provider value={actions}>
      <main
        className={`studio-workspace unified-dm view-${p.view} ${['quests','combat','finder'].includes(panel) ? 'reading-quests' : ''}`}
        data-testid="studio-workspace"
        style={
          {
            '--studio-left': p.leftWidth + 'px',
            '--studio-right': p.rightWidth + 'px',
          } as React.CSSProperties
        }
      >
        <header className="studio-header">
          <a
            href="#/atlas"
            onClick={() => void connection.release()}
            aria-label="Atlasa dön"
          >
            <ArrowLeft size={18} />
          </a>
          <div className="studio-logo">
            ARUZAHR
            <small>
              YÖNETMEN MASASI
            </small>
          </div>
          <div className="studio-project-name">
            <input
              aria-label="Kampanya adı"
              value={p.name}
              disabled={!connection.state.owner}
              onChange={(e) => change((p) => ({ ...p, name: e.target.value }))}
            />
            <input
              aria-label="Oturum adı"
              value={p.sessionName}
              disabled={!connection.state.owner}
              onChange={(e) =>
                change((p) => ({ ...p, sessionName: e.target.value }))
              }
            />
          </div>
          <span
            className={`studio-connection ${connection.state.online ? 'online' : ''}`}
          >
            <i />
            {connection.state.error ||
              (connection.state.online
                ? 'Yayın rölesi bağlı'
                : 'Yayın rölesi bekleniyor')}
          </span>
          <small className="studio-save">{saved}</small>
          <a href="#/broadcast/screens" target="_blank" rel="noopener" className="studio-output-link" title="Açılış ve kapanış tablolarını önizle, MP4 indir">Yayın ekranları ↗</a>
          <button onClick={() => setPalette(true)}>
            <Search size={16} />
            <span>Komutlar</span>
            <kbd>Ctrl K</kbd>
          </button>
          <button onClick={exportProject} title="Özel kampanya paketini indir">
            <Save size={17} />
          </button>
          <a
            className="studio-output-link"
            href="#/broadcast/live"
            target="_blank"
            rel="noopener"
          >
            <MonitorPlay size={16} />
            Yayın ekranı ↗
          </a>
        </header>
              <nav className="studio-panel-tabs studio-global-tabs" aria-label="Studio araçları">
                {panels.map(([id, label, Icon]) => (
                  <button
                    key={id}
                    aria-pressed={panel === id}
                    onClick={() => setPanel(id)}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
        {!connection.state.owner && (
          <div className="studio-owner-banner">
            <strong>
              {connection.state.error || 'Yönetim bağlantısı hazırlanıyor.'}
            </strong>
            <span>
              Diğer penceredeki düzenlemeleri korumak için bu masa kilitli.
            </span>
            <button
              onClick={async () => {
                try {
                  const latest = await loadProject()
                  if (latest) setProject(latest)
                } catch {}
                connection.takeover()
              }}
            >
              Kontrolü bu pencereye al
            </button>
            <button onClick={exportProject}>Bu kaydın yedeğini indir</button>
          </div>
        )}
          <div
            className="studio-main-grid"
            inert={!connection.state.owner || resetting.current || busy}
          >
            <aside className="studio-scenes">
              <div className="studio-rail-heading">
                <span className="studio-eyebrow">OTURUM AKIŞI</span>
                <h2>
                  Sahneler <small>{p.scenes.length}</small>
                </h2>
                <button
                  aria-label="Yeni sahne oluştur"
                  onClick={() => {
                    const clean = {
                      ...newBroadcastState(),
                      customAssets: p.imageAssets,
                      studio: defaults(),
                    }
                    const card = sceneCard(clean, 'Yeni sahne')
                    change((p) => ({
                      ...p,
                      scenes: [...p.scenes, card],
                      draft: clean,
                      activeScene: card.id,
                      covers: {},
                    }))
                  }}
                >
                  <Plus size={17} />
                </button>
              </div>
              <input
                className="studio-scene-search"
                aria-label="Kayıtlı sahnelerde ara"
                placeholder="Bölüm veya sahne ara…"
                value={sceneQuery}
                onChange={(e) => setSceneQuery(e.target.value)}
              />
              <div className="studio-scene-list">
                {!p.scenes.length && (
                  <div className="studio-empty-scenes">
                    <Clapperboard size={32} />
                    <strong>İlk sahneni kaydet</strong>
                    <p>
                      Bir arka plan ve kişiler seç. Düzeni kaydet; sonra tek
                      tıklamayla hazırlığa al.
                    </p>
                    <button onClick={saveScene}>Bu hazırlığı kaydet</button>
                    <button onClick={importQuestScenes}>
                      DM paketinden sahneleri al
                    </button>
                  </div>
                )}
                {sceneMatches.map((s, i) => (
                  <article
                    className={`studio-scene-card ${p.activeScene === s.id ? 'selected' : ''}`}
                    key={s.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData('text/x-studio-scene', s.id)
                    }
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const id = e.dataTransfer.getData('text/x-studio-scene')
                      change((p) => {
                        const source = p.scenes.find((s) => s.id === id)
                        if (!source || id === s.id) return p
                        const list = p.scenes.filter((s) => s.id !== id)
                        list.splice(
                          list.findIndex((c) => c.id === s.id),
                          0,
                          source,
                        )
                        return { ...p, scenes: list }
                      })
                    }}
                  >
                    <button
                      className="studio-scene-open"
                      onClick={() => loadScene(s.id)}
                    >
                      <div className="studio-scene-thumb">
                        <img
                          src={localImage(s.state.scene.src, p.mediaVault)}
                          alt=""
                          loading="lazy"
                        />
                        <span>
                          {s.status === 'played'
                            ? 'OYNANDI'
                            : s.status === 'skipped'
                              ? 'ATLANDI'
                              : s.status === 'prepared'
                                ? 'HAZIR'
                                : 'YENİ'}
                        </span>
                      </div>
                      <small>{s.tag || 'OTURUM SAHNESİ'}</small>
                      <strong>{s.name}</strong>
                    </button>
                    <div className="studio-scene-actions">
                      <button
                        aria-label={`${s.name} önceye taşı`}
                        onClick={() =>
                          change((p) => {
                            const rows = [...p.scenes],
                              j = rows.findIndex((c) => c.id === s.id)
                            if (j > 0)
                              [rows[j - 1], rows[j]] = [rows[j], rows[j - 1]]
                            return { ...p, scenes: rows }
                          })
                        }
                      >
                        ↑
                      </button>
                      <button
                        aria-label={`${s.name} sonraya taşı`}
                        onClick={() =>
                          change((p) => {
                            const rows = [...p.scenes],
                              j = rows.findIndex((c) => c.id === s.id)
                            if (j < rows.length - 1)
                              [rows[j + 1], rows[j]] = [rows[j], rows[j + 1]]
                            return { ...p, scenes: rows }
                          })
                        }
                      >
                        ↓
                      </button>
                      <button
                        aria-label={`${s.name} favori`}
                        onClick={() =>
                          change((p) => ({
                            ...p,
                            scenes: p.scenes.map((c) =>
                              c.id === s.id
                                ? { ...c, favorite: !c.favorite }
                                : c,
                            ),
                          }))
                        }
                      >
                        {s.favorite ? '★' : '☆'}
                      </button>
                      <button
                        aria-label={`${s.name} çoğalt`}
                        onClick={() =>
                          change((p) => ({
                            ...p,
                            scenes: [
                              ...p.scenes,
                              {
                                ...s,
                                id: freshId('scene'),
                                name: s.name + ' · kopya',
                                status: 'new',
                              },
                            ],
                          }))
                        }
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        aria-label={`${s.name} atla`}
                        onClick={() =>
                          change((p) => ({
                            ...p,
                            scenes: p.scenes.map((c) =>
                              c.id === s.id
                                ? {
                                    ...c,
                                    status:
                                      c.status === 'skipped'
                                        ? 'new'
                                        : 'skipped',
                                  }
                                : c,
                            ),
                          }))
                        }
                      >
                        ↷
                      </button>
                      <button
                        aria-label={`${s.name} sil`}
                        onClick={() =>
                          change((p) => ({
                            ...p,
                            trash: [s, ...p.trash].slice(0, 30),
                            scenes: p.scenes.filter((c) => c.id !== s.id),
                          }))
                        }
                      >
                        <Trash2 size={12} />
                      </button>
                      <button
                        aria-label={`${s.name} sabitle`}
                        onClick={() =>
                          change((p) => ({
                            ...p,
                            quick: [
                              ...new Set([...p.quick, 'scene:' + s.id]),
                            ].slice(-24),
                          }))
                        }
                      >
                        ＋
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="studio-rail-footer">
                <button onClick={importQuestScenes}>
                  <BookOpen size={14} />
                  Görev sahnelerini içe al
                </button>
                <button
                  onClick={() => {
                    setShowQuick((v) => !v)
                  }}
                >
                  <Sparkles size={14} />
                  Hızlı yayın paneli
                </button>
                <details>
                  <summary>Silinen sahneler · {p.trash.length}</summary>
                  {p.trash.map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        change((p) => ({
                          ...p,
                          scenes: [...p.scenes, s],
                          trash: p.trash.filter((c) => c.id !== s.id),
                        }))
                      }
                    >
                      {s.name} · geri al
                    </button>
                  ))}
                </details>

              </div>
            </aside>
            <div
              className="studio-resizer left"
              role="separator"
              aria-label="Sol panel genişliği"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
                  change((p) => ({
                    ...p,
                    leftWidth: clamp(
                      p.leftWidth + (e.key === 'ArrowRight' ? 10 : -10),
                      200,
                      400,
                    ),
                  }))
              }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  change((p) => ({
                    ...p,
                    leftWidth: clamp(e.clientX, 200, 400),
                  }))
              }}
            />
            <section className="studio-center">
              <div className="studio-main-actions">
                <div className="studio-view-switch">
                  {[
                    ['narration', 'Anlatım'],
                    ['combat', 'Savaş'],
                    ['preparation', 'Hazırlık'],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      aria-pressed={p.view === id}
                      onClick={() => {
                        change((p) => ({ ...p, view: id as typeof p.view }))
                        setPanel(
                          id === 'combat'
                            ? 'combat'
                            : id === 'preparation'
                              ? 'scene'
                              : 'quests',
                        )
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <select
                  aria-label="Sahne geçişi"
                  value={p.draft.studio!.transition}
                  onChange={(e) =>
                    extras({
                      transition: e.target.value as StudioPublic['transition'],
                    })
                  }
                >
                  <option value="cut">Kesme</option>
                  <option value="fade">Yumuşak geçiş</option>
                  <option value="dip">Kararıp açılma</option>
                </select>
                <button
                  className="studio-take"
                  data-testid="studio-take"
                  disabled={busy || !connection.state.online}
                  onClick={() => void take()}
                >
                  <Radio size={17} />
                  {busy ? 'Hazırlanıyor…' : 'Yayına al'}
                </button>
              </div>
              {panel === 'finder' ? (
                <div className="studio-wide-tool" data-testid="studio-directory-wide"><StudioDirectory /></div>
              ) : panel === 'combat' ? (
                <div className="studio-wide-tool" data-testid="studio-combat-wide"><CombatPanel /></div>
              ) : panel === 'quests' ? (
                <div className="studio-dm-reader" data-testid="studio-dm-reader">
                  {campaignReady ? (
                    <BroadcastQuestDirector
                      key={dmRevision}
                      disabled={!connection.state.owner || busy || !connection.state.online}
                      activeScene={p.activeScene}
                      onPrepare={prepareDM}
                      onReveal={() => void take()}
                      onShow={async (cue, questId) => {
                        if (taking.current || !connection.state.owner || !connection.state.online || !prepareDM(cue, questId)) return null
                        const old = storyFrameKey(current.current!.program)
                        if (!await take()) return null
                        const key = storyFrameKey(current.current!.program)
                        return old === key ? null : key
                      }}
                      onMap={(id) => {
                        const city = locationById(id)
                        if (city?.point) {
                          draft({mode:'map',camera:{x:city.point[0],y:city.point[1],zoom:6}})
                          setPanel('map')
                          notify('Konum hazırlık haritasında. Yayına al demeden oyuncuların görüntüsü değişmez.')
                        }
                      }}
                      onMessage={notify}
                      facts={p.facts}
                      studioMode
                    />
                  ) : <p>Hikâye kitabı açılıyor…</p>}
                </div>
              ) : (
                <>
              <div className="studio-preview-heading">
                <span>
                  <i />
                  HAZIRLIK
                </span>
                <strong>{activeCard?.name || p.draft.title}</strong>
                <small>
                  {dirty ? 'Değişiklikler henüz yayında değil' : 'Kayıt hazır'}
                </small>
              </div>
              <div className="studio-preview" data-testid="studio-preview">
                <BroadcastStage
                  state={p.draft}
                  tool={tool}
                  color={color}
                  width={brush}
                  onChange={draft}
                  selectedIds={p.selectedActors}
                  onSelect={(id, multi) =>
                    change((p) => ({
                      ...p,
                      selectedActors: multi
                        ? p.selectedActors.includes(id)
                          ? p.selectedActors.filter((a) => a !== id)
                          : [...p.selectedActors, id]
                        : p.selectedActors.includes(id)
                          ? p.selectedActors
                          : [id],
                    }))
                  }
                  covers={p.covers}
                  markers={p.mapMarkers}
                  onMapPoint={mapPoint}
                  onAssetDrop={(asset, x, y) => {
                    if (p.draft.mode === 'map') {
                      const c = addPerson(asset, 'ally')
                      draft({
                        tokens: [
                          ...current.current!.draft.tokens,
                          {
                            id: c.id,
                            name: c.knownName,
                            src: c.src,
                            x,
                            y,
                            kind: c.kind,
                            size: 48,
                          },
                        ],
                      })
                    } else
                      addAsset(
                        asset,
                        asset.kind === 'scene'
                          ? 'background'
                          : asset.kind === 'portrait'
                            ? 'portrait'
                            : 'image',
                      )
                  }}
                />
              </div>
              <div className="studio-tools">
                <div className="studio-mode-toggle">
                  <button
                    aria-pressed={p.draft.mode === 'map'}
                    onClick={() => draft({ mode: 'map' })}
                  >
                    <MapIcon size={15} />
                    Harita
                  </button>
                  <button
                    aria-pressed={p.draft.mode === 'scene'}
                    onClick={() => draft({ mode: 'scene' })}
                  >
                    <ImageIcon size={15} />
                    Sahne
                  </button>
                </div>
                {p.draft.mode === 'map' && (
                  <button onClick={() => perform('close-map')}>
                    Haritayı kapat · Esc
                  </button>
                )}
                {(
                  ['pan', 'pen', 'arrow', 'erase', 'ping', 'mark'] as const
                ).map((id, i) => (
                  <button
                    key={id}
                    aria-label={
                      [
                        'Haritayı taşı',
                        'Kalem',
                        'Ok çiz',
                        'Silgi',
                        'Canlı dikkat halkası',
                        'Yer işareti',
                      ][i]
                    }
                    disabled={p.draft.mode !== 'map'}
                    aria-pressed={tool === id}
                    onClick={() => setTool(id)}
                  >
                    {['↔', '✎', '↗', '⌫', '◎', '⚑'][i]}
                  </button>
                ))}
                <input
                  type="color"
                  aria-label="Çizim rengi"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <input
                  type="range"
                  aria-label="Çizgi kalınlığı"
                  min="2"
                  max="40"
                  value={brush}
                  onChange={(e) => setBrush(+e.target.value)}
                />
                <button onClick={undo} title="Son düzenlemeyi geri al">
                  <RotateCcw size={15} />
                </button>
                <button onClick={saveScene}>
                  <Save size={15} />
                  Sahneyi kaydet
                </button>
                <button
                  onClick={() =>
                    draft({ studio: { ...p.draft.studio!, reveal: undefined } })
                  }
                >
                  Görseli kapat
                </button>
              </div>
              <div className="studio-program-strip">
                <div className="studio-live-preview">
                  <BroadcastStage
                    state={localStage(p.program, p.mediaVault)}
                    readOnly
                  />
                </div>
                <div>
                  <span className="studio-eyebrow live">
                    {connection.state.error
                      ? 'GÖNDERİMİ KONTROL ET'
                      : p.program.studio!.takenAt > connection.state.ack
                        ? 'YAYINA GÖNDERİLİYOR'
                        : 'YAYINDA'}
                  </span>
                  <h3 data-testid="studio-program-title">{p.program.title}</h3>
                  <p>
                    {p.program.intermission
                      ? 'Ara ekranı açık'
                      : p.program.mode === 'map'
                        ? 'İzleyici haritayı görüyor'
                        : 'İzleyici sahneyi görüyor'}
                  </p>
                  <div className="st-two">
                    <button onClick={() => perform('break')}>
                      <Pause size={14} />
                      {p.program.intermission ? 'Moladan dön' : 'Acil ara'}
                    </button>
                    <button onClick={() => perform('mute')}>
                      {p.program.studio?.audio?.muted ? (
                        <VolumeX size={14} />
                      ) : (
                        <Volume2 size={14} />
                      )}
                      Sessiz / sesli
                    </button>
                  </div>
                  <div className="st-two">
                    <button
                      disabled={!p.previous}
                      onClick={() => perform('previous-program')}
                    >
                      Önceki yayın
                    </button>
                    <button
                      onClick={() => {
                        draft({
                          ...localStage(p.program, p.mediaVault),
                          studio: { ...p.program.studio!, reveal: undefined },
                        })
                        notify('Canlı görüntü hazırlığa kopyalandı.')
                      }}
                    >
                      Yayını hazırlığa kopyala
                    </button>
                    <button
                      onClick={() => {
                        draft(localStage(p.program, p.mediaVault))
                        change((p) => ({ ...p, covers: {} }))
                      }}
                    >
                      Hazırlığı iptal et
                    </button>
                  </div>
                </div>
              </div>
              {p.facts
                .filter(
                  (f) =>
                    f.enabled &&
                    (f.sceneIds.includes(p.activeScene) ||
                      (!f.sceneIds.length && !f.questIds.length)),
                )
                .map((f) => (
                  <div className="studio-fact" key={f.id}>
                    <BookOpen size={16} />
                    <div>
                      <strong>{f.label}</strong>
                      <p>{f.value}</p>
                    </div>
                    <small>Yalnız DM</small>
                  </div>
                ))}
              {showQuick && (
                <div className="studio-quick-grid">
                  {p.quick.map((id) => (
                    <button key={id} onClick={() => perform(id)}>
                      {id.startsWith('scene:')
                        ? p.scenes.find((s) => s.id === id.slice(6))?.name ||
                          'Sahne'
                        : (
                            {
                              take: 'Yayına al',
                              break: 'Ara / devam',
                              mute: 'Sessiz / sesli',
                              map: 'Haritayı hazırla',
                              'roll-d20': 'd20 at',
                              next: 'Sonraki adım',
                              previous: 'Önceki adım',
                            } as Record<string, string>
                          )[id] || id}
                    </button>
                  ))}
                </div>
              )}
              <details className="studio-help">
                <summary>İlk kullanım</summary>
                <ol>
                  <li>
                    Görsel ve kişileri hazırlıkta düzenle. Sahneyi kaydet.
                  </li>
                  <li>Yayına al düğmesiyle canlı görüntüyü değiştir.</li>
                  <li>
                    Görev paketini aç; sahneleri soldaki akışa aktarabilirsin.
                  </li>
                  <li>
                    Ses kaynağını ve OBS ölçülerini Yayın panelinden ayarla.
                  </li>
                  <li>
                    Özel kampanya yedeği; görev, görsel, ses, karar ve
                    ilerlemeyi birlikte taşır.
                  </li>
                </ol>
              </details>
                </>
              )}
            </section>
            <div
              className="studio-resizer right"
              role="separator"
              aria-label="Sağ panel genişliği"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
                  change((p) => ({
                    ...p,
                    rightWidth: clamp(
                      p.rightWidth + (e.key === 'ArrowLeft' ? 10 : -10),
                      320,
                      650,
                    ),
                  }))
              }}
              onPointerDown={(e) =>
                e.currentTarget.setPointerCapture(e.pointerId)
              }
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  change((p) => ({
                    ...p,
                    rightWidth: clamp(innerWidth - e.clientX, 320, 650),
                  }))
              }}
            />
            <aside className="studio-inspector">
              <div className="studio-panel-body">
                {panels.map(([id]) => (
                  <section
                    key={id}
                    className={`studio-panel panel-${id}`}
                    hidden={panel !== id}
                  >
                    <div className="studio-tool-explanation"><strong>{panelHelp[id].title}</strong><p>{panelHelp[id].text}</p></div>
                    {id === 'quests' || id === 'combat' || id === 'finder' ? (
                      panel === id ? <DMPreparation
                        draft={localStage(p.draft, p.mediaVault)}
                        program={localStage(p.program, p.mediaVault)}
                        busy={busy}
                        onTake={() => void take()}
                        onEdit={() => setPanel('scene')}
                        onBreak={() => perform('break')}
                        onRoll={() => perform('roll-d20')}
                      /> : null
                    ) : id === 'scene' ? (
                      <ScenePanel />
                    ) : id === 'library' ? (
                      <LibraryPanel />
                    ) : id === 'people' ? (
                      <PeoplePanel />
                    ) : id === 'map' ? (
                      <MapPanel />
                    ) : id === 'dice' ? (
                      <DicePanel />
                    ) : id === 'sound' ? (
                      <SoundPanel />
                    ) : id === 'journal' ? (
                      <JournalPanel />
                    ) : (
                      <BroadcastPanel />
                    )}
                  </section>
                ))}
              </div>
            </aside>
          </div>
        <StudioAudio
          state={p.program}
          role="operator"
          assets={p.audioAssets}
          enabled={connection.state.owner}
        />
        {palette && (
          <div className="studio-modal-backdrop">
            <section
              className="studio-command-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Komut menüsü"
            >
              <header>
                <Search size={20} />
                <input
                  autoFocus
                  aria-label="Komut ara"
                  placeholder="Sahne, portre veya komut ara…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={() => setPalette(false)}>
                  <X size={18} />
                </button>
              </header>
              <div>
                {commands.map((c) => (
                  <div key={c.id}>
                    <button
                      onClick={() => {
                        perform(c.id)
                        setPalette(false)
                      }}
                    >
                      {c.name}
                    </button>
                    <button
                      title="Hızlı panele sabitle"
                      onClick={() =>
                        change((p) => ({
                          ...p,
                          quick: [...new Set([...p.quick, c.id])].slice(-24),
                        }))
                      }
                    >
                      ＋
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
        {imported && (
          <div className="studio-modal-backdrop">
            <section
              className="studio-import-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Kampanya içe aktarma"
            >
              <h2>Kampanya dosyası hazır</h2>
              <strong>{imported.name}</strong>
              <p>{packageSummary(imported)}</p>
              <p>
                {imported.dmStorage['aruzahr-director-pack']
                  ? 'Özel DM paketi ve ilerleme içeriyor.'
                  : 'Özel DM paketi bulunmuyor.'}
              </p>
              <p>
                {
                  imported.scenes.filter((s) =>
                    p.scenes.some((c) => c.name === s.name),
                  ).length
                }{' '}
                sahne adı ve{' '}
                {
                  imported.cast.filter((s) =>
                    p.cast.some((c) => c.realName === s.realName),
                  ).length
                }{' '}
                kişi adı mevcut kayıtla aynı.
              </p>
              <button onClick={exportProject}>
                Önce mevcut kampanyayı yedekle
              </button>
              <p>
                Birleştirme; sahneleri, kişileri, görselleri, sesleri ve özel
                notları ekler. Mevcut canlı sahne ve aktif savaş korunur. Tam
                savaş/ilerleme durumunu geri getirmek için değiştir seç.
              </p>
              <button onClick={() => importApply(true)}>
                Mevcut kampanyaya ekle
              </button>
              <button onClick={() => importApply(false)}>
                Bu kampanyayla değiştir
              </button>
              <button onClick={() => setImported(null)}>Vazgeç</button>
            </section>
          </div>
        )}
        {reset && (
          <div className="studio-modal-backdrop">
            <section
              className="studio-import-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Tüm verileri sıfırla"
            >
              <h2>Bu cihazdaki tüm Aruzahr kayıtları silinsin mi?</h2>
              <p>
                Kampanya, sahneler, yerel portre ve sesler, DM notları,
                kararlar, kitap işaretleri ve tercihler silinir. Kaynak lore ve
                site çizimleri korunur.
              </p>
              <button onClick={exportProject}>
                Önce özel kampanya yedeğini indir
              </button>
              <button onClick={downloadPrivateNotes}>
                DM defterini ayrıca indir
              </button>
              <label>
                SIFIRLA yaz
                <input
                  aria-label="Tüm verileri sıfırlama onayı"
                  value={resetWord}
                  onChange={(e) => setResetWord(e.target.value)}
                />
              </label>
              <button
                disabled={resetWord !== 'SIFIRLA' || busy}
                onClick={() => void resetAll()}
              >
                Her şeyi sıfırla
              </button>
              <button disabled={busy} onClick={() => setReset(false)}>
                Vazgeç
              </button>
            </section>
          </div>
        )}
        {message && (
          <div className="studio-toast" role="status">
            {message}
          </div>
        )}
      </main>
    </StudioContext.Provider>
  )
}
