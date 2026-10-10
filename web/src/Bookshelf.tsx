import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Anvil, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Bookmark, Flame, Landmark, Library, MapPin, Mountain, Search, ScrollText, Sprout, UserRound, Waves } from 'lucide-react'
import { bookConditionLabels, worldBooks } from './lore/books'
import type { BookCondition, WorldBook } from './lore/books'
import { normalize, placeById, regionById } from './data'
import './books.css'
import './book-reader.css'

const motifs = { window: Landmark, sun: Flame, wall: Landmark, seal: ScrollText, anvil: Anvil, sea: Waves, stone: Mountain, grain: Sprout }
const filters: { id: 'all' | BookCondition; title: string }[] = [
  { id: 'all', title: 'Bütün raflar' }, { id: 'eski', title: 'Eski kitaplar' }, { id: 'yasakli', title: 'Yasaklı kitaplar' }, { id: 'kayip', title: 'Kayıp yapraklar' },
]

function BookCover({ book }: { book: WorldBook }) {
  const Motif = motifs[book.motif]
  return <span className={`world-book-cover condition-${book.condition}`} style={{ '--book-color': book.color } as CSSProperties} aria-hidden="true">
    <span className="book-cover-corner corner-tl" /><span className="book-cover-corner corner-tr" /><span className="book-cover-corner corner-bl" /><span className="book-cover-corner corner-br" />
    <span className="book-cover-volume">VALHUNAR · KÜÇÜK NÜSHALAR</span>
    <Motif className="book-cover-motif" size={46} strokeWidth={.9} />
    <strong>{book.title}</strong><span className="book-cover-author">{book.author}</span>
    {book.condition === 'yasakli' && <span className="book-cover-seal">MÜHÜRLÜ</span>}
    {book.condition === 'kayip' && <span className="book-cover-wear" />}
  </span>
}

const categoryLabels = { arastirma: 'Araştırma', yolculuk: 'Yolculuk', 'tanıklık': 'Tanıklık' }
type Category = keyof typeof categoryLabels
function readMarks(): Record<string, number> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('aruzahr-book-marks') || '{}')
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    return Object.fromEntries(Object.entries(value).filter(([id,leaf]) => worldBooks.some(book => book.id === id) && typeof leaf === 'number' && Number.isInteger(leaf) && leaf >= 0))
  } catch { return {} }
}
function readFont() { try { const value=Number(localStorage.getItem('aruzahr-book-font')); return [19,21,23,25,27].includes(value) ? value : 23 } catch { return 23 } }

