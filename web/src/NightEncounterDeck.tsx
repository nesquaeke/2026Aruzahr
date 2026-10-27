import { useContext, useEffect, useRef, useState } from 'react'
import {
  Dices,
  Eye,
  MapPin,
  Moon,
  RotateCcw,
  Search,
  Shield,
  Swords,
  X,
} from 'lucide-react'
import { StudioContext } from './studio/context'
import { rollExpression } from './studio/dice'
import { broadcastAssets } from './BroadcastLibrary'
import { artworkFor } from './media'
import { locationById } from './data'
import type { DMNightProgress, DMScene } from './dm-guide'
import type { StudioRoll } from './studio/types'
import {
  chooseNightEncounter,
  loadNightEncounters,
  type NightEncounter,
  type NightTrigger,
} from './night-encounters'
import './night-encounters.css'
const blank: DMNightProgress = {
  selected: '',
  trigger: 'all',
  notes: {},
  choices: {},
  revealed: {},
}
const triggerLabels = {
  all: 'Bütün koşullar',
  camp: 'Uyku / kamp',
  travel: 'Yolculuk',
  trespass: 'Eşik / yasak yer',
}
const searchText = (value: string) =>
  value
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
export default function NightEncounterDeck({
  value,
  onChange,
  onShow,
  onMap,
}: {
  value?: DMNightProgress
  onChange: (next: DMNightProgress) => void
  onShow?: (scene: DMScene, questId: string) => Promise<string | null>
  onMap?: (id: string) => void
}) {
  const studio = useContext(StudioContext),
    progress = value || blank
  const [cards, setCards] = useState<NightEncounter[]>([]),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true),
    [broadcastDie, setBroadcastDie] = useState(false),
    [rolling, setRolling] = useState(false),
    [feedback, setFeedback] = useState(''),
    [manual, setManual] = useState<Record<string, string>>({}),
    [modifiers, setModifiers] = useState<Record<string, string>>({}),
    [checks, setChecks] = useState<Record<string, string>>({}),
    [showing, setShowing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const deck = useRef<HTMLDetailsElement>(null)
  const [query, setQuery] = useState(''),
    [onlyCombat, setOnlyCombat] = useState(false)
  const current = useRef(progress)
  current.current = progress
  useEffect(() => {
    let live = true
    loadNightEncounters()
      .then((next) => {
        if (live) {
          setCards(next)
          setError('')
          setLoading(false)
        }
      })
      .catch((e) => {
        if (live) {
          setError((e as Error).message)
          setLoading(false)
        }
      })
    return () => {
      live = false
      clearTimeout(timer.current)
    }
  }, [])
  useEffect(() => {
    const select = (id?: string) => {
      if (!id || !cards.some((card) => card.id === id)) return
      onChange({
        ...current.current,
        selected: id,
        trigger: 'all',
        roll: undefined,
      })
      if (deck.current) {
        deck.current.open = true
        deck.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    const open = (event: Event) =>
      select((event as CustomEvent<{ id?: string }>).detail?.id)
    if (cards.length) {
      try {
        const requested = sessionStorage.getItem('aruzahr-night-card-request')
        if (requested) {
          sessionStorage.removeItem('aruzahr-night-card-request')
          select(requested)
        }
      } catch {}
    }
    window.addEventListener('studio-open-night-card', open)
    return () => window.removeEventListener('studio-open-night-card', open)
  }, [cards, onChange])
  const card = cards.find((c) => c.id === progress.selected)
  const owner = studio ? studio.connection.owner : true,
    online = studio ? studio.connection.online : false
  const publicRoll = (roll: StudioRoll, share: boolean) => {
    studio?.change((p) => ({
      ...p,
      rolls: [{ ...roll, secret: !share }, ...p.rolls].slice(0, 200),
      program: share
        ? {
            ...p.program,
            roll: null,
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
          }
        : p.program,
    }))
  }
  function draw() {
    if (rolling || !owner || !cards.length) return
    try {
      const roll = rollExpression(
        '1d12',
        'normal',
        '',
        'Yol karşılaşması',
        false,
        false,
      )
      const chosen = chooseNightEncounter(cards, roll.total, progress.trigger)
      publicRoll(roll, broadcastDie && online)
      onChange({ ...progress, roll: roll.total, selected: chosen?.id || '' })
      setFeedback(
        chosen
          ? ''
          : 'Sakin geçiş. Bu zar yüzünde seçtiğin koşula uygun kart yok; yeniden zar atılmadı.',
      )
      setRolling(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setRolling(false), 750)
    } catch (e) {
      setFeedback((e as Error).message)
    }
  }
  function reveal(index: number, total: number) {
    if (!card || !Number.isFinite(total)) return
    const key = card.id + ':' + index,
      clue = card.clues[index]
    if (total >= clue.dc) {
      const now = current.current
      onChange({
        ...now,
        revealed: {
          ...now.revealed,
          [card.id]: [...new Set([...(now.revealed[card.id] || []), index])],
        },
      })
      setChecks((s) => ({ ...s, [key]: `Toplam ${total} · bilgi açıldı.` }))
    } else
      setChecks((s) => ({
        ...s,
        [key]: `Toplam ${total} · bu ayrıntı henüz fark edilmedi. Başarısızlık hakikati değiştirmez; yeni bir yaklaşım olabilir.`,
      }))
  }
  function rollClue(index: number) {
    if (!card || !owner) return
    const key = card.id + ':' + index,
      modifier = Number(modifiers[key] || 0)
    if (!Number.isInteger(modifier) || modifier < -10 || modifier > 20) {
      setChecks((s) => ({
        ...s,
        [key]: 'Ek değer -10 ile +20 arasında tam sayı olmalı.',
      }))
      return
    }
    try {
      const roll = rollExpression(
        '1d20' + (modifier >= 0 ? '+' : '') + modifier,
        'normal',
        '',
        'Keşif kontrolü',
        false,
        false,
      )
      publicRoll(roll, false)
      reveal(index, roll.total)
    } catch (e) {
      setChecks((s) => ({ ...s, [key]: (e as Error).message }))
    }
  }
  async function show(portrait: boolean, portraitId?: string) {
    if (!card || !onShow || showing || !owner || !online) return
    const currentBackground = studio?.p.program.scene?.id
    const sceneId =
      portrait &&
      broadcastAssets.some(
        (a) => a.id === currentBackground && a.kind === 'scene',
      )
        ? currentBackground!
        : card.sceneId || 'night-camp'
    const art = broadcastAssets.find(
      (a) => a.id === sceneId && a.kind === 'scene',
    )
    const faceId = portraitId || card.portraitId
    const face = broadcastAssets.find(
      (a) => a.id === faceId && a.kind === 'portrait',
    )
    if (!art || (portrait && !face)) {
      setFeedback(
        'Kartın görseli henüz bulunamadı. Güncel resim dosyalarını kontrol et.',
      )
      return
    }
    const cue: DMScene = {
      id: 'night-view-' + art.id,
      title: portrait ? face!.name : art.name,
      publicTitle: portrait ? face!.name : art.name,
      backgroundId: art.id,
      portraitIds: portrait ? [faceId] : [],
      summary: '',
      readAloud: '',
      checks: [],
      actions: [],
      choices: [],
    }
    setShowing(true)
    try {
      const key = await onShow(cue, 'night-view')
      setFeedback(
        key
          ? 'Seçtiğin görsel gönderildi. Kartın DM metni gösterilmedi.'
          : 'Görsel gönderilemedi; yayın bağlantısını kontrol et.',
      )
    } catch (e) {
      setFeedback((e as Error).message)
    } finally {
      setShowing(false)
    }
  }
  const portrait = card ? artworkFor(card.portraitId) : undefined
  const choice = card?.choices.find((c) => c.id === progress.choices[card.id])
  const matches = cards.filter(
    (c) =>
      (progress.trigger === 'all' || c.triggers.includes(progress.trigger)) &&
      (!onlyCombat || c.combat) &&
      searchText(
        [
          c.title,
          c.visibleName,
          c.region,
          c.locationId,
          c.arrival,
          c.combat?.combatants.map((enemy) => enemy.name).join(' ') || '',
          ...c.triggers.map((t) => triggerLabels[t]),
          c.combat ? 'pusu canavar yaratık çatışma savaş tehlike' : '',
        ].join(' '),
      ).includes(searchText(query)),
  )
  function prepareBattle() {
    if (!studio || !card?.combat) return
    try {
      sessionStorage.setItem('aruzahr-combat-card-request', card.id)
    } catch {}
    window.dispatchEvent(
      new CustomEvent('studio-night-combat', { detail: { cardId: card.id } }),
    )
    studio.setPanel('combat')
  }
  return (
    <details ref={deck} className="night-deck" data-testid="night-deck">
      <summary>
        <Moon size={16} />
        <span>
          <strong>Karşılaşmalar · yol, pusu ve gece</strong>
          <small>
            {cards.length || 12} kart · kişi ve yaratık portreleri · 3 oyuncu,
            1. seviye
          </small>
        </span>
        <b>1d12</b>
      </summary>
      <div className="night-deck-body">
        <p className="night-intro">
          Kamp kurulduğunda, yol tehlikeli göründüğünde veya bir eşik
          aşıldığında kullan. Kartı seçmek oyunda yaşandığı anlamına gelmez;
          zamanını sen belirlersin.{' '}
          <a href="/dm/GECE-VE-PUSU-KARTLARI.md" download>
            Kim, nerede? Kısa DM rehberini indir
          </a>
        </p>
        {loading ? (
          <p role="status">Kartlar açılıyor…</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          <>
            <div className="night-draw-controls">
              <label>
                Hangi durumda?
                <select
                  aria-label="Gece kartı koşulu"
                  value={progress.trigger}
                  onChange={(e) =>
                    onChange({
                      ...progress,
                      trigger: e.target.value as NightTrigger,
                      selected: '',
                      roll: undefined,
                    })
                  }
                >
                  {Object.entries(triggerLabels).map(([id, label]) => (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={!owner || rolling}
                onClick={draw}
                data-testid="night-draw"
              >
                <Dices size={16} />
                {rolling ? 'Zar dönüyor…' : '1d12 at ve kart çek'}
              </button>
              <div
                className={`night-die ${rolling ? 'rolling' : ''}`}
                aria-label={
                  rolling
                    ? 'Zar dönüyor'
                    : progress.roll
                      ? 'Zar sonucu ' + progress.roll
                      : 'On iki yüzlü zar'
                }
              >
                <span>{rolling ? '◇' : progress.roll || '12'}</span>
              </div>
            </div>
            <label className="night-share-die">
              <input
                type="checkbox"
                checked={broadcastDie}
                disabled={!online}
                onChange={(e) => setBroadcastDie(e.target.checked)}
              />
              Yalnız zarı oyunculara da göster{' '}
              <small>Kart, gizem ve sonuç yine DM’de kalır.</small>
            </label>
            <div className="night-find">
              <label>
                <Search size={15} />
                <input
                  type="search"
                  aria-label="Karşılaşma kişisi, yaratık veya yer ara"
                  placeholder="Ulven, Sivren, Marhalden, canavar…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <button
                type="button"
                aria-pressed={onlyCombat}
                onClick={() => setOnlyCombat((v) => !v)}
              >
                <Swords size={14} />
                {onlyCombat ? 'Savaşlı kartlar' : 'Yalnız pusu ve canavar'}
              </button>
            </div>
            <nav className="night-catalogue" aria-label="Karşılaşma kartları">
              {matches.map((c) => {
                const art = artworkFor(c.portraitId)
                return (
                  <button
                    type="button"
                    key={c.id}
                    aria-pressed={progress.selected === c.id}
                    onClick={() => {
                      onChange({ ...progress, selected: c.id, roll: undefined })
                      setFeedback('')
                    }}
                    data-night-id={c.id}
                  >
                    {art && <img src={art.src} alt="" loading="lazy" />}
                    <span>
                      <strong>{c.visibleName}</strong>
                      <small>{c.title}</small>
                      {c.combat && (
                        <small className="night-catalogue-opponents">
                          {c.combat.combatants
                            .map((enemy) => enemy.name.split(' · ')[0])
                            .join(' · ')}
                        </small>
                      )}
                      <em>
                        {locationById(c.locationId)?.name || c.region} ·{' '}
                        {c.combat ? 'Pusu / çatışma' : 'Keşif / olay'}
                      </em>
                    </span>
                  </button>
                )
              })}
              {!matches.length && (
                <p>
                  Bu aramada kart bulunamadı. Koşulu veya savaş filtresini
                  değiştirebilirsin.
                </p>
              )}
            </nav>
            {feedback && (
              <p role="status" className="night-feedback">
                {feedback}
              </p>
            )}
            {card && (
              <article
                className={'night-card mood-' + card.mood}
                data-testid="night-card"
              >
                <header>
                  <div>
                    <small>
                      {triggerLabels[progress.trigger]} · {card.die.min}
                      {card.die.max !== card.die.min ? '–' + card.die.max : ''}
                    </small>
                    <h3>{card.title}</h3>
                    <p>{card.arrival}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Gece kartını kapat"
                    onClick={() => onChange({ ...progress, selected: '' })}
                  >
                    <X size={15} />
                  </button>
                </header>
                <div className="night-location">
                  <span>
                    <MapPin size={14} />
                    {locationById(card.locationId)?.name || card.region} çevresi
                  </span>
                  <small>
                    {card.triggers
                      .map((trigger) => triggerLabels[trigger])
                      .join(' · ')}
                  </small>
                  {onMap && (
                    <button
                      type="button"
                      onClick={() => onMap(card.locationId)}
                    >
                      Haritada çevresini bul
                    </button>
                  )}
                </div>
                <div className="night-card-art">
                  {portrait && (
                    <figure>
                      <img
                        src={portrait.src}
                        alt={card.visibleName}
                        loading="lazy"
                      />
                      <figcaption>{card.visibleName}</figcaption>
                    </figure>
                  )}
                  <div>
                    <p>
                      Portreyi veya mekânı yalnız hazır olduğunda göster. Kartın
                      gizli metni oyunculara gönderilmez.
                    </p>
                    <button
                      type="button"
                      disabled={!onShow || showing || !owner || !online}
                      onClick={() => void show(true)}
                    >
                      <Eye size={14} />
                      Portreyi göster
                    </button>
                    <button
                      type="button"
                      disabled={!onShow || showing || !owner || !online}
                      onClick={() => void show(false)}
                    >
                      <Eye size={14} />
                      Mekânı göster
                    </button>
                  </div>
                </div>
                <section className="night-read">
                  <span>OYUNCULARA OKU · BETİMLEME</span>
                  <blockquote>{card.readAloud}</blockquote>
                </section>
                {card.combat && (
                  <section
                    className="night-combat"
                    data-testid="night-combat-plan"
                  >
                    <header>
                      <Swords size={18} />
                      <h4>Çatışma çıkarsa</h4>
                      <button
                        type="button"
                        disabled={!studio || !owner}
                        onClick={prepareBattle}
                      >
                        Savaş masasında aç
                      </button>
                    </header>
                    <p className="night-danger">{card.combat.danger}</p>
                    <dl>
                      <dt>Önce hangi işaretleri göster?</dt>
                      <dd>{card.combat.telegraph}</dd>
                      <dt>Düşmanın amacı</dt>
                      <dd>{card.combat.enemyGoal}</dd>
                    </dl>
                    <div className="night-enemies">
                      {card.combat.combatants.map((enemy) => {
                        const face = enemy.portraitId
                          ? artworkFor(enemy.portraitId)
                          : undefined
                        return (
                          <article key={enemy.id}>
                            <div className="night-enemy-heading">
                              {face && (
                                <img
                                  src={face.src}
                                  alt={enemy.name}
                                  loading="lazy"
                                />
                              )}
                              <strong>
                                {enemy.name}
                                {enemy.count > 1 ? ` × ${enemy.count}` : ''}
                              </strong>
                            </div>
                            <span>
                              Zırh {enemy.ac} · Can {enemy.hp} · İnisiyatif{' '}
                              {enemy.initiative >= 0 ? '+' : ''}
                              {enemy.initiative}
                            </span>
                            <p>{enemy.attack}</p>
                            {face && (
                              <button
                                type="button"
                                disabled={
                                  !onShow || showing || !owner || !online
                                }
                                onClick={() =>
                                  void show(true, enemy.portraitId)
                                }
                              >
                                <Eye size={13} />
                                {enemy.name.split(' · ')[0]} portresini göster
                              </button>
                            )}
                          </article>
                        )
                      })}
                    </div>
                    <ol>
                      {card.combat.tactics.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ol>
                    <p>
                      <strong>Ne zaman bırakırlar?</strong> {card.combat.morale}
                    </p>
                    <p>
                      <strong>Kaçış ve başka çözüm:</strong>{' '}
                      {card.combat.escape}
                    </p>
                    <small>
                      Bu plan yalnız DM’de. Savaş masasında açmak düşmanları
                      veya can değerlerini oyunculara göstermez.
                    </small>
                  </section>
                )}
                <details className="night-private" data-testid="night-truth">
                  <summary>
                    <Shield size={13} />
                    Yalnız DM · gerçekte ne oluyor?
                  </summary>
                  <p>{card.dmTruth}</p>
                  <ul>
                    {card.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </details>
                <section className="night-clues">
                  <h4>Neyi fark edebilirler?</h4>
                  {card.clues.map((clue, index) => {
                    const key = card.id + ':' + index,
                      known =
                        clue.dc === 0 ||
                        (progress.revealed[card.id] || []).includes(index)
                    return (
                      <article
                        key={index}
                        className={known ? 'known' : ''}
                        data-testid="night-clue"
                      >
                        <header>
                          <strong>
                            {clue.dc === 0
                              ? 'Zarsız görünür'
                              : `DC ${clue.dc} · ${clue.skill}`}
                          </strong>
                          {known && <small>BİLGİ AÇIK</small>}
                        </header>
                        {known ? (
                          <p className="night-discovery">{clue.discovery}</p>
                        ) : (
                          <>
                            <p className="night-private-clue">
                              {clue.discovery}
                            </p>
                            <small>
                              Bu ayrıntıyı henüz oyunculara okuma. Gerçek sonucu
                              aşağıya gir veya bir kez zar at.
                            </small>
                            <div className="night-clue-controls">
                              <label>
                                Oyuncunun toplamı
                                <input
                                  aria-label={clue.skill + ' toplamı ' + index}
                                  type="number"
                                  min="-10"
                                  max="60"
                                  value={manual[key] || ''}
                                  onChange={(e) =>
                                    setManual((s) => ({
                                      ...s,
                                      [key]: e.target.value,
                                    }))
                                  }
                                />
                              </label>
                              <button
                                type="button"
                                disabled={
                                  !owner ||
                                  manual[key] === undefined ||
                                  manual[key] === ''
                                }
                                onClick={() =>
                                  reveal(index, Number(manual[key]))
                                }
                              >
                                Sonucu uygula
                              </button>
                              <label>
                                Ek değer
                                <input
                                  aria-label={
                                    clue.skill + ' ek değeri ' + index
                                  }
                                  type="number"
                                  min="-10"
                                  max="20"
                                  value={modifiers[key] || '0'}
                                  onChange={(e) =>
                                    setModifiers((s) => ({
                                      ...s,
                                      [key]: e.target.value,
                                    }))
                                  }
                                />
                              </label>
                              <button
                                type="button"
                                disabled={!owner}
                                onClick={() => rollClue(index)}
                              >
                                1d20 + ek değer at
                              </button>
                            </div>
                          </>
                        )}
                        {checks[key] && <p role="status">{checks[key]}</p>}
                      </article>
                    )
                  })}
                </section>
                <details className="night-obstacle">
                  <summary>Engeli masada nasıl oynatırım?</summary>
                  <p>
                    <strong>Amaç:</strong> {card.obstacle.goal}
                  </p>
                  <ol>
                    {card.obstacle.rounds.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ol>
                  <p>
                    <strong>Başarılı olursa:</strong> {card.obstacle.success}
                  </p>
                  <p>
                    <strong>Aksilik olursa:</strong> {card.obstacle.failure}
                  </p>
                  <ul>
                    {card.obstacle.checks.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </details>
                <details className="night-voice">
                  <summary>Karakteri nasıl konuştururum?</summary>
                  <h4>{card.voice.speaker}</h4>
                  <p>{card.voice.direction}</p>
                  {card.voice.lines.map((line, i) => (
                    <div key={i}>
                      <strong>{line.cue}</strong>
                      <blockquote>{line.line}</blockquote>
                    </div>
                  ))}
                </details>
                <details className="night-choices">
                  <summary>Masada hangi yol seçildi?</summary>
                  {card.choices.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      aria-pressed={choice?.id === c.id}
                      onClick={() =>
                        onChange({
                          ...progress,
                          choices: { ...progress.choices, [card.id]: c.id },
                        })
                      }
                    >
                      {c.label}
                    </button>
                  ))}
                  {choice && (
                    <div className="night-choice-result">
                      <p>{choice.result}</p>
                      <details>
                        <summary>İlerideki yankısı</summary>
                        <p>{choice.echo}</p>
                      </details>
                      <button
                        type="button"
                        onClick={() => {
                          const choices = { ...progress.choices }
                          delete choices[card.id]
                          onChange({ ...progress, choices })
                        }}
                      >
                        <RotateCcw size={12} />
                        Seçimi temizle
                      </button>
                    </div>
                  )}
                </details>
                <label className="night-note">
                  Yalnız DM · bu masada ne oldu?
                  <textarea
                    aria-label={card.title + ' özel notu'}
                    maxLength={6000}
                    value={progress.notes[card.id] || ''}
                    onChange={(e) =>
                      onChange({
                        ...progress,
                        notes: { ...progress.notes, [card.id]: e.target.value },
                      })
                    }
                  />
                </label>
                <div className="night-continuation">
                  <strong>Buradan sonra</strong>
                  <p>{card.continuation}</p>
                </div>
              </article>
            )}
          </>
        )}
      </div>
    </details>
  )
}
