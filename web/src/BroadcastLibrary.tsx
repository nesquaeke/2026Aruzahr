import { useId, useMemo, useState, type DragEvent } from 'react'
import { Eye, ImagePlus, Images, MapPin, Search, Upload, Users, X } from 'lucide-react'
import { articleById, normalize, places, placeById, regionById, regions } from './data'
import { characters } from './lore/characters'
import { artworkFor, artworks, countryArt, portraitFor, primaryArtwork, type Artwork } from './media'
import './broadcast-library.css'

export type BroadcastAsset = {
  id: string
  name: string
  src: string
  kind: 'scene' | 'portrait' | 'image'
  locationId?: string
}

type LibraryEntry = {
  asset: BroadcastAsset
  detail: string
  search: string
  region?: string
  group: 'city' | 'location' | 'known' | 'unknown' | 'local'
  regionalView?: boolean
}

type LibraryTab = 'scene' | 'portrait' | 'local'

const sceneLocations: Record<string, string> = {
  'kethra-map': 'kethra',
  'kethra-liman': 'kethra',
  'denizkizi-meyhanesi': 'kethra',
  'kanca-meyhanesi': 'kethra',
  'lirendil-map': 'lirendil',
  'celikkalkan-map': 'lirendil',
  'celikkalkan-yemek': 'lirendil',
  'demirci-ocagi': 'lirendil',
  'lirendil-sokak': 'lirendil',
  'myrran-map': 'myrran',
  'valdareth-zindan': 'valdareth',
}

function sceneContext(art: Artwork) {
  const related = art.relatedId || art.id
  const person = characters.find(character => character.id === related)
  const article = articleById(related)
  const locationId = placeById(related)?.id || sceneLocations[art.id] || person?.city || article?.mapLocation
  const place = locationId ? placeById(locationId) : undefined
  const region = place?.region || person?.region || article?.region || regionById(related)?.id
  return { locationId: place?.id, region }
}

function buildLibrary(): LibraryEntry[] {
  const entries: LibraryEntry[] = []
  const usedScenes = new Set<string>()

  // Every canonical place remains selectable, including places whose public
  // illustration is a regional view rather than an individual city painting.
  for (const place of [...places].sort((a, b) => Number(!!b.major) - Number(!!a.major) || a.name.localeCompare(b.name, 'tr'))) {
    const direct = primaryArtwork(place.id)
    const art = direct || countryArt[place.region]
    if (!art) continue
    const type = !direct ? 'Bölge görseli' : art.origin === 'map' ? 'Harita ayrıntısı' : 'Şehir sahnesi'
    const detail = `${regionById(place.region)?.name || ''} · ${type}`
    entries.push({
      asset: { id: place.id, name: place.name, src: art.src, kind: 'scene', locationId: place.id },
      detail,
      search: normalize([place.name, detail, ...(place.aliases || [])].join(' ')),
      region: place.region,
      group: 'city',
      regionalView: !direct,
    })
    usedScenes.add(art.src)
  }

  // Resolve aliases first so repainted work is selected and a legacy scene
  // marked as a portrait cannot become an invented character identity.
  const extraScenes = Object.values(artworks)
    .map(art => artworkFor(art.id) || art)
    .filter(art => !art.portrait)
    .sort((a, b) => a.title.localeCompare(b.title, 'tr'))
  for (const art of extraScenes) {
    if (usedScenes.has(art.src)) continue
    usedScenes.add(art.src)
    const context = sceneContext(art)
    const detail = art.category === 'fauna' ? 'Canlı çizimi' : art.origin === 'map' || art.id.includes('-map') ? 'Yerleşim çizimi' : 'Mekân ve dünya sahnesi'
    entries.push({
      asset: { id: art.id, name: art.title, src: art.src, kind: 'scene', locationId: context.locationId },
      detail,
      search: normalize(`${art.title} ${art.caption} ${regionById(context.region || '')?.name || ''}`),
      region: context.region,
      group: 'location',
    })
  }

  const usedPortraits = new Set<string>()
  for (const person of [...characters].sort((a, b) => a.name.localeCompare(b.name, 'tr'))) {
    const art = portraitFor(person.portrait)
    if (!art) continue
    usedPortraits.add(art.src)
    const region = person.locationUnknown ? undefined : person.region || 'danstsud'
    const cityName = placeById(person.city)?.name || regionById(person.city)?.name || ''
    const detail = [cityName, person.role].filter(Boolean).join(' · ')
    entries.push({
      asset: { id: person.id, name: person.name, src: art.src, kind: 'portrait', locationId: placeById(person.city)?.id },
      detail,
      search: normalize(`${person.name} ${person.role} ${person.affiliation} ${cityName} ${regionById(region || '')?.name || ''}`),
      region,
      group: 'known',
    })
  }

  let unidentifiedCount = 0
  for (const art of Object.values(artworks)) {
    const resolved = artworkFor(art.id) || art
    if (!resolved.portrait || usedPortraits.has(resolved.src)) continue
    usedPortraits.add(resolved.src)
    unidentifiedCount += 1
    const name = resolved.id.startsWith('night-') ? resolved.title : `Arşiv portresi ${String(unidentifiedCount).padStart(2, '0')}`
    entries.push({
      asset: { id: resolved.id, name, src: resolved.src, kind: 'portrait' },
      detail: resolved.id.startsWith('night-') ? 'Gece ve yol karşılaşması · figür portresi' : 'Arşiv portresi · kimlik atanmamış',
      search: normalize(`${name} ${resolved.title} kimliği açıklanmamış arşiv`),
      group: 'unknown',
    })
  }
  return entries
}

