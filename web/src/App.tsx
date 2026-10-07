import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Bookmark, Castle, Check, ChevronRight, Compass, Flame, Globe2, Keyboard, Layers, Map, MapPin, Maximize2, Menu, Minimize2, Mountain, Plus, Minus, Search, Share2, Snowflake, Sparkles, Trees, Waves, X } from 'lucide-react'
import type { AtlasHandle } from './Atlas'
import { canonicalId, historyArticle, locationById, mapLocations, normalize, places, regionById, regions, subregionById, subregions } from './data'
import type { RegionId, Section } from './data'

const icons = { xotar: Flame, murgul: Trees, honud: Snowflake, danstsud: Castle, garmirk: Mountain, ariki: Waves, gurbin: Compass, lakbar: Flame }
const Atlas = lazy(() => import('./Atlas'))
const readRoute = () => window.location.hash.slice(1) || '/atlas'
const decodeId = (value: string) => { try { return canonicalId(decodeURIComponent(value)) } catch { return canonicalId(value) } }
const allIds = new Set([...regions, ...mapLocations, historyArticle].map(entry => entry.id))
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
  const [focusMode, setFocusMode] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [toast, setToast] = useState('')
  const atlas = useRef<AtlasHandle>(null)
  const search = useRef<HTMLInputElement>(null)
  const help = useRef<HTMLDialogElement>(null)
  const reducedMotion = useReducedMotion()
  const selected = route.startsWith('/atlas/') ? decodeId(route.slice('/atlas/'.length)) : null
  const wiki = route.startsWith('/wiki')
  const articleId = route.startsWith('/wiki/') ? decodeId(route.slice('/wiki/'.length)) : null
  const selectedRegion = regionById(selected || '')
  const selectedPlace = locationById(selected || '')
  const detailRegion = selectedRegion || regionById(selectedPlace?.region || '')
  const selectedName = selectedRegion?.name || selectedPlace?.name
  const needle = normalize(query.trim())

  function navigate(next: string) { setFocusMode(false); window.location.hash = next; setRoute(next); setMobileNav(false) }
  function select(id: string) { navigate(`/atlas/${id}`) }
  function toggleSaved(id: string) { setSaved(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]) }
  function closeDetail() { navigate('/atlas'); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-testid="marker-${selected}"]`)?.focus()) }

  useEffect(() => { const handler = () => { setRoute(readRoute()); setFocusMode(false) }; window.addEventListener('hashchange', handler); return () => window.removeEventListener('hashchange', handler) }, [])
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
  const filteredPlaces = useMemo(() => mapLocations.filter(place => (!savedOnly || saved.includes(place.id)) && (!needle || normalize(`${place.name} ${regionById(place.region)?.name} ${subregionById(place.subregion || '')?.name || ''}`).includes(needle))), [savedOnly, saved, needle])
  const historyResult = (Boolean(query) || savedOnly) && (!savedOnly || saved.includes(historyArticle.id)) && (!needle || normalize(historyArticle.name).includes(needle))

  async function share(id: string) {
    const link = new URL(window.location.href)
    link.hash = `/wiki/${id}`
    try { await navigator.clipboard.writeText(link.href); setToast('Wiki bağlantısı kopyalandı.') } catch { setToast(`Bu kaydın bağlantısı: ${link.href}`) }
  }

  const articleRegion = regionById(articleId || '')
  const articlePlace = locationById(articleId || '')
  const isHistory = articleId === historyArticle.id
  const articleContext = articleRegion || regionById(articlePlace?.region || '')
  const articleName = articleRegion?.name || articlePlace?.name || (isHistory ? historyArticle.name : '')
  const articleSections: Section[] = articleRegion?.sections || articlePlace?.sections || (isHistory ? historyArticle.sections : articlePlace ? [
    { title: 'Yerleşim kaydı', paragraphs: [articlePlace.summary || `${articlePlace.name}, Valhunar haritasında ${articleContext?.name} bölgesindeki yerleşimler arasında gösterilir.`, 'Bu kayıt, haritadaki konumu bölgenin genel kültürü ve coğrafyasıyla birlikte keşfetmen için bir başlangıç noktasıdır.'] },
    { title: `${articleContext?.name} dünyası`, paragraphs: [articleContext?.summary || ''] },
  ] : [])
  const articleSubregions = articleRegion ? subregions.filter(area => area.region === articleRegion.id) : []
  const articleRelated = articlePlace
    ? [...new Set([articlePlace.region, articlePlace.subregion, ...(articlePlace.related || [])])]
      .filter((id): id is string => Boolean(id) && id !== articlePlace.id)
      .map(id => regionById(id) || locationById(id)).filter(entry => Boolean(entry))
    : places.filter(place => place.region === articleContext?.id)
  const articleKind = isHistory ? 'TARİH & EFSANELER' : articlePlace?.kind === 'subregion' ? 'DANSTSUD BÖLGELERİ' : articlePlace ? 'YERLEŞİMLER' : articleRegion?.id === 'danstsud' ? 'KRALLIKLAR' : 'BÖLGELER'

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
      <div className="sidebar-intro"><span className="eyebrow">KEŞİF DEFTERİ</span><h2>Dünyaya açılan kapı.</h2></div>
      <label className="search-field"><Search size={16} /><input ref={search} value={query} onChange={event => setQuery(event.target.value)} placeholder="Bir yer, bir hikâye ara…" aria-label="Atlas ve wiki içinde ara" /><kbd>/</kbd></label>
      {query && <button className="clear-search" onClick={() => setQuery('')}><X size={12} /> Aramayı temizle</button>}
      <div className="sidebar-section-heading"><span>{savedOnly ? 'KAYDEDİLEN YERLER' : query ? 'ARAMA SONUÇLARI' : 'VALHUNAR BÖLGELERİ'}</span><span>{query || savedOnly ? filteredRegions.length + filteredPlaces.length + Number(historyResult) : filteredRegions.length}</span></div>
      <div className="region-list">
        {filteredRegions.map(region => { const Icon = icons[region.id]; return <button key={region.id} className={`region-link ${detailRegion?.id === region.id ? 'active' : ''}`} onClick={() => wiki ? navigate(`/wiki/${region.id}`) : select(region.id)} style={{ '--region-color': region.color } as CSSProperties}><span className="region-icon"><Icon size={18} strokeWidth={1.5} /></span><span><strong>{region.name}</strong><small>{region.climate}</small></span><ChevronRight size={14} /></button> })}
        {(query || savedOnly) && filteredPlaces.map(place => <button className="place-search-result" key={place.id} onClick={() => wiki ? navigate(`/wiki/${place.id}`) : select(place.id)}><MapPin size={14} /><span>{place.name}<small>{regionById(place.region)?.name}{place.kind === 'subregion' ? ' · Bölge' : ''}</small></span><ChevronRight size={13} /></button>)}
        {historyResult && <button className="place-search-result" onClick={() => navigate('/wiki/buyuk-kirilma')}><BookOpen size={14} /><span>Büyük Kırılma<small>Tarih & efsaneler</small></span><ChevronRight size={13} /></button>}
        {(query || savedOnly) && !filteredRegions.length && !filteredPlaces.length && !historyResult && <div className="empty-search"><Compass size={26} /><p>{savedOnly ? 'Henüz bir yer kaydetmedin.' : 'Bu aramada bir kayıt bulunamadı.'}</p><small>{savedOnly ? 'Bir bölgedeki yer imi simgesine dokun.' : 'Bir şehir veya bölge adı dene.'}</small></div>}
      </div>
      <div className="sidebar-bottom"><button className="history-card" onClick={() => navigate('/wiki/buyuk-kirilma')}><span className="history-symbol">✧</span><span className="eyebrow">DÜNYANIN HAFIZASI</span><strong>Büyük Kırılma</strong><p>Her efsane, aynı yaradan doğar.</p><span className="text-link">Hikâyeyi keşfet <ArrowRight size={14} /></span></button><div className="sidebar-footer"><span className="small-diamond">◆</span><span>Bir haritadan daha fazlası.</span></div></div>
    </aside>

    <main id="main-content" className={`main-content ${!wiki ? 'atlas-main' : ''}`} tabIndex={-1}>
      {!wiki ? <>
        <div className="page-heading"><div><div className="breadcrumb"><span>ARUZAHR EVRENİ</span><ChevronRight size={10} /><span>VALHUNAR ATLASI</span></div><h1>Kıtanın <em>izini sür.</em></h1><p>Her sınırın bir geçmişi. Her şehrin anlatacak bir hikâyesi var.</p></div><div className="atlas-stats"><div><Globe2 size={19} /><strong>8</strong><span>BÖLGE</span></div><span className="stat-separator" /><div><MapPin size={19} /><strong>{places.length}</strong><span>YERLEŞİM</span></div></div></div>
        <section className={`map-shell ${focusMode ? 'focus-mode' : ''}`} aria-label="İnteraktif atlas">
          <div className="map-toolbar"><span className="map-toolbar-title"><Compass size={18} /><strong>VALHUNAR</strong><span className="map-version">KEŞİF ATLASI</span></span><div className="map-toolbar-actions"><button className={cities ? 'toggled' : ''} aria-pressed={cities} onClick={() => setCities(!cities)}><Layers size={15} /><span>Yerleşimler</span></button><button className={effects && !reducedMotion ? 'toggled' : ''} aria-pressed={effects && !reducedMotion} aria-label="Atmosfer efektleri" disabled={reducedMotion} onClick={() => setEffects(!effects)}><Sparkles size={15} /><span>Atmosfer</span></button><span className="toolbar-divider" /><button aria-label={focusMode ? 'Odak modundan çık' : 'Odak moduna geç'} aria-pressed={focusMode} onClick={() => setFocusMode(!focusMode)}>{focusMode ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button></div></div>
          <div className="map-stage">
            <Suspense fallback={<div className="map-loading" role="status">Atlas açılıyor…</div>}><Atlas ref={atlas} selected={selected} onSelect={select} query={query} showCities={cities} effects={effects} reducedMotion={reducedMotion} onZoom={setZoom} /></Suspense>
            {!detailRegion && !cities && !query && zoom < 150 && <div className="map-welcome"><span className="eyebrow"><i /> KEŞFİN BURADA BAŞLIYOR</span><h2>Bilinmeyene doğru.</h2><p>Bir bölgeye dokun. Hikâyesine adım at.</p><button onClick={() => select('danstsud')}>İlk yolculuğuna başla <ArrowRight size={15} /></button></div>}
            {detailRegion && selectedName && <aside className="detail-panel" aria-label={`${selectedName} kısa bilgi`} data-testid="detail-panel" style={{ '--region-color': detailRegion.color } as CSSProperties}>
              <div className="detail-cover"><img src={`/atlas/${detailRegion.id}.webp`} alt={`${detailRegion.name} bölgesinin harita detayı`} /><div className="cover-shade" /><span className="detail-type">{selectedPlace?.kind === 'subregion' ? 'DANSTSUD BÖLGESİ' : selectedPlace ? 'YERLEŞİM KAYDI' : 'BÖLGE KAYDI'}</span><button className="detail-close icon-button" aria-label="Bilgi panelini kapat" onClick={closeDetail}><X size={16} /></button></div>
              <div className="detail-body"><div className="detail-heading"><h2>{selectedName}</h2><button className={`icon-button ${saved.includes(selected!) ? 'toggled' : ''}`} aria-label={saved.includes(selected!) ? `${selectedName} kaydını kaldır` : `${selectedName} kaydet`} onClick={() => toggleSaved(selected!)}><Bookmark size={18} fill={saved.includes(selected!) ? 'currentColor' : 'none'} /></button></div><span className="detail-subtitle">{selectedPlace ? selectedPlace.subtitle || `${detailRegion.name} · Valhunar` : detailRegion.subtitle}</span><p>{selectedPlace?.summary || (selectedPlace ? `${selectedPlace.name}, Valhunar haritasında ${detailRegion.name} bölgesindeki yerleşimler arasında yer alır.` : detailRegion.summary)}</p>{!selectedPlace && <blockquote>“{detailRegion.quote}”</blockquote>}<div className="detail-tags">{detailRegion.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button className="gold-button" onClick={() => navigate(`/wiki/${selected}`)}><BookOpen size={16} /> Wiki sayfasını aç <ArrowRight size={15} /></button>{selectedPlace && <button className="detail-region-link" onClick={() => select(detailRegion.id)}>{detailRegion.name} bölgesini keşfet <ChevronRight size={13} /></button>}</div>
            </aside>}
            <div className="zoom-controls"><button aria-label="Yakınlaştır" onClick={() => atlas.current?.zoom(1.5)}><Plus size={18} /></button><span data-testid="zoom-level">{zoom}%</span><button aria-label="Uzaklaştır" onClick={() => atlas.current?.zoom(1 / 1.5)}><Minus size={18} /></button><span className="control-divider" /><button aria-label="Haritanın tamamını göster" onClick={() => { navigate('/atlas'); atlas.current?.home() }}><Maximize2 size={16} /></button></div>
          </div>
          <div className="map-bottom-bar"><span><span className="status-dot" /> 8K ORİJİNAL HARİTA</span><span className="map-help">Sürükle: gezin <i>·</i> Tekerlek: yakınlaş <i>·</i> Noktaya dokun: keşfet</span><button onClick={() => help.current?.showModal()}><Keyboard size={14} /> Kısayollar</button></div>
        </section>
        <div className="below-map"><span><span className="small-diamond">✧</span> Sekiz bölge. Ortak bir geçmiş. Keşfedilecek bir dünya.</span><a href="#/wiki">Ansiklopediye göz at <ArrowRight size={14} /></a></div>
      </> : articleId ? <>
        {!articleName ? <div className="not-found"><Compass size={40} /><h1>Kayıt bulunamadı.</h1><p>Bu sayfanın izleri atlasın dışında kalmış olabilir.</p><button className="gold-button" onClick={() => navigate('/wiki')}>Ansiklopediye dön <ArrowRight size={16} /></button></div> : <article className="wiki-article" key={articleId}>
          <div className="article-topline"><button onClick={() => navigate('/wiki')}><ArrowLeft size={15} /> Ansiklopedi</button><div><button className={`icon-button ${saved.includes(articleId) ? 'toggled' : ''}`} aria-label={saved.includes(articleId) ? 'Kaydı kaldır' : 'Kaydı kaydet'} onClick={() => toggleSaved(articleId)}><Bookmark size={17} fill={saved.includes(articleId) ? 'currentColor' : 'none'} /></button><button className="icon-button" aria-label="Wiki bağlantısını kopyala" onClick={() => share(articleId)}><Share2 size={17} /></button></div></div>
          <div className={`article-cover ${isHistory ? 'history-cover' : ''}`} style={{ backgroundImage: `linear-gradient(0deg, #10161c 2%, #10161c25 100%), url(/atlas/${articleContext?.id || 'lakbar'}.webp)` }}><div className="article-title"><span className="eyebrow">VALHUNAR ANSİKLOPEDİSİ <span> / </span> {articleKind}</span><h1>{articleName}</h1><p>{articleRegion?.subtitle || articlePlace?.subtitle || (isHistory ? historyArticle.subtitle : `${articleContext?.name} · Valhunar`)}</p></div></div>
          <div className="article-layout">
            <div className="article-content">
              {articleContext?.id === 'danstsud' && <p className="article-period">ERYNDORN’UN HÜKÜMDARLIĞI · DARBE ÖNCESİ</p>}
              <p className="article-lead">{articleRegion?.summary || articlePlace?.summary || (isHistory ? historyArticle.summary : `${articleName}, ${articleContext?.name} bölgesindeki harita kayıtlarından biridir.`)}</p>
              {(articleRegion || isHistory) && <blockquote className="article-quote"><span>“</span>{articleRegion?.quote || historyArticle.quote}</blockquote>}
              {articleSections.map((section, index) => <section id={`article-section-${index}`} key={section.title}>
                <span className="section-number">{String(index + 1).padStart(2, '0')}</span>
                <h2>{section.title}</h2>
                {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              </section>)}
              {articleSubregions.length > 0 && <section className="related-places" data-testid="subregion-links">
                <h2>Danstsud’un bölgeleri</h2>
                {articleSubregions.map(area => <button key={area.id} onClick={() => navigate(`/wiki/${area.id}`)}>
                  <Compass size={17} /><span>{area.name}<small>{area.subtitle}</small></span><ArrowRight size={16} />
                </button>)}
              </section>}
              {articleContext && articleRelated.length > 0 && <section className="related-places" data-testid="related-locations">
                <h2>{articlePlace ? 'Bağlantılı yerler' : 'Haritadaki yerleşimler'}</h2>
                {articleRelated.map(entry => entry && <button key={entry.id} onClick={() => navigate(`/wiki/${entry.id}`)}>
                  <MapPin size={15} /><span>{entry.name}<small>{'region' in entry ? entry.kind === 'subregion' ? 'Danstsud bölgesi' : entry.major ? 'Başlıca şehir' : 'Yerleşim' : entry.subtitle}</small></span><ArrowRight size={16} />
                </button>)}
              </section>}
              <div className="article-sources"><BookOpen size={15} /><div><strong>Kaynaklar</strong>
                <p>{(articleRegion?.sources || articlePlace?.sources || (isHistory ? ['Valhunar.pdf — genel kültürel anlatılar'] : ['Aruzahr 8k (1).jpg'])).join(' · ')}</p>
                <small>Genel dünya bilgisi · Kampanya sırları bu ansiklopedide yayımlanmaz.</small>
              </div></div>
            </div>
            <aside className="article-toc"><span className="eyebrow">BU SAYFADA</span>
              {articleSections.map((section, index) => <button key={section.title} onClick={() => document.getElementById(`article-section-${index}`)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</button>)}
              {!isHistory && <button className="gold-button" onClick={() => navigate(`/atlas/${articleId}`)}><Map size={15} /> Haritada göster</button>}
              <div className="toc-note"><Compass size={24} strokeWidth={1} /><p>Bir yerin hikâyesi, onu keşfedenle tamamlanır.</p></div>
            </aside>
          </div>
        </article>}
      </> : <>
        <div className="page-heading wiki-heading"><div><div className="breadcrumb"><span>ARUZAHR EVRENİ</span><ChevronRight size={10} /><span>DÜNYA ANSİKLOPEDİSİ</span></div><h1>Hikâyelerin <em>izinde.</em></h1><p>Toprakları, halkları ve bir dünyayı birbirine bağlayan efsaneleri tanı.</p></div><BookOpen className="heading-symbol" size={42} strokeWidth={.8} /></div>
        <div className="wiki-grid">{filteredRegions.map(region => { const Icon = icons[region.id]; return <a href={`#/wiki/${region.id}`} className="wiki-card" key={region.id}><div className="wiki-card-image"><img src={`/atlas/${region.id}.webp`} alt={`${region.name} haritası`} loading="lazy" /><span><Icon size={17} strokeWidth={1.3} />{region.climate}</span></div><div className="wiki-card-body"><span className="eyebrow">VALHUNAR BÖLGESİ</span><h2>{region.name}</h2><p>{region.summary}</p><span className="text-link">Hikâyesini oku <ArrowRight size={15} /></span></div></a> })}</div>
        {(query || savedOnly) && filteredPlaces.length > 0 && <section className="wiki-place-results"><h2>Yerler ve bölgeler</h2>{filteredPlaces.map(place => <a href={`#/wiki/${place.id}`} key={place.id}><MapPin size={15} /><span>{place.name}<small>{regionById(place.region)?.name}</small></span><ArrowRight size={14} /></a>)}</section>}
        {!filteredRegions.length && !filteredPlaces.length && !historyResult && <div className="empty-search"><Compass size={35} /><h2>Kayıt bulunamadı.</h2><p>Aramayı temizleyerek bütün bölgelere dönebilirsin.</p><button className="gold-button" onClick={() => { setQuery(''); setSavedOnly(false) }}>Bütün bölgeleri göster</button></div>}
        {(!needle || normalize(historyArticle.name).includes(needle)) && (!savedOnly || saved.includes(historyArticle.id)) && <a className="wiki-history" href="#/wiki/buyuk-kirilma"><span className="history-symbol">✧</span><div><span className="eyebrow">ATEŞ, IŞIK VE HAFIZA</span><h2>Büyük Kırılma</h2><p>Aynı geçmişin farklı halklarda bıraktığı izler.</p></div><ArrowRight size={24} strokeWidth={1} /></a>}
      </>}
    </main>

    <dialog ref={help} className="help-dialog" aria-labelledby="help-title"><button className="dialog-close icon-button" aria-label="Rehberi kapat" onClick={() => help.current?.close()} autoFocus><X size={18} /></button><Compass size={35} strokeWidth={1} /><span className="eyebrow">YOLCUNUN REHBERİ</span><h2 id="help-title">Keşfetmenin yolları.</h2><p>Haritayı sürükle, bir yere yaklaş ve hikâyesine dokun. Dokunmatik ekranda iki parmağınla yakınlaşabilirsin.</p><div className="shortcut"><span>Atlas içinde ara</span><kbd>/</kbd></div><div className="shortcut"><span>Yakınlaş / uzaklaş</span><span><kbd>+</kbd> <kbd>−</kbd></span></div><div className="shortcut"><span>Bilgi panelini kapat</span><kbd>Esc</kbd></div><div className="shortcut"><span>Haritanın tamamı</span><Maximize2 size={16} /></div><p className="help-note"><Bookmark size={14} /> Kaydettiğin yerler bu tarayıcıda hatırlanır.</p><button className="gold-button" onClick={() => help.current?.close()}>Yolculuğa devam et <ArrowRight size={15} /></button></dialog>
    {toast && <div className="toast" role="status"><Check size={16} />{toast}</div>}
  </div>
}
