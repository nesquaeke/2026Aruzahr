import { useEffect, useRef, useState } from 'react'
import type { BroadcastState } from '../broadcast-state'
import type { AudioAsset } from './types'
import { api } from './connection'
import { freshId } from '../broadcast-state'

export const builtins = [
  ['wind', 'Karlan rüzgârı', 'ambience'],
  ['rain', 'Yağmur', 'ambience'],
  ['sea', 'Liman ve dalga', 'ambience'],
  ['fire', 'Ocak ateşi', 'ambience'],
  ['forest', 'Orman', 'ambience'],
  ['crowd', 'Kalabalık uğultusu', 'ambience'],
  ['cave', 'Mağara', 'ambience'],
  ['caravan', 'Kervan', 'ambience'],
  ['battle', 'Uzak çatışma', 'ambience'],
  ['calm', 'Sakin armonik doku', 'music'],
  ['knock', 'Kapı vurma', 'effect'],
  ['dice', 'Zar sesleri', 'effect'],
].map(([id, name, type]) => ({ id: 'builtin-' + id, name, type }))

type Voice = {
  audio: HTMLAudioElement
  key: string
  fade: number | null
  starting: boolean
}
export default function StudioAudio({
  state,
  role,
  assets = [],
  enabled = true,
}: {
  state: BroadcastState
  role: 'operator' | 'audience'
  assets?: AudioAsset[]
  enabled?: boolean
}) {
  const [unlocked, setUnlocked] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [lease, setLease] = useState(role === 'operator')
  const identity = useRef(freshId('audio'))
  const active =
    enabled &&
    state.studio?.audio?.owner === role &&
    !state.studio.audio.muted &&
    ((['music', 'ambience', 'effect'] as const).some(
      (k) => state.studio?.audio?.[k]?.playing,
    ) ||
      !!(state.intermission && state.studio.break?.ambientId))
  const retiring = useRef(new Set<HTMLAudioElement>())
  const timers = useRef(new Set<number>())
  const [heard] = useState(() => {
    try {
      const raw: unknown = JSON.parse(
        sessionStorage.getItem('aruzahr-studio-heard-effects') || '[]',
      )
      return new Set(
        Array.isArray(raw)
          ? raw.filter((id): id is string => typeof id === 'string').slice(-200)
          : [],
      )
    } catch {
      return new Set<string>()
    }
  })
  const seen = useRef(heard)
  const voices = useRef(new Map<string, Voice>())
  const latest = useRef({ state, assets, active })
  latest.current = { state, assets, active }

  function report(status: 'playing' | 'blocked' | 'idle') {
    if (role === 'audience')
      void api('audio-lease', { id: identity.current, status }).catch(() => {})
    window.dispatchEvent(
      new CustomEvent('studio-audio-status', {
        detail: {
          role,
          status:
            status === 'playing'
              ? 'Çalıyor'
              : status === 'blocked'
                ? 'Tarayıcı sesi başlatmanı bekliyor'
                : 'Ses durdu',
        },
      }),
    )
  }

  useEffect(() => {
    if (role !== 'audience' || !active) {
      setLease(role === 'operator')
      return
    }
    let cancelled = false
    const claim = () =>
      api('audio-lease', { id: identity.current })
        .then((v) => {
          if (!cancelled) setLease(!!v.granted)
        })
        .catch(() => {
          if (!cancelled) setLease(false)
        })
    void claim()
    const timer = setInterval(() => void claim(), 2500)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [role, active])

  function clearFade(id: number | null) {
    if (id !== null) {
      clearInterval(id)
      timers.current.delete(id)
    }
  }
  function fade(
    audio: HTMLAudioElement,
    target: number,
    ms: number,
    stop = false,
  ) {
    const start = audio.volume,
      at = performance.now()
    if (stop) retiring.current.add(audio)
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - at) / Math.max(ms, 1))
      audio.volume = Math.max(
        0,
        Math.min(1, start + (target - start) * progress),
      )
      if (progress === 1) {
        clearFade(timer)
        if (stop) {
          retiring.current.delete(audio)
          audio.pause()
          audio.removeAttribute('src')
          audio.load()
        }
      }
    }, 30)
    timers.current.add(timer)
    return timer
  }
  function stop() {
    if (voices.current.size) report('idle')
    for (const timer of timers.current) clearInterval(timer)
    timers.current.clear()
    for (const audio of retiring.current) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
    retiring.current.clear()
    for (const voice of voices.current.values()) {
      voice.audio.pause()
      voice.audio.removeAttribute('src')
      voice.audio.load()
    }
    voices.current.clear()
  }
  function start(name: string, voice: Voice, level: number, fadeMs: number) {
    if (voice.starting) return
    voice.starting = true
    void voice.audio
      .play()
      .then(() => {
        if (voices.current.get(name) !== voice) {
          voice.audio.pause()
          return
        }
        if (name === 'effect') {
          seen.current.add(voice.key)
          try {
            sessionStorage.setItem(
              'aruzahr-studio-heard-effects',
              JSON.stringify([...seen.current].slice(-200)),
            )
          } catch {
            /* In-memory deduplication still applies. */
          }
        }
        report('playing')
        setBlocked(false)
        setUnlocked(true)
        clearFade(voice.fade)
        voice.fade = fade(voice.audio, level, fadeMs)
      })
      .catch(() => {
        if (voices.current.get(name) !== voice) return
        setBlocked(true)
        report('blocked')
      })
      .finally(() => {
        voice.starting = false
      })
  }
  function sync() {
    const { state, assets, active } = latest.current,
      config = state.studio?.audio
    if (!active || !lease || !config) {
      stop()
      return
    }
    const desired = new Set<string>()
    for (const name of ['music', 'ambience', 'effect'] as const) {
      let channel = config[name]
      if (
        name === 'ambience' &&
        state.intermission &&
        state.studio?.break?.ambientId
      ) {
        channel = {
          id: state.studio.break.ambientId,
          label: 'Ara ortamı',
          playing: true,
          volume: 0.35,
          loop: true,
          trigger: 'break',
        }
      }
      if (
        !channel?.playing ||
        (name === 'effect' && channel.at && Date.now() - channel.at > 10000)
      )
        continue
      desired.add(name)
      const key = channel.id + (name === 'effect' ? channel.trigger : '')
      const existing = voices.current.get(name),
        level = channel.volume * (state.intermission ? 0.6 : 1)
      if (
        name === 'effect' &&
        seen.current.has(key) &&
        (!existing || existing.audio.paused)
      )
        continue
      if (existing?.key === key) {
        clearFade(existing.fade)
        if (existing.audio.paused) start(name, existing, level, config.fadeMs)
        else existing.fade = fade(existing.audio, level, config.fadeMs)
        continue
      }
      if (existing) {
        clearFade(existing.fade)
        fade(existing.audio, 0, config.fadeMs, true)
        voices.current.delete(name)
      }
      const asset = assets.find((a) => a.id === channel!.id)
      const src =
        asset?.src ||
        (channel.id.startsWith('builtin-')
          ? `/audio/${channel.id}.wav`
          : `/__aruzahr-broadcast/asset/${channel.id}`)
      const audio = new Audio(src)
      audio.loop = name !== 'effect' && channel.loop
      audio.volume = 0
      const voice: Voice = { audio, key, fade: null, starting: false }
      voices.current.set(name, voice)
      audio.onended = () => {
        if ([...voices.current.values()].every((v) => v.audio.paused))
          report('idle')
      }
      start(name, voice, level, config.fadeMs)
    }
    for (const [name, voice] of voices.current)
      if (!desired.has(name)) {
        clearFade(voice.fade)
        fade(voice.audio, 0, config.fadeMs, true)
        voices.current.delete(name)
      }
  }
  useEffect(() => {
    sync()
  }, [
    state.studio?.audio,
    state.intermission,
    state.studio?.break?.ambientId,
    lease,
    enabled,
    unlocked,
  ])
  useEffect(() => () => stop(), [])
  return active && lease && (!unlocked || blocked) ? (
    <button
      className={`studio-audio-unlock ${role}`}
      onClick={() => {
        setUnlocked(true)
        setBlocked(false)
        sync()
      }}
    >
      {blocked ? 'Ses engellendi · başlat' : 'Sesi başlat'}
    </button>
  ) : null
}