const libraryEntries = buildLibrary()
export const broadcastAssets: BroadcastAsset[] = libraryEntries.map(entry => entry.asset)

export type BroadcastLibraryProps = {
  customAssets: BroadcastAsset[]
  onScene: (asset: BroadcastAsset) => void
  onPortrait: (asset: BroadcastAsset) => void
  onReveal: (asset: BroadcastAsset) => void
  onUpload: (files: File[]) => void
}

function beginAssetDrag(event: DragEvent<HTMLElement>, asset: BroadcastAsset) {
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('application/x-aruzahr-asset', JSON.stringify(asset))
  event.dataTransfer.setData('text/plain', asset.name)
}

export default function BroadcastLibrary({ customAssets, onScene, onPortrait, onReveal, onUpload }: BroadcastLibraryProps) {
  const [tab, setTab] = useState<LibraryTab>('scene')
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState('all')
  const [group, setGroup] = useState('all')
  const [limit, setLimit] = useState(24)
  const uploadId = useId()
  const panelId = useId()
  const localEntries = useMemo<LibraryEntry[]>(() => customAssets.map(asset => ({
    asset, detail: 'Yerel görsel', search: normalize(asset.name), group: 'local',
  })), [customAssets])
  const sourceEntries = tab === 'local' ? localEntries : libraryEntries.filter(entry => entry.asset.kind === tab)
  const needle = normalize(query.trim())
  const matches = sourceEntries.filter(entry => (
    (!needle || entry.search.includes(needle))
    && (tab === 'local' || region === 'all' || entry.region === region)
    && (group === 'all' || entry.group === group)
  ))
  const chooseTab = (next: LibraryTab) => { setTab(next); setGroup('all'); setLimit(24) }
  const resetFilters = () => { setQuery(''); setRegion('all'); setGroup('all'); setLimit(24) }
  const activate = (asset: BroadcastAsset) => {
    if (asset.kind === 'portrait') onPortrait(asset)
    else if (asset.kind === 'scene') onScene(asset)
    else onReveal(asset)
  }
  const counts: Record<LibraryTab, number> = {
    scene: libraryEntries.filter(entry => entry.asset.kind === 'scene').length,
    portrait: libraryEntries.filter(entry => entry.asset.kind === 'portrait').length,
    local: customAssets.length,
  }

  return <section className="broadcast-library" aria-label="Yayın görsel kütüphanesi" data-testid="broadcast-library">
    <header className="broadcast-library-heading">
      <div><span className="broadcast-library-kicker">ARUZAHR ARŞİVİ</span><h2>Görsel kütüphanesi</h2></div>
      <Images size={19} aria-hidden="true" />
    </header>

    <div className="broadcast-library-tabs" role="group" aria-label="Görsel kategorisi">
      {([
        { id: 'scene', label: 'Sahneler', icon: <MapPin size={14} /> },
        { id: 'portrait', label: 'Karakterler', icon: <Users size={14} /> },
        { id: 'local', label: 'Yerel', icon: <Upload size={14} /> },
      ] as const).map(item => <button key={item.id} type="button" aria-pressed={tab === item.id} aria-controls={panelId} onClick={() => chooseTab(item.id)}>
        {item.icon}<span>{item.label}</span><small>{counts[item.id]}</small>
      </button>)}
    </div>

    <div className="broadcast-library-tools">
      <label className="broadcast-library-search"><Search size={15} aria-hidden="true" />
        <input type="search" aria-label="Yayın görsellerinde ara" placeholder={tab === 'portrait' ? 'İsim, yer veya görev ara…' : tab === 'local' ? 'Yüklenen görsellerde ara…' : 'Şehir veya mekân ara…'} value={query} onChange={event => { setQuery(event.target.value); setLimit(24) }} />
        {query && <button type="button" aria-label="Görsel aramasını temizle" onClick={() => { setQuery(''); setLimit(24) }}><X size={14} /></button>}
      </label>
      {tab !== 'local' && <div className="broadcast-library-filters">
        <select aria-label="Görsellerin ülkesi" value={region} onChange={event => { setRegion(event.target.value); setLimit(24) }}>
          <option value="all">Bütün ülkeler</option>{regions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <select aria-label={tab === 'scene' ? 'Sahne türü' : 'Portre türü'} value={group} onChange={event => { setGroup(event.target.value); setLimit(24) }}>
          <option value="all">{tab === 'scene' ? 'Bütün sahneler' : 'Bütün portreler'}</option>
          {tab === 'scene' ? <><option value="city">Şehirler ve köyler</option><option value="location">Mekânlar ve dünya</option></> : <><option value="known">Bilinen karakterler</option><option value="unknown">Kimliği açıklanmamış</option></>}
        </select>
      </div>}
      {tab === 'local' && <label className="broadcast-library-upload" htmlFor={uploadId}>
        <ImagePlus size={19} aria-hidden="true" /><span><strong>Görsel ekle</strong><small>Partin, portrelerin, kendi sahnelerin</small></span>
        <input id={uploadId} type="file" accept="image/*" multiple aria-label="Yerel görseller yükle" onChange={event => {
          const files = Array.from(event.target.files || []).filter(file => file.type.startsWith('image/'))
          if (files.length) onUpload(files)
          event.target.value = ''
        }} />
      </label>}
    </div>

    <div className="broadcast-library-result-line"><span role="status">{matches.length} {tab === 'portrait' ? 'portre' : tab === 'local' ? 'görsel' : 'sahne'}</span><span>Sürükle veya seç</span></div>
    <div className="broadcast-library-content" id={panelId}>
      {matches.length ? <div className={`broadcast-library-grid ${tab === 'portrait' ? 'is-portraits' : ''}`}>
        {matches.slice(0, limit).map(entry => {
          const action = entry.asset.kind === 'portrait' ? 'Sahneye ekle' : entry.asset.kind === 'scene' ? 'Arka plan yap' : 'Oyunculara göster'
          return <article className="broadcast-asset-card" key={entry.asset.id} draggable onDragStart={event => beginAssetDrag(event, entry.asset)} data-asset-id={entry.asset.id} data-testid="broadcast-asset-card">
            <button type="button" className="broadcast-asset-select" onClick={() => activate(entry.asset)} aria-label={`${entry.asset.name}: ${action}`} title={`${entry.asset.name} · ${action}`}>
              <span className="broadcast-asset-thumbnail"><img src={entry.asset.src} alt="" loading="lazy" decoding="async" draggable={false} />{entry.group === 'unknown' && <span className="broadcast-asset-context">Kimliği açıklanmamış</span>}{entry.regionalView && <span className="broadcast-asset-context">Bölge görseli</span>}<span className="broadcast-asset-action">{action}</span></span>
              <span className="broadcast-asset-name">{entry.asset.name}</span>
            </button>
            <div className="broadcast-asset-footer"><span title={entry.detail}>{entry.detail}</span><button type="button" aria-label={`${entry.asset.name} görselini oyunculara göster`} title="Oyunculara göster" onClick={() => onReveal(entry.asset)}><Eye size={14} /></button></div>
          </article>
        })}
      </div> : <div className="broadcast-library-empty"><Images size={27} aria-hidden="true" /><strong>{tab === 'local' && !customAssets.length ? 'Kendi görsellerine yer aç.' : 'Bu aramada görsel yok.'}</strong><p>{tab === 'local' && !customAssets.length ? 'Parti karakterlerini veya yeni mekânlarını yukarıdan ekle.' : 'Başka bir isim dene veya filtreleri temizle.'}</p>{(query || region !== 'all' || group !== 'all') && <button type="button" onClick={resetFilters}>Filtreleri temizle</button>}</div>}
      {matches.length > limit && <button type="button" className="broadcast-library-more" onClick={() => setLimit(value => value + 24)}>Daha fazla göster <span>{Math.min(limit, matches.length)} / {matches.length}</span></button>}
    </div>
    <footer className="broadcast-library-note">{tab === 'scene' ? `${places.length} yerleşim · mekânlar · dünya sahneleri` : tab === 'portrait' ? 'Mevcut karakterler ve kimliği açıklanmamış arşiv portreleri.' : 'Eklediğin görseller bu tarayıcıda saklanır.'}</footer>
  </section>
}
