import { abilityIds, classIds, type AbilityId, type ClassId, type PlayerCharacter, type PlayerSpell, type SkillId } from './types'
import { abilityModifier, armorDefinitions, classById, maxHitPoints, pactMagic, races, skills, spellLimits, spellSlots } from './rules'

export const playerStorageKey='aruzahr-player-characters-v1'
const maxPlayers=20,maxImportBytes=50*1024*1024
export const newPlayerId = () => typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():'player-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12)
export function newPlayerCharacter(classId:ClassId='wizard'):PlayerCharacter {
  const at=new Date().toISOString()
  const scores:Record<AbilityId,number>={str:10,dex:14,con:13,int:12,wis:8,cha:15}
  if(['wizard','fighter','rogue'].includes(classId))Object.assign(scores,{str:10,dex:14,con:13,int:15,wis:12,cha:8})
  if(['barbarian','fighter','paladin'].includes(classId))Object.assign(scores,{str:15,dex:13,con:14,int:8,wis:12,cha:10})
  if(['cleric','druid','ranger','monk'].includes(classId))Object.assign(scores,{str:10,dex:14,con:13,int:8,wis:15,cha:12})
  if(classId==='rogue')Object.assign(scores,{str:8,dex:15,con:13,int:14,wis:12,cha:10})
  const c:PlayerCharacter={version:1,id:newPlayerId(),createdAt:at,updatedAt:at,name:'Yeni Yolcu',playerName:'',classId,level:1,subclass:'',raceId:'human',backgroundId:'custom',origin:'Danstsud',houseId:'',alignment:'Tarafsız',appearance:'',portrait:'',scores,skillProficiencies:[],expertise:[],extraSaveProficiencies:[],languages:'Ortak Dil',tools:'',hp:1,maxHpOverride:null,tempHp:0,hitDiceUsed:0,deathSuccesses:0,deathFailures:0,armorId:'none',shield:false,acBonus:0,initiativeBonus:0,speedOverride:null,inspiration:false,exhaustion:0,conditions:[],attacks:[],equipment:[],coins:{cp:0,sp:0,ep:0,gp:0,pp:0},spellbook:[],preparedSpells:[],usedSpellSlots:Array(9).fill(0),pactSlotsUsed:0,arcanumUsed:[],concentration:'',resources:[],personality:'',ideals:'',bonds:'',flaws:'',backstory:'',notes:''}
  c.hp=maxHitPoints(c)
  return c
}
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v)
const safeId=(v:unknown,label:string)=>{if(typeof v!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,159}$/.test(v))throw Error(label+' kimliği geçersiz.');return v}
const string=(v:unknown,label:string,max=1000,fallback='')=>{if(v===undefined)return fallback;if(typeof v!=='string'||v.length>max)throw Error(label+` metni en fazla ${max} karakter olmalı.`);return v}
const number=(v:unknown,label:string,min:number,max:number,fallback:number,integer=true)=>{if(v===undefined)return fallback;if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v)))throw Error(label+' değeri geçersiz.');return v}
const bool=(v:unknown,label:string,fallback=false)=>{if(v===undefined)return fallback;if(typeof v!=='boolean')throw Error(label+' değeri geçersiz.');return v}
const array=(v:unknown,label:string,max:number)=>{if(v===undefined)return [];if(!Array.isArray(v)||v.length>max)throw Error(label+' listesi geçersiz.');return v}
const ids=(v:unknown,label:string,max:number,allowed?:readonly string[])=>[...new Set(array(v,label,max).map(item=>{const value=safeId(item,label);if(allowed&&!allowed.includes(value))throw Error(label+' seçeneği geçersiz.');return value}))]
const textList=(v:unknown,label:string,max:number,length:number)=>[...new Set(array(v,label,max).map(item=>string(item,label,length)))]
const date=(v:unknown,label:string,fallback:string)=>{const s=string(v,label,40,fallback);if(!Number.isFinite(Date.parse(s)))throw Error(label+' tarihi geçersiz.');return new Date(s).toISOString()}
const itemRecord=(v:unknown,label:string)=>{if(!record(v))throw Error(label+' kaydı geçersiz.');return v}
const uniqueRows=<T extends{id:string}>(rows:T[],label:string)=>{if(new Set(rows.map(r=>r.id)).size!==rows.length)throw Error(label+' listesinde yinelenen kimlik var.');return rows}
export function parsePlayerCharacter(value:unknown):PlayerCharacter {
  if(!record(value)||value.version!==1||typeof value.classId!=='string'||!classIds.includes(value.classId as ClassId))throw Error('D&D 5e 2014 karakter kaydı veya sürümü geçersiz.')
  const c=newPlayerCharacter(value.classId as ClassId),scores=itemRecord(value.scores,'Nitelikler')
  if(typeof value.level!=='number'||abilityIds.some(id=>typeof scores[id]!=='number'))throw Error('Seviye ve altı nihai nitelik değeri eksiksiz olmalı.')
  const portrait=string(value.portrait,'Portre',2*1024*1024)
  if(portrait&&!/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(portrait))throw Error('Portre PNG, JPEG veya WebP biçiminde yerel bir resim olmalı.')
  const used=array(value.usedSpellSlots,'Harcanan büyü yuvaları',9)
  const nullable=(v:unknown,label:string,min:number,max:number)=>v===null||v===undefined?null:number(v,label,min,max,0)
  const parsed:PlayerCharacter={
    version:1,id:safeId(value.id,'Karakter'),createdAt:date(value.createdAt,'Oluşturma',c.createdAt),updatedAt:date(value.updatedAt,'Güncelleme',c.updatedAt),name:string(value.name,'Karakter adı',120),playerName:string(value.playerName,'Oyuncu adı',120),classId:value.classId as ClassId,level:number(value.level,'Seviye',1,20,1),subclass:string(value.subclass,'Alt sınıf',100),raceId:string(value.raceId,'Soy',100,'human'),backgroundId:string(value.backgroundId,'Geçmiş',100,'custom'),origin:string(value.origin,'Memleket',200),houseId:string(value.houseId,'Hane',100),alignment:string(value.alignment,'Yönelim',100),appearance:string(value.appearance,'Görünüş',3000),portrait,
    scores:Object.fromEntries(abilityIds.map(id=>[id,number(scores[id],id,1,30,10)])) as Record<AbilityId,number>,
    skillProficiencies:ids(value.skillProficiencies,'Beceri yetkinliği',18,skills.map(s=>s.id)) as SkillId[],expertise:ids(value.expertise,'Uzmanlık',18,skills.map(s=>s.id)) as SkillId[],extraSaveProficiencies:ids(value.extraSaveProficiencies,'Ek kurtarma yetkinliği',6,abilityIds) as AbilityId[],languages:string(value.languages,'Diller',2000),tools:string(value.tools,'Araçlar',2000),
    hp:number(value.hp,'Mevcut can',0,10000,1),maxHpOverride:nullable(value.maxHpOverride,'Azami can',1,10000),tempHp:number(value.tempHp,'Geçici can',0,10000,0),hitDiceUsed:number(value.hitDiceUsed,'Harcanan can zarı',0,20,0),deathSuccesses:number(value.deathSuccesses,'Ölüm kurtarışı başarısı',0,3,0),deathFailures:number(value.deathFailures,'Ölüm kurtarışı başarısızlığı',0,3,0),armorId:string(value.armorId,'Zırh',100,'none'),shield:bool(value.shield,'Kalkan'),acBonus:number(value.acBonus,'Zırh ilavesi',-20,100,0),initiativeBonus:number(value.initiativeBonus,'İnisiyatif ilavesi',-20,100,0),speedOverride:nullable(value.speedOverride,'Hız',0,1000),inspiration:bool(value.inspiration,'Esin'),exhaustion:number(value.exhaustion,'Tükenmişlik',0,6,0),conditions:textList(value.conditions,'Durumlar',32,120),
    attacks:uniqueRows(array(value.attacks,'Saldırılar',30).map(item=>{const r=itemRecord(item,'Saldırı');const ability=string(r.ability,'Saldırı niteliği',4,'str');if(!abilityIds.includes(ability as AbilityId))throw Error('Saldırı niteliği geçersiz.');return{id:safeId(r.id,'Saldırı'),name:string(r.name,'Saldırı adı',160),ability:ability as AbilityId,proficient:bool(r.proficient,'Silah yetkinliği'),damage:string(r.damage,'Hasar',80),damageType:string(r.damageType,'Hasar türü',100),notes:string(r.notes,'Saldırı notu',3000)}}),'Saldırı'),
    equipment:uniqueRows(array(value.equipment,'Ekipman',150).map(item=>{const r=itemRecord(item,'Ekipman');return{id:safeId(r.id,'Ekipman'),name:string(r.name,'Eşya adı',160),quantity:number(r.quantity,'Eşya adedi',0,100000,1),weight:number(r.weight,'Eşya ağırlığı',0,1000000,0,false),notes:string(r.notes,'Eşya notu',2000)}}),'Ekipman'),
    coins:Object.fromEntries(['cp','sp','ep','gp','pp'].map(id=>[id,number(record(value.coins)?value.coins[id]:undefined,'Para',0,1000000000,0)])) as PlayerCharacter['coins'],
    spellbook:ids(value.spellbook,'Büyü kitabı',1000),preparedSpells:ids(value.preparedSpells,'Hazır büyüler',1000),usedSpellSlots:Array.from({length:9},(_,index)=>number(used[index],'Harcanan büyü yuvası',0,20,0)),pactSlotsUsed:number(value.pactSlotsUsed,'Harcanan Ant yuvası',0,4,0),arcanumUsed:array(value.arcanumUsed,'Gizemli Sır kullanımı',4).map(item=>number(item,'Gizemli Sır derecesi',6,9,6)),concentration:string(value.concentration,'Konsantrasyon',200),
    resources:uniqueRows(array(value.resources,'Yetenek kaynakları',50).map(item=>{const r=itemRecord(item,'Kaynak'),reset=string(r.reset,'Yenilenme',10,'manual');if(!['short','long','manual'].includes(reset))throw Error('Kaynağın yenilenme kuralı geçersiz.');return{id:safeId(r.id,'Kaynak'),name:string(r.name,'Kaynak adı',160),max:number(r.max,'Kaynak azamisi',0,10000,1),used:number(r.used,'Harcanan kaynak',0,10000,0),reset:reset as 'short'|'long'|'manual',...(r.description===undefined?{}:{description:string(r.description,'Kaynak açıklaması',4000)})}}),'Kaynak'),
    personality:string(value.personality,'Kişilik',4000),ideals:string(value.ideals,'İdealler',4000),bonds:string(value.bonds,'Bağlar',4000),flaws:string(value.flaws,'Kusurlar',4000),backstory:string(value.backstory,'Geçmiş öyküsü',20000),notes:string(value.notes,'Özel notlar',30000),
  }
  if(!armorDefinitions.some(a=>a.id===parsed.armorId))throw Error('Zırh seçeneği geçersiz.')
  if(!races.some(r=>r.id===parsed.raceId))throw Error('Soy seçeneği geçersiz; özel halk için custom kullan.')
  parsed.arcanumUsed=[...new Set(parsed.arcanumUsed)]
  return parsed
}
export function importPlayerFile(text:string):PlayerCharacter[] {
  if(typeof text!=='string'||new TextEncoder().encode(text).byteLength>maxImportBytes)throw Error('Karakter dosyası en fazla 50 MB olabilir.')
  let raw:unknown
  try {raw=JSON.parse(text)} catch {throw Error('Dosya geçerli bir JSON karakter yedeği değil.')}
  const rows=record(raw)&&raw.format==='aruzahr-characters'&&raw.version===1?array(raw.characters,'Karakterler',maxPlayers):[raw]
  return uniqueRows(rows.map(parsePlayerCharacter),'Karakter')
}
export const exportPlayerCharacter=(c:PlayerCharacter)=>JSON.stringify(parsePlayerCharacter(c),null,2)
export function exportPlayers(characters:PlayerCharacter[]) {if(characters.length>maxPlayers)throw Error('Bir yedekte en fazla 20 karakter olabilir.');const encoded=JSON.stringify({format:'aruzahr-characters',version:1,exportedAt:new Date().toISOString(),characters:uniqueRows(characters.map(parsePlayerCharacter),'Karakter')},null,2);if(new TextEncoder().encode(encoded).byteLength>maxImportBytes)throw Error('Karakter yedeği 50 MB sınırını aşıyor; portreleri küçült veya ayrı ayrı indir.');return encoded}
export function loadPlayers():PlayerCharacter[] {
  if(typeof localStorage==='undefined')return []
  const raw=localStorage.getItem(playerStorageKey)
  if(!raw)return []
  try {return importPlayerFile(raw)} catch {throw Error('Bu tarayıcıdaki karakter kaydı okunamadı. Mevcut veri silinmedi; dosya yedeğini aç veya kayıt alanını incele.')}
}
export function savePlayers(characters:PlayerCharacter[]) {
  if(typeof localStorage==='undefined')throw Error('Bu ortamda tarayıcı kaydı kullanılamıyor.')
  const encoded=exportPlayers(characters)
  try {localStorage.setItem(playerStorageKey,encoded)}catch{throw Error('Karakterler bu tarayıcıya kaydedilemedi. Yer aç veya JSON yedeğini indir; ekrandaki kayıt otomatik silinmedi.')}
}
export function shortRest(c:PlayerCharacter):PlayerCharacter {return {...c,updatedAt:new Date().toISOString(),pactSlotsUsed:0,resources:c.resources.map(r=>r.reset==='short'?{...r,used:0}:r)}}
export function longRest(c:PlayerCharacter,options:{foodAndWater?:boolean}={}):PlayerCharacter {
  if(c.deathFailures>=3||c.exhaustion>=6)throw Error('Ölü karakter uzun dinlenmeyle dirilmez. Önce DM ile ölüm durumunu çöz.')
  if(c.hp<=0)throw Error('2014 uzun dinlenmesi başlangıcında en az 1 can gerekir; önce karakterin durumunu çöz.')
  const rested={...c,exhaustion:options.foodAndWater?Math.max(0,c.exhaustion-1):c.exhaustion}
  return {...rested,updatedAt:new Date().toISOString(),hp:maxHitPoints(rested),tempHp:0,hitDiceUsed:Math.max(0,c.hitDiceUsed-Math.max(1,Math.floor(c.level/2))),usedSpellSlots:Array(9).fill(0),pactSlotsUsed:0,arcanumUsed:[],deathSuccesses:0,deathFailures:0,concentration:'',resources:c.resources.map(r=>r.reset==='short'||r.reset==='long'?{...r,used:0}:r)}
}
export function useHitDie(c:PlayerCharacter,roll:number):PlayerCharacter {
  const die=classById(c.classId).hitDie
  if(!Number.isInteger(roll)||roll<1||roll>die)throw Error(`Can zarı sonucu 1–${die} arasında olmalı.`)
  if(c.hitDiceUsed>=c.level)throw Error('Kullanılabilir can zarı kalmadı.')
  if(c.deathFailures>=3||c.exhaustion>=6)throw Error('Ölü karakter can zarıyla dirilmez. Önce DM ile ölüm durumunu çöz.')
  if(c.hp<=0)throw Error('Önce karakterin bilinç ve can durumunu çöz; can zarıyla otomatik diriltilmez.')
  return {...c,updatedAt:new Date().toISOString(),hitDiceUsed:c.hitDiceUsed+1,hp:Math.min(maxHitPoints(c),c.hp+Math.max(0,roll+abilityModifier(c.scores.con)))}
}
export function spendSpellSlot(c:PlayerCharacter,grade:number):PlayerCharacter {
  if(!Number.isInteger(grade)||grade<1||grade>9)throw Error('Büyü derecesi 1–9 arasında olmalı.')
  const max=spellSlots(c)[grade-1],used=c.usedSpellSlots[grade-1]||0
  if(used>=max)throw Error('Bu derecede kullanılabilir büyü yuvası yok.')
  const next=[...c.usedSpellSlots];next[grade-1]=used+1
  return {...c,updatedAt:new Date().toISOString(),usedSpellSlots:next}
}
export function spendPactSlot(c:PlayerCharacter):PlayerCharacter {
  if(c.pactSlotsUsed>=pactMagic(c).slots)throw Error('Kullanılabilir Ant Büyüsü yuvası yok.')
  return {...c,updatedAt:new Date().toISOString(),pactSlotsUsed:c.pactSlotsUsed+1}
}
export function spendArcanum(c:PlayerCharacter,grade:number):PlayerCharacter {
  if(!spellLimits(c).arcanumLevels.includes(grade))throw Error('Bu derecedeki Gizemli Sır henüz açılmadı.')
  if(c.arcanumUsed.includes(grade))throw Error('Bu Gizemli Sır bugün kullanıldı.')
  return {...c,updatedAt:new Date().toISOString(),arcanumUsed:[...c.arcanumUsed,grade]}
}
export function applyDamage(c:PlayerCharacter,damage:number):PlayerCharacter {
  if(!Number.isInteger(damage)||damage<0||damage>100000)throw Error('Hasar sıfır veya pozitif tam sayı olmalı.')
  const absorbed=Math.min(c.tempHp,damage)
  const remaining=damage-absorbed,hp=Math.max(0,c.hp-remaining)
  const massive=remaining>0&&remaining-c.hp>=maxHitPoints(c)
  const failed=massive?3:c.hp===0&&damage>0?Math.min(3,(c.deathSuccesses>=3?0:c.deathFailures)+1):c.deathFailures
  return {...c,updatedAt:new Date().toISOString(),tempHp:c.tempHp-absorbed,hp,deathFailures:failed,...(c.hp===0&&damage>0&&c.deathSuccesses>=3?{deathSuccesses:0}:{}),...(hp===0&&damage>0?{concentration:''}:{})}
}
export function heal(c:PlayerCharacter,amount:number):PlayerCharacter {
  if(!Number.isInteger(amount)||amount<0||amount>100000)throw Error('İyileştirme sıfır veya pozitif tam sayı olmalı.')
  if(c.deathFailures>=3||c.exhaustion>=6)throw Error('Ölü karakter normal iyileştirmeyle dirilmez. Önce DM ile ölüm durumunu çöz.')
  const hp=Math.min(maxHitPoints(c),c.hp+amount)
  return {...c,updatedAt:new Date().toISOString(),hp,...(hp>0?{deathSuccesses:0,deathFailures:0}:{})}
}
export function knownSpellRows(c:PlayerCharacter,all:PlayerSpell[]) {const ids=new Set(c.spellbook);return all.filter(s=>ids.has(s.id))}
