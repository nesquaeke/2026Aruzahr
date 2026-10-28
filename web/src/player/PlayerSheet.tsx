import type { ReactNode } from 'react'
import { abilityIds, type PlayerCharacter, type PlayerSpell } from './types'
import { abilityLabels, abilityModifier, classDefinitions, derivedStats, races as raceDefinitions, backgrounds as backgroundDefinitions, savingThrow, skillBonus, skills, subclasses } from './rules'
import { worldHouses } from '../lore/world-polities'
import './player-sheet.css'

const signed = (number: number) => `${number >= 0 ? '+' : ''}${number}`
const compact = (value: string | undefined, size: number) => !value ? '' : value.length > size ? value.slice(0, size - 1) + '…' : value
const spellDegree = (level: number) => level === 0 ? 'Basit büyü' : `${level}. derece`
const preview = (value: string | undefined, size: number) => compact(value?.replace(/\s+/g,' ').trim(),size)
const measure = (value: number) => Number.isInteger(value) ? String(value) : value.toLocaleString('tr-TR')

export function SheetSeal() {
  return <svg className="sheet-seal" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="39"/><path d="m23 65 19-35 11 22 7-13 18 26H23m19-35v35M19 75h62M50 7v11m0 64v11M7 50h11m64 0h11"/><path className="sheet-seal-fill" d="m50 18 3 9-3-2-3 2 3-9m0 64-3-9 3 2 3-2-3 9"/></svg>
}

function PageHeader({ number, title, name, houseId }: {number: string; title: string; name?: string; houseId?: string}) {
  const house = worldHouses.find(house => house.id === houseId)
  return <header className="sheet-page-header">
    <div className="sheet-emblem">{house ? <img src={`/heraldry/${house.id}.svg`} alt={house.name + ' arması'}/> : <SheetSeal/>}</div>
    <div><span className="sheet-wordmark">ARUZAHR</span><h2>{title}</h2><p>{compact(name,90) || 'Adını yaz. Yolunu kendin çiz.'}</p></div>
    <div className="sheet-edition"><strong>YOLCUNUN DEFTERİ</strong><span>5e · 2014</span><small>{number}</small></div>
  </header>
}

function Field({ label, value, className = '', children }: {label: string; value?: ReactNode; className?: string; children?: ReactNode}) {
  return <div className={`sheet-field ${className}`}><span>{label}</span><div>{children ?? (value === undefined || value === null || value === '' ? <i className="sheet-empty-line"/> : value)}</div></div>
}
function Box({label,value,className=''}:{label:string;value?:ReactNode;className?:string}) {
  return <div className={`sheet-value-box ${className}`}><strong>{value ?? <i/>}</strong><span>{label}</span></div>
}
function Dots({count=3, filled=0}:{count?:number;filled?:number}) {
  return <span className="sheet-dots">{Array.from({length:Math.min(20, Math.max(0,count))},(_,i)=><i key={i} className={i<filled?'filled':''}/>)}</span>
}
function TextBox({label,value,limit=115}:{label:string;value?:string;limit?:number}) {
  return <section className="sheet-text-box"><h3>{label}</h3><p>{preview(value,limit) || <><i/><i/><i/></>}</p></section>
}
function PageFooter({name,page}:{name?:string;page:string}) {
  return <footer className="sheet-page-footer"><span>VALHUNAR · KARAKTER KAYDI</span><span>{compact(name,46) || 'Yolculuğun burada başlıyor.'}</span><span>{page} · A4</span></footer>
}

