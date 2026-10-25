import { useEffect, useId, useRef, useState } from 'react'
import type { DragEvent, KeyboardEvent, PointerEvent } from 'react'
import OpenSeadragon from 'openseadragon'
import { Crosshair, Home, LoaderCircle, MapPinned, Minus, Plus, RotateCcw, Trash2, X } from 'lucide-react'
import { correctedMapPixels } from './map-corrections'
import './broadcast-map.css'

export type MapToken = {
  id: string
  name: string
  src?: string
  assetId?: string
  x: number
  y: number
  kind: 'party' | 'ally' | 'enemy'
  size: number
}

export type MapStroke = {
  id: string
  kind: 'pen' | 'arrow'
  color: string
  width: number
  points: [number, number][]
}

export type MapCamera = { x: number; y: number; zoom: number }

export type BroadcastMapProps = {
  tokens: MapToken[]
  strokes: MapStroke[]
  camera: MapCamera | null
  tool: 'pan' | 'pen' | 'arrow' | 'erase'
  brushColor: string
  brushWidth: number
  readOnly?: boolean
  onTokensChange: (tokens: MapToken[]) => void
  onStrokesChange: (strokes: MapStroke[]) => void
  onCameraChange: (camera: MapCamera) => void
  onAssetDrop?: (asset: { id: string; name: string; src: string; kind: string }, x: number, y: number) => void
}

const IMAGE_WIDTH = 8192
const IMAGE_HEIGHT = 5668
const ASSET_MIME = 'application/x-aruzahr-asset'
const marhalden = correctedMapPixels.find(place => place.id === 'marhalden')!
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const equalCamera = (a: MapCamera | null, b: MapCamera | null) => !!a && !!b && Math.abs(a.x - b.x) < .000002 && Math.abs(a.y - b.y) < .000002 && Math.abs(a.zoom - b.zoom) < .00002
const validCamera = (camera: MapCamera | null): camera is MapCamera => !!camera && Number.isFinite(camera.x) && Number.isFinite(camera.y) && Number.isFinite(camera.zoom) && camera.zoom > 0

type Projection = { left: number; top: number; width: number; height: number; scale: number; zoom: number }
type Gesture =
  | { kind: 'token'; pointerId: number; id: string; offset: [number, number] }
  | { kind: 'stroke'; pointerId: number; stroke: MapStroke }
  | { kind: 'erase'; pointerId: number }

function segmentDistance(point: [number, number], start: [number, number], end: [number, number]) {
  const x = point[0] * IMAGE_WIDTH, y = point[1] * IMAGE_HEIGHT
  const ax = start[0] * IMAGE_WIDTH, ay = start[1] * IMAGE_HEIGHT
  const dx = (end[0] - start[0]) * IMAGE_WIDTH, dy = (end[1] - start[1]) * IMAGE_HEIGHT
  const t = dx || dy ? clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)) : 0
  return Math.hypot(x - ax - dx * t, y - ay - dy * t)
}

function strokePath(stroke: MapStroke) {
  if (!stroke.points.length) return ''
  const points = stroke.points.map(([x, y]) => `${x * IMAGE_WIDTH},${y * IMAGE_HEIGHT}`)
  // A stationary pen tap is a small round mark, rather than an invisible path.
  return `M${points[0]} ${points.length === 1 ? `l0.01,0` : points.slice(1).map(point => `L${point}`).join(' ')}`
}

