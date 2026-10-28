import { useId, useState } from 'react'
import { abilityLabels, classById, proficiencyBonus, skills, subclasses } from './rules'
import {
  createReferenceResource, featuresForCharacter, languageOptions, mergeReferenceSkills,
  mergeReferenceText, raceReferences, type ReferenceResource,
} from './character-options'
import type { PlayerCharacter, SkillId } from './types'
import './character-rules-reference.css'

type Props = {character:PlayerCharacter;onChange:(patch:Partial<PlayerCharacter>)=>void}
const resetLabels = {short:'kısa / uzun dinlenme',long:'uzun dinlenme',manual:'elle sıfırlama'}

function ResourceButton({resource,character,onChange}:Props&{resource:ReferenceResource}) {
  const existing=character.resources.find(row=>row.id===resource.id)
  if(existing)return <p className="crr-resource-existing">Kaynaklarda kayıtlı: {existing.name} · {Math.max(0,existing.max-existing.used)}/{existing.max}. {existing.max!==resource.max||existing.reset!==resource.reset?'Seviye veya nitelik değişmiş olabilir; önerilen azami '+resource.max+' ve yenilenme '+resetLabels[resource.reset]+'. Mevcut harcamaların korunuyor; düzenlemeyi Kaynaklar’da yap.':'Harcamayı Kaynaklar bölümünden izle.'}</p>
  if(character.resources.length>=50)return <p className="crr-muted">50 kaynaklık kayıt sınırına ulaştın. Yeni sayaç eklemeden önce Kaynaklar bölümündeki kullanılmayan bir kaydı kaldır.</p>
  if(resource.max<1)return <p className="crr-muted">Mevcut niteliklerle bu yeteneğin kullanım hakkı yok.</p>
  return <div className="crr-resource"><span>{resource.max} kullanım / puan · {resetLabels[resource.reset]}</span><button type="button" onClick={()=>onChange({resources:[...character.resources,createReferenceResource(resource)]})} aria-label={`${resource.name}: kaynak takibine ekle`}>Kaynak takibine ekle <span aria-hidden="true">＋</span></button></div>
}

