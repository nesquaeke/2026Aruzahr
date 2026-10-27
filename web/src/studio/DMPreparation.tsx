import { Eye, Image as ImageIcon, Pause, Dices } from 'lucide-react'
import BroadcastStage from '../BroadcastStage'
import type { BroadcastState } from '../broadcast-state'
import './dm-preparation.css'

export default function DMPreparation({draft,program,busy,onTake,onEdit,onBreak,onRoll}:{draft:BroadcastState;program:BroadcastState;busy:boolean;onTake:()=>void;onEdit:()=>void;onBreak:()=>void;onRoll:()=>void}) {
 return <section className="dm-preparation" aria-label="Görevin yayın hazırlığı">
  <span className="studio-eyebrow">BİR · HAZIRLA</span>
  <h2>{draft.title || 'Seçtiğin sahne burada görünür'}</h2>
  <div className="dm-preparation-preview" data-testid="dm-preparation-preview"><BroadcastStage state={draft} readOnly /></div>
  <p>Bu resim ve portreler <strong>hazırlıkta</strong>. Oyuncuların ekranına ancak göster komutuyla geçer.</p>
  <button className="dm-preparation-take" disabled={busy} onClick={onTake}><Eye size={15}/>{busy?'Gönderiliyor…':'Bu hazırlığı yayına al'}</button>
  <button onClick={onEdit}><ImageIcon size={14}/>Portreleri ve yerleşimi düzenle</button>
  <div className="dm-preparation-live">
   <span className="studio-eyebrow live">İKİ · ŞU ANDA YAYINDA</span>
   <h3 data-testid="studio-program-title">{program.title}</h3>
   <div className="dm-program-preview"><BroadcastStage state={program} readOnly /></div>
   <small>{program.intermission?'Ara ekranı açık':program.mode==='map'?'Oyuncular haritayı görüyor':'Oyuncular bu manzarayı görüyor'}</small>
  </div>
  <div className="st-two"><button onClick={onBreak}><Pause size={14}/>{program.intermission?'Moladan dön':'Ara ver'}</button><button onClick={onRoll}><Dices size={14}/>d20 at</button></div>
  <details><summary>İlk kez kullanıyorsan</summary><ol><li>Görev menüsünden bölümü ve adımı seç. Nerede, ne zaman ve amaç bilgisi metnin başındadır.</li><li>Sahneyi hazırla ile resmi burada kontrol et.</li><li>Oyunculara göster ile yayına geçir; sonra hikâyede ilerle.</li><li>Kişi / yer bul menüsünde isim veya şehir ara. Kart, kişinin kim olduğunu ve hangi olayda kullanılacağını gösterir.</li><li>Görev içindeki Karşılaşmalar · yol, pusu ve gece bölümünden kamp kartı veya pusu seç. Savaş masasında aç ile can ve sıra takibine geç.</li></ol><p>Sadece okumak, adım değiştirmek veya karar notu almak yayını değiştirmez.</p></details>
 </section>
}
