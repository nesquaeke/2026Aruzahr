import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Anvil, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Flame, Landmark, Library, Mountain, ScrollText, Sprout, Waves } from 'lucide-react'
import { bookConditionLabels, worldBooks } from './lore/books'
import type { BookCondition, WorldBook } from './lore/books'
import './books.css'

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

export default function Bookshelf({ navigate }: { navigate: (route: string) => void }) {
  const [filter, setFilter] = useState<'all' | BookCondition>('all')
  const [selectedId, setSelectedId] = useState(worldBooks[0].id)
  const [leaf, setLeaf] = useState(0)
  const desk = useRef<HTMLElement>(null)
  const books = worldBooks.filter(book => filter === 'all' || book.condition === filter)
  const selected = worldBooks.find(book => book.id === selectedId) || worldBooks[0]
  const paragraph = selected.excerpt[leaf]
  function openBook(book: WorldBook) {
    setSelectedId(book.id)
    setLeaf(0)
    requestAnimationFrame(() => {
      desk.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
      desk.current?.focus({ preventScroll: true })
    })
  }
  function selectFilter(next: 'all' | BookCondition) {
    setFilter(next)
    const first = worldBooks.find(book => next === 'all' || book.condition === next)
    if (first && next !== 'all') { setSelectedId(first.id); setLeaf(0) }
  }
  return <div className="bookshelf-page" data-testid="bookshelf">
    <header className="bookshelf-heading">
      <div className="bookshelf-heading-mark"><Library size={42} strokeWidth={1} /></div>
      <div><span className="eyebrow">VALHUNAR KİTAPLIĞI</span><h1>Tozun altında<br /><em>hâlâ bir ses var.</em></h1><p>Eski kitaplar, dolaşımı engellenmiş risaleler ve eksik kalmış yapraklar. Bir nüsha seç; kalan satırları oku.</p></div>
      <span className="bookshelf-count"><strong>{worldBooks.length.toString().padStart(2, '0')}</strong><span>kısa nüsha</span></span>
    </header>
    <div className="book-filter-bar" aria-label="Kitaplık rafları">{filters.map(item => <button key={item.id} aria-pressed={filter === item.id} onClick={() => selectFilter(item.id)}>{item.title}<span>{worldBooks.filter(book => item.id === 'all' || book.condition === item.id).length}</span></button>)}</div>
    <div className="world-book-grid" aria-label="Kitap koleksiyonu">
      {books.map(book => <button className={`world-book ${book.id === selectedId ? 'selected' : ''}`} key={book.id} onClick={() => openBook(book)} aria-label={`${book.title} kitabını aç`} aria-pressed={book.id === selectedId}>
        <BookCover book={book} /><span className="book-shelf-caption"><span>{bookConditionLabels[book.condition]}</span><strong>{book.title}</strong><small>{book.place}</small><span className="book-open-label">Nüshayı aç <ArrowRight size={15} /></span></span>
      </button>)}
    </div>
    <section className="book-reading-desk" ref={desk} tabIndex={-1} aria-label={`${selected.title} okuma masası`} data-testid="book-reading-desk">
      <aside className="book-desk-note"><span className="eyebrow">ELDEKİ NÜSHA</span><h2>{selected.title}</h2><p>{selected.note}</p><dl><div><dt>Kalem</dt><dd>{selected.author}</dd></div><div><dt>Yer</dt><dd>{selected.place}</dd></div><div><dt>Durum</dt><dd>{bookConditionLabels[selected.condition]}</dd></div></dl><button onClick={() => navigate(`/wiki/${selected.id}`)}><BookOpen size={16} />Bütün kaydı oku<ArrowRight size={16} /></button></aside>
      <div className={`book-paper book-paper-${selected.condition}`} key={`${selected.id}-${leaf}`}>
        <div className="book-paper-top"><span>{selected.subtitle}</span><span>{String(leaf + 1).padStart(2, '0')}</span></div>
        <div className="book-paper-reading"><span className="paper-ornament" aria-hidden="true">✦</span><h3>{selected.title}</h3><p>{paragraph}</p><span className="book-paper-signature">{selected.author}</span></div>
        <footer className="book-leaf-controls"><button onClick={() => setLeaf(Math.max(0, leaf - 1))} disabled={leaf === 0} aria-label="Önceki kitap yaprağı"><ChevronLeft size={20} /><span>Önceki</span></button><span aria-live="polite">{leaf + 1} / {selected.excerpt.length} yaprak</span><button onClick={() => setLeaf(Math.min(selected.excerpt.length - 1, leaf + 1))} disabled={leaf === selected.excerpt.length - 1} aria-label="Sonraki kitap yaprağı"><span>Sonraki</span><ChevronRight size={20} /></button></footer>
      </div>
    </section>
    <p className="bookshelf-colophon">Bryndon ve Büyük Kırılma mevcut genel lore’dan derlenir. Diğer nüshalar evren için özgün yazımdır.</p>
  </div>
}
