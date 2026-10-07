import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import OpenSeadragon from 'openseadragon'
import { Compass, LoaderCircle, RotateCcw } from 'lucide-react'
import { normalize, places, regions, regionById, placeById } from './data'

export type AtlasHandle = { zoom: (factor: number) => void; home: () => void }
type Props = {
  selected: string | null; onSelect: (id: string) => void; query: string;
  showCities: boolean; effects: boolean; reducedMotion: boolean; onZoom: (value: number) => void;
}

export default forwardRef<AtlasHandle, Props>(function Atlas({ selected, onSelect, query, showCities, effects, reducedMotion, onZoom }, ref) {
  const element = useRef<HTMLDivElement>(null)
  const viewer = useRef<OpenSeadragon.Viewer | null>(null)
  const markers = useRef<Map<string, HTMLButtonElement>>(new Map())
  const select = useRef(onSelect)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [zoom, setZoom] = useState(100)
  select.current = onSelect

  useImperativeHandle(ref, () => ({
    zoom(factor) { viewer.current?.viewport.zoomBy(factor); viewer.current?.viewport.applyConstraints() },
    home() { viewer.current?.viewport.goHome(reducedMotion) },
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
      animationTime: reducedMotion ? 0 : 1.1,
      blendTime: reducedMotion ? 0 : .25,
      springStiffness: 6,
      visibilityRatio: .75,
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
      for (const entry of [...regions, ...places]) {
        const isRegion = 'sections' in entry
        const button = document.createElement('button')
        button.type = 'button'
        button.className = `map-pin ${isRegion ? 'region-pin' : 'city-pin'}`
        button.dataset.testid = `marker-${entry.id}`
        button.setAttribute('aria-label', `${entry.name} ${isRegion ? 'bölgesini' : 'yerleşimini'} keşfet`)
        const symbol = document.createElement('span')
        symbol.className = 'pin-symbol'
        symbol.textContent = isRegion ? '✧' : '◆'
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
      if (instance.viewport.getContainerSize().x < 600 && !selected) instance.viewport.fitVertically(true)
      setFailed(false)
      setReady(true)
    })
    instance.addHandler('open-failed', () => { setFailed(true); setReady(false) })
    instance.addHandler('animation', () => {
      const value = Math.round(instance.viewport.getZoom() / instance.viewport.getHomeZoom() * 100)
      setZoom(value)
      onZoom(value)
    })
    return () => {
      instance.destroy()
      markers.current.clear()
      viewer.current = null
    }
  }, [])

  useEffect(() => {
    if (!ready || !selected || !viewer.current) return
    const region = regionById(selected)
    const place = placeById(selected)
    if (region) {
      const [x, y, w, h] = region.box
      viewer.current.viewport.fitBounds(viewer.current.viewport.imageToViewportRectangle(x * 8192, y * 5668, w * 8192, h * 5668), reducedMotion)
    } else if (place) {
      const [x, y] = place.point
      viewer.current.viewport.fitBounds(viewer.current.viewport.imageToViewportRectangle((x - .09) * 8192, (y - .09) * 5668, .18 * 8192, .18 * 5668), reducedMotion)
    }
  }, [selected, ready, reducedMotion])

  useEffect(() => {
    const needle = normalize(query)
    for (const entry of [...regions, ...places]) {
      const marker = markers.current.get(entry.id)
      if (!marker) continue
      const isRegion = 'sections' in entry
      const match = !needle || normalize(entry.name).includes(needle)
      const visible = match && (isRegion || showCities || zoom > 175 || Boolean(needle))
      marker.classList.toggle('is-hidden', !visible)
      marker.classList.toggle('selected', entry.id === selected)
      marker.setAttribute('aria-pressed', String(entry.id === selected))
    }
  }, [query, showCities, zoom, ready, selected])

  const scene = regionById(selected || '')?.id || placeById(selected || '')?.region || 'world'
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