function ClassGuide({character,onChange}:Props) {
  const [showFuture,setShowFuture]=useState(false)
  const [query,setQuery]=useState('')
  const definition=classById(character.classId),features=featuresForCharacter(character)
  const folded=query.trim().toLocaleLowerCase('tr-TR')
  const levels=Array.from({length:showFuture?20:character.level},(_,i)=>i+1)
  const rows=levels.map(level=>({level,features:features.filter(row=>row.level===level)})).filter(row=>!folded||row.features.some(feature=>(feature.title+' '+feature.text).toLocaleLowerCase('tr-TR').includes(folded)))
  const selectedSubclass=subclasses[character.classId].find(row=>row.id===character.subclass)
  const subclassLevel=subclasses[character.classId][0]?.level
  return <div className="crr-guide">
    <dl className="crr-facts">
      <div><dt>Can zarı</dt><dd>d{definition.hitDie}</dd></div>
      <div><dt>Kurtarış yetkinlikleri</dt><dd>{definition.saves.map(id=>abilityLabels[id]).join(' · ')}</dd></div>
      <div><dt>Başlangıç becerileri</dt><dd>{definition.skillCount} seçim</dd></div>
      <div><dt>Yetkinlik bonusun</dt><dd>+{proficiencyBonus(character.level)}</dd></div>
    </dl>
    <p><strong>Zırh:</strong> {definition.armor}. <strong>Silah:</strong> {definition.weapons}.</p>
    <p><strong>Becerilerini seç:</strong> {definition.skillChoices.map(id=>skills.find(row=>row.id===id)?.name).join(', ')}. Sınıfının verdiği {definition.skillCount} seçime soy ve geçmiş yetkinlikleri eklenir; aynı beceriyi iki kez almak uzmanlık vermez.</p>
    <p className="crr-notice"><strong>{selectedSubclass?selectedSubclass.name:'Alt sınıf henüz seçilmedi'}.</strong> {selectedSubclass?`${selectedSubclass.level}. seviyede açılır. Aşağıda temel sınıf ile yalnız seçili alt sınıfın özellikleri gösterilir.`:`Bu sınıfın alt sınıf seçimi ${subclassLevel}. seviyededir. Kimlik alanından seçtiğinde ilgili yetenekler bu rehbere eklenir.`} Özellikler anlatımdır; koşullu hasar, direnç, aura, çağrı, biçim değiştirme ve seçimler otomatik uygulanmaz.</p>
    <div className="crr-tools"><label><span>Yetenek içinde ara</span><input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Öfke, ritüel, kritik…"/></label><label className="crr-checkbox"><input type="checkbox" checked={showFuture} onChange={event=>setShowFuture(event.target.checked)}/> Gelecek seviyeleri de göster</label></div>
    <div className="crr-timeline">
      {rows.map(({level,features:levelFeatures})=><details className={`crr-level ${level===character.level?'is-current':''} ${level>character.level?'is-future':''}`} key={`${character.classId}-${character.subclass}-${level}`} open={level===character.level}>
        <summary><span className="crr-level-number">{level}</span><span><strong>{level===character.level?'Şu anki seviyen':level>character.level?'İleride açılır':'Kazanılmış seviye'}</strong><small>{levelFeatures.length?levelFeatures.map(row=>row.title).join(' · '):'Mevcut yetenekler ve seviye ilerlemesi'}</small></span><span className="crr-disclosure" aria-hidden="true">＋</span></summary>
        <div className="crr-level-content">{levelFeatures.length?levelFeatures.filter(row=>!folded||(row.title+' '+row.text).toLocaleLowerCase('tr-TR').includes(folded)).map((row,index)=><article className="crr-feature" key={`${level}-${row.title}-${index}`}><h4>{row.title}{row.subclass&&<small>Alt sınıf</small>}</h4><p>{row.text}</p>{row.resource&&level<=character.level&&(()=>{const resource=row.resource!(character);return resource?<ResourceButton resource={resource} character={character} onChange={onChange}/>:<p className="crr-muted">Bu seviyede kullanım sınırı yok; sayaç gerekmez.</p>})()}</article>):<p className="crr-muted">Bu seviyede yeni adlı sınıf özelliği yok. Canını, yetkinlik bonusunu ve varsa büyü yuvaları/bilinen büyü seçimlerini kontrol et. Önceki yeteneklerin geçerliliğini korur; seviye alanını değiştirmek nitelik artışlarını veya ekipman seçimlerini kendiliğinden yapmaz.</p>}</div>
      </details>)}
      {!rows.length&&<p className="crr-muted">Bu aramayla eşleşen bir özellik yok. Gelecek seviyeleri açmayı veya başka bir sözcük denemeyi seçebilirsin.</p>}
    </div>
  </div>
}

function ChoiceLanguages({count,values,onChange,excluded=[]}:{count:number;values:string[];onChange:(next:string[])=>void;excluded?:string[]}) {
  if(!count)return null
  return <div className="crr-choice-grid">{Array.from({length:count},(_,index)=><label key={index}><span>Ek dil seçimi {index+1}</span><select value={values[index]||''} onChange={event=>onChange(Array.from({length:count},(_,i)=>i===index?event.target.value:values[i]||''))}><option value="">Bir dil seç…</option>{languageOptions.filter(language=>!excluded.includes(language)).map(language=><option key={language} value={language} disabled={values.some((value,i)=>i!==index&&value===language)}>{language}</option>)}</select></label>)}</div>
}

