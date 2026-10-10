import { useMemo, useState } from 'react'
import { ArrowUpRight, Camera, Image as ImageIcon, Search, SlidersHorizontal, X } from 'lucide-react'
import { artworks, portraitFor, type Artwork } from './media'
import { characters } from './lore/characters'
import { articleById, placeById, regionById } from './data'
import { ArtworkButton, ImageViewer } from './MediaGallery'
import './gallery.css'

type Filter = 'all' | 'portrait' | 'landscape' | 'fauna' | 'map'
const filters: { id: Filter; label: string }[] = [{ id: 'all', label: 'Tümü' }, { id: 'portrait', label: 'Karakterler' }, { id: 'landscape', label: 'Şehirler & sahneler' }, { id: 'fauna', label: 'Canlılar' }, { id: 'map', label: 'Çizim haritaları' }]
const animalIds = new Set(['tac-kecisi', 'kar-kartali', 'cig-kuzgunu', 'orvak', 'varkul', 'kharven', 'ulveth', 'gumusalasi', 'tervan', 'norruk', 'velkir'])
const normalize = (text: string) => text.toLocaleLowerCase('tr').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/ı/g, 'i')
const category = (art: Artwork): Filter => art.portrait ? 'portrait' : art.category === 'fauna' || animalIds.has(art.id.replace(/-painted$/, '')) ? 'fauna' : art.id.includes('-map') || art.origin === 'map' ? 'map' : 'landscape'
function relatedTarget(art: Artwork) {
  const character = characters.find(person => person.portrait === art.id || portraitFor(person.portrait)?.id === art.id)
  if (character) return { id: character.id, label: 'Karakteri tanı' }
  const id = art.relatedId || art.id.replace(/-painted$/, '').replace(/^region-/, '')
  return placeById(id) || articleById(id) || regionById(id) ? { id, label: 'Wiki sayfasını aç' } : undefined
}

export default function GalleryHub({ navigate }: { navigate: (path: string) => void }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [originalOnly, setOriginalOnly] = useState(false)
  const [limit, setLimit] = useState(36)
  const [index, setIndex] = useState<number | null>(null)
  const all = useMemo(() => Object.values(artworks).sort((a, b) => Number(!!b.painted) - Number(!!a.painted) || a.title.localeCompare(b.title, 'tr')), [])
  const items = useMemo(() => all.filter(art => (filter === 'all' || category(art) === filter) && (!originalOnly || art.origin === 'author' || art.origin === 'map') && (!query || normalize(`${art.title} ${art.caption}`).includes(normalize(query)))), [all, filter, originalOnly, query])
  const choose = (next: Filter) => { setFilter(next); setLimit(36); setIndex(null) }
  return <main className="gallery-hub" data-testid="gallery-hub">
    <header className="gallery-intro"><span className="eyebrow"><Camera size={15} /> ARUZAHR GÖRSEL ARŞİVİ</span><h1>Bir dünyanın yüzleri.</h1><p>Portreler, kentler ve henüz karşılaşmadığın canlılar. Bir çizimi aç; ayrıntılarda biraz oyalan.</p><div className="gallery-tally"><strong>{all.length}</strong><span>görsel · tek arşiv</span></div></header>
    <div className="gallery-tools"><div className="gallery-tabs" role="group" aria-label="Galeri kategorileri">{filters.map(item => <button key={item.id} aria-pressed={filter === item.id} onClick={() => choose(item.id)}>{item.label}<span>{all.filter(a => item.id === 'all' || category(a) === item.id).length}</span></button>)}</div>
      <div className="gallery-search-row"><label className="gallery-search"><Search size={17} /><input aria-label="Görsellerde ara" value={query} placeholder="Bir yüz, şehir veya canlı ara…" onChange={e => { setQuery(e.target.value); setLimit(36) }} />{query && <button aria-label="Galeri aramasını temizle" onClick={() => setQuery('')}><X size={15} /></button>}</label><button className="gallery-source" aria-pressed={originalOnly} onClick={() => { setOriginalOnly(!originalOnly); setLimit(36) }}><SlidersHorizontal size={15} /> Yazarın çizimleri</button></div>
    </div>
    <div className="gallery-results-line" role="status"><span>{items.length} görsel{query ? ` · “${query}”` : ''}</span><span>Bir görsele basarak büyüt</span></div>
    {items.length ? <div className="gallery-collection">{items.slice(0, limit).map((art, i) => { const target = relatedTarget(art); return <article key={art.id} className={`gallery-tile gallery-tile-${category(art)}`}><ArtworkButton item={art} onClick={() => setIndex(i)} /><div className="gallery-tile-footer"><span>{art.painted ? 'Boya dokulu illüstrasyon' : art.origin === 'author' ? 'Yazarın arşivi' : art.origin === 'map' ? 'Özgün haritadan' : art.origin === 'adapted' ? 'Portre uyarlaması' : 'Evren illüstrasyonu'}</span>{target && <button onClick={() => navigate(`/wiki/${target.id}`)} aria-label={`${art.title}: ${target.label}`}><ArrowUpRight size={15} /></button>}</div></article> })}</div> : <div className="gallery-empty"><ImageIcon size={36} /><h2>Bu aramada bir çizim yok.</h2><button onClick={() => { setQuery(''); setOriginalOnly(false); choose('all') }}>Arşivin tamamına dön</button></div>}
    {items.length > limit && <button className="gallery-load-more" onClick={() => setLimit(limit + 36)}>Sonraki {Math.min(36, items.length - limit)} görseli göster <span>{Math.min(limit, items.length)} / {items.length}</span></button>}
    <ImageViewer items={items} index={index} setIndex={setIndex} />
  </main>
}
