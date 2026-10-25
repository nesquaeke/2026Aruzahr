import { useRef, useState, type PointerEvent } from 'react'
import { Grip, Maximize2, X } from 'lucide-react'
import BroadcastMap from './BroadcastMap'
import BroadcastBreak from './BroadcastBreak'
import type { MapCamera, MapStroke, MapToken } from './BroadcastMap'
import type { BroadcastAsset } from './BroadcastLibrary'
import { BroadcastDiceDisplay } from './BroadcastDice'
import type { BroadcastState, StageActor } from './broadcast-state'

export type BroadcastTool = 'pan' | 'pen' | 'arrow' | 'erase'
type Props = {
  state: BroadcastState
  readOnly?: boolean
  tool?: BroadcastTool
  color?: string
  width?: number
  onChange?: (patch: Partial<BroadcastState>) => void
  onAssetDrop?: (asset: BroadcastAsset, x: number, y: number) => void
}
const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n))

export default function BroadcastStage({ state, readOnly = false, tool = 'pan', color = '#e4bc74', width = 14, onChange, onAssetDrop }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const liveState = useRef(state); liveState.current = state
  const move = useRef<{ id: string; action: 'move' | 'resize'; x: number; y: number; actor: StageActor; rect: DOMRect } | null>(null)
  function begin(event: PointerEvent, actor: StageActor, action: 'move' | 'resize') {
    if (readOnly || event.button !== 0 || !host.current) return
    event.preventDefault(); event.stopPropagation()
    setSelected(actor.id)
    move.current = { id: actor.id, action, x: event.clientX, y: event.clientY, actor: { ...actor }, rect: host.current.getBoundingClientRect() }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function drag(event: PointerEvent) {
    const current = move.current
    if (!current || readOnly) return
    const dx = (event.clientX - current.x) / current.rect.width * 100, dy = (event.clientY - current.y) / current.rect.height * 100
    const a = current.actor
    const change = current.action === 'move' ? { x: clamp(a.x + dx, 0, 100 - a.w), y: clamp(a.y + dy, 0, 100 - a.h) } : { w: clamp(a.w + dx, 3, 100 - a.x), h: clamp(a.h + dy, 5, 100 - a.y) }
    onChange?.({ actors: liveState.current.actors.map(actor => actor.id === current.id ? { ...actor, ...change } : actor) })
  }
  function remove(id: string) { onChange?.({ actors: liveState.current.actors.filter(actor => actor.id !== id) }); setSelected(null) }
  function key(event: React.KeyboardEvent, actor: StageActor) {
    if (readOnly) return
    if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); remove(actor.id); return }
    const delta = event.shiftKey ? 2 : .5, directions: Record<string, number[]> = { ArrowLeft: [-delta, 0], ArrowRight: [delta, 0], ArrowUp: [0, -delta], ArrowDown: [0, delta] }
    const direction = directions[event.key]
    if (direction) { event.preventDefault(); onChange?.({ actors: state.actors.map(a => a.id === actor.id ? { ...a, x: clamp(a.x + direction[0], 0, 100 - a.w), y: clamp(a.y + direction[1], 0, 100 - a.h) } : a) }) }
  }
  return <div ref={host} className={`broadcast-stage ${readOnly ? 'is-audience' : 'is-director'} ${state.cameraLane ? 'has-camera-lane' : ''}`} data-testid="broadcast-stage" onClick={event => { if (event.target === event.currentTarget) setSelected(null) }} onDragOver={event => event.preventDefault()} onDrop={event => {
    if (readOnly || state.mode === 'map') return
    event.preventDefault()
    try { const asset = JSON.parse(event.dataTransfer.getData('application/x-aruzahr-asset')) as BroadcastAsset; const rect = host.current!.getBoundingClientRect(); if (asset?.id && asset.src) onAssetDrop?.(asset, clamp((event.clientX - rect.left) / rect.width, 0, 1), clamp((event.clientY - rect.top) / rect.height, 0, 1)) } catch { /* Only internal asset drags are accepted. */ }
  }}>
    {state.mode === 'map' ? <BroadcastMap tokens={state.tokens} strokes={state.strokes} camera={state.camera} tool={tool} brushColor={color} brushWidth={width} readOnly={readOnly} onTokensChange={(tokens: MapToken[]) => onChange?.({ tokens })} onStrokesChange={(strokes: MapStroke[]) => onChange?.({ strokes })} onCameraChange={(camera: MapCamera) => onChange?.({ camera })} onAssetDrop={(asset, x, y) => onAssetDrop?.(asset as BroadcastAsset, x, y)} /> : <div className="broadcast-backdrop" data-testid="broadcast-scene"><img src={state.scene.src} alt={state.scene.name} draggable={false} style={{ transform: `scale(${state.sceneZoom})` }} /><div className="broadcast-scene-shade" /></div>}
    {state.cameraLane && <div className="broadcast-camera-lane" aria-hidden="true">{!readOnly && <span>OBS KAMERA ALANI<br /><small>Kameralarını bu şeridin üzerine yerleştir.</small></span>}</div>}
    <div className="broadcast-stage-heading"><span>ARUZAHR</span><small>{state.title}</small></div>
    <div className="broadcast-stage-actors">{state.actors.filter(actor => !actor.hidden).map(actor => <div key={actor.id} data-testid={`broadcast-actor-${actor.id}`} data-actor-name={actor.name} className={`broadcast-actor ${actor.kind} tier-${actor.tier || 'ordinary'} ${selected === actor.id && !readOnly ? 'is-selected' : ''}`} style={{ left: `${actor.x}%`, top: `${actor.y}%`, width: `${actor.w}%`, height: `${actor.h}%` }} tabIndex={readOnly ? -1 : 0} aria-label={`${actor.name} sahne katmanı`} onKeyDown={event => key(event, actor)} onPointerDown={event => begin(event, actor, 'move')} onPointerMove={drag} onPointerUp={() => { move.current = null }} onPointerCancel={() => { move.current = null }} onFocus={() => setSelected(actor.id)}>
      <img src={actor.src} alt={actor.name} draggable={false} />
      {state.showNames && <span className="broadcast-actor-name">{actor.name}</span>}
      {!readOnly && <><span className="broadcast-actor-grip" aria-hidden="true"><Grip size={12} /></span><button className="broadcast-actor-remove" aria-label={`${actor.name} sahneden kaldır`} onPointerDown={event => event.stopPropagation()} onClick={() => remove(actor.id)}><X size={13} /></button><button className="broadcast-actor-resize" aria-label={`${actor.name} boyutlandır`} onPointerDown={event => begin(event, actor, 'resize')} onPointerMove={drag} onPointerUp={() => { move.current = null }} onPointerCancel={() => { move.current = null }}><Maximize2 size={13} /></button></>}
    </div>)}</div>
    <BroadcastDiceDisplay roll={state.roll} />
    {state.intermission && <BroadcastBreak message={state.breakMessage || ''} />}
    {state.blackout && !state.intermission && <div className={`broadcast-curtain ${readOnly ? '' : 'operator-curtain'}`} data-testid="broadcast-curtain"><span>ARUZAHR</span><p>Bir sonraki sahneye hazırlanıyoruz.</p>{!readOnly && <button onClick={() => onChange?.({ blackout: false })}>Perdeyi aç</button>}</div>}
  </div>
}
