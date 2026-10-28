import { useState } from 'react'
import { ArrowRight, Backpack, BookOpen, Check, CheckCircle2, ChevronDown, ClipboardCheck, Shield, Sparkles, UserRound } from 'lucide-react'
import { abilityIds, type ClassId, type PlayerCharacter, type PlayerSpell } from './types'
import { abilityLabels, alwaysPreparedSpellIds, backgrounds, canSelectSpell, classById, derivedStats, races, spellChoiceCounts, spellLimits, subclasses } from './rules'
import './character-creation-guide.css'

export type CreationGuideTab='identity'|'abilities'|'adventure'|'spells'|'equipment'|'story'|'sheet'
export type CreationStep={id:string;title:string;tab:CreationGuideTab;ready:boolean;optional:boolean;detail:string;gaps:string[];action:string}
export const creationGuideStorageKey='aruzahr-player-creation-guide-v1'
export const classCreationHints:Record<ClassId,{role:string;priorities:string;firstChoice:string}>={
  barbarian:{role:'Ön safta darbeyi karşılar; öfke ve yakın dövüşle öne çıkar.',priorities:'Kuvvet ve Dayanıklılık; ardından Çeviklik.',firstChoice:'Nasıl dövüştüğünü düşün: ağır bir yakın dövüş silahı mı, tek elli silah ve kalkan mı? Öfke kullanımlarını Macerada bölümünde takip et.'},
  bard:{role:'Söz, müzik, beceriler ve büyüyle arkadaşlarını destekler.',priorities:'Karizma; ardından Çeviklik ve Dayanıklılık.',firstChoice:'Hangi üç beceride eğitildiğini seç. Ozan bildiği büyüleri doğrudan kullanır; günlük hazırlık listesi oluşturmaz.'},
  cleric:{role:'İnancına göre şifa, koruma ve savaş büyülerini birleştirir.',priorities:'Bilgelik ve Dayanıklılık; zırhına göre Kuvvet veya Çeviklik.',firstChoice:'1. seviyede inanç alanını seç. Yaşam Alanının büyüleri her zaman hazırdır; normal günlük hazırlık sayısına eklenmez.'},
  druid:{role:'Doğa büyüleri ve dönüşüm yetenekleriyle çevreyi kullanır.',priorities:'Bilgelik ve Dayanıklılık; ardından Çeviklik.',firstChoice:'Basit büyülerini ve günlük hazırladıklarını seç. Yabanî Biçim 2. seviyede gelir; biçim ve kullanım ayrıntılarını ayrıca kaydet.'},
  fighter:{role:'Silah ve zırh eğitimiyle güvenilir bir savaşçı olur.',priorities:'Yakın dövüş için Kuvvet veya uzak dövüş için Çeviklik; ardından Dayanıklılık.',firstChoice:'Dövüş biçimini ve silahını belirle. Büyülü Şövalye yolu seçilirse büyüler 3. seviyede açılır; sıradan Savaşçıya otomatik büyü verilmez.'},
  monk:{role:'Çeviklik, silahsız dövüş ve disiplinle hareket eder.',priorities:'Çeviklik ve Bilgelik; ardından Dayanıklılık.',firstChoice:'Zırhsız Savunma için zırh ve kalkan kullanma. Ki 2. seviyede başlar; silahsız saldırını ve kullanım sayacını ayrıca kaydet.'},
  paladin:{role:'Yemin, koruma ve yakın dövüşü bir arada taşır.',priorities:'Kuvvet ve Karizma; ardından Dayanıklılık.',firstChoice:'Silah ve zırhını seç. Büyüler 2. seviyede, yemin yolu 3. seviyede açılır; 1. seviyede büyü seçmen gerekmez.'},
  ranger:{role:'İz sürer, arazide yol bulur ve silahla savaşır.',priorities:'Çeviklik ve Bilgelik; ardından Dayanıklılık.',firstChoice:'Yakın veya uzak dövüş silahını belirle. 2014 Kolcusu 2. seviyeden itibaren sınırlı sayıda büyü bilir; günlük hazırlık yapmaz.'},
  rogue:{role:'Keşif, gizlilik, uzmanlık ve fırsat kollayan saldırılarda öne çıkar.',priorities:'Çeviklik; ardından oyun tarzına göre Zekâ, Karizma veya Bilgelik.',firstChoice:'Dört sınıf becerisini ve uzmanlıklarını seç. Gizli Saldırı koşullarını masada kontrol et. Büyülü Düzenbaz yolu seçilirse büyüler 3. seviyede başlar.'},
  sorcerer:{role:'Doğuştan gelen sınırlı büyü repertuvarını güçlü biçimde kullanır.',priorities:'Karizma ve Dayanıklılık; ardından Çeviklik.',firstChoice:'Bildiğin büyüleri dikkatle seç; günlük hazırlık yapmazsın. Büyü Puanları 2. seviyede açılır ve normal büyü yuvalarından ayrı takip edilir.'},
  warlock:{role:'Bir varlıkla yaptığı antın büyülerini ve özel yeteneklerini kullanır.',priorities:'Karizma; ardından Dayanıklılık ve Çeviklik.',firstChoice:'Koruyucunu ve bildiğin büyüleri seç. Ant yuvalarının hepsi aynı derecededir ve kısa dinlenmede yenilenir; koruyucu listesi öğrenme seçeneği verir.'},
  wizard:{role:'Büyü kitabını genişletir; her gün uygun büyüleri hazırlayarak çözüm bulur.',priorities:'Zekâ; ardından Dayanıklılık ve Çeviklik.',firstChoice:'Büyü kitabı, hazırlanan büyüler ve büyü yuvaları ayrı şeylerdir. 1. seviyede kitapta altı büyü vardır; her Büyücü seviyesi iki yeni kitap büyüsü getirir.'},
}