function CoreSheet({character}:{character?:PlayerCharacter}) {
  const stats=character ? derivedStats(character) : undefined
  const classDefinition=classDefinitions.find(row=>row.id===character?.classId)
  const race=raceDefinitions.find(row=>row.id===character?.raceId)
  const background=backgroundDefinitions.find(row=>row.id===character?.backgroundId)
  const subclass=character?subclasses[character.classId].find(row=>row.id===character.subclass)?.name||character.subclass:''
  const house=worldHouses.find(row=>row.id===character?.houseId)
  const textExists=!!character && (!!character.backstory || !!character.notes)
  return <section className="aruzahr-sheet-page sheet-core" data-testid="player-sheet-core">
    <PageHeader number="I" title="Karakter Kâğıdı" name={character?.name} houseId={character?.houseId}/>
    <div className="sheet-identity">
      <Field label="Karakterin adı" value={compact(character?.name,48)} className="sheet-name"/>
      <Field label="Sınıf / seviye" value={character ? compact(`${classDefinition?.name || character.classId} · ${character.level}${subclass?' / '+subclass:''}`,48):undefined}/>
      <Field label="Oyuncu" value={compact(character?.playerName,40)}/>
      <Field label="Soy / halk" value={compact(race?.name || character?.raceId,32)}/>
      <Field label="Geçmiş" value={compact(background?.name || character?.backgroundId,32)}/>
      <Field label="Yönelim" value={compact(character?.alignment,30)}/>
      <Field label="Memleket / bağlılık" value={compact([character?.origin,house?.name].filter(Boolean).join(' · '),88)} className="sheet-origin"/>
    </div>
    <div className="sheet-abilities">{abilityIds.map(id=><section key={id} className="sheet-ability"><h3>{abilityLabels[id]}</h3><strong>{character ? character.scores[id] : ''}</strong><span>{character ? signed(abilityModifier(character.scores[id])) : 'Değiştirici'}</span></section>)}</div>
    <div className="sheet-main-columns">
      <div className="sheet-skill-column">
        <div className="sheet-proficiency"><strong>{stats ? signed(stats.proficiency) : ''}</strong><span>Yetkinlik bonusu</span><i className={character?.inspiration?'filled':''}/><small>İlham</small></div>
        <section className="sheet-saves"><h3>Kurtulma Atışları</h3>{abilityIds.map(id=><div key={id} className="sheet-check-row"><i className={character && (classDefinition?.saves.includes(id) || character.extraSaveProficiencies.includes(id))?'filled':''}/><strong>{character?signed(savingThrow(character,id)):''}</strong><span>{abilityLabels[id]}</span></div>)}</section>
        <section className="sheet-skills"><h3>Beceriler</h3>{skills.map(skill=><div key={skill.id} className="sheet-check-row"><i className={character?.expertise.includes(skill.id)?'expert':character?.skillProficiencies.includes(skill.id)?'filled':''}/><strong>{character?signed(skillBonus(character,skill.id)):''}</strong><span>{skill.name}</span><small>{skill.ability.toUpperCase()}</small></div>)}<p className="sheet-key">● Yetkinlik · ◆ Uzmanlık</p></section>
        <Field label="Pasif Algı" value={stats?.passivePerception}/>
        <TextBox label="Diller ve aletler" value={[character?.languages,character?.tools].filter(Boolean).join(' · ')} limit={140}/>
      </div>
      <div className="sheet-combat-column">
        <div className="sheet-defenses"><Box label="Zırh sınıfı" value={stats?.armorClass}/><Box label="İnisiyatif" value={stats?signed(stats.initiative):undefined}/><Box label="Hız · fit" value={stats?.speed}/></div>
        <section className="sheet-health"><h3>Can Puanı</h3><div><Field label="Azami" value={stats?.maxHp}/><Field label="Güncel" value={character?.hp}/><Field label="Geçici" value={character?.tempHp}/></div><div className="sheet-health-track"><Field label="Can zarları · kalan" value={character&&classDefinition?`${Math.max(0,character.level-character.hitDiceUsed)} / ${character.level}d${classDefinition.hitDie}`:undefined}/><section><span>Ölüm kurtarmaları</span><div><small>Başarı</small><Dots filled={character?.deathSuccesses}/></div><div><small>Başarısızlık</small><Dots filled={character?.deathFailures}/></div></section></div></section>
        <section className="sheet-attacks"><h3>Saldırılar</h3><div className="sheet-table-heading"><span>Silah / saldırı</span><span>Bonus</span><span>Hasar / tür</span></div>{Array.from({length:4},(_,i)=>{const attack=character?.attacks[i];return <div className="sheet-attack-row" key={i}><strong>{compact(attack?.name,36)}</strong><span>{attack&&character&&stats?signed(abilityModifier(character.scores[attack.ability])+(attack.proficient?stats.proficiency:0)):''}</span><small>{attack?compact([attack.damage,attack.damageType].filter(Boolean).join(' · '),44):''}</small></div>})}</section>
        <section className="sheet-equipment"><h3>Çanta ve Ekipman</h3><div className="sheet-equipment-heading"><span>Eşya</span><span>Adet</span></div>{Array.from({length:7},(_,i)=>{const item=character?.equipment[i];return <div className="sheet-equipment-row" key={i}><span>{compact(item?.name,50)}</span><span>{item?measure(item.quantity):''}</span></div>})}<p className="sheet-key">Uzun listeler ve eşya notları ek sayfada.</p></section>
        <section className="sheet-coins">{([['cp','Bakır'],['sp','Gümüş'],['ep','Elektrum'],['gp','Altın'],['pp','Platin']] as const).map(([id,label])=><Box key={id} label={label} value={character?.coins[id]}/>)}</section>
      </div>
      <div className="sheet-story-column">
        {character?.portrait ? <img className="sheet-character-portrait" src={character.portrait} alt={character.name + ' portresi'}/> : <div className="sheet-portrait-space"><SheetSeal/><span>Portre / kişisel işaret</span></div>}
        <TextBox label="Özellikler ve kaynaklar" value={character?.resources.slice(0,4).map(row=>`${row.name}: ${Math.max(0,row.max-row.used)} / ${row.max}`).join('\n')} limit={170}/>
        <TextBox label="Kişilik" value={character?.personality}/>
        <TextBox label="İdealler" value={character?.ideals}/>
        <TextBox label="Bağlar" value={character?.bonds}/>
        <TextBox label="Kusurlar" value={character?.flaws}/>
        <TextBox label="Durumlar / tükenmişlik" value={character?[...character.conditions,`Tükenmişlik: ${character.exhaustion}`].join(' · '):undefined} limit={80}/>
      </div>
    </div>
    <section className="sheet-bottom-notes"><h3>Geçmişin ve Aldığın Notlar</h3><p>{character ? preview([character.backstory,character.notes].filter(Boolean).join('\n'),330) : ''}</p>{textExists&&<small>Tam metin, görünüş ve ayrıntılı kayıtlar ek sayfada.</small>}</section>
    <PageFooter name={character?.name} page="1"/>
  </section>
}

