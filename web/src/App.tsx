import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowRight, BookOpen, Bookmark, Castle, Check, ChevronRight, Compass, Crown, Flame, Globe2, Keyboard, Layers, Map, MapPin, Maximize2, Menu, Minimize2, Mountain, Plus, Minus, Search, Snowflake, Sparkles, Trees, Waves, X } from 'lucide-react'
import type { AtlasHandle } from './Atlas'
import { articleById, canonicalId, historyArticle, locationById, loreArticles, loreKindLabels, mapLocations, normalize, places, regionById, regions, subregionById, subregions } from './data'
import { featureById, mapFeatures, featureLabels } from './map-features'
import DiscoveryCard from './DiscoveryCard'
import WikiArticle from './WikiArticle'
import WikiHub from './WikiHub'
import { JourneyCollection, JourneyNavigator, journeyById } from './Journeys'
import type { JourneyId } from './Journeys'

const icons = { xotar: Flame, murgul: Trees, honud: Snowflake, danstsud: Castle, garmirk: Mountain, ariki: Waves, gurbin: Compass, lakbar: Flame }
const Atlas = lazy(() => import('./Atlas'))
const readRoute = () => window.location.hash.slice(1) || '/atlas'
const decodeId = (value: string) => { try { return canonicalId(decodeURIComponent(value)) } catch { return canonicalId(value) } }
const allIds = new Set([...regions, ...mapLocations, ...loreArticles, ...mapFeatures, historyArticle].map(entry => entry.id))
function readSaved(): string[] {
  try { const value = JSON.parse(localStorage.getItem('aruzahr-saved') || '[]'); return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string').map(canonicalId).filter(id => allIds.has(id)))] : [] } catch { return [] }
}
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => { const media = window.matchMedia('(prefers-reduced-motion: reduce)'); const handler = () => setReduced(media.matches); media.addEventListener('change', handler); return () => media.removeEventListener('change', handler) }, [])
  return reduced
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(readSaved)
  const [savedOnly, setSavedOnly] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [cities, setCities] = useState(false)
  const [effects, setEffects] = useState(true)
  const [geography, setGeography] = useState(true)
  const [routes, setRoutes] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [toast, setToast] = useState('')
  const [journey, setJourney] = useState<JourneyId | null>(null)
  const atlas = useRef<AtlasHandle>(null)
  const search = useRef<HTMLInputElement>(null)
  const help = useRef<HTMLDialogElement>(null)
  const lastMapRoute = useRef(readRoute().startsWith('/atlas') ? readRoute() : '/atlas')
  const reducedMotion = useReducedMotion()
  const selected = route.startsWith('/atlas/') ? decodeId(route.slice('/atlas/'.length)) : null
  const wiki = route.startsWith('/wiki')
  const articleId = route.startsWith('/wiki/') ? decodeId(route.slice('/wiki/'.length)) : null
  const selectedRegion = regionById(selected || '')
  const selectedPlace = locationById(selected || '')
  const selectedFeature = featureById(selected || '')
  const detailRegion = selectedRegion || regionById(selectedPlace?.region || selectedFeature?.region || '')
  const selectedName = selectedRegion?.name || selectedPlace?.name || selectedFeature?.name
  const needle = normalize(query.trim())

  function navigate(next: string) { if (!next.startsWith('/atlas')) setFocusMode(false); window.location.hash = next; setRoute(next); setMobileNav(false) }
  function resetMap() { navigate('/atlas'); requestAnimationFrame(() => atlas.current?.home()) }
  function select(id: string) { navigate(`/atlas/${id}`) }
  function startJourney(id: JourneyId) { setJourney(id); setQuery(''); setSavedOnly(false); setRoutes(false); select(journeyById(id).stops[0].id) }
  function toggleSaved(id: string) { setSaved(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]) }
  function closeDetail() { navigate('/atlas'); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-testid="marker-${selected}"]`)?.focus()) }

  useEffect(() => { const handler = () => { const next = readRoute(); setRoute(next); if (!next.startsWith('/atlas')) setFocusMode(false) }; window.addEventListener('hashchange', handler); return () => window.removeEventListener('hashchange', handler) }, [])
  useEffect(() => {
    if (route.startsWith('/atlas')) lastMapRoute.current = route
    document.getElementById('main-content')?.scrollTo({ top: 0 })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [route])
  useEffect(() => {
    if (selectedFeature?.kind === 'route') setRoutes(true)
    else if (selectedFeature) setGeography(true)
  }, [selectedFeature])

  useEffect(() => { try { localStorage.setItem('aruzahr-saved', JSON.stringify(saved)) } catch { /* Private browser storage is optional. */ } }, [saved])
  useEffect(() => { if (!toast) return; const timeout = window.setTimeout(() => setToast(''), 3500); return () => window.clearTimeout(timeout) }, [toast])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (event.key === 'Escape') { if (help.current?.open) return; setMobileNav(false); setFocusMode(false); if (selected) closeDetail(); return }
      if (target.matches('input, textarea, [contenteditable]')) return
      if (event.key === '/' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) { event.preventDefault(); setMobileNav(true); search.current?.focus() }
      if (!wiki && (event.key === '+' || event.key === '=')) atlas.current?.zoom(1.4)
      if (!wiki && event.key === '-') atlas.current?.zoom(1 / 1.4)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, wiki])

  const filteredRegions = useMemo(() => regions.filter(region => (!savedOnly || saved.includes(region.id)) && (!needle || normalize([region.name, region.summary, ...region.tags].join(' ')).includes(needle))), [savedOnly, saved, needle])
  const filteredPlaces = useMemo(() => mapLocations.filter(place => (!savedOnly || saved.includes(place.id)) && (!needle || normalize([
    place.name, place.summary, regionById(place.region)?.name, subregionById(place.subregion || '')?.name,
    ...(place.sections || []).flatMap(section => [section.title, ...section.paragraphs, ...(section.table?.rows.flat() || [])]),
  ].join(' ')).includes(needle))), [savedOnly, saved, needle])
  const filteredLore = useMemo(() => loreArticles.filter(article => (!savedOnly || saved.includes(article.id)) && (!needle || normalize([
    article.name, article.summary, regionById(article.region)?.name, ...(article.aliases || []),
    ...article.sections.flatMap(section => [section.title, ...section.paragraphs, ...(section.table?.rows.flat() || [])]),
  ].join(' ')).includes(needle))), [savedOnly, saved, needle])
  const filteredFeatures = useMemo(() => mapFeatures.filter(feature => (!savedOnly || saved.includes(feature.id)) && (!needle || normalize([feature.name, feature.summary, feature.fact].join(' ')).includes(needle))), [savedOnly, saved, needle])
  const historyResult = (Boolean(query) || savedOnly) && (!savedOnly || saved.includes(historyArticle.id)) && (!needle || normalize(historyArticle.name).includes(needle))

  async function share(id: string) {
    const link = new URL(window.location.href)
    link.hash = `/wiki/${id}`
    try { await navigator.clipboard.writeText(link.href); setToast('Wiki bağlantısı kopyalandı.') } catch { setToast(`Bu kaydın bağlantısı: ${link.href}`) }
  }

  const isHistory = articleId === historyArticle.id

  return <div className="app-shell">
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById('main-content')?.focus() }}>İçeriğe geç</a>
    <header className="topbar">
      <button className="mobile-menu icon-button" aria-label="Bölge menüsünü aç" aria-expanded={mobileNav} onClick={() => setMobileNav(!mobileNav)}><Menu size={21} /></button>
      <a className="brand" href="#/atlas" aria-label="Aruzahr ana atlas"><span className="brand-emblem"><Compass size={30} strokeWidth={1} /></span><span>ARUZAHR<small>THE WORLD WITHIN</small></span></a>
      <nav className="primary-nav" aria-label="Ana gezinme">
        <a href="#/atlas" className={!wiki ? 'active' : ''}><Map size={15} /> Atlas</a>
        <a href="#/wiki" className={wiki && !isHistory ? 'active' : ''}><BookOpen size={15} /> Ansiklopedi</a>
        <a href="#/wiki/buyuk-kirilma" className={isHistory ? 'active' : ''}>Büyük Kırılma</a>
      </nav>
      <div className="topbar-right"><span className="world-label"><i /> VALHUNAR KITASI</span><span className="top-divider" /><button className={`icon-button ${savedOnly ? 'toggled' : ''}`} aria-label="Kaydedilen yerleri göster" aria-pressed={savedOnly} onClick={() => { setSavedOnly(!savedOnly); setQuery(''); setMobileNav(true) }}><Bookmark size={18} />{saved.length > 0 && <b className="saved-count">{saved.length}</b>}</button><button className="icon-button help-button" aria-label="Kullanım rehberi" onClick={() => help.current?.showModal()}><Keyboard size={19} /></button></div>
    </header>

    {mobileNav && <button className="nav-backdrop" aria-label="Bölge menüsünü kapat" onClick={() => setMobileNav(false)} />}
    <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`} aria-label="Atlas dizini">
      <div className="sidebar-intro"><span className="eyebrow">KEŞİF DEFTERİ</span><h2>Valhunar</h2><p>Sekiz toprak. Binlerce hikâye.</p></div>
      <label className="search-field"><Search size={16} /><input ref={search} value={query} onChange={event => setQuery(event.target.value)} placeholder="Bir yer, bir hikâye ara…" aria-label="Atlas ve wiki içinde ara" /><kbd>/</kbd></label>
      {query && <button className="clear-search" onClick={() => setQuery('')}><X size={12} /> Aramayı temizle</button>}
      <div className="sidebar-section-heading"><span>{savedOnly ? 'KAYDEDİLEN YERLER' : query ? 'ARAMA SONUÇLARI' : 'VALHUNAR BÖLGELERİ'}</span><span>{query || savedOnly ? filteredRegions.length + filteredPlaces.length + filteredLore.length + (wiki ? filteredFeatures.length : filteredFeatures.filter(f => !articleById(f.id)).length) + Number(historyResult) : filteredRegions.length}</span></div>
      <div className="region-list">
        {filteredRegions.map(region => { const Icon = icons[region.id]; return <button key={region.id} className={`region-link ${detailRegion?.id === region.id ? 'active' : ''}`} onClick={() => wiki ? navigate(`/wiki/${region.id}`) : select(region.id)} style={{ '--region-color': region.color } as CSSProperties}><span className="region-icon"><Icon size={18} strokeWidth={1.5} /></span><span><strong>{region.name}</strong><small>{region.climate}</small></span><ChevronRight size={14} /></button> })}
        {(query || savedOnly) && filteredPlaces.map(place => <button className="place-search-result" data-testid={`location-result-${place.id}`} key={place.id} onClick={() => wiki ? navigate(`/wiki/${place.id}`) : select(place.id)}><MapPin size={14} /><span>{place.name}<small>{regionById(place.region)?.name}{place.kind === 'subregion' ? ' · Bölge' : ''}</small></span><ChevronRight size={13} /></button>)}
        {(query || savedOnly) && filteredFeatures.map(feature => <button className="place-search-result feature-search-result" data-testid={`feature-result-${feature.id}`} key={`map-${feature.id}`} onClick={() => select(feature.id)}><Waves size={14} /><span>{feature.name}<small>{featureLabels[feature.kind]} · Haritada bul</small></span><ChevronRight size={13} /></button>)}
        {(query || savedOnly) && filteredLore.filter(article => wiki || !featureById(article.id)).map(article => <button className="place-search-result lore-search-result" key={article.id} onClick={() => navigate(`/wiki/${article.id}`)}><BookOpen size={14} /><span>{article.name}<small>{regionById(article.region)?.name} · {loreKindLabels[article.kind]}</small></span><ChevronRight size={13} /></button>)}
        {historyResult && <button className="place-search-result" onClick={() => navigate('/wiki/buyuk-kirilma')}><BookOpen size={14} /><span>Büyük Kırılma<small>Tarih & efsaneler</small></span><ChevronRight size={13} /></button>}
        {(query || savedOnly) && !filteredRegions.length && !filteredPlaces.length && !filteredLore.length && !filteredFeatures.length && !historyResult && <div className="empty-search"><Compass size={26} /><p>{savedOnly ? 'Henüz bir yer kaydetmedin.' : 'Bu aramada bir kayıt bulunamadı.'}</p><small>{savedOnly ? 'Bir bölgedeki yer imi simgesine dokun.' : 'Bir şehir veya bölge adı dene.'}</small></div>}
      </div>
      <div className="sidebar-bottom"><button className="history-card" onClick={() => navigate('/wiki/buyuk-kirilma')}><span className="history-symbol">✧</span><span className="eyebrow">DÜNYANIN HAFIZASI</span><strong>Büyük Kırılma</strong><p>Her efsane, aynı yaradan doğar.</p><span className="text-link">Hikâyeyi keşfet <ArrowRight size={14} /></span></button><div className="sidebar-footer"><span className="small-diamond">◆</span><span>Bir haritadan daha fazlası.</span></div></div>
    </aside>

    <main id="main-content" className={`main-content ${!wiki ? 'atlas-main' : ''}`} tabIndex={-1}>
      {!wiki ? <>
        <div className="page-heading atlas-arrival"><div><div className="breadcrumb"><span>ARUZAHR EVRENİ</span><ChevronRight size={10} /><span>YAŞAYAN ATLAS</span></div><h1>Valhunar’a <em>adım at.</em></h1><p>Her yol bir hikâyeye açılır.</p></div><div className="atlas-stats"><div><Globe2 size={19} /><strong>8</strong><span>BÖLGE</span></div><span className="stat-separator" /><div><MapPin size={19} /><strong>{places.length}</strong><span>YERLEŞİM</span></div></div></div>
        <div className="atlas-presets" aria-label="Hızlı keşif"><span>KEŞFET</span><button onClick={() => { setQuery(''); setRoutes(false); select('hardlane') }}><Snowflake size={15} />Hardlane</button><button onClick={() => { setQuery(''); setRoutes(false); select('valdareth') }}><Crown size={15} />Başkent</button><button onClick={() => { setQuery(''); setRoutes(true); select('kemige-basan-yol') }}><Map size={15} />Yolları keşfet</button><button onClick={() => { setQuery(''); setRoutes(false); resetMap() }}><Globe2 size={15} />Bütün dünya</button></div>
        <section className={`map-shell ${focusMode ? 'focus-mode' : ''}`} aria-label="İnteraktif atlas">
          <div className="map-toolbar"><span className="map-toolbar-title"><Compass size={18} /><strong>VALHUNAR</strong><span className="map-version">KEŞİF ATLASI</span></span><div className="map-toolbar-actions"><button className={cities ? 'toggled' : ''} aria-label="Yerleşimler" aria-pressed={cities} onClick={() => setCities(!cities)}><Layers size={15} /><span>Yerleşimler</span></button><button className={geography ? 'toggled' : ''} aria-label="Denizler & zirveler" aria-pressed={geography} onClick={() => setGeography(!geography)}><Waves size={15} /><span>Denizler & zirveler</span></button><button className={routes ? 'toggled' : ''} aria-label="Ticaret yolları" aria-pressed={routes} onClick={() => setRoutes(!routes)}><Map size={15} /><span>Ticaret yolları</span></button><button className={effects && !reducedMotion ? 'toggled' : ''} aria-pressed={effects && !reducedMotion} aria-label="Atmosfer efektleri" disabled={reducedMotion} onClick={() => setEffects(!effects)}><Sparkles size={15} /><span>Atmosfer</span></button><span className="toolbar-divider" /><button aria-label={focusMode ? 'Odak modundan çık' : 'Odak moduna geç'} aria-pressed={focusMode} onClick={() => setFocusMode(!focusMode)}>{focusMode ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button></div></div>
          {routes && <nav className="route-picker" aria-label="Ticaret rotası seç"><span>Bir hat seç</span>{mapFeatures.filter(f => f.kind === 'route').map(f => <button key={f.id} aria-pressed={selected === f.id} onClick={() => { setQuery(''); select(f.id) }}><i className={f.status === 'planned' ? 'planned' : f.status === 'dangerous' ? 'dangerous' : ''} />{f.name}{f.status === 'planned' && <small>Yapılmadı</small>}</button>)}</nav>}
          {journey && <JourneyNavigator id={journey} selected={selected} onSelect={id => { setQuery(''); select(id) }} onClose={() => setJourney(null)} />}
          <div className={`map-layout ${detailRegion && selectedName ? 'has-detail' : ''}`}><div className="map-stage">
            <Suspense fallback={<div className="map-loading" role="status">Atlas açılıyor…</div>}><Atlas ref={atlas} selected={selected} onSelect={select} query={query} showCities={cities} showGeography={geography} showRoutes={routes} effects={effects} reducedMotion={reducedMotion} onZoom={setZoom} /></Suspense>
            {!detailRegion && !cities && !query && zoom < 150 && <div className="map-welcome"><span className="eyebrow"><i /> KEŞFİN BURADA BAŞLIYOR</span><h2>Bilinmeyene doğru.</h2><p>Bir bölgeye dokun. Hikâyesine adım at.</p><button onClick={() => select('danstsud')}>İlk yolculuğuna başla <ArrowRight size={15} /></button></div>}
            <div className="zoom-controls">
              <button aria-label="Yakınlaştır" onClick={() => atlas.current?.zoom(1.5)}><Plus size={17} /></button><span data-testid="zoom-level">{zoom}%</span>
              <button aria-label="Uzaklaştır" onClick={() => atlas.current?.zoom(1 / 1.5)}><Minus size={17} /></button><span className="control-divider" />
              <button aria-label="Haritanın tamamını göster" onClick={() => { resetMap() }}><Maximize2 size={16} /></button>
            </div>
          </div>
            {detailRegion && selectedName && <DiscoveryCard id={selected!} region={detailRegion} entry={selectedPlace} feature={selectedFeature} saved={saved.includes(selected!)} onSave={() => toggleSaved(selected!)} onClose={closeDetail} navigate={navigate} />}
          </div>
          <div className="map-bottom-bar"><span><span className="status-dot" /> 8K ORİJİNAL HARİTA</span><span className="map-help"><i className="legend-line active-route" />İşleyen hat <i className="legend-line dangerous-route" />Riskli hat <i className="legend-line planned-route" />Planlanan hat <span>· Şematik güzergâhlar</span></span><button onClick={() => help.current?.showModal()}><Keyboard size={14} /> Kısayollar</button></div>
        </section>
        <div className="below-map"><span><span className="small-diamond">✧</span> Sekiz bölge. Ortak bir geçmiş. Keşfedilecek bir dünya.</span><a href="#/wiki">Ansiklopediye göz at <ArrowRight size={14} /></a></div>
        <JourneyCollection onStart={startJourney} />
      </> : articleId ? <WikiArticle key={articleId} id={articleId} saved={saved.includes(articleId)} toggleSaved={() => toggleSaved(articleId)} share={() => share(articleId)} navigate={navigate} backToMap={lastMapRoute.current} reducedMotion={reducedMotion} /> : <WikiHub onStartJourney={startJourney} regions={filteredRegions} places={filteredPlaces} lore={filteredLore} query={query} savedOnly={savedOnly} navigate={navigate} clear={() => { setQuery(''); setSavedOnly(false) }} />}
    </main>

    <dialog ref={help} className="help-dialog" aria-labelledby="help-title"><button className="dialog-close icon-button" aria-label="Rehberi kapat" onClick={() => help.current?.close()} autoFocus><X size={18} /></button><Compass size={35} strokeWidth={1} /><span className="eyebrow">YOLCUNUN REHBERİ</span><h2 id="help-title">Keşfetmenin yolları.</h2><p>Haritayı sürükle, bir yere yaklaş ve hikâyesine dokun. Dokunmatik ekranda iki parmağınla yakınlaşabilirsin.</p><div className="shortcut"><span>Atlas içinde ara</span><kbd>/</kbd></div><div className="shortcut"><span>Yakınlaş / uzaklaş</span><span><kbd>+</kbd> <kbd>−</kbd></span></div><div className="shortcut"><span>Bilgi panelini kapat</span><kbd>Esc</kbd></div><div className="shortcut"><span>Haritanın tamamı</span><Maximize2 size={16} /></div><p className="help-note"><Bookmark size={14} /> Kaydettiğin yerler bu tarayıcıda hatırlanır.</p><button className="gold-button" onClick={() => help.current?.close()}>Yolculuğa devam et <ArrowRight size={15} /></button></dialog>
    {toast && <div className="toast" role="status"><Check size={16} />{toast}</div>}
  </div>
}
