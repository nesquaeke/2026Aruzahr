import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { Dices, Minus, Plus, Volume2, VolumeX } from 'lucide-react'
import { createBroadcastRoll, DICE_SIDES, rollFormula, type BroadcastRoll } from './broadcast-dice-engine'
import './broadcast-dice.css'

export type { BroadcastRoll } from './broadcast-dice-engine'

type DiceProps = {
  onRoll?: (roll: BroadcastRoll) => void
  compact?: boolean
}

const SETTLE_MS = 1150

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

function useRolling(roll: BroadcastRoll | null) {
  const reduced = useReducedMotion()
  const [settledId, setSettledId] = useState<string | null>(null)
  useEffect(() => {
    if (!roll) return
    const timer = window.setTimeout(() => setSettledId(roll.id), reduced ? 0 : SETTLE_MS)
    return () => window.clearTimeout(timer)
  }, [roll?.id, reduced])
  return !!roll && !reduced && settledId !== roll.id
}

type AudioState = { context: AudioContext; activeGain: GainNode | null }
type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext }

// This is called only inside the user's roll gesture. No audio is started by
// mounting the component, receiving a stage update, or replaying old results.
function playDiceSound(audio: { current: AudioState | null }, count: number) {
  const Context = window.AudioContext || (window as AudioWindow).webkitAudioContext
  if (!Context) return false
  try {
    if (!audio.current || audio.current.context.state === 'closed') {
      audio.current = { context: new Context(), activeGain: null }
    }
    const { context } = audio.current
    void context.resume().catch(() => {})
    const master = context.createGain()
    master.gain.value = 0.2
    master.connect(context.destination)
    audio.current.activeGain = master
    const noise = context.createBuffer(1, 4096, context.sampleRate)
    const channel = noise.getChannelData(0)
    let seed = 0x1234abcd
    for (let index = 0; index < channel.length; index++) {
      seed ^= seed << 13
      seed ^= seed >>> 17
      seed ^= seed << 5
      channel[index] = (seed >>> 0) / 0x80000000 - 1
    }
    const now = context.currentTime
    const impacts = [0, 0.1, 0.22, 0.37, 0.55, 0.76, 0.95]
    impacts.forEach((delay, index) => {
      const at = now + delay
      const source = context.createBufferSource()
      source.buffer = noise
      source.playbackRate.value = 0.85 + (index % 3) * 0.19
      const filter = context.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 1400 + index * 160
      const envelope = context.createGain()
      envelope.gain.setValueAtTime(0.001, at)
      envelope.gain.exponentialRampToValueAtTime((0.42 + Math.min(count, 6) * 0.04) * (1 - index * 0.1), at + 0.003)
      envelope.gain.exponentialRampToValueAtTime(0.001, at + 0.08)
      source.connect(filter)
      filter.connect(envelope)
      envelope.connect(master)
      source.start(at)
      source.stop(at + 0.085)
      source.onended = () => { source.disconnect(); filter.disconnect(); envelope.disconnect() }

      const thud = context.createOscillator()
      const body = context.createGain()
      thud.frequency.setValueAtTime(180 - index * 10, at)
      thud.frequency.exponentialRampToValueAtTime(65, at + 0.07)
      body.gain.setValueAtTime(0.16 * (1 - index * 0.1), at)
      body.gain.exponentialRampToValueAtTime(0.001, at + 0.075)
      thud.connect(body)
      body.connect(master)
      thud.start(at)
      thud.stop(at + 0.08)
      thud.onended = () => { thud.disconnect(); body.disconnect() }
    })
    window.setTimeout(() => master.disconnect(), 1400)
    return true
  } catch {
    return false
  }
}

