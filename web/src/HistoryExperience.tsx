import { useState } from 'react'
import { ArrowRight, Flame, Snowflake } from 'lucide-react'
import { fractureLayers } from './lore/history'

export default function HistoryExperience({ jump }: { jump: (index: number) => void }) {
  const [voice, setVoice] = useState<'honud' | 'danstsud'>('honud')
  return <section className="fracture-experience" aria-label="Büyük Kırılma’nın katmanları">
    <div className="fracture-timeline"><span>Ejderha İmparatorluğu</span><i /><span>Sessiz Binyıl</span><i /><strong>Büyük Kırılma</strong><i /><span>Göçler ve yeni halklar</span></div>
    <div className="section-heading"><div><span className="eyebrow">BİR FELAKETİN BEŞ YÜZÜ</span><h2>Dünya bir gecede bitmedi.</h2></div><p>Bir katman seç; hikâyenin içine gir.</p></div>
    <div className="fracture-layers">{fractureLayers.map((layer, i) => <button key={layer.title} onClick={() => jump(layer.section)}><span className={`fracture-symbol layer-${i}`}>{layer.symbol}</span><small>0{i + 1}</small><h3>{layer.title}</h3><p>{layer.detail}</p><ArrowRight size={15} /></button>)}</div>
    <div className={`fracture-voices voice-${voice}`}><div className="voice-tabs" role="tablist" aria-label="Halkların anlatıları"><button role="tab" id="voice-honud" aria-controls="fracture-voice" aria-selected={voice === 'honud'} onClick={() => setVoice('honud')}><Snowflake size={16} />Honud’un sesi</button><button role="tab" id="voice-danstsud" aria-controls="fracture-voice" aria-selected={voice === 'danstsud'} onClick={() => setVoice('danstsud')}><Flame size={16} />Danstsud’un sesi</button></div>
      <div id="fracture-voice" role="tabpanel" aria-labelledby={`voice-${voice}`}><span className="eyebrow">{voice === 'honud' ? 'KAN YARILDIĞINDA' : 'IŞIĞIN SAVAŞI'}</span><blockquote>{voice === 'honud' ? '“Bizi buz değil, iki büyük çocuğun kavgası öldürdü.”' : '“Bakır Ana, bizi Ateşin Çocuğu’ndan koru.”'}</blockquote><p>{voice === 'honud' ? 'Honud ağıtları, halkın üzerine çöken iki kudreti de sorgular. Hatırlanan kahraman, göğü parçalayan hükümdardan çok karda yeniden ev kuran insandır.' : 'Danstsud anlatısı, ateşin karşısındaki koruyucu çemberi ve Bakır Ana’nın fedakârlığını öne çıkarır. Eski felaket, evleri korumak için edilen gündelik bir duaya dönüşür.'}</p><button onClick={() => jump(voice === 'honud' ? 11 : 13)}>Bu anlatıyı oku <ArrowRight size={15} /></button></div>
    </div>
  </section>
}
