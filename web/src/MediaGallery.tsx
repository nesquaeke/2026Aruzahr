import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Expand, Images, X } from 'lucide-react'
import type { Artwork } from './media'
import { characters } from './lore/characters'
import CharacterCard from './CharacterCard'

export function ImageViewer({ items, index, setIndex }: { items: Artwork[]; index: number | null; setIndex: (index: number | null) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const item = index === null ? undefined : items[index]
  const character = item?.portrait ? characters.find(person => person.portrait === item.id) : undefined
  useEffect(() => {
    if (item && !dialog.current?.open) dialog.current?.showModal()
    if (!item && dialog.current?.open) dialog.current.close()
  }, [item])
  const move = (amount: number) => { if (index !== null) setIndex((index + amount + items.length) % items.length) }
  return <dialog ref={dialog} className="art-viewer" aria-label="Görsel galerisi" onCancel={() => setIndex(null)} onClose={() => setIndex(null)} onKeyDown={e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); move(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1) }
  }} onClick={e => { if (e.target === dialog.current) setIndex(null) }}>
    {item && <><header><span>{index! + 1} / {items.length}</span><button className="icon-button" aria-label="Görseli kapat" autoFocus onClick={() => setIndex(null)}><X size={22} /></button></header>
      <div className="art-viewer-stage">{items.length > 1 && <button className="gallery-prev" aria-label="Önceki görsel" onClick={() => move(-1)}><ArrowLeft /></button>}
        {item.portrait ? <div className="viewer-character"><CharacterCard id={character?.id} src={item.src} name={item.title} role={character?.role} eager /></div> : <img src={item.src} alt={item.title} />}
        {items.length > 1 && <button className="gallery-next" aria-label="Sonraki görsel" onClick={() => move(1)}><ArrowRight /></button>}</div>
      <footer><h2>{item.title}</h2><p>{item.caption}</p><small>{item.origin === 'adapted' ? 'Yazarın özgün portresinden uyarlama' : item.origin === 'author' ? 'Yazarın özgün görseli' : item.origin === 'map' ? 'Özgün haritadan' : 'Evren için üretilen temsili çizim'}</small></footer></>}
  </dialog>
}

export function ArtworkButton({ item, onClick, className = '' }: { item: Artwork; onClick: () => void; className?: string }) {
  const character = item.portrait ? characters.find(person => person.portrait === item.id) : undefined
  return <button className={`artwork-button ${className} ${item.portrait ? 'framed-artwork' : ''}`} onClick={onClick} aria-label={`${item.title} görselini büyüt`}>{item.portrait ? <CharacterCard id={character?.id} src={item.src} name={item.title} role={character?.role} /> : <img src={item.src} alt={item.title} loading="lazy" />}<span className="artwork-expand"><Expand size={16} /></span><span className="artwork-caption"><strong>{item.title}</strong><small>{item.caption}</small></span></button>
}

export default function MediaGallery({ items, open }: { items: Artwork[]; open: (index: number) => void }) {
  const [expanded, setExpanded] = useState(false)
  if (!items.length) return null
  return <section className="article-gallery" data-testid="article-gallery"><div className="section-heading"><div><span className="eyebrow">GÖZÜNDE CANLANDIR</span><h2>Buraya bir de böyle bak.</h2></div><span><Images size={16} /> {items.length} görsel</span></div>
    <div className={`article-gallery-grid ${items[0].portrait ? 'has-portraits' : ''}`}>{items.slice(0, expanded ? undefined : 4).map((item, i) => <ArtworkButton key={item.id} item={item} onClick={() => open(i)} />)}</div>
    {items.length > 4 && <button className="gallery-more" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Galeriyi daralt' : `Tüm ${items.length} görseli göster`}<ArrowRight size={15} /></button>}
  </section>
}