const geometry: Record<number, { outline: string; facets: string[]; lines: string }> = {
  4: { outline: '60,9 112,103 8,103', facets: ['60,9 60,72 8,103', '60,9 112,103 60,72', '8,103 60,72 112,103'], lines: 'M60 9V72L8 103M60 72L112 103' },
  6: { outline: '60,7 109,34 109,90 60,116 11,90 11,34', facets: ['60,7 109,34 60,61 11,34', '11,34 60,61 60,116 11,90', '60,61 109,34 109,90 60,116'], lines: 'M11 34L60 61L109 34M60 61V116' },
  8: { outline: '60,5 110,61 60,117 10,61', facets: ['60,5 85,61 35,61', '10,61 60,5 35,61', '60,5 110,61 85,61', '35,61 85,61 60,117', '10,61 35,61 60,117', '85,61 110,61 60,117'], lines: 'M60 5L35 61L60 117L85 61Z M10 61H110' },
  10: { outline: '60,5 104,30 114,72 60,117 6,72 16,30', facets: ['60,5 82,48 60,88 38,48', '60,5 104,30 82,48', '104,30 114,72 82,48', '82,48 114,72 60,117 60,88', '60,5 38,48 16,30', '16,30 38,48 6,72', '38,48 60,88 60,117 6,72'], lines: 'M60 5L38 48L60 88L82 48Z M16 30L38 48L6 72M104 30L82 48L114 72M60 88V117' },
  12: { outline: '39,7 82,7 112,38 112,81 82,111 39,111 8,81 8,38', facets: ['60,27 87,47 77,79 43,79 33,47', '39,7 82,7 60,27', '82,7 112,38 87,47 60,27', '112,38 112,81 77,79 87,47', '112,81 82,111 77,79', '82,111 39,111 43,79 77,79', '39,111 8,81 43,79', '8,81 8,38 33,47 43,79', '8,38 39,7 60,27 33,47'], lines: 'M60 27L87 47L77 79H43L33 47Z M39 7L60 27L82 7M112 38L87 47M112 81L77 79L82 111M39 111L43 79L8 81M8 38L33 47' },
  20: { outline: '60,5 109,33 109,88 60,116 11,88 11,33', facets: ['60,5 83,44 37,44', '11,33 37,44 60,5', '60,5 109,33 83,44', '37,44 83,44 60,87', '11,33 37,44 11,88', '37,44 60,87 11,88', '83,44 109,33 109,88', '83,44 109,88 60,87', '11,88 60,87 60,116', '60,87 109,88 60,116'], lines: 'M60 5L37 44H83Z M11 33L37 44L11 88L60 87L109 88L83 44L109 33M37 44L60 87L83 44M60 87V116' },
  100: { outline: '60,5 104,30 114,72 60,117 6,72 16,30', facets: ['60,5 82,48 60,88 38,48', '60,5 104,30 82,48', '104,30 114,72 82,48', '82,48 114,72 60,117 60,88', '60,5 38,48 16,30', '16,30 38,48 6,72', '38,48 60,88 60,117 6,72'], lines: 'M60 5L38 48L60 88L82 48Z M16 30L38 48L6 72M104 30L82 48L114 72M60 88V117' },
}

