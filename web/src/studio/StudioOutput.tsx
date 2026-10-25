import { useCallback, useEffect, useRef, useState } from 'react'
import BroadcastStage from '../BroadcastStage'
import {
  newBroadcastState,
  loadBroadcast,
  validateBroadcastState,
} from '../broadcast-state'
import type { BroadcastState } from '../broadcast-state'
import { useBroadcastRelay } from '../useBroadcastRelay'
import type { OutputKind } from './types'
import StudioAudio from './StudioAudio'
import '../broadcast-workspace.css'
import './studio.css'
export default function StudioOutput({ kind = 'main' }: { kind?: OutputKind }) {
  const [state, setState] = useState(newBroadcastState),
    [online, setOnline] = useState(false),
    [previous, setPrevious] = useState<BroadcastState | null>(null)
  const latest = useRef(state),
    received = useRef(false),
    serverStudio = useRef(false)
  latest.current = state
  const receive = useCallback((next: BroadcastState) => {
    received.current = true
    if (
      next.studio?.transition === 'fade' &&
      next.studio.takenAt !== latest.current.studio?.takenAt
    )
      setPrevious(latest.current)
    setState(next)
  }, [])
  useBroadcastRelay({
    state,
    ready: true,
    readOnly: true,
    onState: (next) => {
      serverStudio.current = !!next.studio
      receive(next)
    },
    onConnection: setOnline,
  })
  useEffect(() => {
    let cancelled = false
    loadBroadcast()
      .then((s) => {
        if (s && !cancelled && !received.current) setState(s)
      })
      .catch(() => {})
    const bus = new BroadcastChannel('aruzahr-broadcast-v1')
    bus.postMessage({ type: 'hello-audience', sender: 'studio-output' })
    bus.onmessage = (e) => {
      if (e.data?.type === 'state') {
        try {
          const next = validateBroadcastState(e.data.state)
          if (!next.studio && !serverStudio.current) {
            receive(next)
            setOnline(true)
          }
        } catch {}
      }
    }
    const t = setInterval(
      () =>
        bus.postMessage({
          type: 'audience-heartbeat',
          sender: 'studio-output',
        }),
      3000,
    )
    return () => {
      cancelled = true
      clearInterval(t)
      bus.postMessage({ type: 'goodbye-audience', sender: 'studio-output' })
      bus.close()
    }
  }, [receive])
  useEffect(() => {
    if (!previous) return
    const t = setTimeout(() => setPrevious(null), 850)
    return () => clearTimeout(t)
  }, [previous])
  const filtered = (s: BroadcastState): BroadcastState => {
    if (kind === 'main') return s
    const out = {
      ...s,
      actors: kind === 'portraits' ? s.actors : [],
      roll: kind === 'dice' ? s.roll : null,
      cameraLane: false,
      showNames: s.showNames,
      intermission: kind === 'break',
      blackout: false,
      title: '',
      mode: kind === 'map' ? ('map' as const) : ('scene' as const),
      studio: s.studio
        ? {
            ...s.studio,
            reveal: undefined,
            weather: 'none' as const,
            cameraSlots: 0,
            poll: undefined,
            combat: kind === 'initiative' ? s.studio.combat : undefined,
            roll: kind === 'dice' ? s.studio.roll : undefined,
          }
        : undefined,
    }
    return out
  }
  const fullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen()
  }
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f' && kind === 'main') {
        e.preventDefault()
        fullscreen()
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [kind])
  const transparent = ['portraits', 'dice', 'initiative'].includes(kind)
  return (
    <main
      className={`broadcast-live studio-output output-${kind} ${transparent ? 'studio-output-transparent' : ''}`}
      data-testid="broadcast-live"
      aria-label="OBS yayın görüntüsü"
    >
      <BroadcastStage state={filtered(state)} readOnly />
      {previous && kind === 'main' && (
        <div className="studio-transition-old" key={state.studio?.takenAt}>
          <BroadcastStage state={previous} readOnly />
        </div>
      )}
      {state.studio?.transition === 'dip' && kind === 'main' && (
        <div className="studio-transition-dip" key={state.studio.takenAt} />
      )}
      {kind === 'main' && (
        <>
          <StudioAudio state={state} role="audience" />
          <button className="broadcast-fullscreen" onClick={fullscreen}>
            Tam ekran · F
          </button>
          {!online && (
            <div className="broadcast-live-status">
              Yönetim penceresi bekleniyor · son görüntü korunuyor
            </div>
          )}
        </>
      )}
    </main>
  )
}