function SpellSlots({character}:{character:PlayerCharacter}) {
  const stats=derivedStats(character)
  return <><div className="sheet-magic-summary"><Box label="Büyü niteliği" value={stats.spellAbility?abilityLabels[stats.spellAbility]:'—'}/><Box label="Kurtulma ZD" value={stats.spellDC??'—'}/><Box label="Büyü saldırısı" value={stats.spellAttack===null?'—':signed(stats.spellAttack)}/></div><div className="sheet-spell-slots">{stats.slots.map((count,i)=>count>0?<section key={i}><strong>{i+1}. derece</strong><Dots count={count} filled={character.usedSpellSlots[i]||0}/><small>{Math.max(0,count-(character.usedSpellSlots[i]||0))} / {count} kaldı</small></section>:null)}{stats.pact.slots>0&&<section className="sheet-pact-slots"><strong>Ant Büyüsü · {stats.pact.level}. derece</strong><Dots count={stats.pact.slots} filled={character.pactSlotsUsed}/><small>{Math.max(0,stats.pact.slots-character.pactSlotsUsed)} / {stats.pact.slots} kaldı · kısa dinlenmede yenilenir</small></section>}{stats.spellLimits.arcanumLevels.map(level=><section key={'arcanum-'+level}><strong>Gizemli Sır · {level}. derece</strong><Dots count={1} filled={character.arcanumUsed.includes(level)?1:0}/><small>{character.arcanumUsed.includes(level)?'Bugün kullanıldı':'Bugün kullanılabilir'} · uzun dinlenmede yenilenir</small></section>)}</div><p className="sheet-key">Dolu daireler harcanan yuvaları gösterir. Basit büyüler büyü yuvası harcamaz. Karakter seviyesi ile büyü derecesi farklıdır.</p></>
}