function Die({ sides, value, rolling = false, index = 0 }: { sides: number; value?: number; rolling?: boolean; index?: number }) {
  const id = useId().replace(/:/g, '')
  const shape = geometry[sides] ?? geometry[20]
  return <div className={`bd-die bd-die-${sides}${rolling ? ' is-tumbling' : ''}`} style={{ '--die-index': index } as CSSProperties} aria-hidden="true">
    <div className="bd-die-shadow" />
    <svg className="bd-die-body" viewBox="0 0 120 122">
      <defs>
        <linearGradient id={`die-${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f4df9e" /><stop offset="0.43" stopColor="#ac7a35" /><stop offset="1" stopColor="#49351e" /></linearGradient>
        <linearGradient id={`face-${id}`} x1="0" y1="0" x2="0.8" y2="1"><stop offset="0" stopColor="#403d35" /><stop offset="1" stopColor="#171b1c" /></linearGradient>
      </defs>
      <polygon points={shape.outline} fill={`url(#face-${id})`} stroke={`url(#die-${id})`} strokeWidth="1.7" strokeLinejoin="round" />
      {shape.facets.map((points, face) => <polygon key={face} points={points} fill={face % 3 === 0 ? '#f0d69a' : '#050c13'} opacity={face % 3 === 0 ? 0.1 : face % 3 === 1 ? 0.18 : 0.02} />)}
      <path d={shape.lines} fill="none" stroke={`url(#die-${id})`} strokeWidth="0.7" opacity="0.5" />
      <text x="60" y={sides === 4 ? '82' : '69'} textAnchor="middle" className="bd-die-value" style={{ fontSize: value === 100 ? 28 : undefined }}>{rolling ? '·' : value ?? sides}</text>
    </svg>
  </div>
}

function naturalResult(roll: BroadcastRoll | null) {
  if (roll?.sides !== 20 || roll.count !== 1) return ''
  return roll.values[0] === 20 ? 'critical' : roll.values[0] === 1 ? 'fumble' : ''
}

function breakdown(roll: BroadcastRoll) {
  return `${roll.values.join(' + ')}${roll.modifier ? ` ${roll.modifier > 0 ? '+' : '−'} ${Math.abs(roll.modifier)}` : ''}`
}

function clampInteger(value: string | number, min: number, max: number, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && String(value).trim() ? Math.max(min, Math.min(max, Math.trunc(parsed))) : fallback
}

export default function BroadcastDice({ onRoll, compact = false }: DiceProps) {
  const [sides, setSides] = useState(20)
  const [countInput, setCountInput] = useState('1')
  const [modifierInput, setModifierInput] = useState('0')
  const [roll, setRoll] = useState<BroadcastRoll | null>(null)
  const [history, setHistory] = useState<BroadcastRoll[]>([])
  const [muted, setMuted] = useState(false)
  const [audioUnavailable, setAudioUnavailable] = useState(false)
  const [error, setError] = useState('')
  const audio = useRef<AudioState | null>(null)
  const rolling = useRolling(roll)
  const count = clampInteger(countInput, 1, 12, 1)
  const modifier = clampInteger(modifierInput, -99, 99, 0)
  const resultKind = naturalResult(roll)

  useEffect(() => () => { if (audio.current) void audio.current.context.close().catch(() => {}) }, [])

  const submitRoll = (event: FormEvent) => {
    event.preventDefault()
    if (rolling) return
    try {
      const next = createBroadcastRoll(sides, count, modifier)
      setCountInput(String(count))
      setModifierInput(String(modifier))
      setError('')
      setRoll(next)
      setHistory(previous => [next, ...previous].slice(0, 20))
      if (!muted && !playDiceSound(audio, count)) setAudioUnavailable(true)
      onRoll?.(next)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Zar atılamadı. Yeniden deneyin.')
    }
  }

  const toggleMute = () => {
    if (!muted && audio.current?.activeGain) audio.current.activeGain.gain.setValueAtTime(0, audio.current.context.currentTime)
    setMuted(previous => !previous)
  }

  return <section className={`broadcast-dice${compact ? ' is-compact' : ''}`} aria-label="Zar masası" data-testid="broadcast-dice">
    <header className="bd-heading"><div><span className="bd-eyebrow">KADERİNİ YUVARLA</span><h3>Zar masası</h3></div><button type="button" className="bd-sound" onClick={toggleMute} aria-label={muted ? 'Zar sesini aç' : 'Zar sesini kapat'} aria-pressed={muted} title={muted ? 'Ses kapalı' : 'Ses açık'}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button></header>
    <div className={`bd-operator-result${resultKind ? ` is-${resultKind}` : ''}`}>
      <div className="bd-operator-die" key={roll?.id ?? 'ready'}><Die sides={roll?.sides ?? sides} value={roll?.values[0]} rolling={rolling} /></div>
      <div className="bd-operator-reading" role="status" aria-live="polite" aria-atomic="true">
        <span className="bd-eyebrow">{rolling ? 'ZARLAR DÖNÜYOR' : roll ? 'SON ATIŞ' : 'MASA HAZIR'}</span>
        <strong className="bd-total" data-testid="dice-total">{rolling ? '…' : roll?.total ?? '—'}</strong>
        <span className="bd-result-formula">{roll ? rollFormula(roll) : 'Bir zar seç. Hikâye başlasın.'}</span>
        {roll && !rolling && <span className="bd-breakdown">{breakdown(roll)}{roll.count > 1 || roll.modifier ? ` = ${roll.total}` : ''}</span>}
        {resultKind && !rolling && <span className={`bd-natural is-${resultKind}`}>{resultKind === 'critical' ? 'Doğal 20' : 'Doğal 1'}</span>}
      </div>
    </div>
    <form onSubmit={submitRoll} className="bd-controls">
      <fieldset className="bd-types"><legend>Zar türü</legend><div>{DICE_SIDES.map(option => <button type="button" key={option} className={sides === option ? 'is-selected' : ''} onClick={() => setSides(option)} aria-pressed={sides === option} aria-label={`d${option} zarı`}><span>d</span>{option}</button>)}</div></fieldset>
      <div className="bd-number-controls">
        <label className="bd-number-label">Zar adedi<div className="bd-stepper"><button type="button" onClick={() => setCountInput(String(Math.max(1, count - 1)))} disabled={count <= 1} aria-label="Zar adedini azalt"><Minus size={13} /></button><input type="number" min="1" max="12" step="1" inputMode="numeric" aria-label="Zar adedi" value={countInput} onChange={event => setCountInput(event.target.value)} onBlur={() => setCountInput(String(count))} /><button type="button" onClick={() => setCountInput(String(Math.min(12, count + 1)))} disabled={count >= 12} aria-label="Zar adedini artır"><Plus size={13} /></button></div></label>
        <label className="bd-number-label">Ek değer<div className="bd-stepper"><button type="button" onClick={() => setModifierInput(String(Math.max(-99, modifier - 1)))} disabled={modifier <= -99} aria-label="Ek değeri azalt"><Minus size={13} /></button><input type="number" min="-99" max="99" step="1" inputMode="numeric" aria-label="Ek değer" value={modifierInput} onChange={event => setModifierInput(event.target.value)} onBlur={() => setModifierInput(String(modifier))} /><button type="button" onClick={() => setModifierInput(String(Math.min(99, modifier + 1)))} disabled={modifier >= 99} aria-label="Ek değeri artır"><Plus size={13} /></button></div></label>
      </div>
      <button className="bd-roll-button" type="submit" disabled={rolling}><Dices size={19} /><span>{rolling ? 'Zarlar dönüyor…' : 'Zarları at'}</span><small>{rollFormula({ count, sides, modifier })}</small></button>
      {error && <p className="bd-error" role="alert">{error}</p>}
      {audioUnavailable && !muted && <p className="bd-audio-note">Bu tarayıcıda zar sesi kullanılamıyor.</p>}
    </form>
    <div className="bd-history"><div className="bd-history-heading"><span>Atış geçmişi</span><span>{history.length ? `${history.length} / 20` : 'Bu oturum'}</span></div>
      {history.length ? <ol aria-label="Son 20 zar atışı">{history.map((entry, index) => <li key={entry.id}><span className="bd-history-index">{String(history.length - index).padStart(2, '0')}</span><div><span className="bd-history-formula">{rollFormula(entry)}</span><span className="bd-history-values">{index === 0 && rolling ? 'Zarlar dönüyor…' : breakdown(entry)}</span></div><strong className={naturalResult(entry) ? `is-${naturalResult(entry)}` : ''}>{index === 0 && rolling ? '…' : entry.total}</strong></li>)}</ol> : <p className="bd-history-empty">İlk atışın burada yerini alacak.</p>}
    </div>
  </section>
}

export function BroadcastDiceDisplay({ roll }: { roll: BroadcastRoll | null }) {
  const rolling = useRolling(roll)
  const resultKind = naturalResult(roll)
  if (!roll) return null
  return <div className={`broadcast-dice-display${rolling ? ' is-rolling' : ' is-settled'}${resultKind ? ` is-${resultKind}` : ''}`} data-testid="broadcast-dice-display" data-roll-id={roll.id}>
    <div className="bd-stage-heading"><span className="bd-stage-line" /><span>{rolling ? 'KADER DÖNÜYOR' : 'ZARLAR KONUŞTU'}</span><span className="bd-stage-line" /></div>
    <div className={`bd-stage-dice${roll.count > 5 ? ' is-many' : ''}`} key={roll.id}>{roll.values.map((value, index) => <Die key={index} sides={roll.sides} value={value} rolling={rolling} index={index} />)}</div>
    <div className="bd-stage-result" role="status" aria-live="polite" aria-atomic="true"><span className="bd-stage-formula">{rollFormula(roll)}</span><strong className="bd-stage-total">{rolling ? '…' : roll.total}</strong><span className="bd-stage-breakdown">{rolling ? 'Zarlar dönüyor…' : `${breakdown(roll)}${roll.count > 1 || roll.modifier ? ` = ${roll.total}` : ''}`}</span>{resultKind && !rolling && <span className={`bd-natural is-${resultKind}`}>{resultKind === 'critical' ? 'Doğal 20' : 'Doğal 1'}</span>}</div>
  </div>
}
