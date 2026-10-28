import { classIds, type PlayerSpell } from './types'

export const customSpellStorageKey = 'aruzahr-player-spells-v1'
export type PlayerSpellPack = {version:1;title:string;source:string;spells:PlayerSpell[]}
let builtinPromise:Promise<PlayerSpell[]>|undefined
const obj=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v)
const text=(v:Record<string,unknown>,key:string,max:number)=>{
  if(typeof v[key]!=='string'||(v[key] as string).length>max)throw Error('Büyü alanı geçersiz: '+key)
  return v[key] as string
}
const spellSchoolAliases:Record<string,string>={
  abjuration:'abjuration',koruma:'abjuration',
  conjuration:'conjuration',cagirma:'conjuration',
  divination:'divination',kehanet:'divination',
  enchantment:'enchantment',efsun:'enchantment',
  evocation:'evocation',tezahur:'evocation',evokasyon:'evocation',
  illusion:'illusion',yanilsama:'illusion',
  necromancy:'necromancy',nekromansi:'necromancy',
  transmutation:'transmutation',donusturme:'transmutation',donusum:'transmutation',
}
function normalizeSpellSchool(value:string){
  const key=value.trim().toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i')
  return spellSchoolAliases[key] || value.trim()
}
export function parsePlayerSpellPack(value:unknown):PlayerSpellPack{
  if(!obj(value)||value.version!==1||!Array.isArray(value.spells)||value.spells.length>1200)throw Error('Büyü dosyası sürüm 1 biçiminde ve en fazla 1.200 kayıt olmalı.')
  const ids=new Set<string>()
  const spells:PlayerSpell[]=value.spells.map(raw=>{
    if(!obj(raw))throw Error('Büyü kaydı geçersiz.')
    const id=text(raw,'id',120)
    if(!/^[a-z0-9][a-z0-9-]*$/.test(id)||ids.has(id))throw Error('Büyü kimliği eksik veya yinelenmiş: '+id)
    ids.add(id)
    if(!Number.isInteger(raw.level)||Number(raw.level)<0||Number(raw.level)>9)throw Error('Büyü derecesi 0–9 arasında olmalı.')
    if(!Array.isArray(raw.classes)||!raw.classes.length||raw.classes.length>12||!raw.classes.every(v=>classIds.includes(v as typeof classIds[number])))throw Error('Büyünün sınıf listesi geçersiz: '+id)
    if(!Array.isArray(raw.components)||raw.components.length>3||!raw.components.every(v=>['V','S','M'].includes(v)))throw Error('Büyü bileşenleri V, S veya M olabilir.')
    if(typeof raw.concentration!=='boolean'||typeof raw.ritual!=='boolean')throw Error('Yoğunlaşma ve ritüel alanları açıkça belirtilmeli.')
    const name=text(raw,'name',160),description=text(raw,'description',30000)
    if(!name.trim()||!description.trim())throw Error('Büyünün adı ve açıklaması boş olamaz.')
    return {id,name,description,englishName:text(raw,'englishName',160),level:Number(raw.level),school:normalizeSpellSchool(text(raw,'school',120)),classes:[...new Set(raw.classes)] as PlayerSpell['classes'],castingTime:text(raw,'castingTime',300),range:text(raw,'range',300),components:[...new Set(raw.components)] as string[],material:text(raw,'material',5000),duration:text(raw,'duration',400),concentration:raw.concentration,ritual:raw.ritual,higherLevels:text(raw,'higherLevels',15000),source:text(raw,'source',500)}
  })
  return {version:1,title:text(value,'title',200),source:text(value,'source',1000),spells}
}
export async function loadPlayerSpells():Promise<PlayerSpell[]>{
  if(!builtinPromise)builtinPromise=(async()=>{
    const response=await fetch(new URL('rules/spells-2014-tr.json',document.baseURI),{cache:'no-cache'})
    if(!response.ok)throw Error('Türkçe büyü arşivi açılamadı. Sayfayı yenileyip tekrar dene.')
    const raw=await response.text()
    if(raw.length>5_000_000)throw Error('Büyü arşivi beklenen boyutu aşıyor.')
    const pack=parsePlayerSpellPack(JSON.parse(raw))
    if(pack.spells.length!==319)throw Error('Yerleşik büyü arşivi eksik; 319 SRD büyüsü bekleniyor.')
    return pack.spells
  })().catch(error=>{builtinPromise=undefined;throw error})
  const builtin=await builtinPromise
  const custom=readCustomPlayerSpells()
  const builtinIds=new Set(builtin.map(s=>s.id))
  return [...builtin,...custom.filter(s=>!builtinIds.has(s.id))]
}
export function readCustomPlayerSpells():PlayerSpell[]{
  const raw=localStorage.getItem(customSpellStorageKey)
  if(!raw)return []
  try{return parsePlayerSpellPack(JSON.parse(raw)).spells}
  catch{throw Error('Özel büyü kaydın okunamadı. Kayıt silinmedi; yedeğini içe aktarabilir veya tarayıcıdaki kaydı dışarı alabilirsin.')}
}
export async function importPlayerSpells(raw:string):Promise<number>{
  if(raw.length>5_000_000)throw Error('Büyü dosyası 5 MB’dan küçük olmalı.')
  let decoded:unknown
  try{decoded=JSON.parse(raw)}catch{throw Error('Büyü dosyası geçerli JSON biçiminde değil.')}
  const incoming=parsePlayerSpellPack(decoded),builtins=await builtinSpells()
  const official=new Set(builtins.map(s=>s.id))
  if(incoming.spells.some(s=>official.has(s.id)))throw Error('Yerleşik SRD büyülerinin kimlikleri değiştirilemez. Özel büyülerine ayrı kimlik ver.')
  const merged=new Map(readCustomPlayerSpells().map(s=>[s.id,s]))
  for(const spell of incoming.spells)merged.set(spell.id,{...spell,source:spell.source||'Oyuncunun eklediği özel büyü'})
  if(merged.size>500)throw Error('En fazla 500 özel büyü saklanabilir.')
  const pack:PlayerSpellPack={version:1,title:'Özel büyülerim',source:'Oyuncunun yerel büyü kayıtları',spells:[...merged.values()]}
  localStorage.setItem(customSpellStorageKey,JSON.stringify(pack))
  window.dispatchEvent(new Event('aruzahr-player-spells-change'))
  return incoming.spells.length
}
async function builtinSpells(){
  // loadPlayerSpells validates the immutable source before imported rows merge.
  await loadPlayerSpells()
  return await builtinPromise!
}
export function removeCustomPlayerSpell(id:string){
  const spells=readCustomPlayerSpells().filter(s=>s.id!==id)
  localStorage.setItem(customSpellStorageKey,JSON.stringify({version:1,title:'Özel büyülerim',source:'Oyuncunun yerel büyü kayıtları',spells}))
  window.dispatchEvent(new Event('aruzahr-player-spells-change'))
}
export const customPlayerSpellTemplate:PlayerSpellPack={version:1,title:'Özel büyü dosyam',source:'Kendi oyun notlarım',spells:[{id:'ozel-buyum',name:'Özel Büyüm',englishName:'',level:1,school:'Koruma',classes:['wizard'],castingTime:'1 eylem',range:'30 fit',components:['V','S'],material:'',duration:'1 dakika',concentration:false,ritual:false,description:'Büyünün hedefini, etkisini, zarlarını ve kurtulma koşullarını buraya yaz.',higherLevels:'Üst derecede kullanım değişiyorsa buraya yaz.',source:'Kendi oyun notlarım'}]}