export default function BroadcastMap(props: BroadcastMapProps) {
  const { tokens, strokes, camera, tool, brushColor, brushWidth, readOnly = false } = props
  const root = useRef<HTMLDivElement>(null)
  const mapElement = useRef<HTMLDivElement>(null)
  const viewer = useRef<OpenSeadragon.Viewer | null>(null)
  const latest = useRef(props)
  const gesture = useRef<Gesture | null>(null)
  const lastEmitted = useRef<MapCamera | null>(null)
  const applyingCamera = useRef(false)
  const frame = useRef(0)
  const suppressFrame = useRef(0)
  const paint = useRef<() => void>(() => {})
  const projectionRef = useRef<Projection | null>(null)
  const [projection, setProjection] = useState<Projection | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [draft, setDraft] = useState<MapStroke | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const arrowId = `broadcast-arrow-${useId().replace(/:/g, '')}`
  latest.current = props

  paint.current = () => {
    const instance = viewer.current
    if (!instance?.isOpen()) return
    const viewport = instance.viewport
    const origin = viewport.pixelFromPoint(viewport.imageToViewportCoordinates(0, 0), true)
    const end = viewport.pixelFromPoint(viewport.imageToViewportCoordinates(IMAGE_WIDTH, IMAGE_HEIGHT), true)
    const next = { left: origin.x, top: origin.y, width: end.x - origin.x, height: end.y - origin.y, scale: (end.x - origin.x) / IMAGE_WIDTH, zoom: viewport.getZoom(true) / viewport.getHomeZoom() }
    projectionRef.current = next
    setProjection(next)
    if (latest.current.readOnly || applyingCamera.current) return
    const imageCenter = viewport.viewportToImageCoordinates(viewport.getCenter(true))
    const nextCamera = { x: imageCenter.x / IMAGE_WIDTH, y: imageCenter.y / IMAGE_HEIGHT, zoom: next.zoom }
    if (!equalCamera(nextCamera, lastEmitted.current)) {
      lastEmitted.current = nextCamera
      latest.current.onCameraChange(nextCamera)
    }
  }

  useEffect(() => {
    if (!mapElement.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const instance = OpenSeadragon({
      element: mapElement.current,
      tileSources: '/atlas/aruzahr.dzi',
      showNavigationControl: false,
      showNavigator: false,
      animationTime: reduced ? 0 : .35,
      blendTime: reduced ? 0 : .15,
      springStiffness: 8,
      visibilityRatio: .65,
      constrainDuringPan: true,
      minZoomImageRatio: .8,
      maxZoomPixelRatio: 3,
      imageLoaderLimit: 4,
      keyboardNavEnabled: false,
      gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true, scrollToZoom: true },
      gestureSettingsTouch: { clickToZoom: false, pinchToZoom: true, flickEnabled: true },
    })
    viewer.current = instance
    const schedule = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(() => { frame.current = 0; paint.current() })
    }
    instance.addHandler('open', () => {
      setFailed(false)
      setReady(true)
      const initial = latest.current.camera
      if (validCamera(initial)) {
        applyingCamera.current = true
        instance.viewport.zoomTo(initial.zoom * instance.viewport.getHomeZoom(), undefined, true)
        instance.viewport.panTo(instance.viewport.imageToViewportCoordinates(initial.x * IMAGE_WIDTH, initial.y * IMAGE_HEIGHT), true)
        cancelAnimationFrame(suppressFrame.current)
        suppressFrame.current = requestAnimationFrame(() => { applyingCamera.current = false })
      }
      instance.setMouseNavEnabled(!latest.current.readOnly && latest.current.tool === 'pan')
      schedule()
    })
    instance.addHandler('open-failed', () => { setFailed(true); setReady(false) })
    for (const event of ['animation', 'animation-finish', 'pan', 'zoom', 'resize', 'after-resize'] as const) instance.addHandler(event, schedule)
    return () => {
      cancelAnimationFrame(frame.current)
      cancelAnimationFrame(suppressFrame.current)
      frame.current = 0
      instance.destroy()
      viewer.current = null
    }
  }, [])

  useEffect(() => {
    const instance = viewer.current
    if (!ready || !instance || !validCamera(camera) || equalCamera(camera, lastEmitted.current)) return
    const currentImage = instance.viewport.viewportToImageCoordinates(instance.viewport.getCenter(true))
    const current = { x: currentImage.x / IMAGE_WIDTH, y: currentImage.y / IMAGE_HEIGHT, zoom: instance.viewport.getZoom(true) / instance.viewport.getHomeZoom() }
    if (equalCamera(camera, current)) return
    // An incoming remote camera replaces the previous local echo marker.
    lastEmitted.current = null
    applyingCamera.current = true
    instance.viewport.zoomTo(clamp(camera.zoom, .1, 100) * instance.viewport.getHomeZoom(), undefined, true)
    instance.viewport.panTo(instance.viewport.imageToViewportCoordinates(camera.x * IMAGE_WIDTH, camera.y * IMAGE_HEIGHT), true)
    paint.current()
    cancelAnimationFrame(suppressFrame.current)
    suppressFrame.current = requestAnimationFrame(() => { applyingCamera.current = false })
  }, [camera, ready])

  useEffect(() => {
    viewer.current?.setMouseNavEnabled(!readOnly && tool === 'pan')
    gesture.current = null
    setDraft(null)
    if (readOnly) setSelected(null)
  }, [tool, readOnly])

  useEffect(() => {
    if (selected && !tokens.some(token => token.id === selected)) setSelected(null)
  }, [tokens, selected])

  function sourcePoint(clientX: number, clientY: number) {
    const instance = viewer.current, element = mapElement.current
    if (!instance?.isOpen() || !element) return null
    const rect = element.getBoundingClientRect()
    const viewportPoint = instance.viewport.pointFromPixel(new OpenSeadragon.Point(clientX - rect.left, clientY - rect.top), true)
    const image = instance.viewport.viewportToImageCoordinates(viewportPoint)
    const x = image.x / IMAGE_WIDTH, y = image.y / IMAGE_HEIGHT
    return { point: [clamp(x), clamp(y)] as [number, number], inside: x >= 0 && x <= 1 && y >= 0 && y <= 1 }
  }

  function eraseAt(point: [number, number]) {
    const threshold = 13 / Math.max(.001, projectionRef.current?.scale || 1)
    const remaining = latest.current.strokes.filter(stroke => {
      const tolerance = threshold + stroke.width / 2
      return !stroke.points.some((start, index) => segmentDistance(point, start, stroke.points[index + 1] || start) <= tolerance)
    })
    if (remaining.length !== latest.current.strokes.length) {
      // Keep fast successive pointer moves consistent while React propagates state.
      latest.current = { ...latest.current, strokes: remaining }
      props.onStrokesChange(remaining)
    }
  }

  function beginDrawing(event: PointerEvent<HTMLDivElement>) {
    if (readOnly || tool === 'pan' || event.button !== 0 || gesture.current) return
    const source = sourcePoint(event.clientX, event.clientY)
    if (!source?.inside) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    root.current?.focus({ preventScroll: true })
    setSelected(null)
    if (tool === 'erase') {
      gesture.current = { kind: 'erase', pointerId: event.pointerId }
      eraseAt(source.point)
      return
    }
    const stroke: MapStroke = { id: crypto.randomUUID(), kind: tool, color: brushColor, width: clamp(brushWidth, 1, 80), points: [source.point] }
    gesture.current = { kind: 'stroke', pointerId: event.pointerId, stroke }
    setDraft(stroke)
  }

  function beginToken(event: PointerEvent<HTMLButtonElement>, token: MapToken) {
    if (readOnly || event.button !== 0 || gesture.current) return
    const source = sourcePoint(event.clientX, event.clientY)
    if (!source) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    root.current?.focus({ preventScroll: true })
    viewer.current?.setMouseNavEnabled(false)
    setSelected(token.id)
    gesture.current = { kind: 'token', pointerId: event.pointerId, id: token.id, offset: [token.x - source.point[0], token.y - source.point[1]] }
  }

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    const active = gesture.current
    if (!active || active.pointerId !== event.pointerId || readOnly) return
    const source = sourcePoint(event.clientX, event.clientY)
    if (!source) return
    event.preventDefault()
    if (active.kind === 'erase') { eraseAt(source.point); return }
    if (active.kind === 'token') {
      const next = latest.current.tokens.map(token => token.id === active.id ? { ...token, x: clamp(source.point[0] + active.offset[0]), y: clamp(source.point[1] + active.offset[1]) } : token)
      latest.current = { ...latest.current, tokens: next }
      props.onTokensChange(next)
      return
    }
    const last = active.stroke.points[active.stroke.points.length - 1]
    if (Math.hypot((last[0] - source.point[0]) * IMAGE_WIDTH, (last[1] - source.point[1]) * IMAGE_HEIGHT) < 2) return
    const next = { ...active.stroke, points: active.stroke.kind === 'arrow' ? [active.stroke.points[0], source.point] : [...active.stroke.points, source.point] } as MapStroke
    active.stroke = next
    setDraft(next)
  }

  function endPointer(event: PointerEvent<HTMLDivElement>, cancel = false) {
    const active = gesture.current
    if (!active || active.pointerId !== event.pointerId) return
    if (!cancel) movePointer(event)
    gesture.current = null
    setDraft(null)
    viewer.current?.setMouseNavEnabled(!readOnly && tool === 'pan')
    if (!cancel && active.kind === 'stroke' && (active.stroke.kind === 'pen' || active.stroke.points.length > 1)) {
      props.onStrokesChange([...latest.current.strokes, active.stroke])
    }
  }

  function removeSelected() {
    if (!selected || readOnly) return
    props.onTokensChange(latest.current.tokens.filter(token => token.id !== selected))
    setSelected(null)
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (readOnly || !selected || (event.target instanceof HTMLInputElement) || (event.target instanceof HTMLTextAreaElement)) return
    if (event.key === 'Escape') { setSelected(null); return }
    if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); removeSelected(); return }
    const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
    const direction = directions[event.key]
    if (!direction || !projectionRef.current) return
    event.preventDefault()
    const distance = event.shiftKey ? 10 : 2
    const next = latest.current.tokens.map(token => token.id === selected ? { ...token, x: clamp(token.x + direction[0] * distance / projectionRef.current!.width), y: clamp(token.y + direction[1] * distance / projectionRef.current!.height) } : token)
    latest.current = { ...latest.current, tokens: next }
    props.onTokensChange(next)
  }

  function acceptsAsset(event: DragEvent<HTMLDivElement>) {
    return !readOnly && !!props.onAssetDrop && Array.from(event.dataTransfer.types).includes(ASSET_MIME)
  }

  function dropAsset(event: DragEvent<HTMLDivElement>) {
    setDragOver(false)
    if (!acceptsAsset(event)) return
    event.preventDefault()
    const source = sourcePoint(event.clientX, event.clientY)
    if (!source?.inside) return
    try {
      const asset: unknown = JSON.parse(event.dataTransfer.getData(ASSET_MIME))
      if (asset && typeof asset === 'object' && 'id' in asset && typeof asset.id === 'string' && 'name' in asset && typeof asset.name === 'string' && 'src' in asset && typeof asset.src === 'string' && 'kind' in asset && typeof asset.kind === 'string') {
        props.onAssetDrop?.({ id: asset.id, name: asset.name, src: asset.src, kind: asset.kind }, source.point[0], source.point[1])
      }
    } catch { /* Invalid or unrelated drag payloads are ignored. */ }
  }

  function zoomBy(factor: number) { viewer.current?.viewport.zoomBy(factor); viewer.current?.viewport.applyConstraints() }
  function focusMarhalden() {
    const viewport = viewer.current?.viewport
    if (!viewport) return
    viewport.fitBounds(viewport.imageToViewportRectangle(marhalden.x - 850, marhalden.y - 600, 1700, 1200), window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }

  const selectedToken = tokens.find(token => token.id === selected)
  const drawnStrokes = draft ? [...strokes, draft] : strokes

  return <div ref={root} className={`broadcast-map bm-tool-${tool}${readOnly ? ' bm-readonly' : ''}${dragOver ? ' bm-drop-active' : ''}`} data-testid="broadcast-map" tabIndex={readOnly ? -1 : 0} aria-label={readOnly ? 'Canlı yayın haritası' : 'Harita sahnesi; simge seçmek ve taşımak için üzerine basın'} onKeyDown={keyboard} onPointerMove={movePointer} onPointerUp={event => endPointer(event)} onPointerCancel={event => endPointer(event, true)} onPointerDown={event => { if (event.target instanceof Node && mapElement.current?.contains(event.target)) setSelected(null) }} onDragOver={event => { if (acceptsAsset(event)) { event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; setDragOver(true) } }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragOver(false) }} onDrop={dropAsset}>
    <div ref={mapElement} className="bm-viewport" aria-label="Aruzahr özgün 8K haritası" />
    {ready && projection && <>
      <div className="bm-drawing-hit" aria-hidden="true" onPointerDown={beginDrawing}>
        <svg className="bm-ink" viewBox={`0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}`} preserveAspectRatio="none" style={{ left: projection.left, top: projection.top, width: projection.width, height: projection.height }}>
          <defs><marker id={arrowId} viewBox="0 0 12 12" refX="10" refY="6" markerWidth="5" markerHeight="5" orient="auto-start-reverse" markerUnits="strokeWidth"><path d="M1,1 L11,6 L1,11 L4,6 Z" fill="context-stroke" /></marker></defs>
          {drawnStrokes.map(stroke => <path key={stroke.id} d={strokePath(stroke)} fill="none" stroke={stroke.color} strokeWidth={stroke.width} strokeLinecap="round" strokeLinejoin="round" markerEnd={stroke.kind === 'arrow' && stroke.points.length > 1 ? `url(#${arrowId})` : undefined} />)}
        </svg>
      </div>
      <div className="bm-token-layer">
        {tokens.map(token => <button key={token.id} type="button" className={`bm-token bm-token-${token.kind}${selected === token.id ? ' bm-token-selected' : ''}`} data-testid={`map-token-${token.id}`} style={{ left: projection.left + token.x * projection.width, top: projection.top + token.y * projection.height, width: clamp(token.size, 24, 160), height: clamp(token.size, 24, 160) }} disabled={readOnly} aria-label={`${token.name} · ${token.kind === 'party' ? 'Oyuncu' : token.kind === 'ally' ? 'Müttefik' : 'Düşman'} simgesi`} aria-pressed={!readOnly ? selected === token.id : undefined} title={readOnly ? token.name : `${token.name} · Taşımak için sürükle`} onPointerDown={event => beginToken(event, token)} onClick={() => { if (!readOnly) setSelected(token.id) }}>
          <span className="bm-token-initials">{token.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toLocaleUpperCase('tr-TR')}</span>
          {token.src && <img src={token.src} alt="" draggable={false} onError={event => { event.currentTarget.style.display = 'none' }} />}
          <span className="bm-token-name">{token.name}</span>
          <span className="bm-token-dot" />
        </button>)}
      </div>
    </>}
    {!ready && !failed && <div className="bm-message" role="status"><LoaderCircle className="bm-spinner" size={25} /><strong>Harita açılıyor</strong><span>Özgün Aruzahr atlası</span></div>}
    {failed && <div className="bm-message bm-error" role="alert"><MapPinned size={32} /><strong>Özgün harita yüklenemedi</strong><span>Atlas dosyasına şu anda erişilemiyor.</span><button type="button" onClick={() => { setFailed(false); viewer.current?.open({ tileSource: '/atlas/aruzahr.dzi' }) }}><RotateCcw size={15} /> Yeniden dene</button></div>}
    {!readOnly && <>
      <div className="bm-map-label"><span className="bm-live-dot" /><span>ARUZAHR</span><span className="bm-map-label-separator">/</span><span className="bm-map-label-detail">Özgün atlas</span></div>
      {selectedToken && <div className="bm-selection-bar"><span>{selectedToken.name}</span><button type="button" aria-label={`${selectedToken.name} simgesini kaldır`} title="Simgeyi kaldır · Delete" onClick={removeSelected}><Trash2 size={15} /></button><button type="button" aria-label="Simge seçimini kaldır" onClick={() => setSelected(null)}><X size={15} /></button></div>}
      <div className="bm-navigation" aria-label="Harita görünümü">
        <button type="button" aria-label="Haritayı yakınlaştır" title="Yakınlaştır" disabled={!ready} onClick={() => zoomBy(1.45)}><Plus size={17} /></button>
        <output aria-label="Harita yakınlaştırması">{projection ? Math.round(projection.zoom * 100) : 100}%</output>
        <button type="button" aria-label="Haritayı uzaklaştır" title="Uzaklaştır" disabled={!ready} onClick={() => zoomBy(1 / 1.45)}><Minus size={17} /></button>
        <span className="bm-control-divider" />
        <button type="button" aria-label="Haritanın tamamını göster" title="Haritanın tamamı" disabled={!ready} onClick={() => viewer.current?.viewport.goHome(window.matchMedia('(prefers-reduced-motion: reduce)').matches)}><Home size={16} /></button>
        <button type="button" aria-label="Marhalden'e odaklan" title="Marhalden'e odaklan" disabled={!ready} onClick={focusMarhalden}><Crosshair size={16} /></button>
      </div>
      <div className="bm-map-hint">{selectedToken ? 'Ok tuşları: taşı · Shift: hızlı · Delete: kaldır' : tool === 'pan' ? 'Sürükle: gezin · Tekerlek: yakınlaştır' : tool === 'pen' ? 'Harita üzerine çiz' : tool === 'arrow' ? 'Ok çizmek için sürükle' : 'Çizimleri silmek için üzerlerinden geç'}</div>
      {dragOver && <div className="bm-drop-hint"><Plus size={19} /> Haritaya bırak</div>}
    </>}
  </div>
}
