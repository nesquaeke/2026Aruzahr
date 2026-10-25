import { useEffect, useRef } from 'react'
import { validateBroadcastState, type BroadcastState } from './broadcast-state'

type RelayOptions = {
  state: BroadcastState
  ready: boolean
  readOnly: boolean
  onState: (state: BroadcastState) => void
  onConnection: (online: boolean) => void
}
type Publisher = { queue: (state: BroadcastState) => void }
const PREFIX = '/__aruzahr-broadcast'
const MIN_PUBLISH_MS = 80

export function publicRelayState(state: BroadcastState): BroadcastState {
  return validateBroadcastState({
    version: state.version, mode: state.mode, scene: state.scene, sceneZoom: state.sceneZoom,
    actors: state.actors.filter(actor => !actor.hidden), tokens: state.tokens, strokes: state.strokes,
    camera: state.camera, customAssets: [], roll: state.roll, intermission: state.intermission || false, breakMessage: state.breakMessage || '', blackout: state.blackout,
    title: state.title, cameraLane: state.cameraLane, showNames: state.showNames,
  })
}

/** BroadcastChannel remains the fast path; this also reaches OBS's CEF profile. */
export function useBroadcastRelay({ state, ready, readOnly, onState, onConnection }: RelayOptions): void {
  const callbacks = useRef({ onState, onConnection })
  callbacks.current = { onState, onConnection }
  const publisher = useRef<Publisher | null>(null)

  useEffect(() => {
    if (!ready) return
    if (readOnly) {
      if (typeof window.EventSource !== 'function') return
      const source = new EventSource(`${PREFIX}/events`)
      let disposed = false
      source.addEventListener('state', event => {
        if (disposed) return
        try { callbacks.current.onState(publicRelayState(validateBroadcastState(JSON.parse((event as MessageEvent<string>).data)))) } catch { /* Invalid scene updates never replace the current view. */ }
      })
      source.addEventListener('presence', event => {
        if (disposed) return
        try {
          const value: unknown = JSON.parse((event as MessageEvent<string>).data)
          if (value && typeof value === 'object' && 'online' in value && typeof value.online === 'boolean') callbacks.current.onConnection(value.online)
        } catch { /* A malformed status is ignored. */ }
      })
      source.onerror = () => {
        if (!disposed) callbacks.current.onConnection(false)
        // Native EventSource reconnects after a temporary local-server outage.
        // A static host's 404 closes it automatically; BroadcastChannel remains.
        if (source.readyState === EventSource.CLOSED) source.close()
      }
      return () => { disposed = true; source.close() }
    }

    let disposed = false, unavailable = false, inFlight = false, heartbeatPending = false
    let pending: BroadcastState | null = null, latest: BroadcastState | null = null, timer: number | null = null, lastStarted = 0
    let requestAbort: AbortController | null = null
    const schedule = (minimumDelay = 0) => {
      if (disposed || unavailable || inFlight || timer !== null || !pending && !heartbeatPending) return
      timer = window.setTimeout(() => { timer = null; void drain() }, Math.max(minimumDelay, MIN_PUBLISH_MS - (Date.now() - lastStarted), 0))
    }
    const drain = async () => {
      if (disposed || unavailable || inFlight) return
      const snapshot = pending
      pending = null
      let body: string
      try { body = snapshot ? JSON.stringify(publicRelayState(snapshot)) : '{}' } catch { schedule(); return }
      heartbeatPending = false
      inFlight = true
      lastStarted = Date.now()
      requestAbort = new AbortController()
      const timeout = window.setTimeout(() => requestAbort?.abort(), 10_000)
      let retry = false
      try {
        const response = await fetch(`${PREFIX}/${snapshot ? 'state' : 'heartbeat'}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
          signal: requestAbort.signal, cache: 'no-store', credentials: 'same-origin',
        })
        if ([404, 405, 501].includes(response.status) || response.ok && !response.headers.get('content-type')?.includes('application/json')) {
          unavailable = true; pending = null; heartbeatPending = false
          window.clearInterval(heartbeat)
        } else if (response.status >= 500 || response.status === 408 || response.status === 429) retry = true
        else if (response.ok) {
          const status: unknown = await response.json().catch(() => null)
          // A restarted local server has lost its RAM cache. Restore the last
          // scene even if the operator has made no new edit since restarting.
          if (!snapshot && status && typeof status === 'object' && 'hasState' in status && status.hasState === false && latest && !pending) pending = latest
        }
      } catch { if (!disposed) retry = true } finally {
        window.clearTimeout(timeout)
        requestAbort = null
        inFlight = false
        if (retry && snapshot && !pending) pending = snapshot
        if (retry && !snapshot) heartbeatPending = true
        schedule(retry ? 1500 : 0)
      }
    }
    const heartbeat = window.setInterval(() => { heartbeatPending = true; schedule() }, 3000)
    const worker: Publisher = { queue: next => { if (!disposed && !unavailable) { latest = next; pending = next; schedule() } } }
    publisher.current = worker
    return () => {
      disposed = true
      if (publisher.current === worker) publisher.current = null
      window.clearInterval(heartbeat)
      if (timer !== null) window.clearTimeout(timer)
      requestAbort?.abort()
      pending = null; latest = null
    }
  }, [ready, readOnly])

  useEffect(() => {
    if (ready && !readOnly) publisher.current?.queue(state)
  }, [state, ready, readOnly])
}

export default useBroadcastRelay