/** A preparation checklist, not a claim that every optional book rule is automated. */
export function getCharacterReadiness(character:PlayerCharacter,spells:PlayerSpell[]):CreationStep[]{
  const definition=classById(character.classId),limits=spellLimits(character),stats=derivedStats(character)
  const background=backgrounds.find(b=>b.id===character.backgroundId)
  const identityGaps:string[]=[]
  if(!character.name.trim()||['Yeni Yolcu','İsimsiz Yolcu'].includes(character.name.trim()))identityGaps.push('Karakterine hatırlayacağın bir ad ver.')
  if(!races.some(r=>r.id===character.raceId))identityGaps.push('Soyunu seç veya Özel soy / halk seçeneğini kullan.')
  if(!background)identityGaps.push('Bir geçmiş seç; kendi geçmişin için Özel geçmiş kullanılabilir.')
  const availableSubclass=subclasses[character.classId].some(s=>s.level<=character.level)
  if(availableSubclass&&!character.subclass)identityGaps.push('Bu seviyede sınıf yolun açıldı; alt sınıf seçimini yap veya DM ile belirle.')
  const scoreGaps:string[]=[]
  if(abilityIds.some(id=>!Number.isInteger(character.scores[id])||character.scores[id]<1||character.scores[id]>30))scoreGaps.push('Altı nihai nitelik tam sayı ve 1–30 arasında olmalı.')
  const fromBackground=new Set(background?.skills||[])
  const classSkills=character.skillProficiencies.filter(id=>definition.skillChoices.includes(id)&&!fromBackground.has(id)).length
  if(classSkills<definition.skillCount)scoreGaps.push(`${definition.name} listesinden ${definition.skillCount} sınıf becerisi seçimini kontrol et; geçmişte verilen beceriler ayrıca gelir.`)
  const missingBackground=(background?.skills||[]).filter(id=>!character.skillProficiencies.includes(id))
  if(missingBackground.length)scoreGaps.push('Seçtiğin geçmişin beceri yetkinliklerini işaretle.')
  if(character.expertise.some(id=>!character.skillProficiencies.includes(id)))scoreGaps.push('Uzmanlık için aynı beceride önce yetkinlik olmalı.')
  const steps:CreationStep[]=[
    {id:'identity',title:'Kimlik ve sınıf',tab:'identity',ready:!identityGaps.length,optional:false,detail:`${definition.name} · ${character.level}. seviye. Portre, hane ve uzun geçmiş yazısı isteğe bağlıdır.`,gaps:identityGaps,action:'Kimlik seçimlerine git'},
    {id:'abilities',title:'Puanlar ve beceriler',tab:'abilities',ready:!scoreGaps.length,optional:false,detail:'Altı puanı dağıt; sınıf, geçmiş ve soy yetkinliklerini kontrol et. Soy artışları kendiliğinden eklenmez.',gaps:scoreGaps,action:'Nitelikleri ve becerileri aç'},
    {id:'equipment',title:'Donanım',tab:'equipment',ready:!!character.equipment.length||!!character.attacks.length,optional:true,detail:'Silah, zırh, erzak ve başlangıç eşyalarını masanın seçtiği yöntemle kaydet. Eşya listesi zorunlu bir başlangıç paketi atamaz.',gaps:character.equipment.length||character.attacks.length?[]:['Başlangıç eşyalarını Eşya bölümüne; silah ve savunmanı Macerada bölümüne ekleyebilirsin.'],action:'Eşya listemi aç'},
  ]
  if(limits.mode!=='none'){
    const gaps:string[]=[],counts=spellChoiceCounts(character,spells),always=new Set(alwaysPreparedSpellIds(character))
    const selected=character.spellbook.map(id=>spells.find(s=>s.id===id)).filter((s):s is PlayerSpell=>!!s)
    if(!spells.length)gaps.push('Büyü arşivi açılınca seçimlerin burada denetlenecek.')
    else{
      if(counts.cantrips<limits.cantrips)gaps.push(`${limits.cantrips} basit büyü seçebilirsin; şu anda ${counts.cantrips} seçili.`)
      if(counts.cantrips>limits.cantrips)gaps.push('Basit büyü sayısını kontrol et; soy veya özel özellikten gelen ek seçimler ayrıca izlenir.')
      if(limits.known!==null&&counts.known!==limits.known)gaps.push(`Bu sınıf/seviye ${limits.known} büyü bilir; listende ${counts.known} bulunuyor.`)
      if(limits.mode==='book'&&selected.filter(s=>s.level>0).length<limits.minimumBook)gaps.push(`Normal seviye ilerleyişiyle kitabında en az ${limits.minimumBook} büyü bulunur; kitap seçimlerini tamamla.`)
      if(limits.prepared!==null){const prepared=character.preparedSpells.filter(id=>!always.has(id)).length;if(!prepared)gaps.push(`Günlük hazırlık listen boş; en fazla ${limits.prepared} normal büyü hazırlayabilirsin.`);if(prepared>limits.prepared)gaps.push(`Normal hazırlık sayısı ${limits.prepared} sınırını aşıyor.`)}
      if(character.preparedSpells.some(id=>!always.has(id)&&!character.spellbook.includes(id)))gaps.push('Hazırlanmış bir büyü seçili listende yok; günlük hazırlığı yeniden gözden geçir.')
      if(character.preparedSpells.some(id=>{const spell=spells.find(s=>s.id===id);return spell&&(spell.level===0||!canSelectSpell(character,spell))}))gaps.push('Günlük hazırlığında basit büyü veya sınıfına uygun olmayan bir seçim var.')
      if(limits.prepared===null&&character.preparedSpells.length)gaps.push('Bu sınıf günlük hazırlık listesi kullanmaz; önceki hazırlanmış seçimlerini kaldırabilirsin.')
      if(selected.some(s=>!canSelectSpell(character,s)))gaps.push('Sınıf veya seviye değiştirdiysen önceki uyumsuz seçimlerini gözden geçir.')
      if([...new Set([...character.spellbook,...character.preparedSpells])].some(id=>!spells.some(s=>s.id===id)))gaps.push('Bazı seçili büyülerin metni arşivde yok; ilgili özel büyü dosyasını aç.')
      if(character.classId==='bard'&&counts.secrets>counts.secretsLimit)gaps.push(`Sınıf dışı Büyülü Sırlar seçimlerin ${counts.secretsLimit} sınırını aşıyor.`)
      if(character.classId==='rogue'&&character.subclass==='arcane-trickster'&&!character.spellbook.includes('mage-hand'))gaps.push('Büyülü Düzenbazın basit büyüleri arasında Büyücü Eli bulunmalı.')
      for(const degree of limits.arcanumLevels)if(selected.filter(s=>s.level===degree).length!==1)gaps.push(`${degree}. derece Gizemli Sır için bir büyü seç.`)
    }
    steps.push({id:'spells',title:'Büyü seçimi',tab:'spells',ready:!gaps.length,optional:false,detail:limits.maxLevel?`Normal sınıf büyülerin ${limits.maxLevel}. dereceye kadar açıldı. Karakter seviyesi ve büyü derecesi aynı değildir.`:'Büyü seçimini sınıfının kurallarına göre tamamla.',gaps,action:'Büyü defterimi aç'})
  }
  const earlierReady=steps.filter(s=>!s.optional).every(s=>s.ready)
  const reviewGaps=earlierReady?[]:['Önce yukarıdaki temel hazırlık notlarına dön. Kâğıdını istediğin aşamada yine de açabilir ve yazdırabilirsin.']
  if(character.hp>stats.maxHp)reviewGaps.push('Mevcut canın hesaplanan azami canı aşıyor; seviye veya Dayanıklılık değişikliğini kontrol et.')
  steps.push({id:'review',title:'Son kontrol ve A4',tab:'sheet',ready:!reviewGaps.length,optional:false,detail:`Azami can ${stats.maxHp} · Zırh Sınıfı ${stats.armorClass} · Yetkinlik +${stats.proficiency}. Kâğıttaki bilgileri DM ile son kez gözden geçir.`,gaps:reviewGaps,action:'A4 nüshamı gözden geçir'})
  return steps
}

