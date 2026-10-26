import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  MapPin,
  Maximize2,
  Pause,
  Play,
  X,
} from 'lucide-react'
import { broadcastAssets } from '../BroadcastLibrary'
import {
  readPrivatePack,
  readSavedDMProgress,
  type DMPack,
  type DMProgress,
  type DMQuest,
  type DMScene,
} from '../dm-guide'
import './story-flow.css'
import DMPlayCard from '../DMPlayCard'
import JourneyCompanion from './JourneyCompanion'

const read = (key: string) => {
  try {
    return localStorage.getItem(key) || ''
  } catch {
    return ''
  }
}
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
const short = (value: string) =>
  value
    .split(/(?<=[.!?])\s/)
    .slice(0, 2)
    .join(' ')
const assetFor = (id: string) => broadcastAssets.find((a) => a.id === id)
const cueIdentity = (questId: string, scene: DMScene, showPeople = true) =>
  JSON.stringify([
    questId,
    scene.id,
    scene.publicTitle,
    scene.backgroundId,
    showPeople ? scene.portraitIds : [],
  ])
function openingCue(q: DMQuest): DMScene | undefined {
  const first = q.steps?.[0],
    b = q.briefing
  if (!first || !b) return first
  return {
    id: q.id + '-giris',
    title: 'Bölüm girişi',
    summary: b.arrival,
    readAloud: b.opening,
    backgroundId: b.backgroundId || first.backgroundId,
    portraitIds: b.portraitIds || first.portraitIds,
    publicNames: first.publicNames,
    publicTitle: b.publicTitle || first.publicTitle,
    actions: [],
    checks: [],
    choices: [],
    quick: q.quick ? { ...q.quick, next: b.transition } : undefined,
  }
}
export default function StoryFlow({
  onPrepare,
  onShow,
  onMessage,
  onMap,
  preview,
  liveTitle,
  liveKey,
  busy,
  connected,
  acknowledged,
  onBreak,
  onRoll,
  intermission,
  onAdvanced,
}: {
  onPrepare: (scene: DMScene, questId: string) => boolean
  onShow: (scene: DMScene, questId: string) => Promise<string | null>
  onMessage: (text: string) => void
  onMap: (id: string) => void
  preview: ReactNode
  liveTitle: string
  liveKey: string
  busy: boolean
  connected: boolean
  acknowledged: boolean
  intermission: boolean
  onBreak: () => void
  onRoll: () => void
  onAdvanced: () => void
}) {
  const [pack, setPack] = useState<DMPack | null>(readPrivatePack)
  const [progress, setProgress] = useState<DMProgress>(() =>
    readSavedDMProgress(readPrivatePack()?.quests || []),
  )
  const [opening, setOpening] = useState(() => {
    const p = readSavedDMProgress(readPrivatePack()?.quests || [])
    const key = read('aruzahr-story-opening')
    return key
      ? key === p.quest
      : !read('aruzahr-story-seen') &&
          !p.done.length &&
          !Object.values(p.steps).some((v) => v > 0) &&
          !Object.values(p.decisions).some(Boolean)
  })
  const [prepared, setPrepared] = useState('')
  const [lastShown, setLastShown] = useState<{
    id: string
    key: string
  } | null>(() => {
    try {
      return JSON.parse(read('aruzahr-story-live') || 'null')
    } catch {
      return null
    }
  })
  const [enlarged, setEnlarged] = useState(false)
  const [search, setSearch] = useState('')
  const [mediaSearch, setMediaSearch] = useState('')
  const [showPeople, setShowPeople] = useState(true)
  const scroll = useRef<HTMLElement>(null)
  const focusBeforeModal = useRef<HTMLElement | null>(null)
  const quest =
    pack?.quests.find((q) => q.id === progress.quest) || pack?.quests[0]
  const questIndex = pack?.quests.findIndex((q) => q.id === quest?.id) || 0
  const index = quest ? progress.steps[quest.id] || 0 : 0
  const step = opening && quest ? openingCue(quest) : quest?.steps?.[index]
  useEffect(() => {
    scroll.current
      ?.querySelector(
        '[aria-label="Bu bölümün adımları"] [aria-current="step"]',
      )
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [quest?.id, index, opening])
  const background = step && assetFor(step.backgroundId)
  const people =
    step?.portraitIds.map((id) => assetFor(id)).filter(Boolean) || []
  const cueId = quest && step ? cueIdentity(quest.id, step, showPeople) : ''
  const quick = step?.quick || quest?.quick
  const nextLabel = opening
    ? quest?.steps?.[0]?.title
    : quest?.steps?.[index + 1]?.title || pack?.quests[questIndex + 1]?.title
  const onAir =
    !!lastShown &&
    lastShown.id === cueId &&
    lastShown.key === liveKey &&
    connected &&
    acknowledged &&
    !intermission
  const sending =
    !!lastShown &&
    lastShown.id === cueId &&
    lastShown.key === liveKey &&
    connected &&
    !acknowledged &&
    !intermission
  const positionRef = useRef({
    quest,
    questIndex,
    index,
    opening,
    pack,
    progress,
  })
  positionRef.current = { quest, questIndex, index, opening, pack, progress }
  useEffect(() => {
    const reload = () => {
      const next = readPrivatePack(),
        p = readSavedDMProgress(next?.quests || [])
      setPack((old) => (same(old, next) ? old : next))
      setProgress((old) => (same(old, p) ? old : p))
    }
    window.addEventListener('studio-dm-change', reload)
    return () => window.removeEventListener('studio-dm-change', reload)
  }, [])
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnlarged(false)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [])
  useEffect(() => {
    if (!enlarged) return
    focusBeforeModal.current = document.activeElement as HTMLElement
    requestAnimationFrame(() =>
      document.querySelector<HTMLButtonElement>('.story-art-close')?.focus(),
    )
    const trap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        document.querySelector<HTMLButtonElement>('.story-art-close')?.focus()
      }
    }
    window.addEventListener('keydown', trap, true)
    return () => {
      window.removeEventListener('keydown', trap, true)
      focusBeforeModal.current?.focus()
    }
  }, [enlarged])
  function saveProgress(next: DMProgress) {
    setProgress(next)
    try {
      localStorage.setItem('aruzahr-director-progress', JSON.stringify(next))
      window.dispatchEvent(new Event('studio-dm-change'))
    } catch {
      onMessage('İlerleme kaydedilemedi; gelişmiş masadan yedek alabilirsin.')
    }
  }
  function go(qi: number, stage: number) {
    const p = positionRef.current,
      q = p.pack?.quests[qi]
    if (!q) return
    const isOpening = stage < 0 && !!q.briefing
    const bounded = Math.max(0, Math.min((q.steps?.length || 1) - 1, stage))
    setOpening(isOpening)
    setPrepared('')
    setShowPeople(true)
    setMediaSearch('')
    try {
      localStorage.setItem('aruzahr-story-opening', isOpening ? q.id : '-')
      localStorage.setItem('aruzahr-story-seen', '1')
    } catch {}
    saveProgress({
      ...p.progress,
      quest: q.id,
      steps: { ...p.progress.steps, ...(isOpening ? {} : { [q.id]: bounded }) },
    })
    scroll.current?.scrollTo({ top: 0, behavior: 'instant' })
    const cue = isOpening ? openingCue(q) : q.steps?.[bounded]
    return cue ? { cue, questId: q.id } : undefined
  }
  function move(delta: number) {
    const p = positionRef.current
    if (!p.quest || !p.pack) return
    if (delta > 0) {
      if (p.opening) return go(p.questIndex, 0)
      else if (p.index < (p.quest.steps?.length || 1) - 1)
        return go(p.questIndex, p.index + 1)
      else if (p.questIndex < p.pack.quests.length - 1)
        return go(p.questIndex + 1, -1)
    } else if (!p.opening && p.index > 0) return go(p.questIndex, p.index - 1)
    else if (!p.opening && p.quest.briefing) return go(p.questIndex, -1)
    else if (p.questIndex > 0)
      return go(
        p.questIndex - 1,
        (p.pack.quests[p.questIndex - 1].steps?.length || 1) - 1,
      )
  }
  const moveRef = useRef(move)
  moveRef.current = move
  const prepareRef = useRef(onPrepare)
  prepareRef.current = onPrepare
  useEffect(() => {
    const next = (e: Event) => {
      const target = moveRef.current((e as CustomEvent<number>).detail)
      if (target && prepareRef.current(target.cue, target.questId))
        setPrepared(cueIdentity(target.questId, target.cue))
    }
    window.addEventListener('studio-step', next)
    return () => window.removeEventListener('studio-step', next)
  }, [])
  function edit(patch: Partial<DMScene>) {
    if (!quest || !step || !pack) return
    const next: DMPack = {
      ...pack,
      quests: pack.quests.map((q) =>
        q.id !== quest.id
          ? q
          : opening && q.briefing
            ? {
                ...q,
                quick: patch.quick
                  ? { ...patch.quick, next: q.quick?.next || patch.quick.next }
                  : q.quick,
                briefing: {
                  ...q.briefing,
                  ...(patch.quick ? { transition: patch.quick.next } : {}),
                  ...(patch.readAloud !== undefined
                    ? { opening: patch.readAloud }
                    : {}),
                  ...(patch.backgroundId
                    ? { backgroundId: patch.backgroundId }
                    : {}),
                  ...(patch.portraitIds
                    ? { portraitIds: patch.portraitIds }
                    : {}),
                },
              }
            : {
                ...q,
                steps: q.steps?.map((s) =>
                  s.id === step.id ? { ...s, ...patch } : s,
                ),
              },
      ),
    }
    setPack(next)
    setPrepared('')
    try {
      localStorage.setItem('aruzahr-director-pack', JSON.stringify(next))
      window.dispatchEvent(new Event('studio-dm-change'))
    } catch {
      onMessage('Değişiklik kaydedilemedi; gelişmiş masadan yedek alabilirsin.')
    }
  }
  function currentCue() {
    return step
      ? { ...step, portraitIds: showPeople ? step.portraitIds : [] }
      : undefined
  }
  async function show() {
    const cue = currentCue()
    if (!cue || !quest) return
    const key = await onShow(cue, quest.id)
    if (key) {
      setPrepared(cueId)
      const value = { id: cueId, key }
      setLastShown(value)
      try {
        localStorage.setItem('aruzahr-story-live', JSON.stringify(value))
      } catch {}
    }
  }
  if (!pack || !quest || !step)
    return (
      <section className="story-empty">
        <BookOpen size={30} />
        <h1>
          {pack ? 'Bu kaydın sahne adımları bulunmuyor' : 'Hikâye açılamadı'}
        </h1>
        <p>
          {pack
            ? 'Mevcut not dosyan korunuyor. Bu eski biçimdeki kaydı gelişmiş masada açabilirsin.'
            : 'Sayfayı yeniden açabilir veya kendi not dosyanı gelişmiş masada yükleyebilirsin.'}
        </p>
        <button onClick={onAdvanced}>Gelişmiş masayı aç</button>
      </section>
    )
  const source = quest.briefing
  const beats = opening ? [] : step.runbook?.beats || []
  const where = quick?.where || quest.location || 'Yolculuk sahnesi'
  const when =
    quick?.time ||
    (opening ? 'Bu bölüme başlarken' : 'Önceki sahnenin ardından')
  const purpose =
    quick?.goal || quest.objective || source?.purpose || step.summary
  const transition =
    quick?.next || (opening ? source?.transition : step.runbook?.next)
  const cast = source?.cast || []
  return (
    <div className="story-flow" data-testid="story-workspace">
      <aside className="story-route">
        <div className="story-route-heading">
          <span>YOLCULUK</span>
          <h2>{pack.title.replace(/\s*[—–·].*$/, '')}</h2>
          <small>{pack.quests.length} bölüm · kaldığın yer kaydedilir</small>
        </div>
        <label className="story-route-search">
          <span>Bölüm bul</span>
          <input
            aria-label="Hikâyede bölüm bul"
            type="search"
            placeholder="Yer veya görev…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <nav aria-label="Hikâye bölümleri">
          {pack.quests
            .map((q, i) => ({ q, i }))
            .filter(({ q }) =>
              `${q.title} ${q.quick?.where || ''}`
                .toLocaleLowerCase('tr')
                .includes(search.toLocaleLowerCase('tr')),
            )
            .map(({ q, i }) => (
              <button
                key={q.id}
                aria-current={q.id === quest.id ? 'step' : undefined}
                onClick={() =>
                  go(i, q.id === quest.id ? (opening ? -1 : index) : -1)
                }
              >
                <span>
                  {progress.done.includes(q.id) ? (
                    <Check size={15} />
                  ) : (
                    String(i + 1).padStart(2, '0')
                  )}
                </span>
                <div>
                  <strong>{q.title}</strong>
                  <small>{q.quick?.where || q.location}</small>
                </div>
                <ChevronRight size={14} />
              </button>
            ))}
        </nav>
        <p className="story-route-note">
          Bölüm seçmek yayını değiştirmez. Hazır olduğunda sahneyi göster.
        </p>
        <a
          className="story-session-guide"
          href="dm/ILK-OTURUM.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          İlk oturumun kısa rehberi ↗
        </a>
        <JourneyCompanion
          mode="summary"
          pack={pack}
          quest={quest}
          sceneId={step.id}
          opening={opening}
          progress={progress}
          onProgress={saveProgress}
        />
      </aside>
      <section className="story-scroll" ref={scroll}>
        <div className="story-sheet" key={step.id}>
          <header className="story-chapter">
            <span>
              BÖLÜM {questIndex + 1} / {pack.quests.length}
            </span>
            <h1>{quest.title}</h1>
            <nav aria-label="Bu bölümün adımları">
              {source && (
                <button
                  aria-current={opening ? 'step' : undefined}
                  onClick={() => go(questIndex, -1)}
                >
                  Giriş
                </button>
              )}
              {quest.steps?.map((s, i) => (
                <button
                  key={s.id}
                  aria-current={!opening && i === index ? 'step' : undefined}
                  onClick={() => go(questIndex, i)}
                >
                  {i + 1}
                  <span>{s.title.replace(/^\d+[.·]\s*/, '')}</span>
                </button>
              ))}
            </nav>
          </header>
          <div className="story-step-heading">
            <div>
              <span>
                {opening
                  ? 'ÖNCE BUNU OYNAT'
                  : `ŞİMDİ · ${index + 1} / ${quest.steps?.length} ADIM`}
              </span>
              <h2>{opening ? 'Hikâyeyi buradan başlat' : step.title}</h2>
            </div>
            <span className={`story-on-air ${onAir ? 'active' : ''}`}>
              {onAir
                ? 'Bu sahne yayında'
                : sending
                  ? 'Yayına gönderiliyor…'
                  : 'Yayını değiştirmeden okuyorsun'}
            </span>
          </div>
          <div className="story-facts" data-testid="story-context">
            <div>
              <MapPin size={17} />
              <span>NEREDE</span>
              <p>{where}</p>
            </div>
            <div>
              <span>NE ZAMAN</span>
              <p>{when}</p>
            </div>
            <div>
              <span>AMAÇ</span>
              <p>{purpose}</p>
            </div>
          </div>
          <div className="story-columns">
            <div className="story-reading">
              <section className="story-now">
                <h3>
                  {opening
                    ? 'Nereden geldiler, neden buradalar?'
                    : 'Bu anda ne oluyor?'}
                </h3>
                <p>
                  {short(
                    (opening
                      ? source?.arrival
                      : step.runbook?.entry || step.summary) || '',
                  )}
                </p>
              </section>
              <section className="story-speech">
                <span>OYUNCULARA OKU</span>
                <blockquote>{step.readAloud}</blockquote>
              </section>
              {beats.length > 0 && (
                <section className="story-beats">
                  <h3>Sırayla oynat</h3>
                  {beats.map((b, i) => (
                    <article key={i}>
                      <span>{i + 1}</span>
                      <div>
                        <strong>{b.title}</strong>
                        <p>{short(b.text)}</p>
                        {(b.line || short(b.text) !== b.text) && (
                          <details>
                            <summary>Konuşma ve ayrıntı</summary>
                            {short(b.text) !== b.text && <p>{b.text}</p>}
                            {b.line && <blockquote>{b.line}</blockquote>}
                          </details>
                        )}
                      </div>
                    </article>
                  ))}
                </section>
              )}
              {!opening && step.play && (
                <DMPlayCard
                  value={step.play}
                  onGo={(id) => {
                    const target = quest.steps?.findIndex((s) => s.id === id)
                    if (target !== undefined && target >= 0)
                      go(questIndex, target)
                  }}
                />
              )}
              {opening && source && (
                <details className="story-detail">
                  <summary>Öncesi ve zaman baskısı</summary>
                  <p>{source.previous}</p>
                  <p>{source.stakes}</p>
                </details>
              )}
              <JourneyCompanion
                mode="events"
                pack={pack}
                quest={quest}
                sceneId={step.id}
                opening={opening}
                progress={progress}
                onProgress={saveProgress}
                canShow={connected && !busy}
                onShow={async (scene, questId) => {
                  setPrepared('')
                  return onShow(scene, questId)
                }}
              />
              <section className="story-next">
                <span>BURADAN SONRA</span>
                <p>
                  {transition ||
                    nextLabel ||
                    'Oyuncuların kararını kaydet; yolculuğu masanızın sonucuna göre sürdür.'}
                </p>
              </section>
            </div>
            <aside className="story-media">
              <section className="story-visual">
                <div className="story-section-label">
                  <ImageIcon size={15} />
                  <span>BU ADIMDA GÖSTERECEĞİN GÖRSEL</span>
                </div>
                {background && (
                  <button
                    className="story-image-button"
                    onClick={() => setEnlarged(true)}
                    aria-label="Sahne görselini büyüt"
                  >
                    <img src={background.src} alt={background.name} />
                    <span>
                      <Maximize2 size={13} /> Büyüt
                    </span>
                  </button>
                )}
                <p>{background?.name || 'Görsel bulunamadı'}</p>
                <div className="story-show-controls">
                  <button
                    className="story-show"
                    data-testid="story-show"
                    disabled={!connected || busy || !background}
                    onClick={() => void show()}
                  >
                    <Eye size={18} />
                    {busy
                      ? 'Görsel hazırlanıyor…'
                      : onAir
                        ? 'Sahneyi yeniden göster'
                        : 'Bu sahneyi göster'}
                  </button>
                  <button
                    className="story-prepare"
                    onClick={() => {
                      const cue = currentCue()
                      if (cue && onPrepare(cue, quest.id)) setPrepared(cueId)
                    }}
                    disabled={!connected || busy || !background}
                  >
                    <Play size={12} />
                    {prepared === cueId ? 'Hazırlıkta hazır' : 'Sadece hazırla'}
                  </button>
                </div>
                <small>
                  “Göster” bu resmi ve aşağıdaki portreleri yayına verir.
                  Anlatım metinleri görünmez.
                </small>
              </section>
              <section className="story-people">
                <div className="story-section-label">
                  <span>SAHNEDEKİ KİŞİLER</span>
                  <label>
                    <input
                      type="checkbox"
                      checked={showPeople}
                      onChange={(e) => {
                        setShowPeople(e.target.checked)
                        setPrepared('')
                      }}
                    />
                    Portreleri göster
                  </label>
                </div>
                {people.length ? (
                  people.map((a) => {
                    if (!a) return null
                    const c = cast.find(
                      (c) =>
                        c.name
                          .toLocaleLowerCase('tr')
                          .includes(a.name.toLocaleLowerCase('tr')) ||
                        a.name
                          .toLocaleLowerCase('tr')
                          .includes(c.name.toLocaleLowerCase('tr')),
                    )
                    return (
                      <article key={a.id}>
                        <img src={a.src} alt={a.name} />
                        <div>
                          <strong>{a.name}</strong>
                          <p>{c ? short(c.role) : 'Bu sahnenin portresi'}</p>
                          {c && (
                            <details>
                              <summary>Ne istiyor, ne söyler?</summary>
                              <p>{c.wants}</p>
                              <blockquote>{c.line}</blockquote>
                            </details>
                          )}
                        </div>
                      </article>
                    )
                  })
                ) : (
                  <p>
                    Bu adımda portre gerekmiyor; manzarayı tek başına göster.
                  </p>
                )}
                {cast.filter(
                  (c) =>
                    !people.some(
                      (a) =>
                        a &&
                        (c.name
                          .toLocaleLowerCase('tr')
                          .includes(a.name.toLocaleLowerCase('tr')) ||
                          a.name
                            .toLocaleLowerCase('tr')
                            .includes(c.name.toLocaleLowerCase('tr'))),
                    ),
                ).length > 0 && (
                  <details>
                    <summary>Bölümdeki diğer kişiler</summary>
                    {cast
                      .filter(
                        (c) =>
                          !people.some(
                            (a) =>
                              a &&
                              c.name
                                .toLocaleLowerCase('tr')
                                .includes(a.name.toLocaleLowerCase('tr')),
                          ),
                      )
                      .map((c) => (
                        <article key={c.name}>
                          <div>
                            <strong>{c.name}</strong>
                            <p>{c.role}</p>
                            <p>{c.meeting}</p>
                            <blockquote>{c.line}</blockquote>
                          </div>
                        </article>
                      ))}
                  </details>
                )}
              </section>
              <JourneyCompanion
                mode="people"
                pack={pack}
                quest={quest}
                sceneId={step.id}
                opening={opening}
                progress={progress}
                onProgress={saveProgress}
              />
              <details className="story-live">
                <summary>
                  <span className="story-live-dot" />
                  Oyuncular şu anda ne görüyor?
                </summary>
                <p>{liveTitle}</p>
                <div className="story-live-preview">{preview}</div>
              </details>
            </aside>
          </div>
          <div className="story-extras">
            {!opening && (
              <details className="story-detail">
                <summary>Zarlar, olası kararlar ve sonuçlar</summary>
                {step.checks.map((c, i) => (
                  <p key={'c' + i}>{c}</p>
                ))}
                {step.actions.map((a, i) => (
                  <p key={'a' + i}>{a}</p>
                ))}
                {step.runbook?.questions.map((q) => (
                  <article key={q.question}>
                    <strong>{q.question}</strong>
                    <p>{q.answer}</p>
                  </article>
                ))}
                {step.choices.map((c) => (
                  <article key={c.label}>
                    <strong>{c.label}</strong>
                    <p>{c.result}</p>
                    <small>Daha sonra: {c.echo}</small>
                    <button
                      onClick={() =>
                        saveProgress({
                          ...progress,
                          decisions: {
                            ...progress.decisions,
                            [quest.id]: c.label,
                          },
                        })
                      }
                    >
                      Bu kararı kaydet
                    </button>
                  </article>
                ))}
              </details>
            )}
            <details className="story-detail">
              <summary>Not al / bu adımı değiştir</summary>
              <label>
                Bu bölümde ne karar verildi?
                <textarea
                  aria-label="Hikâye karar notu"
                  value={progress.decisions[quest.id] || ''}
                  onChange={(e) =>
                    saveProgress({
                      ...progress,
                      decisions: {
                        ...progress.decisions,
                        [quest.id]: e.target.value,
                      },
                    })
                  }
                />
              </label>
              <label>
                Oyunculara okunacak metin
                <textarea
                  aria-label="Hikâye anlatımını düzenle"
                  value={step.readAloud}
                  onChange={(e) => edit({ readAloud: e.target.value })}
                />
              </label>
              {(['where', 'time', 'goal', 'next'] as const).map((k) => (
                <label key={k}>
                  {
                    {
                      where: 'Nerede',
                      time: 'Ne zaman',
                      goal: 'Amaç',
                      next: 'Sonra ne olacak',
                    }[k]
                  }
                  <textarea
                    value={quick?.[k] || ''}
                    onChange={(e) =>
                      edit({
                        quick: {
                          where: quick?.where || '',
                          time: quick?.time || '',
                          goal: quick?.goal || '',
                          next: quick?.next || '',
                          [k]: e.target.value,
                        },
                      })
                    }
                  />
                </label>
              ))}
              <label>
                Farklı görsel bul
                <input
                  type="search"
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  placeholder="Şehir veya sahne adı…"
                />
              </label>
              <label>
                Sahne görseli
                <select
                  aria-label="Hikâye sahne görseli"
                  value={step.backgroundId}
                  onChange={(e) => edit({ backgroundId: e.target.value })}
                >
                  {broadcastAssets
                    .filter(
                      (a) =>
                        a.kind === 'scene' &&
                        (a.id === step.backgroundId ||
                          `${a.name} ${a.id}`
                            .toLocaleLowerCase('tr')
                            .includes(mediaSearch.toLocaleLowerCase('tr'))),
                    )
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                </select>
              </label>
              <button
                onClick={() =>
                  saveProgress({
                    ...progress,
                    done: progress.done.includes(quest.id)
                      ? progress.done.filter((id) => id !== quest.id)
                      : [...progress.done, quest.id],
                  })
                }
              >
                {progress.done.includes(quest.id)
                  ? 'Bölümü yeniden açık işaretle'
                  : 'Bölümü tamamlandı işaretle'}
              </button>
            </details>
          </div>
          <footer className="story-navigation">
            <button
              onClick={() => move(-1)}
              disabled={
                questIndex === 0 && (opening || (!source && index === 0))
              }
            >
              <ArrowLeft size={16} />
              Önceki
            </button>
            <div>
              <span>SONRAKİ</span>
              <strong>{nextLabel || 'Yolculuğun sonu'}</strong>
            </div>
            <button
              className="story-next-button"
              onClick={() => move(1)}
              disabled={!nextLabel}
            >
              Sonraki adım
              <ArrowRight size={16} />
            </button>
          </footer>
        </div>
      </section>
      <div className="story-quick-controls">
        <button onClick={onBreak}>
          <Pause size={15} />
          {intermission ? 'Moladan dön' : 'Ara ver'}
        </button>
        <button onClick={onRoll}>d20 at</button>
        <button onClick={() => onMap(quest.location || '')}>
          <MapPin size={14} />
          Konumu haritada hazırla
        </button>
      </div>
      {enlarged && background && (
        <div
          className="story-art-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Sahne görseli"
          onClick={() => setEnlarged(false)}
        >
          <button
            className="story-art-close"
            onClick={() => setEnlarged(false)}
          >
            <X size={20} />
            Kapat
          </button>
          <img
            src={background.src}
            alt={background.name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