function RaceGuide({character,onChange}:Props) {
  const [selectedLanguages,setSelectedLanguages]=useState<string[]>([])
  const [selectedSkills,setSelectedSkills]=useState<SkillId[]>([])
  const [selectedTool,setSelectedTool]=useState('')
  const [message,setMessage]=useState('')
  const race=raceReferences.find(row=>row.id===character.raceId)
  if(!race)return <div className="crr-notice"><strong>Özel soy</strong><p>Soyunun özelliklerini DM ile belirle. Nitelik artışı, boy, hız, diller, duyular ve yetkinlikleri not et; bu sürüm özel soy için varsayılan özellik uydurmaz.</p></div>
  const chosenLanguages=[...race.languages,...selectedLanguages.filter(Boolean)]
  const chosenSkills=[...race.skills,...selectedSkills.filter(Boolean)]
  const chosenTools=[...(race.tools||[]),...(selectedTool?[selectedTool]:[])]
  const complete=selectedLanguages.filter(Boolean).length===race.extraLanguages&&selectedSkills.filter(Boolean).length===race.skillChoices&&(!race.toolChoices||!!selectedTool)
  const duplicateSkill=selectedSkills.some(id=>character.skillProficiencies.includes(id))
  const nextLanguages=mergeReferenceText(character.languages,chosenLanguages)
  const nextTools=mergeReferenceText(character.tools,chosenTools)
  const nextSkills=mergeReferenceSkills(character.skillProficiencies,chosenSkills)
  const changed=nextLanguages!==character.languages||nextTools!==character.tools||nextSkills.length!==character.skillProficiencies.length
  return <div className="crr-guide">
    <dl className="crr-facts"><div><dt>Boy</dt><dd>{race.size}</dd></div><div><dt>Yürüyüş</dt><dd>{race.speed} ft</dd></div><div><dt>Karanlık görüşü</dt><dd>{race.darkvision}</dd></div></dl>
    <div className="crr-notice"><strong>Nitelik artışları: {race.ability}</strong><p>Nitelikler alanındaki puanlar nihai puanların olsun. Aşağıdaki düğme niteliklere, cana veya hıza ekleme yapmaz; tekrar tıklamak artışları biriktirmez. Soydan kaynaklanan otomatik can/hız hesabı mevcut defterin ayrı hesaplamasıdır.</p></div>
    <div className="crr-traits">{race.traits.map(trait=><article key={trait.title}><h4>{trait.title}</h4><p>{trait.text}</p></article>)}</div>
    <details className="crr-apply"><summary>Dil ve yetkinlikleri kayda ekle</summary>
      <div className="crr-apply-body"><p>Önce seçimlerini tamamla, ardından özeti kontrol et. Yalnız listelenen diller, beceriler ve aletler eklenir; mevcut kayıtların silinmez. Silah/zırh yetkinlikleri yukarıda açıklanır; donanım alanına elle not edebilirsin.</p>
        <ChoiceLanguages count={race.extraLanguages} values={selectedLanguages} onChange={setSelectedLanguages} excluded={race.languages}/>
        {!!race.skillChoices&&<div className="crr-choice-grid">{Array.from({length:race.skillChoices},(_,index)=><label key={index}><span>Soydan beceri seçimi {index+1}</span><select value={selectedSkills[index]||''} onChange={event=>setSelectedSkills(Array.from({length:race.skillChoices},(_,i)=>i===index?event.target.value as SkillId:(selectedSkills[i]||'') as SkillId))}><option value="">Bir beceri seç…</option>{skills.map(skill=><option key={skill.id} value={skill.id} disabled={character.skillProficiencies.includes(skill.id)||selectedSkills.some((id,i)=>i!==index&&id===skill.id)}>{skill.name}{character.skillProficiencies.includes(skill.id)?' · zaten yetkin':''}</option>)}</select></label>)}</div>}
        {race.toolChoices&&<label><span>Soydan zanaat aleti seçimi</span><select value={selectedTool} onChange={event=>setSelectedTool(event.target.value)}><option value="">Bir alet seç…</option>{race.toolChoices.map(tool=><option value={tool} key={tool}>{tool}</option>)}</select></label>}
        <div className="crr-preview"><strong>Ekleneceklerin özeti</strong><p>Diller: {chosenLanguages.join(', ')||'Yok'}<br/>Beceriler: {chosenSkills.map(id=>skills.find(row=>row.id===id)?.name).join(', ')||'Yok'}<br/>Aletler: {chosenTools.join(', ')||'Yok'}</p></div>
        <button type="button" disabled={!complete||duplicateSkill||!changed} onClick={()=>{onChange({languages:nextLanguages,tools:nextTools,skillProficiencies:nextSkills});setMessage('Seçtiğin dil ve yetkinlikler eklendi. Nitelik puanlarını ayrıca kontrol et.')}}>Özetteki soy yetkinliklerini ekle</button>
        <p className="crr-muted" role="status">{message||(!complete?'Gerekli dil, beceri ve alet seçimlerini tamamla.':!changed?'Bu özetteki özellikler zaten kayıtlı.':'Aynı dil veya beceri ikinci kez eklenmez; uzmanlık verilmez.')}</p>
      </div>
    </details>
    {!!race.resources?.(character).length&&<div className="crr-race-resources"><h4>Soydan gelen sınırlı kullanımlar</h4>{race.resources(character).map(resource=><ResourceButton key={resource.id} resource={resource} character={character} onChange={onChange}/>)}</div>}
  </div>
}