export function BlankSpellPage() {
  return <section className="aruzahr-sheet-page sheet-blank-magic" data-testid="player-sheet-blank-magic"><PageHeader number="II" title="Büyü Defteri"/><div className="sheet-blank-magic-stats"><Field label="Karakter / sınıf"/><Field label="Büyü niteliği"/><Field label="Kurtulma ZD"/><Field label="Saldırı bonusu"/></div><section className="sheet-blank-slots"><h3>Büyü Yuvaları</h3><div>{Array.from({length:9},(_,i)=><section key={i}><strong>{i+1}. derece</strong><Field label="Toplam / kalan"/></section>)}</div><Field label="Antlaşma yuvaları / derece"/><Field label="Yoğunlaşılan büyü"/></section><section className="sheet-blank-spell-list"><h3>Bildiğin ve Hazırladığın Büyüler</h3><div className="sheet-blank-spell-heading"><span>Hazır</span><span>Derece / büyünün adı</span><span>Kullanım / kısa not</span></div>{Array.from({length:18},(_,i)=><div key={i}><i/><span/><span/></div>)}</section><section className="sheet-blank-spell-notes"><h3>Bileşenler, Ritüeller ve Büyü Notları</h3>{Array.from({length:6},(_,i)=><i key={i}/>)}</section><PageFooter page="2"/></section>
}

function SpellPages({character,spells}:{character:PlayerCharacter;spells:PlayerSpell[]}) {
  const selected=spells.filter(spell=>character.spellbook.includes(spell.id)).sort((a,b)=>a.level-b.level||a.name.localeCompare(b.name,'tr'))
  const unknown=character.spellbook.filter(id=>!spells.some(spell=>spell.id===id))
  const stats=derivedStats(character)
  if(!selected.length&&!unknown.length&&!stats.spellAbility)return null
  return <section className="aruzahr-sheet-page sheet-flow-page" data-testid="player-sheet-spells"><PageHeader number="II" title="Büyü Defteri" name={character.name} houseId={character.houseId}/><SpellSlots character={character}/>{character.concentration&&<p className="sheet-concentration"><strong>Yoğunlaşılan büyü:</strong> {character.concentration}</p>}{!selected.length&&!unknown.length&&<p className="sheet-missing-spells">Henüz büyü seçilmedi. Büyü defterinden bildiğin büyüleri ekleyebilirsin.</p>}<div className="sheet-spell-entries">{selected.map(spell=><article className="sheet-spell-entry" key={spell.id}><header><h3>{spell.name}</h3><span>{spellDegree(spell.level)} · {spell.school}</span><small>{spell.level===0?'Basit büyü':character.preparedSpells.includes(spell.id)?'Hazır işaretli':'Defterde'}</small></header><dl><div><dt>Kullanım</dt><dd>{spell.castingTime}</dd></div><div><dt>Menzil</dt><dd>{spell.range}</dd></div><div><dt>Süre</dt><dd>{spell.duration}{spell.concentration?' · yoğunlaşma':''}</dd></div><div><dt>Bileşen</dt><dd>{spell.components.map(c=>({V:'Söz',S:'Hareket',M:'Malzeme'}[c]||c)).join(' · ')}{spell.material?' · '+spell.material:''}{spell.ritual?' · ritüel':''}</dd></div></dl><p>{spell.description}</p>{spell.higherLevels&&<p><strong>Yüksek derecede:</strong> {spell.higherLevels}</p>}</article>)}{unknown.map(id=><article className="sheet-spell-entry" key={id}><h3>{id}</h3><p>Bu büyünün açıklaması açık katalogda bulunamadı. Karakter kaydındaki seçim korunmuştur; kendi büyü notunu ekleyebilirsin.</p></article>)}</div><PageFooter name={character.name} page="Büyü eki"/></section>
}

