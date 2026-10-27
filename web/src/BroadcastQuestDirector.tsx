import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { QuestBriefing, SceneRunbook } from './DMRunbook'
import DMPlayCard from './DMPlayCard'
import NightEncounterDeck from './NightEncounterDeck'
import JourneyCompanion from './studio/JourneyCompanion'
import {
  BookOpen,
  FileUp,
  ArrowDownToLine,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
  Play,
  MapPin,
} from 'lucide-react'
import { adventureHooks } from './session-adventures'
import { broadcastAssets } from './BroadcastLibrary'
import {
  readPrivatePack,
  parseDMPack,
  parseProgress,
  readSavedDMProgress,
  downloadPrivateNotes,
  type DMPack,
  type DMProgress,
  type DMScene,
} from './dm-guide'
import type { WorldFact } from './studio/types'
import './broadcast-director.css'
const read = (key: string) => {
  try {
    return localStorage.getItem(key) || ''
  } catch {
    return ''
  }
}
export default function BroadcastQuestDirector({
  onPrepare,
  onReveal,
  onShow,
  onMap,
  onMessage,
  facts = [],
  studioMode = false,
  disabled = false,
  activeScene,
}: {
  facts?: WorldFact[]
  studioMode?: boolean
  disabled?: boolean
  activeScene?: string
  onPrepare: (scene: DMScene, questId?: string) => boolean
  onReveal: () => void
  onShow?: (scene: DMScene, questId: string) => Promise<string | null>
  onMap: (id: string) => void
  onMessage: (message: string) => void
}) {
  const [pack, setPack] = useState<DMPack | null>(readPrivatePack)
  const [notes, setNotes] = useState(() => read('aruzahr-director-notes'))
  const [progress, setProgress] = useState<DMProgress>(() => {
    const p = readPrivatePack()
    let raw = {}
    try {
      raw = JSON.parse(read('aruzahr-director-progress') || '{}')
    } catch {}
    return parseProgress(raw, p?.quests || [])
  })
  const [opening, setOpening] = useState(() => {
    const saved = readPrivatePack()
    const p = readSavedDMProgress(saved?.quests || [])
    const pending = read('aruzahr-story-opening')
    return pending ? pending === p.quest : !read('aruzahr-story-seen') && !p.done.length && !Object.values(p.steps).some(n => n > 0) && !Object.values(p.decisions).some(Boolean)
  })
  const [selectedLegacy, setSelectedLegacy] = useState('')
  const [prepared, setPrepared] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [exitLabel, setExitLabel] = useState(''),
    [exitTarget, setExitTarget] = useState('')
  const quest =
    pack?.quests.find((q) => q.id === progress.quest) || pack?.quests[0]
  const index = quest ? progress.steps[quest.id] || 0 : 0,
    step = quest?.steps?.[index]
  useEffect(() => {
    if (!studioMode || !pack) return
    const open = (request: unknown) => {
      if (!request || typeof request !== 'object') return
      const { questId, stepId } = request as {questId?: unknown; stepId?: unknown}
      if (typeof questId !== 'string' || typeof stepId !== 'string') return
      const selected = pack.quests.find(q => q.id === questId)
      const target = selected?.steps?.findIndex(s => s.id === stepId) ?? -1
      if (!selected || target < 0) return
      setPrepared(null)
      setOpening(false)
      setNotes(selected.body)
      setProgress(p => ({...p,quest:selected.id,steps:{...p.steps,[selected.id]:target}}))
      onMessage('İlgili görev adımı açıldı. Hazırlık ve canlı görüntü değiştirilmedi.')
    }
    try {
      const saved = sessionStorage.getItem('aruzahr-dm-scene-request')
      if (saved) { sessionStorage.removeItem('aruzahr-dm-scene-request'); open(JSON.parse(saved)) }
    } catch { /* Ignore a malformed local navigation request. */ }
    const receive = (event: Event) => open((event as CustomEvent).detail)
    window.addEventListener('studio-open-dm-scene',receive)
    return () => window.removeEventListener('studio-open-dm-scene',receive)
  }, [pack,studioMode,onMessage])
  useEffect(() => {
    try {
      localStorage.setItem('aruzahr-director-notes', notes)
      window.dispatchEvent(new Event('studio-dm-change'))
    } catch {
      onMessage('DM notları kaydedilemedi. Defteri indirerek koru.')
    }
  }, [notes, onMessage])
  useEffect(() => {
    try {
      localStorage.setItem(
        'aruzahr-director-progress',
        JSON.stringify(progress),
      )
      window.dispatchEvent(new Event('studio-dm-change'))
    } catch {
      onMessage('Görev ilerlemesi kaydedilemedi.')
    }
  }, [progress, onMessage])
  function store(next: DMPack) {
    setPack(next)
    try {
      localStorage.setItem('aruzahr-director-pack', JSON.stringify(next))
      window.dispatchEvent(new Event('studio-dm-change'))
    } catch {
      onMessage('Paket bu oturumda açık; kaydetmek için Defteri indir.')
    }
  }
  async function importDM(file?: File) {
    if (!file) return
    try {
      if (file.size > 2 * 1024 * 1024)
        throw new Error('DM dosyası 2 MB’dan küçük olmalı.')
      const text = await file.text()
      if (/\.json$/i.test(file.name)) {
        const next = parseDMPack(JSON.parse(text))
        store(next)
        const restored = parseProgress(
          next.progress || readSavedDMProgress(next.quests),
          next.quests,
        )
        setProgress(restored)
        setNotes(next.quests.find((q) => q.id === restored.quest)?.body || '')
        setSelectedLegacy('')
        setOpening(!!next.quests.find(q => q.id === restored.quest)?.briefing)
        setPrepared(null)
        onMessage(
          `${next.quests.length} görev açıldı. Özel metinler yalnızca bu pencerede.`,
        )
      } else {
        setPack(null)
        localStorage.removeItem('aruzahr-director-pack')
        setNotes(text)
        setSelectedLegacy('')
        setProgress(parseProgress({}, []))
        onMessage('Not dosyası DM defterine açıldı.')
      }
    } catch (e) {
      onMessage((e as Error).message)
    }
  }
  function select(id: string) {
    if (pack && !pack.quests.some((q) => q.id === id)) {
      onMessage(
        'Bu görev önceki Yük ve Söz paketinde. ZIP içindeki eski JSON’u açarak oynatabilirsin.',
      )
      return
    }
    setPrepared(null)
    setSelectedLegacy(id)
    setProgress((p) => ({ ...p, quest: id }))
    const q = pack?.quests.find((q) => q.id === id)
    if (q) { setNotes(q.body); setOpening(!!q.briefing) }
  }
  function changeNotes(value: string) {
    setNotes(value)
    if (quest)
      store({
        ...pack!,
        quests: pack!.quests.map((q) =>
          q.id === quest.id ? { ...q, body: value } : q,
        ),
      })
  }
  function changeStep(next: number) {
    setOpening(false)
    setPrepared(null)
    if (quest)
      setProgress((p) => ({ ...p, steps: { ...p.steps, [quest.id]: next } }))
  }
  const navigation = useRef({ index, quest, changeStep, onPrepare, opening: studioMode && opening && !!quest?.briefing })
  navigation.current = { index, quest, changeStep, onPrepare, opening: studioMode && opening && !!quest?.briefing }
  useEffect(() => {
    const run = (e: Event) => {
      const { index, quest, changeStep, onPrepare, opening } = navigation.current
      if (quest?.steps) {
        const next = Math.max(
          0,
          Math.min(
            quest.steps.length - 1,
            opening && (e as CustomEvent<number>).detail > 0 ? 0 : index + (e as CustomEvent<number>).detail,
          ),
        )
        changeStep(next)
        setPrepared(
          onPrepare(quest.steps[next], quest.id) ? quest.steps[next].id : null,
        )
      }
    }
    window.addEventListener('studio-step', run)
    return () => window.removeEventListener('studio-step', run)
  }, [])
  function updateStep(patch: Partial<DMScene>) {
    if (!pack || !quest || !step) return
    store({
      ...pack,
      quests: pack.quests.map((q) =>
        q.id === quest.id
          ? {
              ...q,
              steps: q.steps!.map((s) =>
                s.id === step.id ? { ...s, ...patch } : s,
              ),
            }
          : q,
      ),
    })
  }
  function reorderStep(delta: number) {
    if (!pack || !quest || !step) return
    const rows = [...quest.steps!],
      target = index + delta
    if (target < 0 || target >= rows.length) return
    ;[rows[index], rows[target]] = [rows[target], rows[index]]
    store({
      ...pack,
      quests: pack.quests.map((q) =>
        q.id === quest.id ? { ...q, steps: rows } : q,
      ),
    })
    changeStep(target)
  }
  const intro = quest?.briefing?.backgroundId
    ? {
        id: quest.id + '-giris',
        title: quest.title + ' · Giriş',
        summary: '',
        readAloud: quest.briefing.opening,
        actions: [],
        checks: [],
        choices: [],
        backgroundId: quest.briefing.backgroundId,
        portraitIds: quest.briefing.portraitIds || [],
        publicTitle: quest.briefing.publicTitle || 'Yolculuk başlangıcı',
      }
    : null
  const activeOpening = studioMode && opening && !!quest?.briefing
  useEffect(() => {
    if (!studioMode || !quest) return
    try {
      localStorage.setItem('aruzahr-story-opening', activeOpening ? quest.id : '')
      if (!activeOpening) localStorage.setItem('aruzahr-story-seen', '1')
    } catch { /* progress already saved separately */ }
  }, [studioMode, quest?.id, activeOpening])
  function nextStage() {
    if (!quest || !pack) return
    if (activeOpening) { changeStep(0); return }
    if (index < (quest.steps?.length || 0) - 1) { changeStep(index + 1); return }
    const at = pack.quests.findIndex(q => q.id === quest.id)
    if (at < pack.quests.length - 1) select(pack.quests[at + 1].id)
  }
  function previousStage() {
    if (!quest) return
    if (index > 0 && !activeOpening) { changeStep(index - 1); return }
    if (quest.briefing) { setOpening(true); setPrepared(null) }
  }
  useEffect(() => {
    if (!expanded) return
    const old = document.activeElement as HTMLElement | null
    requestAnimationFrame(() =>
      document.querySelector<HTMLButtonElement>('.dm-reading-close')?.focus(),
    )
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopImmediatePropagation()
        setExpanded(false)
      }
      if (e.key === 'Tab') {
        const dialog = document.querySelector('.dm-reading-desk')
        const focusable = Array.from(
          dialog?.querySelectorAll<HTMLElement>(
            'button,a,input,textarea,select,summary,[tabindex="0"]',
          ) || [],
        ).filter(
          (el) => !el.hasAttribute('disabled') && el.getClientRects().length,
        )
        const first = focusable[0],
          last = focusable.at(-1)
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener('keydown', key, true)
    return () => {
      window.removeEventListener('keydown', key, true)
      if (old?.isConnected) old.focus()
    }
  }, [expanded])
  const content = (
    <div className="dm-director" inert={disabled}>
      <div className="broadcast-panel-heading">
        <span className="broadcast-kicker">ÖZEL OTURUM REHBERİ</span>
        <h2>Hikâyeyi yönet</h2>
        <p>Bütün görev zinciri burada. Bir bölüm seç, adımı oku, resmi kontrol et ve hazır olduğunda göster.</p>
      </div>
      {!expanded && (
        <button className="dm-reading-open" onClick={() => setExpanded(true)}>
          Geniş DM okuma masasını aç
        </button>
      )}
      <label className="broadcast-upload-label">
        <FileUp size={15} /> DM paketi aç
        <input
          data-testid="broadcast-import-dm"
          type="file"
          accept=".json,.md,.txt"
          onChange={(e) => {
            void importDM(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </label>
      <a
        className="dm-package-link"
        href="/dm/On-Kis-Karari-DM.json"
        download="On-Kis-Karari-DM.json"
        target="_blank"
        rel="noopener"
      >
        On Kış Kararı · şifresiz hikâye dosyasını indir ↗
      </a>
      {pack && (
        <>
          <h3 className="dm-pack-heading">{pack.title}</h3>
          <section className="dm-route-picker" aria-label="Bütün görev zinciri">
            <div className="dm-chain-heading"><strong>{pack.quests.length} bölüm · görev zinciri</strong><small>{pack.quests.reduce((n,q)=>n+(q.steps?.length||0),0)} ana sahne · {pack.quests.reduce((n,q)=>n+(q.events?.length||0),0)} yan olay</small></div>
            <p className="dm-party-note">Başlangıç grubu: 3 oyuncu · 1. seviye. Bölümler arasında kazandığınız seviyeyi masanıza göre ilerlet.</p>
            <nav className="dm-roadmap" aria-label="Görev yol haritası">
              {pack.quests.map((q, i) => (
                <button
                  key={q.id}
                  aria-pressed={quest?.id === q.id}
                  onClick={(e) => {
                    select(q.id)
                    e.currentTarget.blur()
                  }}
                >
                  <span>
                    {progress.done.includes(q.id) ? (
                      <Check size={13} />
                    ) : (
                      String(i + 1).padStart(2, '0')
                    )}
                  </span>
                  <div>
                    <strong>{q.title}</strong>
                    <small>{q.quick?.where || q.location || 'Özel görev'}</small>
                  </div>
                </button>
              ))}
            </nav>
            <details className="dm-chain-order"><summary>Bölüm sırasını düzenle</summary><div className="st-two">
              <button
                disabled={pack.quests[0]?.id === quest?.id}
                onClick={() => {
                  const rows = [...pack.quests],
                    i = rows.findIndex((q) => q.id === quest?.id)
                  if (i > 0) {
                    ;[rows[i - 1], rows[i]] = [rows[i], rows[i - 1]]
                    store({ ...pack, quests: rows })
                  }
                }}
              >
                Görevi önceye taşı
              </button>
              <button
                disabled={pack.quests.at(-1)?.id === quest?.id}
                onClick={() => {
                  const rows = [...pack.quests],
                    i = rows.findIndex((q) => q.id === quest?.id)
                  if (i < rows.length - 1) {
                    ;[rows[i + 1], rows[i]] = [rows[i], rows[i + 1]]
                    store({ ...pack, quests: rows })
                  }
                }}
              >
                Görevi sonraya taşı
              </button>
            </div>
            </details>
          </section>
        </>
      )}
      {!pack && (
        <div className="dm-empty">
          <BookOpen size={25} />
          <h3>Yeni kampanyayı aç</h3>
          <p>
            Hazır On Kış Kararı hikâyesi otomatik açılır. Kendi maceran için
            yukarıdan bir JSON veya not dosyası seçebilirsin.
          </p>
        </div>
      )}
      {studioMode && <NightEncounterDeck value={progress.night} onChange={night=>setProgress(p=>({...p,night}))} onShow={onShow} onMap={onMap} />}
      {quest && (
        <section className="dm-current">
          <span className="broadcast-kicker">ŞİMDİ OYNAT</span>
          <h2>{quest.title}</h2>
          {facts
            .filter(
              (f) =>
                f.enabled &&
                (f.questIds.includes(quest.id) ||
                  f.sceneIds.includes('dm:' + (step?.id || '')) ||
                  f.sceneIds.includes(
                    'dm:' + quest.id + ':' + (step?.id || ''),
                  )),
            )
            .map((f) => (
              <div className="studio-fact" key={f.id}>
                <strong>{f.label}</strong>
                <p>{f.value}</p>
              </div>
            ))}
          <div className="dm-step-tabs" aria-label="Görev sahneleri">
            {quest.briefing && <button aria-pressed={activeOpening} onClick={()=>{setOpening(true);setPrepared(null)}}>Giriş</button>}
            {quest.steps?.map((scene,i)=><button key={scene.id} aria-pressed={!activeOpening && i===index} onClick={()=>changeStep(i)}>{i+1}. {scene.title}</button>)}
          </div>
          {(activeOpening ? quest.quick : step?.quick || quest.quick) && (() => {
            const quick = (activeOpening ? quest.quick : step?.quick || quest.quick)!
            return <dl className="dm-stage-context" data-testid="dm-stage-context"><div><dt>NEREDE?</dt><dd>{quick.where}</dd></div><div><dt>NE ZAMAN?</dt><dd>{quick.time}</dd></div><div><dt>BU ADIMIN AMACI</dt><dd>{quick.goal}</dd></div></dl>
          })()}
          {quest.objective && <p className="dm-objective">{quest.objective}</p>}
          {!quest.briefing && pack?.title.startsWith('On Kış Kararı') && (
            <p className="dm-book-upgrade">
              Bu dosya önceki kısa anlatım sürümü. Girişleri, kişi rehberini ve
              genişletilmiş sahnelerin oynatımını görmek için hazır hikâyenin güncel JSON’unu
              aç. Aynı görevlerin ilerlemesi ve kararları korunur.
            </p>
          )}
          {quest.briefing && (activeOpening || !studioMode) && (
            <QuestBriefing
              key={quest.id}
              value={quest.briefing}
              onPrepare={() => {
                if (intro)
                  setPrepared(onPrepare(intro, quest.id) ? intro.id : null)
              }}
              onReveal={() => { if (intro && onShow) void onShow(intro, quest.id); else onReveal() }}
              ready={!!intro && prepared === intro.id && (!activeScene || activeScene === 'dm:' + quest.id + ':' + intro.id)}
            />
          )}
          {!quest.briefing && quest.people && (
            <details>
              <summary>Kim ne istiyor?</summary>
              <ul>
                {quest.people.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </details>
          )}
          {step && !activeOpening ? (
            <>
              <div className="dm-step-counter">
                {progress.skipped?.includes(step.id) ? 'ATLANDI · ' : ''}SAHNE{' '}
                {index + 1} / {quest.steps!.length}
              </div>
              <h3>{step.title}</h3>
              <div className="dm-stage-actions">
                <button
                  data-testid="dm-prepare-scene"
                  onClick={() => {
                    setPrepared(onPrepare(step, quest.id) ? step.id : null)
                  }}
                >
                  <Play size={15} /> Sahneyi hazırla
                </button>
                <button
                  data-testid="dm-reveal-scene"
                  disabled={prepared !== step.id || !!activeScene && activeScene !== 'dm:' + quest.id + ':' + step.id}
                  onClick={() => { if(onShow) void onShow(step,quest.id); else onReveal() }}
                >
                  <Eye size={15} /> Oyunculara göster
                </button>
              </div>
              <div className="dm-action-help">
                <p>
                  <strong>Sahneyi hazırla:</strong> Resmi ve portreleri hazırlık
                  ekranına koyar. <strong>Oyunculara göster:</strong> Hazırlığı
                  canlıya gönderir.
                </p>
                {quest.steps!.filter(
                  (s) => s.backgroundId === step.backgroundId,
                ).length > 1 && (
                  <p>
                    Bu adımlar aynı arka planı kullanıyor. 1–2–3 ile aşağıdaki
                    olay, araştırma ve karar metinleri değişir; her adımda yeni
                    bir resim açılması beklenmez.
                  </p>
                )}
                {prepared === step.id && (
                  <p
                    className="dm-prepared-status"
                    data-testid="dm-prepare-status"
                    aria-live="polite"
                  >
                    ✓ Hazır: {step.title}.{' '}
                    {studioMode
                      ? 'Resim ve portreler hazırlık ekranında. Hazırlamak tek başına canlı görüntüyü değiştirmez.'
                      : 'Resim ve portreler perdenin arkasına yerleştirildi.'}
                  </p>
                )}
              </div>
              <section className="dm-now dm-private-note">
                <strong>DM · Şimdi ne oluyor?</strong>
                <p>{step.summary}</p>
              </section>
              <section className="dm-read">
                <span>OYUNCULARA OKU · BETİMLEME</span>
                <blockquote>{step.readAloud}</blockquote>
              </section>
              {step.runbook ? (
                <SceneRunbook
                  value={step.runbook}
                  actions={step.actions}
                  checks={step.checks}
                />
              ) : (
                <>
                  <h4>DM olarak yap</h4>
                  <ol>
                    {step.actions.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ol>
                </>
              )}
              {step.play && <DMPlayCard value={step.play} onGo={id => { const target = quest.steps?.findIndex(s => s.id === id); if (target !== undefined && target >= 0) changeStep(target) }} />}
              <details className="dm-book-visuals" open={!step.runbook}>
                <summary>Bu sahnede gösterilecek görseller</summary>
                <div className="dm-cues">
                  {[step.backgroundId, ...step.portraitIds].map((id, i) => {
                    const a = broadcastAssets.find((a) => a.id === id)
                    return a ? (
                      <figure key={`${id}-${i}`}>
                        <img src={a.src} alt={a.name} />
                        <figcaption>
                          <small>{i ? 'KİŞİ' : 'ARKA PLAN'}</small>
                          {a.name}
                        </figcaption>
                      </figure>
                    ) : (
                      <p key={id}>Görsel bulunamadı: {id}</p>
                    )
                  })}
                </div>
              </details>
              <p className="dm-hint">
                {studioMode
                  ? 'Hazırlık canlı yayını değiştirmez. Oyunculara göster ile yayına al.'
                  : 'Hazırlarken perde kapanır; eski portreler değişir. Harita taşları korunur.'}
              </p>
              {quest.location && (
                <button
                  className="broadcast-wide-button"
                  onClick={() => {
                    setPrepared(null)
                    onMap(quest.location!)
                  }}
                >
                  <MapPin size={14} /> Konumu haritada hazırla
                </button>
              )}
              {!step.runbook && step.checks.length > 0 && (
                <details className="dm-checks" open>
                  <summary>Kontrol ve karşılaşma</summary>
                  <ul>
                    {step.checks.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </details>
              )}
              {step.choices.length > 0 && (
                <section className="dm-choices">
                  <h4>Kararlar ve yankıları · yalnızca DM</h4>
                  {step.choices.map((c) => (
                    <details key={c.label}>
                      <summary>{c.label}</summary>
                      <p>
                        <strong>Şimdi:</strong> {c.result}
                      </p>
                      <p>
                        <strong>2–3 oturum sonra:</strong> {c.echo}
                      </p>
                    </details>
                  ))}
                </section>
              )}
              <details className="dm-flow-edit">
                <summary>Sahne akışı ve düzenleme</summary>
                <div className="st-two">
                  <button
                    disabled={index === 0}
                    onClick={() => reorderStep(-1)}
                  >
                    Sahneyi önceye taşı
                  </button>
                  <button
                    disabled={index === quest.steps!.length - 1}
                    onClick={() => reorderStep(1)}
                  >
                    Sahneyi sonraya taşı
                  </button>
                  <button
                    onClick={() => {
                      setProgress((p) => ({
                        ...p,
                        skipped: [...new Set([...(p.skipped || []), step.id])],
                      }))
                      if (index < quest.steps!.length - 1) changeStep(index + 1)
                    }}
                  >
                    Bu sahneyi atla
                  </button>
                  <button
                    onClick={() =>
                      setProgress((p) => ({
                        ...p,
                        skipped: (p.skipped || []).filter(
                          (id) => id !== step.id,
                        ),
                      }))
                    }
                  >
                    Atlamayı geri al
                  </button>
                </div>
                {(['title', 'summary', 'readAloud'] as const).map((k) => (
                  <label className="st-field" key={k}>
                    <span>
                      {
                        {
                          title: 'Sahne adı',
                          summary: 'Şimdi ne oluyor?',
                          readAloud: 'Oyunculara oku',
                        }[k]
                      }
                    </span>
                    <textarea
                      value={step[k]}
                      onChange={(e) => updateStep({ [k]: e.target.value })}
                    />
                  </label>
                ))}
                {(['actions', 'checks'] as const).map((k) => (
                  <label className="st-field" key={k}>
                    <span>
                      {k === 'actions'
                        ? 'DM eylemleri · her satır bir madde'
                        : 'Kontroller · her satır bir madde'}
                    </span>
                    <textarea
                      value={step[k].join('\n')}
                      onChange={(e) =>
                        updateStep({ [k]: e.target.value.split('\n') })
                      }
                    />
                  </label>
                ))}
                <label className="st-field">
                  <span>Oyuncuların göreceği kişi adları</span>
                  {step.portraitIds.map((id) => (
                    <label key={id}>
                      {id}
                      <input
                        value={step.publicNames?.[id] || ''}
                        placeholder="Kütüphanedeki ad"
                        onChange={(e) =>
                          updateStep({
                            publicNames: {
                              ...step.publicNames,
                              [id]: e.target.value,
                            },
                          })
                        }
                      />
                    </label>
                  ))}
                </label>
                <label className="st-field">
                  <span>Alternatif çıkış · seçilen sahneye geç</span>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const target = quest.steps!.findIndex(
                        (s) => s.id === e.target.value,
                      )
                      if (target >= 0) changeStep(target)
                    }}
                  >
                    <option value="">Sahne seç</option>
                    {quest.steps!.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="st-field">
                  <span>Yeni çıkış etiketi</span>
                  <input
                    value={exitLabel}
                    onChange={(e) => setExitLabel(e.target.value)}
                  />
                </label>
                <select
                  value={exitTarget}
                  onChange={(e) => setExitTarget(e.target.value)}
                >
                  <option value="">Çıkışın hedef sahnesi</option>
                  {quest
                    .steps!.filter((s) => s.id !== step.id)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                </select>
                <button
                  disabled={
                    !exitLabel || !exitTarget || (step.exits?.length || 0) >= 12
                  }
                  onClick={() => {
                    updateStep({
                      exits: [
                        ...(step.exits || []),
                        { label: exitLabel, sceneId: exitTarget },
                      ],
                    })
                    setExitLabel('')
                    setExitTarget('')
                  }}
                >
                  Çıkışı kaydet
                </button>
                {step.exits?.map((e, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      updateStep({
                        exits: step.exits!.filter((_, j) => i !== j),
                      })
                    }
                  >
                    {e.label} · çıkışı kaldır
                  </button>
                ))}
              </details>
              {step.exits?.map((exit) => (
                <button
                  key={exit.sceneId}
                  onClick={() => {
                    const target = quest.steps!.findIndex(
                      (s) => s.id === exit.sceneId,
                    )
                    if (target >= 0) changeStep(target)
                  }}
                >
                  {exit.label}
                </button>
              ))}
            </>
          ) : !activeOpening ? (
            <section className="dm-legacy-read">
              <h3>Görev metni</h3>
              <p>
                Bu eski paket metin biçiminde. Yeni 10 görevlik pakette sahne
                düğmeleri ve görsel eşleştirmeleri var.
              </p>
              {quest.body.split(/\n(?=#{1,4}\s)/).map((chunk, i) => (
                <details key={i} open>
                  <summary>
                    {chunk.split('\n')[0].replace(/^#+\s*/, '') || 'Sahne notu'}
                  </summary>
                  <p>{chunk.split('\n').slice(1).join('\n') || chunk}</p>
                </details>
              ))}
            </section>
          ) : null}
          {pack && <div className="story-flow dm-journey-tools">
            <JourneyCompanion mode="events" pack={pack} quest={quest} sceneId={activeOpening ? quest.id+'-giris' : step?.id || ''} opening={activeOpening} progress={progress} onProgress={setProgress} onShow={onShow} canShow={!disabled} />
            <JourneyCompanion mode="people" pack={pack} quest={quest} sceneId={activeOpening ? quest.id+'-giris' : step?.id || ''} opening={activeOpening} progress={progress} onProgress={setProgress} />
            <JourneyCompanion mode="summary" pack={pack} quest={quest} sceneId={activeOpening ? quest.id+'-giris' : step?.id || ''} opening={activeOpening} progress={progress} onProgress={setProgress} />
          </div>}
          <div className="dm-step-navigation dm-main-navigation">
            <button disabled={activeOpening || index===0 && !quest.briefing} onClick={previousStage}><ChevronLeft size={15}/>Önceki adım</button>
            <div><small>{activeOpening ? 'BÖLÜM GİRİŞİ' : `ADIM ${index+1} / ${quest.steps?.length||0}`}</small><strong>{activeOpening ? quest.steps?.[0]?.title : quest.steps?.[index+1]?.title || pack?.quests[pack.quests.findIndex(q=>q.id===quest.id)+1]?.title || 'Bölümün sonu'}</strong></div>
            <button disabled={!activeOpening && index===(quest.steps?.length||1)-1 && pack?.quests.at(-1)?.id===quest.id} onClick={nextStage}>{activeOpening ? 'İlk sahneye geç' : index===(quest.steps?.length||1)-1 ? 'Sonraki bölüme geç' : 'Sonraki adım'}<ChevronRight size={15}/></button>
          </div>
          <label className="dm-decision-label">
            Masada ne karar verildi?
            <textarea
              aria-label="Oyuncuların kararı"
              value={progress.decisions[quest.id] || ''}
              onChange={(e) =>
                setProgress((p) => ({
                  ...p,
                  decisions: { ...p.decisions, [quest.id]: e.target.value },
                }))
              }
              placeholder="Oyuncuların seçimi, kime söz verdiler, ne değişti…"
            />
          </label>
          {studioMode && (
            <button
              className="broadcast-wide-button"
              disabled={!progress.decisions[quest.id]?.trim()}
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent('studio-fact', {
                    detail: {
                      label: quest.title,
                      value: progress.decisions[quest.id],
                    },
                  }),
                )
              }
            >
              Bu kararı hatırlatmaya dönüştür
            </button>
          )}
          <button
            className="broadcast-wide-button"
            aria-pressed={progress.done.includes(quest.id)}
            onClick={() =>
              setProgress((p) => ({
                ...p,
                done: p.done.includes(quest.id)
                  ? p.done.filter((id) => id !== quest.id)
                  : [...p.done, quest.id],
              }))
            }
          >
            <Check size={15} />
            {progress.done.includes(quest.id)
              ? 'Görev tamamlandı · geri al'
              : 'Görevi tamamlandı işaretle'}
          </button>
        </section>
      )}
      <details className="dm-old-hooks" open={!pack || pack.version === 1}>
        <summary>Önceki mini kampanya · Yük ve Söz</summary>
        {adventureHooks.map((q) => (
          <button
            key={q.id}
            className={`broadcast-quest-card ${selectedLegacy === q.id ? 'selected' : ''}`}
            onClick={() => select(q.id)}
          >
            <span>
              {q.locationName} · {q.duration}
            </span>
            <strong>{q.title}</strong>
            <p>{q.pitch}</p>
            <small>{q.stakes}</small>
          </button>
        ))}
      </details>
      <section className="broadcast-dm-desk">
        <div>
          <BookOpen size={16} />
          <h3>DM defteri</h3>
          <span>Yalnızca bu pencere</span>
        </div>
        <details open={!step}>
          <summary>Özel metni düzenle</summary>
          <textarea
            data-testid="broadcast-dm-notes"
            aria-label="Yalnızca DM için özel notlar"
            value={notes}
            onChange={(e) => changeNotes(e.target.value)}
            placeholder="Gizli ipuçları ve özel notlar…"
          />
        </details>
        <button
          className="broadcast-wide-button"
          onClick={downloadPrivateNotes}
        >
          <ArrowDownToLine size={15} /> Defteri indir
        </button>
        <small>
          İlerleme ve kararlar özel defter yedeğine eklenir. Yayın sahnesine ve
          sahne yedeğine gönderilmez.
        </small>
      </section>
    </div>
  )
  return expanded
    ? createPortal(
        <div className={`dm-reading-backdrop ${studioMode ? 'unified-dm' : ''}`}>
          <section
            className="dm-reading-desk"
            role="dialog"
            aria-modal="true"
            aria-label="Özel DM okuma masası"
          >
            <header>
              <div>
                <small>YALNIZ DM · OYNATIM KİTABI</small>
                <strong>{quest?.title || 'Görev rehberi'}</strong>
              </div>
              <button
                className="dm-reading-close"
                onClick={() => setExpanded(false)}
              >
                Okuma masasını kapat · Esc
              </button>
            </header>
            {content}
          </section>
        </div>,
        document.body,
      )
    : content
}