const stepIcons={identity:UserRound,abilities:Shield,equipment:Backpack,spells:Sparkles,review:ClipboardCheck}
export default function CharacterCreationGuide({character,spells,onTab,onChange}:{character:PlayerCharacter;spells:PlayerSpell[];onTab:(tab:CreationGuideTab)=>void;onChange:(patch:Partial<PlayerCharacter>)=>void}){
  const [open,setOpen]=useState(()=>{try{return localStorage.getItem(creationGuideStorageKey)!=='hidden'}catch{return true}})
  const [selected,setSelected]=useState('identity')
  const steps=getCharacterReadiness(character,spells),current=steps.find(s=>s.id===selected)||steps[0]
  const required=steps.filter(s=>!s.optional&&s.id!=='review'),completed=required.filter(s=>s.ready).length
  const definition=classById(character.classId),hint=classCreationHints[character.classId],limits=spellLimits(character)
  const background=backgrounds.find(b=>b.id===character.backgroundId)
  const missingBackground=(background?.skills||[]).filter(id=>!character.skillProficiencies.includes(id))
  const firstGap=steps.find(s=>!s.ready&&!s.optional)||steps.at(-1)!
  function toggle(){const next=!open;setOpen(next);try{localStorage.setItem(creationGuideStorageKey,next?'open':'hidden')}catch{/* Preference is optional. */}}
  return <section className={'character-creation-guide'+(open?' is-open':'')} data-testid="character-creation-guide" aria-label="Karakter hazırlama rehberi">
    <header className="ccg-heading"><div><BookOpen size={19}/><span><strong>Karakterimi adım adım hazırla</strong><small>Yeni başlayanlar için yol haritası · {completed} / {required.length} temel kontrol</small></span></div><button type="button" aria-expanded={open} aria-controls="character-creation-guide-body" onClick={toggle}>{open?'Rehberi daralt':'Rehberi aç'}<ChevronDown size={16}/></button></header>
    {open&&<div className="ccg-body" id="character-creation-guide-body">
      <div className="ccg-class-intro">
        <div><span className="ccg-eyebrow">SEÇTİĞİN SINIF · {definition.name.toLocaleUpperCase('tr')}</span><h2>{hint.role}</h2><p className="ccg-priorities"><strong>Önceliğin:</strong> {hint.priorities}</p></div>
        <details className="ccg-class-details">
          <summary>Sınıfını ve büyü kullanımını tanı <ChevronDown size={15}/></summary>
          <p>{hint.firstChoice}</p>
          <dl><div><dt>Can zarı</dt><dd>d{definition.hitDie} · Dayanıklılık değiştiricisi canı etkiler.</dd></div><div><dt>Büyü kullanımı</dt><dd>{limits.mode==='none'?definition.casting==='half'?'2. seviyede açılır.':'Bu seviyede sınıf büyüsü yok.':limits.mode==='book'?`Kitap → günlük hazırlık → büyü yuvası. Büyü niteliğin ${abilityLabels[limits.ability!]}.`:limits.mode==='pact'?'Bilinen büyüler ve kısa dinlenmede dönen ayrı Ant yuvaları.':limits.prepared!==null?`Günlük hazırlık: en fazla ${limits.prepared} normal büyü.`:'Bilinen büyüler; günlük hazırlık listesi yok.'}</dd></div></dl>
        </details>
      </div>
      <nav className="ccg-steps" aria-label="Karakter hazırlama adımları">{steps.map((step,index)=>{const Icon=stepIcons[step.id as keyof typeof stepIcons];return <button type="button" key={step.id} aria-pressed={current.id===step.id} className={step.ready?'is-ready':''} onClick={()=>{setSelected(step.id);onTab(step.tab)}}><span>{step.ready?<Check size={14}/>:index+1}</span><strong>{step.title}<small>{step.optional?'İsteğe bağlı':step.ready?'Kontrol edildi':'Gözden geçir'}</small></strong><Icon size={15}/></button>})}</nav>
      <div className="ccg-current"><div><span className="ccg-eyebrow">{steps.findIndex(s=>s.id===current.id)+1}. ADIM</span><h3>{current.title}</h3><p>{current.detail}</p>{current.gaps.length?<ul>{current.gaps.map((gap,index)=><li key={index}>{gap}</li>)}</ul>:<p className="ccg-ready-note"><CheckCircle2 size={15}/>Bu başlığın temel kayıtları yerinde. İstersen ayrıntıları değiştirebilirsin.</p>}</div><div className="ccg-step-actions"><button type="button" onClick={()=>onTab(current.tab)}>{current.action}<ArrowRight size={15}/></button>{current.id==='equipment'&&<button type="button" className="ccg-secondary" onClick={()=>onTab('adventure')}>Silah ve savunmaya git</button>}{current.id==='abilities'&&missingBackground.length>0&&<button type="button" className="ccg-secondary" onClick={()=>onChange({skillProficiencies:[...new Set([...character.skillProficiencies,...missingBackground])]})}>Geçmiş yetkinliklerini ekle</button>}</div></div>
      <footer className="ccg-footer"><p>Bu rehber temel seçimleri denetler. Soy özellikleri, özel yetenekler, sınıf yollarının koşullu etkileri ve başlangıç donanımı masanda ayrıca belirlenir. Portre, hane ve uzun hikâye zorunlu değildir.</p>{firstGap.id!==current.id&&<button type="button" onClick={()=>{setSelected(firstGap.id);onTab(firstGap.tab)}}>{firstGap.ready?'A4 son kontrolüne git':'Sıradaki öneriye git'}<ArrowRight size={13}/></button>}</footer>
    </div>}
  </section>
}