function BackgroundGuide({character,onChange}:Props) {
  const [languages,setLanguages]=useState<string[]>([])
  const [message,setMessage]=useState('')
  if(character.backgroundId!=='acolyte')return <div className="crr-guide"><h3>Özel geçmişini birlikte kur</h3><p>2014 özel geçmiş kuralında bir geçmiş özelliğini değiştirir, iki beceri ve toplam iki dil/alet yetkinliği seçersin. Örneğin iki dil veya bir dil + bir alet. Bir geçmişin donanım paketini kullanabilir veya başlangıç altınını seçebilirsin; altın yönteminde sınıf/geçmiş paketlerini ayrıca alma.</p><p>Birden fazla kaynaktan aynı beceri/alet gelirse DM ile aynı türde başka bir yetkinlik seç; ikinci kez almak uzmanlık sağlamaz. Kişilik, ideal, bağ ve kusurunu hikâye alanlarına yaz.</p><p className="crr-notice">Bu arşivde tam geçmiş örneği Tapınak Öğrencisi’dir. Diğer kitapların bütün geçmişleri ekliymiş gibi sunulmaz; özel geçmiş ayrıntılarını DM ile belirleyip kaydet.</p></div>
  const nextLanguages=mergeReferenceText(character.languages,languages.filter(Boolean))
  const nextSkills=mergeReferenceSkills(character.skillProficiencies,['insight','religion'])
  const complete=languages.filter(Boolean).length===2&&languages[0]!==languages[1]
  const changed=nextLanguages!==character.languages||nextSkills.length!==character.skillProficiencies.length
  return <div className="crr-guide"><h3>Tapınak Öğrencisi</h3><p>Bir tapınakta ayinlere yardım ederek, inancının geleneklerini öğrenerek ve topluluğa hizmet ederek yetiştin. Bu geçmiş seni otomatik rahip sınıfı veya büyü kullanıcısı yapmaz.</p>
    <dl className="crr-facts"><div><dt>Beceriler</dt><dd>Sezgi · Din</dd></div><div><dt>Diller</dt><dd>İki seçim</dd></div><div><dt>Alet yetkinliği</dt><dd>Yok</dd></div></dl>
    <article className="crr-traits"><h4>İnananların Sığınağı</h4><p>İnancını paylaşan bir tapınak sen ve yoldaşlarına ücretsiz bakım/şifa sunabilir; büyülerin maddi bileşenlerini yine sağlamanız gerekir. Topluluğun yalnız seni mütevazı yaşamla destekler. İyi ilişkide olduğun tapınaktan tehlikeli olmayan yardım isteyebilirsin; koşulsuz askerî güç veya sınırsız büyü hizmeti değildir.</p></article>
    <details className="crr-apply"><summary>Geçmiş seçimlerini kayda ekle</summary><div className="crr-apply-body"><ChoiceLanguages count={2} values={languages} onChange={setLanguages}/><p className="crr-preview"><strong>Özet:</strong> Sezgi ve Din yetkinliği; {languages.filter(Boolean).join(', ')||'henüz seçilmemiş iki dil'}. Nitelik artışı ve altın eklenmez.</p><button type="button" disabled={!complete||!changed} onClick={()=>{onChange({languages:nextLanguages,skillProficiencies:nextSkills});setMessage('Geçmişinin dilleri ve becerileri eklendi. Çakışan bir becerin varsa DM ile bir alternatif seç.')}}>Özetteki geçmiş yetkinliklerini ekle</button><p className="crr-muted" role="status">{message||(!complete?'Birbirinden farklı iki dil seç.':!changed?'Bu seçimler zaten kayıtlı.':'Zaten yetkin olduğun bir beceri varsa aynı türde başka yetkinliği DM ile belirle; bu düğme uzmanlık vermez.')}</p></div></details>
    <details className="crr-apply"><summary>Donanım ve rol yapma başlangıcı</summary><div className="crr-apply-body"><p><strong>Başlangıç paketi:</strong> kutsal simge, dua kitabı veya dua çarkı, 5 tütsü çubuğu, dinî giysiler, sıradan giysiler ve 15 altın içeren kese. Bu liste bilgi içindir; Eşya bölümüne yalnız paketi gerçekten seçtiysen ekle.</p><p><strong>Karakterine cevap ver:</strong> Hangi tapınağa borçlusun? İnancının hangi öğretisi seni bir sığınmacıyı korumaya iter? Üstlerin senden neyi sakladı? İdealin, sadık olduğun kişi ve zaafın birbiriyle gerilim taşısın; Aruzahr’daki yer ve kişi bağlarını DM ile kur.</p></div></details>
  </div>
}

