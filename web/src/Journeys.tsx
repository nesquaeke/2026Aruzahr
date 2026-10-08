import { ArrowLeft, ArrowRight, Compass, X } from 'lucide-react'
import { locationById } from './data'
import { artFor } from './presentation'

export const journeys = [
  { id: 'crown', title: 'Taçtan kırağıya', label: 'TAÇ VE TOPRAK', cover: 'valdareth', tone: 'gold', description: 'Mor çatılardan dağın kapısına. Aynı krallığın birbirine benzemeyen hayatları.', stops: [
    { id: 'valdareth', title: 'Bir şehir, bin hayat', hint: 'Beş sur, üç nehir ve sınırlarının dışına taşan bir başkent.' },
    { id: 'dorvenhall', title: 'Morun kaynağı', hint: 'Sarayların rengi, önce bir ocağın karanlığından çıkar.' },
    { id: 'marhalden', title: 'Dağın kapısı', hint: 'Kralın yolunun bittiği yerde başka bir hayat başlar.' },
    { id: 'frostbay', title: 'Kıştan önceki taşlar', hint: 'Bryndon’un merak ettiği eski değirmenler, bugünün soğuğuna sığmaz.' },
  ] },
  { id: 'guild', title: 'Kalkanın ardındaki hayat', label: 'İNSANLAR VE YEMİNLER', cover: 'lirendil', tone: 'violet', description: 'Bir lonca sofrasından hanedanların gölgesine. Şehirleri ayakta tutan insanlarla tanış.', stops: [
    { id: 'lirendil', title: 'Aynı sofrada', hint: 'Çelik Kalkan bir arma kadar, ortak bir gündelik hayattır.' },
    { id: 'myrran', title: 'Kervanın ilk durağı', hint: 'Yolcular gider; açtıkları ticaret şehirde kalır.' },
    { id: 'luthen', title: 'Yolun nöbeti', hint: 'Bir kervanın güvenliği, yola çıkmadan önce başlar.' },
    { id: 'kethra', title: 'Sis ve hanedan', hint: 'Limanın kıyısında, Damian’ın şehrini keşfet.' },
    { id: 'elorwyn', title: 'Eski surların gölgesi', hint: 'Gelenek, hanedan ve büyüye çizilen dar sınırlar.' },
  ] },
  { id: 'coast', title: 'Buzun tuttuğu hatıralar', label: 'ESKİ KIYILAR', cover: 'frostbay', tone: 'ice', description: 'Taşın, sıcak suyun ve buzun çevresinde kurulmuş dört ayrı yaşama bak.', stops: [
    { id: 'frostbay', title: 'Taşın hafızası', hint: 'Bilinmeyen bir çağın binaları, bugünün postalarını ve gümrük defterlerini saklar.' },
    { id: 'dranthol', title: 'Külün üstündeki ocak', hint: 'Yeni kale güvenlik getirdi. Ticaretin dönüşü daha yavaş oldu.' },
    { id: 'ternhaven', title: 'Sıcak suyun çevresinde', hint: 'Hardlane’in eski halkı, sıcak kaynakların çevresinde hayatını sürdürür.' },
    { id: 'kaldmere', title: 'Son umut', hint: 'Haritada bir yer; oraya sığınanlar için yeniden kurulacak bir ev.' },
  ] },
] as const
export type JourneyId = typeof journeys[number]['id']
export const journeyById = (id: JourneyId) => journeys.find(journey => journey.id === id)!

export function JourneyCollection({ onStart }: { onStart: (id: JourneyId) => void }) {
  return <section className="journey-collection" aria-labelledby="journeys-title">
    <div className="section-heading"><span className="eyebrow">NEREDEN BAŞLAYACAĞINI BİLMİYORSAN</span><h2 id="journeys-title">Bir hikâyenin peşine düş.</h2><p>Okuma ve keşif seçkileri · Haritadaki ticaret yollarından bağımsız.</p></div>
    <div className="journey-grid">{journeys.map((journey, i) => <button key={journey.id} className={`journey-card tone-${journey.tone}`} onClick={() => onStart(journey.id)} aria-label={`${journey.title} yolculuğuna başla`}>
      <img src={artFor(journey.cover)} alt="" loading="lazy" /><span className="journey-number">0{i + 1}</span><span className="journey-copy"><small>{journey.label}</small><strong>{journey.title}</strong><span>{journey.description}</span><em>{journey.stops.length} durak <span>Keşfe başla <ArrowRight size={16} /></span></em></span>
    </button>)}</div>
  </section>
}

export function JourneyNavigator({ id, selected, onSelect, onClose }: { id: JourneyId; selected: string | null; onSelect: (id: string) => void; onClose: () => void }) {
  const journey = journeyById(id)
  const index = journey.stops.findIndex(stop => stop.id === selected)
  const current = index >= 0 ? journey.stops[index] : null
  return <section className="journey-navigator" aria-label="Keşif yolculuğu">
    <div className="journey-nav-title"><Compass size={21} /><div><small>KEŞİF SEÇKİN</small><strong>{journey.title}</strong></div><button onClick={onClose} aria-label="Keşif yolculuğunu kapat"><X size={18} /></button></div>
    <ol className="journey-stops">{journey.stops.map((stop, i) => <li key={stop.id}><button onClick={() => onSelect(stop.id)} aria-current={stop.id === selected ? 'step' : undefined}><span>{i + 1}</span>{locationById(stop.id)?.name}</button></li>)}</ol>
    <div className="journey-nav-bottom"><p><strong>{current?.title || 'Keşfi sürdür'}</strong>{current?.hint || 'Bu seçkideki bir durağa dokun; şehir kartından hikâyesine geç.'}</p><div><button disabled={index <= 0} onClick={() => onSelect(journey.stops[index - 1].id)} aria-label="Önceki keşif durağı"><ArrowLeft size={17} /></button><span>{index >= 0 ? `${index + 1} / ${journey.stops.length}` : `${journey.stops.length} durak`}</span><button disabled={index === journey.stops.length - 1} onClick={() => onSelect(journey.stops[index + 1].id)} aria-label="Sonraki keşif durağı"><ArrowRight size={17} /></button></div></div>
  </section>
}
