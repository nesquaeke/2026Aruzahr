import { useEffect, useState } from 'react'
import { ArrowRight, Check, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { abilityIds, type AbilityId, type ClassId, type PlayerCharacter } from './types'
import { abilityLabels, abilityModifier, classById, races } from './rules'
import './character-creation-guide.css'

type Scores = Record<AbilityId, number>
type AllocationMode = 'standard' | 'point-buy'
const standardValues = [15, 14, 13, 12, 10, 8] as const
const pointCosts: Record<number, number> = {8:0,9:1,10:2,11:3,12:4,13:5,14:7,15:9}
const emptyBonuses = ():Scores => ({str:0,dex:0,con:0,int:0,wis:0,cha:0})
const fixedRaceBonuses:Record<string,Partial<Scores>> = {
  human:{str:1,dex:1,con:1,int:1,wis:1,cha:1},
  'hill-dwarf':{con:2,wis:1},
  'high-elf':{dex:2,int:1},
  'lightfoot-halfling':{dex:2,cha:1},
  dragonborn:{str:2,cha:1},
  'rock-gnome':{int:2,con:1},
  'half-orc':{str:2,con:1},
  tiefling:{cha:2,int:1},
}
const halfElfAbilities:readonly AbilityId[]=abilityIds.filter(id=>id!=='cha')
export function validHalfElfChoices(choices:readonly string[]):boolean {
  return choices.length===2&&choices[0]!==choices[1]&&choices.every(id=>halfElfAbilities.includes(id as AbilityId))
}
export function supportsRacialAbilityBonuses(raceId:string):boolean {
  return raceId==='half-elf'||Object.hasOwn(fixedRaceBonuses,raceId)
}
/** Optional 2014 race ASIs, kept separate from the base allocation. */
export function racialAbilityBonuses(raceId:string,halfElfChoices:readonly string[]=[]):Scores {
  if(raceId==='half-elf'){
    if(!validHalfElfChoices(halfElfChoices))throw Error('Yarı Elf için Karizma dışından iki farklı nitelik seç.')
    const bonuses={...emptyBonuses(),cha:2}
    for(const id of halfElfChoices)bonuses[id as AbilityId]=1
    return bonuses
  }
  return {...emptyBonuses(),...(fixedRaceBonuses[raceId]||{})}
}
/** Computes a replacement from BASE scores; repeated application never stacks. */
export function applyRacialBonuses(base:Scores,raceId:string,halfElfChoices:readonly string[]=[]):Scores {
  const bonuses=racialAbilityBonuses(raceId,halfElfChoices)
  return Object.fromEntries(abilityIds.map(id=>[id,base[id]+bonuses[id]])) as Scores
}
const priorities: Record<ClassId, readonly AbilityId[]> = {
  barbarian:['str','con','dex','wis','cha','int'],
  bard:['cha','dex','con','wis','int','str'],
  cleric:['wis','con','str','cha','dex','int'],
  druid:['wis','con','dex','int','cha','str'],
  fighter:['str','con','dex','wis','cha','int'],
  monk:['dex','wis','con','str','int','cha'],
  paladin:['str','cha','con','wis','dex','int'],
  ranger:['dex','wis','con','str','int','cha'],
  rogue:['dex','int','con','wis','cha','str'],
  sorcerer:['cha','con','dex','wis','int','str'],
  warlock:['cha','con','dex','wis','int','str'],
  wizard:['int','dex','con','wis','cha','str'],
}

/** The 2014 point-buy table; invalid or fractional scores have no legal cost. */
export function pointBuyCost(score:number):number {
  return Number.isInteger(score) && Object.hasOwn(pointCosts,score) ? pointCosts[score] : Infinity
}
export function totalPointBuyCost(scores:Scores):number {
  return abilityIds.reduce((total,id)=>total+pointBuyCost(scores[id]),0)
}
function isStandardAllocation(scores:Scores) {
  return [...abilityIds.map(id=>scores[id])].sort((a,b)=>b-a).every((value,index)=>value===standardValues[index])
}
function recommendedStandard(classId:ClassId):Scores {
  return Object.fromEntries(priorities[classId].map((ability,index)=>[ability,standardValues[index]])) as Scores
}
function startingStandard(character:PlayerCharacter):Scores {
  return isStandardAllocation(character.scores) ? {...character.scores} : recommendedStandard(character.classId)
}
function startingPointBuy(character:PlayerCharacter):Scores {
  return totalPointBuyCost(character.scores)<=27 ? {...character.scores} : {str:8,dex:8,con:8,int:8,wis:8,cha:8}
}

/** Choosing an occupied value exchanges the two scores; no value is duplicated. */
export function swapStandardAllocation(allocation:Scores,ability:AbilityId,nextValue:number):Scores {
  const next=isStandardAllocation(allocation) ? {...allocation} : recommendedStandard('fighter')
  if(!(standardValues as readonly number[]).includes(nextValue))return next
  const previous=next[ability]
  const owner=abilityIds.find(id=>id!==ability&&next[id]===nextValue)
  next[ability]=nextValue
  if(owner)next[owner]=previous
  return next
}
const signed=(value:number)=>value>=0?'+'+value:String(value)

export default function AbilityScoreBuilder({character,onChange}:{character:PlayerCharacter;onChange:(patch:Partial<PlayerCharacter>)=>void}) {
  const [mode,setMode]=useState<AllocationMode>('standard')
  const [standard,setStandard]=useState<Scores>(()=>startingStandard(character))
  const [pointBuy,setPointBuy]=useState<Scores>(()=>startingPointBuy(character))
  const [applied,setApplied]=useState(false)
  const [includeRace,setIncludeRace]=useState(false)
  const [halfElfChoices,setHalfElfChoices]=useState<[string,string]>(['',''])
  useEffect(()=>{
    setStandard(startingStandard(character));setPointBuy(startingPointBuy(character));setApplied(false);setIncludeRace(false);setHalfElfChoices(['',''])
  },[character.id])
  useEffect(()=>{setIncludeRace(false);setHalfElfChoices(['','']);setApplied(false)},[character.raceId])
  const draft=mode==='standard'?standard:pointBuy
  const spent=totalPointBuyCost(pointBuy),remaining=27-spent
  const definition=classById(character.classId)
  const race=races.find(r=>r.id===character.raceId)
  const supportedRace=supportsRacialAbilityBonuses(character.raceId)
  const validRaceChoice=!includeRace||character.raceId!=='half-elf'||validHalfElfChoices(halfElfChoices)
  const bonuses=includeRace&&supportedRace&&validRaceChoice?racialAbilityBonuses(character.raceId,halfElfChoices):emptyBonuses()
  const finalScores=Object.fromEntries(abilityIds.map(ability=>[ability,draft[ability]+bonuses[ability]])) as Scores
  const changed=abilityIds.some(ability=>finalScores[ability]!==character.scores[ability])
  function chooseMode(next:AllocationMode){setMode(next);setApplied(false)}
  function allocate(ability:AbilityId,value:number) {
    setApplied(false)
    if(mode==='standard'){setStandard(current=>swapStandardAllocation(current,ability,value));return}
    setPointBuy(current=>{
      const candidate={...current,[ability]:value}
      return totalPointBuyCost(candidate)<=27?candidate:current
    })
  }
  function apply(){if(!validRaceChoice)return;onChange({scores:{...finalScores}});setApplied(true)}
  return <section className="ab-builder" data-testid="ability-score-builder" aria-label="Başlangıç niteliklerini dağıt">
    <header className="ab-heading"><SlidersHorizontal size={18}/><div><h3>Altı niteliğini birlikte dağıt.</h3><p>Önce yöntemi seç, değerleri yerleştir ve önizlemeyi kontrol et. <strong>Uygula</strong> demeden karakterin değişmez.</p></div></header>
    <div className="ab-modes" role="group" aria-label="Nitelik belirleme yöntemi">
      <button type="button" aria-pressed={mode==='standard'} onClick={()=>chooseMode('standard')}>Standart dizi</button>
      <button type="button" aria-pressed={mode==='point-buy'} onClick={()=>chooseMode('point-buy')}>27 puan dağıt</button>
    </div>
    {mode==='standard'?<div className="ab-method-description"><p><strong>15 · 14 · 13 · 12 · 10 · 8</strong> değerlerinin her biri bir kez kullanılır. Başka nitelikte kullanılan bir değeri seçersen iki değer yer değiştirir.</p><button type="button" className="ab-reset" onClick={()=>{setStandard(recommendedStandard(character.classId));setApplied(false)}}><RotateCcw size={13}/>{definition.name} için önerilen dağılım</button><small>Bu bir başlangıç önerisidir; örneğin yay kullanan Savaşçıda Çevikliğe öncelik verebilirsin.</small></div>:<div className="ab-method-description"><div className="ab-budget" role="status"><strong>{remaining}</strong><span>puan kaldı <small>{spent} / 27 harcandı</small></span></div><p>Her nitelik 8’den başlar ve 15’e kadar yükseltilebilir. 14 ve 15 daha pahalıdır; bütçeyi aşan seçenekler kapalıdır.</p><details><summary>Puan maliyetleri</summary><div className="ab-cost-table">{Object.entries(pointCosts).map(([score,cost])=><span key={score}><strong>{score}</strong><small>{cost} puan</small></span>)}</div></details><button type="button" className="ab-reset" onClick={()=>{setPointBuy({str:8,dex:8,con:8,int:8,wis:8,cha:8});setApplied(false)}}><RotateCcw size={13}/>Dağılımı 8’e sıfırla</button></div>}
    <div className="ab-racial-bonuses">
      <label className="ab-racial-toggle"><input type="checkbox" checked={includeRace&&supportedRace} disabled={!supportedRace} onChange={event=>{setIncludeRace(event.target.checked);setApplied(false)}}/><span>Bu dağılıma soy artışlarını ekle <small>{race?.name||'Özel soy'} · 2014</small></span></label>
      {!supportedRace?<p>Özel soyunun artışlarını nitelik kutularına elle gir. Bu dağılım onları kendiliğinden eklemez.</p>:includeRace?<p>Artışlar aşağıdaki başlangıç değerlerine bir kez eklenir. Uygula demeden nihai önizlemeyi kontrol et; mevcut karakter değerlerinin üstüne artış yığılmaz.</p>:<p>İşaretlemezsen yalnız başlangıç dağılımı uygulanır. Soy artışlarını daha sonra nitelik kutularından elle verebilirsin.</p>}
      {includeRace&&character.raceId==='half-elf'&&<div className="ab-racial-choices"><p>Karizma +2 sabittir. +1 alacak iki farklı niteliği seç.</p>{[0,1].map(index=><label key={index}><span>{index+1}. ek nitelik</span><select aria-label={`Yarı Elf ${index+1}. ek nitelik`} value={halfElfChoices[index]} onChange={event=>{const value=event.target.value;setHalfElfChoices(current=>index===0?[value,current[1]]:[current[0],value]);setApplied(false)}}><option value="">Bir nitelik seç</option>{halfElfAbilities.map(id=><option key={id} value={id} disabled={halfElfChoices[1-index]===id}>{abilityLabels[id]} +1</option>)}</select></label>)}{!validRaceChoice&&<small role="status">İki farklı nitelik seçilince dağılım uygulanabilir.</small>}</div>}
    </div>
    <div className="ab-allocations">
      {abilityIds.map(ability=><label className="ab-allocation" key={ability}>
        <span>{abilityLabels[ability]}</span>
        <select aria-label={(mode==='standard'?'Standart dizi':'Puan dağıtımı')+' · '+abilityLabels[ability]} value={draft[ability]} onChange={event=>allocate(ability,Number(event.target.value))}>
          {(mode==='standard'?standardValues:[8,9,10,11,12,13,14,15]).map(value=><option key={value} value={value} disabled={mode==='point-buy'&&spent-pointBuyCost(pointBuy[ability])+pointBuyCost(value)>27}>{value}{mode==='point-buy'?` · ${pointBuyCost(value)} puan`:''}</option>)}
        </select>
        {includeRace&&supportedRace&&validRaceChoice&&<em className="ab-racial-addition">{draft[ability]} + {bonuses[ability]} soy = {finalScores[ability]}</em>}
        <small>Nihai değiştirici <strong>{signed(abilityModifier(finalScores[ability]))}</strong></small>
      </label>)}
    </div>
    <div className="ab-preview" data-testid="ability-allocation-preview"><h4>Uygulayınca ne değişecek?</h4><div>{abilityIds.map(ability=><span key={ability} className={character.scores[ability]!==finalScores[ability]?'is-changing':''}><small>{abilityLabels[ability]}</small><b>{character.scores[ability]}</b><ArrowRight size={12}/><strong>{finalScores[ability]}</strong></span>)}</div></div>
    <p className="ab-final-score-note">Seçtiğin sayılar başlangıç dağılımıdır. <strong>Uygula, mevcut altı nihai niteliği önizlemedeki değerlerle değiştirir.</strong> {includeRace&&supportedRace?'İşaretlediğin 2014 soy artışları bu önizlemeye dahil; tekrar elle ekleme. Diğer yetenek veya eşya artışlarını ayrıca kontrol et.':'Soy, yetenek ve eşya artışlarını daha sonra nitelik kutularına elle ekle; burada otomatik eklenmez.'} Mevcut nihai değerlerini başlangıç sayıları olarak kullanıyorsan önceden eklenmiş artışları önce ayır.</p>
    <footer className="ab-apply"><button type="button" data-testid="ability-allocation-apply" onClick={apply} disabled={!validRaceChoice||mode==='point-buy'&&(!Number.isFinite(spent)||spent>27)}>{applied?<Check size={15}/>:<ArrowRight size={15}/>}Dağılımı uygula</button><p role="status">{applied?'Dağılım uygulandı.':!validRaceChoice?'Yarı Elf için iki farklı ek nitelik seç.':changed?'Önizleme hazır; henüz kaydına uygulanmadı.':'Önizleme, mevcut değerlerinle aynı.'} Güncel canın ve kaynakların korunur; Dayanıklılık değişirse azami canı ayrıca kontrol et.</p></footer>
  </section>
}