export default function Bookshelf({ navigate, route = '/books' }: { navigate: (route: string) => void; route?: string }) {
  const [filter, setFilter] = useState<'all' | BookCondition>('all')
  const [category, setCategory] = useState<'all' | Category>('all')
  const [query, setQuery] = useState('')
  const [marks, setMarks] = useState(readMarks)
  const [font, setFont] = useState(readFont)
  const desk = useRef<HTMLElement>(null)
  const paper = useRef<HTMLDivElement>(null)
  const rawRequestedId = route.split('?')[0].split('/')[2] || ''
  let requestedId=rawRequestedId
  try {requestedId=decodeURIComponent(rawRequestedId)} catch { /* Preserve the invalid identifier so the missing-volume notice appears. */ }
  const selected = worldBooks.find(book => book.id === requestedId) || worldBooks[0]
  const rawLeaf=Number(new URLSearchParams(route.split('?')[1] || '').get('leaf') || '1')
  const leaf=Number.isInteger(rawLeaf) ? Math.max(0,Math.min(selected.excerpt.length-1,rawLeaf-1)) : 0
  const needle=normalize(query.trim())
  const books=worldBooks.filter(book => (filter === 'all' || book.condition === filter) && (category === 'all' || book.category === category) && (!needle || normalize([book.title,book.author,book.place,book.note,...book.excerpt].join(' ')).includes(needle)))
  const savedLeaf=marks[selected.id]
  const words=selected.excerpt.join(' ').trim().split(/\s+/).length
  const hasBook=Boolean(requestedId)
  const previousPage = useRef({ id: selected.id, leaf })
  useEffect(() => {try {localStorage.setItem('aruzahr-book-marks',JSON.stringify(marks))} catch { /* Optional browser storage. */ }},[marks])
  useEffect(() => {try {localStorage.setItem('aruzahr-book-font',String(font))} catch { /* Optional browser storage. */ }},[font])
  useEffect(() => {
    if (!hasBook) return
    const handle=requestAnimationFrame(() => {desk.current?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'start'});desk.current?.focus({preventScroll:true})})
    return () => cancelAnimationFrame(handle)
  },[selected.id,hasBook])
  useEffect(() => {
    const previous = previousPage.current
    previousPage.current = { id: selected.id, leaf }
    if (previous.id !== selected.id || previous.leaf === leaf) return
    const handle = requestAnimationFrame(() => paper.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }))
    return () => cancelAnimationFrame(handle)
  },[selected.id,leaf])
  function turn(index: number) {navigate(`/books/${selected.id}?leaf=${Math.max(0,Math.min(selected.excerpt.length-1,index))+1}`)}
  function markLeaf() {setMarks(previous => {const next={...previous};if(next[selected.id] === leaf) delete next[selected.id];else next[selected.id]=leaf;return next})}
  return <div className="bookshelf-page" data-testid="bookshelf">
    <header className="bookshelf-heading"><div className="bookshelf-heading-mark"><Library size={42} strokeWidth={1} /></div><div><span className="eyebrow">VALHUNAR KİTAPLARI</span><h1>Tozun altında<br /><em>hâlâ bir ses var.</em></h1><p>Eski nüshalar, araştırma defterleri ve yarım kalmış yolculuklar. Bir yaprağı aç; bir izden diğerine geç.</p></div><span className="bookshelf-count"><strong>{worldBooks.length.toString().padStart(2,'0')}</strong><span>kısa nüsha</span></span></header>
    <label className="book-search"><Search size={18} /><input type="search" aria-label="Kitaplarda ara" placeholder="Kitap, yazar, yer veya bir satır…" value={query} onChange={event => setQuery(event.target.value)} /></label>
    <div className="book-filter-bar" role="group" aria-label="Kitaplık rafları">{filters.map(item => <button key={item.id} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.title}<span>{worldBooks.filter(book => item.id === 'all' || book.condition === item.id).length}</span></button>)}</div>
    <div className="book-topic-filters" role="group" aria-label="Kitap türleri"><button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>Bütün türler</button>{Object.entries(categoryLabels).map(([id,label]) => <button key={id} aria-pressed={category === id} onClick={() => setCategory(id as Category)}>{label}</button>)}</div>
    <p className="book-results" role="status">{books.length} nüsha bulundu</p>
    <div className="world-book-grid" aria-label="Kitap koleksiyonu">{books.map(book => <button className={`world-book ${book.id === selected.id ? 'selected' : ''}`} key={book.id} onClick={() => navigate(`/books/${book.id}`)} aria-label={`${book.title} kitabını aç`} aria-pressed={book.id === selected.id}><BookCover book={book} /><span className="book-shelf-caption"><span>{bookConditionLabels[book.condition]} · {categoryLabels[book.category || 'tanıklık']}</span><strong>{book.title}</strong><small>{book.place}</small><span className="book-caption-note">{book.note}</span><span className="book-open-label">Nüshayı aç <ArrowRight size={15} /></span></span></button>)}</div>
    {!books.length && <div className="book-search-empty"><p>Bu rafta aradığın nüsha bulunamadı.</p><button onClick={() => {setQuery('');setFilter('all');setCategory('all')}}>Bütün kitaplara dön</button></div>}
    {requestedId && !worldBooks.some(book => book.id === requestedId) && <p className="book-missing" role="alert">Bu nüsha bulunamadı. İlk kitap gösteriliyor.</p>}
    <section className="book-reading-desk" ref={desk} tabIndex={-1} aria-label={`${selected.title} okuma masası`} data-testid="book-reading-desk" data-book-id={selected.id} onKeyDown={event => {
      if ((event.target as HTMLElement).closest('input,select,button,a,textarea')) return
      if (event.key === 'ArrowRight') {event.preventDefault();turn(leaf+1)}
      if (event.key === 'ArrowLeft') {event.preventDefault();turn(leaf-1)}
    }}>
      <aside className="book-desk-note"><span className="eyebrow">ELDEKİ NÜSHA</span><h2>{selected.title}</h2><p>{selected.note}</p><dl><div><dt>Kalem</dt><dd>{selected.author}</dd></div><div><dt>Dönem</dt><dd>{selected.period}</dd></div><div><dt>Yer</dt><dd>{selected.place}</dd></div><div><dt>Durum</dt><dd>{bookConditionLabels[selected.condition]}</dd></div><div><dt>Okuma</dt><dd>{words} sözcük · {Math.max(2,Math.ceil(words/180))} dakika</dd></div></dl>
        <div className="book-world-links">{selected.authorId && <button onClick={() => navigate(`/wiki/${selected.authorId}`)}><UserRound size={16} />Yazarı tanı<ArrowRight size={16} /></button>}{selected.placeId && <><button onClick={() => navigate(`/wiki/${selected.placeId}`)}><BookOpen size={16} />{placeById(selected.placeId)?.name || regionById(selected.placeId)?.name} hakkında oku<ArrowRight size={16} /></button><button onClick={() => navigate(`/atlas/${selected.placeId}`)}><MapPin size={16} />Haritada göster<ArrowRight size={16} /></button></>}<button onClick={() => navigate(`/wiki/${selected.id}`)}><BookOpen size={16} />Bütün kaydı oku<ArrowRight size={16} /></button></div>
      </aside>
      <div className="book-reader-column"><div className="book-reader-tools"><label>Bölüm<select aria-label="Kitap bölümü" value={leaf} onChange={event => turn(Number(event.target.value))}>{selected.excerpt.map((_,index) => <option value={index} key={index}>{index+1}. {selected.leafTitles?.[index] || 'Yaprak'}</option>)}</select></label><label>Yazı<select aria-label="Kitap yazısı boyutu" value={font} onChange={event => setFont(Number(event.target.value))}>{[19,21,23,25,27].map(size => <option value={size} key={size}>{size}</option>)}</select></label><button onClick={markLeaf} aria-pressed={savedLeaf === leaf} aria-label={savedLeaf === leaf ? 'Bu yaprağın işaretini kaldır' : 'Bu yaprağı işaretle'}><Bookmark size={17} fill={savedLeaf === leaf ? 'currentColor' : 'none'} /></button>{savedLeaf !== undefined && savedLeaf !== leaf && <button className="resume-book" onClick={() => turn(Math.min(savedLeaf,selected.excerpt.length-1))}>İşaretli yaprağa dön</button>}</div>
      <div className={`book-paper book-paper-${selected.condition}`} ref={paper} key={`${selected.id}-${leaf}`} style={{'--book-font-size':`${font}px`} as CSSProperties}>
        <div className="book-paper-top"><span>{selected.subtitle}</span><span>{String(leaf+1).padStart(2,'0')}</span></div>
        <div className="book-paper-reading"><span className="paper-ornament" aria-hidden="true">✦</span><h3>{selected.leafTitles?.[leaf] || selected.title}</h3>{selected.excerpt[leaf].split('\n\n').map((paragraph,index) => <p key={index}>{paragraph}</p>)}{selected.marginNotes?.[leaf] && <aside className="book-margin-note"><span>KENAR NOTU</span>{selected.marginNotes[leaf]}</aside>}<span className="book-paper-signature">{selected.author}</span></div>
        <footer className="book-leaf-controls"><button onClick={() => turn(leaf-1)} disabled={leaf === 0} aria-label="Önceki kitap yaprağı"><ChevronLeft size={20} /><span>Önceki</span></button><span aria-live="polite">{leaf+1} / {selected.excerpt.length} yaprak</span><button onClick={() => turn(leaf+1)} disabled={leaf === selected.excerpt.length-1} aria-label="Sonraki kitap yaprağı"><span>Sonraki</span><ChevronRight size={20} /></button></footer>
      </div></div>
    </section>
    <p className="bookshelf-colophon">Bryndon ve Büyük Kırılma mevcut genel lore’dan seçkidir. Diğer nüshalar özgün dünya yazımıdır. Bu açık raflarda araştırmanın başlangıcı ve gözlemler bulunur.</p>
  </div>
}