export function CharacterRulesReference({character,onChange}:Props) {
  const [tab,setTab]=useState<'class'|'race'|'background'>('class')
  const id=useId(),definition=classById(character.classId)
  const current=featuresForCharacter(character).filter(row=>row.level===character.level)
  return <section className="character-rules-reference" data-testid="rules-reference" aria-labelledby={`${id}-heading`}>
    <header className="crr-header"><span className="crr-kicker">2014 · Karakter rehberi</span><h3 id={`${id}-heading`}>Seçimlerini anlayarak yap</h3><p><strong>{character.level}. seviye {definition.name}.</strong> {current.length?current.map(row=>row.title).join(' · '):'Yeni adlı özellik yok; önceki yeteneklerin ve seviye ilerlemen sürer.'}</p></header>
    <details className="crr-database"><summary>Sınıf gelişimi, soy ve geçmiş rehberini aç <span aria-hidden="true">↗</span></summary><div className="crr-database-body">
      <div className="crr-tabs" role="tablist" aria-label="Kural rehberi konuları">{([{id:'class',label:'Sınıf ve seviyeler'},{id:'race',label:'Soy özellikleri'},{id:'background',label:'Geçmiş'}] as const).map(item=><button key={item.id} type="button" role="tab" id={`${id}-${item.id}-tab`} aria-controls={`${id}-${item.id}-panel`} aria-selected={tab===item.id} tabIndex={tab===item.id?0:-1} onClick={()=>setTab(item.id)} onKeyDown={event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const tabs=['class','race','background'] as const,index=tabs.indexOf(tab),next=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;setTab(tabs[next]);document.getElementById(`${id}-${tabs[next]}-tab`)?.focus()}}>{item.label}</button>)}</div>
      <div role="tabpanel" id={`${id}-${tab}-panel`} aria-labelledby={`${id}-${tab}-tab`} tabIndex={0}>
        {tab==='class'?<ClassGuide key={`${character.id}-${character.classId}-${character.subclass}`} character={character} onChange={onChange}/>:tab==='race'?<RaceGuide key={`${character.id}-${character.raceId}`} character={character} onChange={onChange}/>:<BackgroundGuide key={`${character.id}-${character.backgroundId}`} character={character} onChange={onChange}/>}
      </div>
      <footer className="crr-source">Türkçe, özgün oyun özetleri · SRD 5.1 / 2014. Bu arşiv 12 temel sınıf, yerleşik SRD alt sınıfları, 9 SRD soyunu ve Tapınak Öğrencisi geçmişini kapsar; Büyülü Şövalye/Düzenbaz için kısa seçim rehberi de içerir. Bütün ek kitap seçeneklerinin veya çoklu sınıf kurallarının tam otomasyonu değildir. <a href="licenses/SRD-5.1.txt" target="_blank" rel="noreferrer">Kaynak ve lisans</a></footer>
    </div></details>
  </section>
}

export default CharacterRulesReference
