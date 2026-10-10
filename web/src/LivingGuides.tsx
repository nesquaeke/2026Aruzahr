import { BookOpen, ArrowRight, Utensils, Scale, Sparkles, Sun, Network, Coins, MessageCircle } from 'lucide-react';
import { cityGuides, cityJustice } from './lore/civic-guides';
import { institutionOperations } from './lore/institution-operations';
import { worldBooks } from './lore/books';
import { speciesGuides } from './lore/species-guides';
import './living-guides.css';

export function CityGuide({ id }: { id: string }) {
  const guide = cityGuides[id];
  if (!guide) return null;
  const fields = [
    ['food', 'Sofra & su', Utensils], ['work', 'İş & geçim', Coins], ['order', 'Yetki & itiraz', Scale],
    ['magic', 'Büyünün sınırı', Sparkles], ['season', 'Mevsim', Sun], ['neighbours', 'Bağlı olduğu yerler', Network],
  ] as const;
  return <section className="living-guide" data-testid="city-living-guide"><div className="section-heading"><span className="eyebrow">BİR YERDE YAŞAMAK</span><h2>Bu şehir nasıl işler?</h2><p>Merak ettiğin başlığı aç; sokaktaki hayatı tanı.</p></div><div className="living-guide-grid">{fields.map(([key, label, Icon]) => <details key={key}><summary><Icon size={18} /><span>{label}</span><span className="guide-plus">+</span></summary><p>{guide[key]}</p></details>)}<details><summary><Scale size={18} /><span>Suç & adalet</span><span className="guide-plus">+</span></summary><p>{cityJustice[id]}</p></details></div><aside className="street-question"><MessageCircle size={20} /><div><span>Bugün sokakta konuşulan</span><p>{guide.tension}</p></div></aside></section>;
}

export function InstitutionOperations({ id }: { id: string }) {
  const guide = institutionOperations[id];
  if (!guide) return null;
  return <section className="living-guide institution-operations" data-testid="institution-operations"><div className="section-heading"><span className="eyebrow">GÖRÜNEN YÜZLERİN ARDINDA</span><h2>Yetki, emek ve hesap</h2></div><div className="living-guide-grid">{([['mandate','Görev & sınır'],['chain','Emir & sorumluluk'],['support','Ücret & destek'],['accountability','Denetim & anlaşmazlık']] as const).map(([key,label]) => <details key={key}><summary><Scale size={18} /><span>{label}</span><span className="guide-plus">+</span></summary><p>{guide[key]}</p></details>)}</div></section>;
}

export function RelatedBooks({ id, navigate }: { id: string; navigate: (route: string) => void }) {
  const volumes = worldBooks.filter(book => book.authorId === id || book.placeId === id || book.id === id);
  if (!volumes.length) return null;
  return <section className="related-volumes" data-testid="related-books"><div className="section-heading"><span className="eyebrow">YAZILI HAFIZA</span><h2>Defterler, kayıtlar ve tanıklıklar</h2></div><div className="related-volume-grid">{volumes.map(book => <button key={book.id} onClick={() => navigate(`/books/${book.id}`)}><BookOpen size={24} /><span><strong>{book.title}</strong><small>{book.author} · {book.excerpt.length} yaprak</small></span><ArrowRight size={18} /></button>)}</div></section>;
}

export function SpeciesGuide({ id }: { id: string }) {
  const guide = speciesGuides[id];
  if (!guide) return null;
  return <section className="species-passport" data-testid="species-passport" aria-label="Canlının yaşam özeti">{([['habitat','Yaşam alanı'],['behaviour','Davranış'],['human','İnsanla ilişkisi']] as const).map(([key,label]) => <div key={key}><span>{label}</span><p>{guide[key]}</p></div>)}</section>;
}
