import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import OpenSeadragon from 'openseadragon'
import { Compass, LoaderCircle, RotateCcw } from 'lucide-react'
import { locationById, mapLocations, normalize, regions, regionById, placeById, subregionById } from './data'
import { featureById, featureLabels, mapFeatures } from './map-features'

export type AtlasHandle = { zoom: (factor: number) => void; home: () => void }
type Props = {
  selected: string | null; onSelect: (id: string) => void; query: string;
  showCities: boolean; showGeography: boolean; showRoutes: boolean; effects: boolean; reducedMotion: boolean; onZoom: (value: number) => void;
}

export default forwardRef<AtlasHandle, Props>(function Atlas({ selected, onSelect, query, showCities, showGeography, showRoutes, effects, reducedMotion, onZoom }, ref) {
  const element = useRef<HTMLDivElement>(null)
  const viewer = useRef<OpenSeadragon.Viewer | null>(null)
  const markers = useRef<Map<string, HTMLButtonElement>>(new Map())
  const select = useRef(onSelect)
  const selectedRef = useRef(selected)
  const restoredView = useRef(false)
  const routeElements = useRef<Map<string, SVGGElement>>(new Map())
  const refreshMarkers = useRef<() => void>(() => {})
  const refreshFrame = useRef<number>(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [zoom, setZoom] = useState(100)
  select.current = onSelect
  selectedRef.current = selected

  useImperativeHandle(ref, () => ({
    zoom(factor) { viewer.current?.viewport.zoomBy(factor); viewer.current?.viewport.applyConstraints() },
    home() {
      const instance = viewer.current
      if (!instance || !element.current) return
      // Wait for the viewer's own resize after the side card changes the layout.
      instance.addOnceHandler('after-resize', () => requestAnimationFrame(() => { if (viewer.current === instance) instance.viewport.goHome(reducedMotion) }))
      instance.forceResize()
    },
  }), [reducedMotion])

  useEffect(() => {
    if (!element.current) return
    const instance = OpenSeadragon({
      element: element.current,
      tileSources: '/atlas/aruzahr.dzi',
      showNavigationControl: false,
      showNavigator: true,
      navigatorPosition: 'BOTTOM_RIGHT',
      navigatorWidth: 124,
      navigatorHeight: 86,
      navigatorAutoFade: false,
      navigatorBorderColor: '#bc9b60',
      navigatorDisplayRegionColor: '#dbc28e',
      navigatorBackground: '#10161c',
      animationTime: reducedMotion ? 0 : .65,
      blendTime: reducedMotion ? 0 : .25,
      springStiffness: 6,
      visibilityRatio: .5,
      constrainDuringPan: true,
      maxZoomPixelRatio: 2,
      minZoomImageRatio: .7,
      imageLoaderLimit: 4,
      gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true, scrollToZoom: true },
      gestureSettingsTouch: { pinchToZoom: true, flickEnabled: true, clickToZoom: false },
      keyboardNavEnabled: true,
    })
    viewer.current = instance
    instance.addHandler('open', () => {
      const routeOverlay = document.createElement('div')
      routeOverlay.className = 'route-overlay'
      const ns = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(ns, 'svg')
      svg.setAttribute('viewBox', '0 0 8192 5668')
      svg.setAttribute('preserveAspectRatio', 'none')
      svg.setAttribute('aria-label', 'Şematik ticaret güzergâhları')
      for (const route of mapFeatures.filter(feature => feature.paths)) {
        const group = document.createElementNS(ns, 'g')
        group.setAttribute('class', `atlas-route ${route.status || 'open'}`)
        group.dataset.testid = `route-${route.id}`
        for (const points of route.stops ? [route.stops.map(id => placeById(id)!.point)] : route.paths!) {
          // Smooth the known stops without introducing fictional detours.
          const p = points.map(([x, y]) => [x * 8192, y * 5668])
          const geometry = `M${p[0].join(',')} ` + p.slice(1).map((end, i) => {
            const start = p[i], before = p[Math.max(0, i - 1)], after = p[Math.min(p.length - 1, i + 2)]
            return `C${start[0] + (end[0] - before[0]) / 8},${start[1] + (end[1] - before[1]) / 8} ${end[0] - (after[0] - start[0]) / 8},${end[1] - (after[1] - start[1]) / 8} ${end.join(',')}`
          }).join(' ')
          for (const type of ['hit', 'shadow', 'line']) {
            const path = document.createElementNS(ns, 'path')
            path.setAttribute('d', geometry)
            path.setAttribute('class', `route-${type}`)
            path.setAttribute('vector-effect', 'non-scaling-stroke')
            if (type === 'hit') {
              path.setAttribute('role', 'button')
              path.setAttribute('tabindex', '0')
              path.setAttribute('aria-label', `${route.name} yolunu keşfet`)
              path.addEventListener('pointerdown', event => event.stopPropagation())
              path.addEventListener('click', event => { event.stopPropagation(); select.current(route.id) })
              path.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select.current(route.id) } })
            }
            group.append(path)
          }
        }
        routeElements.current.set(route.id, group)
        svg.append(group)
      }
      routeOverlay.append(svg)
      instance.addOverlay({ element: routeOverlay, location: instance.viewport.imageToViewportRectangle(0, 0, 8192, 5668) })
      for (const entry of [...regions, ...mapLocations, ...mapFeatures]) {
        const feature = featureById(entry.id)
        const isRegion = 'box' in entry
        const isSubregion = 'kind' in entry && entry.kind === 'subregion'
        const button = document.createElement('button')
        button.type = 'button'
        button.className = `map-pin ${feature ? `feature-pin ${feature.kind}-pin` : isRegion ? 'region-pin' : 'city-pin'}${isSubregion ? ' subregion-pin' : ''}${'positionStatus' in entry && entry.positionStatus === 'approximate' ? ' approximate-pin' : ''}`
        button.dataset.testid = `marker-${entry.id}`
        button.setAttribute('aria-label', `${entry.name} ${feature ? featureLabels[feature.kind].toLocaleLowerCase('tr-TR') : isRegion ? 'bölgesini' : 'yerleşimini'} keşfet`)
        if (feature || ('positionStatus' in entry && entry.positionStatus === 'approximate')) button.title = `${entry.name} · Yaklaşık konum${feature?.kind === 'route' ? ' · Şematik güzergâh' : ''}`
        const symbol = document.createElement('span')
        symbol.className = 'pin-symbol'
        symbol.textContent = feature ? ['mountain', 'ridge'].includes(feature.kind) ? '▲' : feature.kind === 'route' ? '⌁' : feature.kind === 'landmark' ? '⌑' : '≈' : isRegion ? '✧' : '◆'
        const label = document.createElement('span')
        label.className = 'pin-label'
        label.textContent = entry.name
        button.append(symbol, label)
        button.addEventListener('pointerdown', event => event.stopPropagation())
        button.addEventListener('click', event => { event.stopPropagation(); select.current(entry.id) })
        const point = instance.viewport.imageToViewportCoordinates(entry.point[0] * 8192, entry.point[1] * 5668)
        instance.addOverlay({ element: button, location: point, placement: OpenSeadragon.Placement.CENTER, checkResize: false })
        markers.current.set(entry.id, button)
      }
      // A portrait screen begins with a filled map; the home control still fits
      // the complete original image. Choosing a region always fits that region.
      try {
        const camera = JSON.parse(sessionStorage.getItem('aruzahr-map-camera') || 'null')
        if (camera && camera.selected === selectedRef.current && Number.isFinite(camera.zoom) && camera.zoom > 0 && Number.isFinite(camera.x) && Number.isFinite(camera.y)) {
          instance.viewport.zoomTo(camera.zoom, undefined, true)
          instance.viewport.panTo(new OpenSeadragon.Point(camera.x, camera.y), true)
          restoredView.current = true
        }
      } catch { /* A remembered camera is optional. */ }
      if (!restoredView.current && instance.viewport.getContainerSize().x < 600 && !selectedRef.current) instance.viewport.fitVertically(true)
      const value = Math.round(instance.viewport.getZoom() / instance.viewport.getHomeZoom() * 100)
      setZoom(value); onZoom(value)
      setFailed(false)
      setReady(true)
    })
    instance.addHandler('open-failed', () => { setFailed(true); setReady(false) })
    instance.addHandler('animation', () => {
      const value = Math.round(instance.viewport.getZoom() / instance.viewport.getHomeZoom() * 100)
      setZoom(value)
      onZoom(value)
      scheduleRefresh()
    })
    function scheduleRefresh() {
      if (refreshFrame.current) return
      refreshFrame.current = requestAnimationFrame(() => { refreshFrame.current = 0; refreshMarkers.current() })
    }
    instance.addHandler('pan', scheduleRefresh)
    instance.addHandler('resize', scheduleRefresh)
    instance.addHandler('after-resize', scheduleRefresh)
    instance.addHandler('animation-finish', () => {
      const center = instance.viewport.getCenter()
      try { sessionStorage.setItem('aruzahr-map-camera', JSON.stringify({ selected: selectedRef.current, zoom: instance.viewport.getZoom(), x: center.x, y: center.y })) } catch { /* Storage is optional. */ }
    })
    return () => {
      cancelAnimationFrame(refreshFrame.current)
      refreshFrame.current = 0
      instance.destroy()
      markers.current.clear()
      routeElements.current.clear()
      viewer.current = null
    }
  }, [])

  useEffect(() => {
    if (!ready || !selected || !viewer.current) return
    if (restoredView.current) { restoredView.current = false; return }
    const region = regionById(selected) || subregionById(selected)
    const place = placeById(selected)
    const feature = featureById(selected)
    if (region || feature) {
      const [x, y, w, h] = (region || feature)!.box
      viewer.current.viewport.fitBounds(viewer.current.viewport.imageToViewportRectangle(x * 8192, y * 5668, w * 8192, h * 5668), reducedMotion)
    } else if (place) {
      const [x, y] = place.point
      viewer.current.viewport.fitBounds(viewer.current.viewport.imageToViewportRectangle((x - .09) * 8192, (y - .09) * 5668, .18 * 8192, .18 * 5668), reducedMotion)
    }
  }, [selected, ready, reducedMotion])

  useEffect(() => {
    refreshMarkers.current = () => {
      const instance = viewer.current
      if (!instance || !ready || !element.current) return
      const needle = normalize(query)
      const level = instance.viewport.getZoom() / instance.viewport.getHomeZoom() * 100
      const { x: width, y: height } = instance.viewport.getContainerSize()
      const country = regionById(selected || '')?.id || locationById(selected || '')?.region || featureById(selected || '')?.region
      const route = featureById(selected || '')?.kind === 'route' ? featureById(selected!) : undefined
      const stops = route?.stops || []
      const candidates: { marker: HTMLButtonElement; x: number; y: number; priority: number; id: string }[] = []
      for (const entry of [...regions, ...mapLocations, ...mapFeatures]) {
        const marker = markers.current.get(entry.id)
        if (!marker) continue
        const isRegion = 'box' in entry
        const isSubregion = 'kind' in entry && entry.kind === 'subregion'
        const feature = featureById(entry.id)
        const aliases = 'aliases' in entry ? entry.aliases || [] : []
        const searchText = ('region' in entry ? `${entry.name} ${regionById(entry.region)?.name} ${subregionById(('subregion' in entry && entry.subregion) || '')?.name || ''}` : entry.name) + ' ' + aliases.join(' ')
        const chosen = entry.id === selected
        const match = chosen || !needle || normalize(searchText + ' ' + (feature?.summary || '')).includes(needle)
        const point = instance.viewport.pixelFromPoint(instance.viewport.imageToViewportCoordinates(entry.point[0] * 8192, entry.point[1] * 5668), true)
        const inView = point.x > -12 && point.x < width + 12 && point.y > -12 && point.y < height + 12
        let tier = false
        if (feature) tier = feature.kind === 'route'
          ? showRoutes && (route ? chosen : feature.status !== 'planned')
          : showGeography && !route
        else if (isSubregion) tier = showGeography && !route
        else if (isRegion) tier = level < 175 && !route
        else tier = route ? stops.includes(entry.id) : showCities
        const visible = inView && match && ((chosen && (!feature || (feature.kind === 'route' ? showRoutes : showGeography))) || tier || Boolean(needle))
        marker.parentElement!.style.zIndex = chosen ? '30' : 'major' in entry && entry.major ? '10' : feature ? '4' : isRegion ? '3' : '6'
        marker.classList.toggle('is-hidden', !visible)
        marker.tabIndex = visible ? 0 : -1
        marker.setAttribute('aria-hidden', String(!visible))
        marker.classList.toggle('selected', chosen)
        marker.classList.toggle('distant-pin', !route && level < 175 && !country && !showCities && !needle && !chosen)
        marker.classList.toggle('route-stop', stops.includes(entry.id))
        marker.setAttribute('aria-pressed', String(chosen))
        if (visible) candidates.push({ marker, x: point.x, y: point.y, id: entry.id, priority: chosen ? 100 : stops.includes(entry.id) ? 90 : isRegion ? 80 : 'major' in entry && entry.major ? 70 : isSubregion ? 60 : feature ? 40 : 50 })
      }
      // Labels collide in screen space. A muted label still has a small marker
      // and appears on hover/focus. Recalculate on pan, resize and zoom.
      const occupied = candidates.map(c => ({ l: c.x - 13, r: c.x + 13, t: c.y - 13, b: c.y + 13, id: c.id }))
      let count = 0
      for (const c of candidates.sort((a, b) => b.priority - a.priority)) {
        const label = c.marker.querySelector<HTMLSpanElement>('.pin-label')!
        c.marker.classList.remove('label-muted', 'label-left')
        const w = Math.min(label.offsetWidth || 130, width - 30), h = Math.max(label.offsetHeight, 22)
        let placed = false
        for (const left of [false, true]) {
          const l = left ? c.x - 23 - w : c.x + 23
          const rect = { l, r: l + w, t: c.y - h / 2 - 3, b: c.y + h / 2 + 3, id: c.id }
          const overlap = occupied.some(o => o.id !== c.id && rect.l < o.r + 5 && rect.r > o.l - 5 && rect.t < o.b + 4 && rect.b > o.t - 4)
          if ((c.id === selected || (!overlap && count < (width < 600 ? 10 : 18))) && rect.l >= 6 && rect.r <= width - 6 && rect.t >= 5 && rect.b <= height - 5) {
            c.marker.classList.toggle('label-left', left)
            occupied.push(rect); count++; placed = true; break
          }
        }
        c.marker.classList.toggle('label-muted', !placed && c.id !== selected)
      }
      for (const [id, element] of routeElements.current) {
        const feature = featureById(id)!
        element.classList.toggle('route-hidden', !showRoutes || (route ? selected !== id : feature.status === 'planned') || (!!needle && selected !== id && !normalize(feature.name).includes(needle)))
        element.classList.toggle('route-selected', selected === id)
        element.querySelectorAll('.route-hit').forEach(path => path.setAttribute('tabindex', element.classList.contains('route-hidden') ? '-1' : '0'))
      }
    }
    refreshMarkers.current()
  }, [query, showCities, showGeography, showRoutes, zoom, ready, selected])

  const location = locationById(selected || '')
  const scene = selected === 'hardlane' || location?.subregion === 'hardlane' || (featureById(selected || '') && !['mor-sir-hatti', 'myrran-luthen-yolu', 'rilorn-korfezi'].includes(selected!))
    ? 'honud' : regionById(selected || '')?.id || location?.region || 'world'
  return <>
    <div className="atlas-viewer" ref={element} data-testid="atlas-viewer" aria-label="Valhunar interaktif haritası. Fareyle sürükle; tekerlekle veya kontrollerle yakınlaştır." />
    <div className="map-vignette" />
    {effects && !reducedMotion && <div className={`atmosphere scene-${scene}`} aria-hidden="true">
      <div className="fog fog-one" /><div className="fog fog-two" />
      {Array.from({ length: 22 }, (_, i) => <i key={i} style={{ '--x': `${(i * 37 + 13) % 100}%`, '--delay': `${-i * .7}s`, '--duration': `${7 + i % 6}s` } as CSSProperties} />)}
    </div>}
    <div className="map-compass" aria-hidden="true"><span>K</span><Compass size={38} strokeWidth={.8} /><span>VALHUNAR</span></div>
    {!ready && !failed && <div className="map-loading" role="status"><LoaderCircle className="spin" size={26} /><span>Atlas açılıyor…</span></div>}
    {failed && <div className="map-loading" role="alert"><p>Harita yüklenemedi.</p><button className="gold-button" onClick={() => { setFailed(false); viewer.current?.open({ tileSource: '/atlas/aruzahr.dzi' }) }}><RotateCcw size={16} /> Yeniden dene</button></div>}
    <span className="map-credit">ARUZAHR <span>✦</span> VALHUNAR ATLASI</span>
  </>
})