function CharacterAppendix({character}:{character:PlayerCharacter}) {
  const cls=classDefinitions.find(row=>row.id===character.classId)
  const subclass=subclasses[character.classId].find(row=>row.id===character.subclass)?.name||character.subclass
  const race=raceDefinitions.find(row=>row.id===character.raceId)?.name||character.raceId
  const background=backgroundDefinitions.find(row=>row.id===character.backgroundId)?.name||character.backgroundId
  const house=worldHouses.find(row=>row.id===character.houseId)?.name||character.houseId
  const stats=derivedStats(character)
  const paragraphs=[['Karakterin tam adı',character.name],['Oyuncu',character.playerName],['Sınıf ve seviye',`${cls?.name||character.classId} · ${character.level}`],['Alt sınıf',subclass],['Soy / halk',race],['Geçmiş seçimi',background],['Memleket',character.origin],['Hane / bağlılık',house],['Yönelim',character.alignment],['Görünüş',character.appearance],['Kişilik',character.personality],['İdealler',character.ideals],['Bağlar',character.bonds],['Kusurlar',character.flaws],['Geçmiş',character.backstory],['Notlar',character.notes],['Diller',character.languages],['Alet yetkinlikleri',character.tools],['Durumlar',character.conditions.join(' · ')]]
  const identityExtra=character.name.length>48||character.playerName.length>40||[character.origin,house].filter(Boolean).join(' · ').length>88||`${cls?.name||character.classId} · ${character.level}${subclass?' / '+subclass:''}`.length>48||character.alignment.length>30||race.length>32||background.length>32
  const textExtra=identityExtra||[character.languages,character.tools].filter(Boolean).join(' · ').length>140||character.conditions.join(' · ').length>65||paragraphs.some(([label,text])=>text && (['Geçmiş','Notlar','Görünüş'].includes(label)||text.length>115||text.includes('\n')))
  // The first A4 page is a fixed-height summary; the full records below keep
  // long labels, narrow-column wrapping and equipment details from being lost.
  const equipmentExtra=character.equipment.length>0
  const attacksExtra=character.attacks.length>0
  const resourcesExtra=character.resources.length>0
  if(!equipmentExtra&&!attacksExtra&&!textExtra&&!resourcesExtra)return null
  return <section className="aruzahr-sheet-page sheet-flow-page" data-testid="player-sheet-appendix">
    <PageHeader number="III" title="Yolculuk Notları" name={character.name} houseId={character.houseId}/>
    {textExtra&&paragraphs.filter(([,text])=>text).map(([label,text])=><section className="sheet-appendix-section" key={label}><h3>{label}</h3><p>{text}</p></section>)}
    {attacksExtra&&<section className="sheet-appendix-section"><h3>Saldırı Ayrıntıları</h3>{character.attacks.map(attack=><div className="sheet-appendix-item" key={attack.id}><h4>{attack.name}</h4><p>Saldırı {signed(abilityModifier(character.scores[attack.ability])+(attack.proficient?stats.proficiency:0))} · {abilityLabels[attack.ability]}{attack.proficient?' · Yetkin':''}</p><p>{attack.damage} {attack.damageType}</p>{attack.notes&&<p>{attack.notes}</p>}</div>)}</section>}
    {equipmentExtra&&<section className="sheet-appendix-section"><h3>Çantanın Tam Listesi</h3>{character.equipment.map(item=><div className="sheet-appendix-item" key={item.id}><h4>{item.name} <span>× {measure(item.quantity)} · {measure(item.weight)} libre / adet</span></h4>{item.notes&&<p>{item.notes}</p>}</div>)}</section>}
    {resourcesExtra&&<section className="sheet-appendix-section"><h3>Özellik ve Kaynak Ayrıntıları</h3>{character.resources.map(resource=><div className="sheet-appendix-item" key={resource.id}><h4>{resource.name}</h4><p>Kalan {Math.max(0,resource.max-resource.used)} / {resource.max} · {resource.reset==='short'?'Kısa dinlenmede':resource.reset==='long'?'Uzun dinlenmede':'Elle'} yenilenir.</p></div>)}</section>}
    <PageFooter name={character.name} page="Kayıt eki"/>
  </section>
}

/** The same semantic document is used on screen and in the isolated print window. */
export default function PlayerSheet({character,spells=[]}:{character?:PlayerCharacter;spells?:PlayerSpell[]}) {
  return <div className="player-sheet-document" data-testid="player-sheet"><CoreSheet character={character}/>{character&&<><SpellPages character={character} spells={spells}/><CharacterAppendix character={character}/></>}</div>
}
