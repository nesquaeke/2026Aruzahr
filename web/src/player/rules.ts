import { abilityIds, type AbilityId, type ClassId, type PlayerCharacter, type PlayerSpell, type SkillId } from './types'

export const abilityLabels: Record<AbilityId,string> = {str:'Kuvvet',dex:'Çeviklik',con:'Dayanıklılık',int:'Zekâ',wis:'Bilgelik',cha:'Karizma'}
export const skills: {id:SkillId;name:string;ability:AbilityId}[] = [
  {id:'acrobatics',name:'Akrobasi',ability:'dex'}, {id:'animal-handling',name:'Hayvanlarla İletişim',ability:'wis'},
  {id:'arcana',name:'Büyü Bilgisi',ability:'int'}, {id:'athletics',name:'Atletizm',ability:'str'},
  {id:'deception',name:'Aldatma',ability:'cha'}, {id:'history',name:'Tarih',ability:'int'},
  {id:'insight',name:'Sezgi',ability:'wis'}, {id:'intimidation',name:'Gözdağı',ability:'cha'},
  {id:'investigation',name:'Araştırma',ability:'int'}, {id:'medicine',name:'Tıp',ability:'wis'},
  {id:'nature',name:'Doğa',ability:'int'}, {id:'perception',name:'Algı',ability:'wis'},
  {id:'performance',name:'Performans',ability:'cha'}, {id:'persuasion',name:'İkna',ability:'cha'},
  {id:'religion',name:'Din',ability:'int'}, {id:'sleight-of-hand',name:'El Çabukluğu',ability:'dex'},
  {id:'stealth',name:'Gizlenme',ability:'dex'}, {id:'survival',name:'Hayatta Kalma',ability:'wis'},
]
export type ClassDefinition = {id:ClassId;name:string;hitDie:number;saves:AbilityId[];skillChoices:SkillId[];skillCount:number;spellAbility:AbilityId|null;casting:'none'|'full'|'half'|'pact';description:string;armor:string;weapons:string}
export const classDefinitions: ClassDefinition[] = [
  {id:'barbarian',name:'Barbar',hitDie:12,saves:['str','con'],skillChoices:['animal-handling','athletics','intimidation','nature','perception','survival'],skillCount:2,spellAbility:null,casting:'none',description:'Öfke, dayanıklılık ve yakın dövüş. Zırhsız Savunma: 10 + Çeviklik + Dayanıklılık; kalkan kullanılabilir.',armor:'Hafif ve orta zırh, kalkan',weapons:'Basit ve askerî silahlar'},
  {id:'bard',name:'Ozan',hitDie:8,saves:['dex','cha'],skillChoices:skills.map(s=>s.id),skillCount:3,spellAbility:'cha',casting:'full',description:'Söz, müzik ve esinle büyü yapan gezgin. Bildiği büyüler sınırlıdır; ayrıca günlük hazırlık yapmaz.',armor:'Hafif zırh',weapons:'Basit silahlar, el arbaleti, uzun kılıç, meç, kısa kılıç'},
  {id:'cleric',name:'Rahip',hitDie:8,saves:['wis','cha'],skillChoices:['history','insight','medicine','persuasion','religion'],skillCount:2,spellAbility:'wis',casting:'full',description:'İnancı aracılığıyla büyü yapar. Her gün Rahip seviyesi + Bilgelik değiştiricisi kadar büyü hazırlar; alan büyüleri bu sayıya ek olabilir.',armor:'Hafif ve orta zırh, kalkan; Yaşam Alanı ağır zırh verir',weapons:'Basit silahlar'},
  {id:'druid',name:'Druid',hitDie:8,saves:['int','wis'],skillChoices:['arcana','animal-handling','insight','medicine','nature','perception','religion','survival'],skillCount:2,spellAbility:'wis',casting:'full',description:'Doğanın büyücüsü; günlük büyülerini Bilgelik ve seviyesine göre hazırlar. Yabanî Biçim ayrı bir sınıf yeteneğidir.',armor:'Hafif ve orta zırh, kalkan; 2014 geleneğinde metal zırh ve kalkan kullanılmaz',weapons:'Sopa, hançer, cirit, topuz, çeyrek asa, pala, orak, sapan, mızrak, dart'},
  {id:'fighter',name:'Savaşçı',hitDie:10,saves:['str','con'],skillChoices:['acrobatics','animal-handling','athletics','history','insight','intimidation','perception','survival'],skillCount:2,spellAbility:null,casting:'none',description:'Silah ve zırh eğitiminin ustası. Büyülü Şövalye seçilirse 3. seviyeden itibaren sınırlı büyü kullanır.',armor:'Bütün zırhlar ve kalkan',weapons:'Basit ve askerî silahlar'},
  {id:'monk',name:'Keşiş',hitDie:8,saves:['str','dex'],skillChoices:['acrobatics','athletics','history','insight','religion','stealth'],skillCount:2,spellAbility:null,casting:'none',description:'Bedeni ve disipliniyle savaşır. Zırh ve kalkan yokken Zırh Sınıfı 10 + Çeviklik + Bilgelik olur.',armor:'Zırh veya kalkan yetkinliği yok',weapons:'Basit silahlar ve kısa kılıç'},
  {id:'paladin',name:'Paladin',hitDie:10,saves:['wis','cha'],skillChoices:['athletics','insight','intimidation','medicine','persuasion','religion'],skillCount:2,spellAbility:'cha',casting:'half',description:'Yeminli savaşçı; büyü kullanımı 2. seviyede başlar. Hazırlık sayısı yarım Paladin seviyesi + Karizma değiştiricisidir.',armor:'Bütün zırhlar ve kalkan',weapons:'Basit ve askerî silahlar'},
  {id:'ranger',name:'Kolcu',hitDie:10,saves:['str','dex'],skillChoices:['animal-handling','athletics','insight','investigation','nature','perception','stealth','survival'],skillCount:3,spellAbility:'wis',casting:'half',description:'İz sürme ve silah becerisini doğa büyüsüyle birleştirir. 2014 kurallarında 2. seviyeden başlayarak sınırlı sayıda büyü bilir; günlük hazırlık yapmaz.',armor:'Hafif ve orta zırh, kalkan',weapons:'Basit ve askerî silahlar'},
  {id:'rogue',name:'Düzenbaz',hitDie:8,saves:['dex','int'],skillChoices:['acrobatics','athletics','deception','insight','intimidation','investigation','perception','performance','persuasion','sleight-of-hand','stealth'],skillCount:4,spellAbility:null,casting:'none',description:'Gizli saldırı, uzmanlık ve çeviklik. Büyülü Düzenbaz seçilirse 3. seviyeden itibaren Zekâ ile büyü kullanır.',armor:'Hafif zırh',weapons:'Basit silahlar, el arbaleti, uzun kılıç, meç, kısa kılıç'},
  {id:'sorcerer',name:'Efsuncu',hitDie:6,saves:['con','cha'],skillChoices:['arcana','deception','insight','intimidation','persuasion','religion'],skillCount:2,spellAbility:'cha',casting:'full',description:'Doğuştan gelen büyü gücü, sınırlı bilinen büyüler ve 2. seviyeden itibaren Büyü Puanları. Günlük hazırlık yapmaz.',armor:'Zırh veya kalkan yetkinliği yok',weapons:'Hançer, dart, sapan, çeyrek asa, hafif arbalet'},
  {id:'warlock',name:'Ant Büyücüsü',hitDie:8,saves:['wis','cha'],skillChoices:['arcana','deception','history','intimidation','investigation','nature','religion'],skillCount:2,spellAbility:'cha',casting:'pact',description:'Bir varlıkla yaptığı antın gücünü kullanır. Ant Büyüsü yuvaları kısa dinlenmede yenilenir; 6–9. derece Gizemli Sırlar ayrı günlük kullanımlardır.',armor:'Hafif zırh',weapons:'Basit silahlar'},
  {id:'wizard',name:'Büyücü',hitDie:6,saves:['int','wis'],skillChoices:['arcana','history','insight','investigation','medicine','religion'],skillCount:2,spellAbility:'int',casting:'full',description:'Büyü kitabına dayanır. 1. seviyede altı büyü, sonraki her seviyede iki yeni büyü öğrenir; bulunan büyüler ayrıca eklenebilir. Günlük hazırlık: seviye + Zekâ değiştiricisi.',armor:'Zırh veya kalkan yetkinliği yok',weapons:'Hançer, dart, sapan, çeyrek asa, hafif arbalet'},
]
export const classes = classDefinitions
export const classById = (id:string) => classDefinitions.find(c=>c.id===id) || classDefinitions[11]
export const subclasses: Record<ClassId,{id:string;name:string;level:number;description:string}[]> = {
  barbarian:[{id:'berserker',name:'Berserker Yolu',level:3,description:'Öfkeyi gözü kara saldırılara dönüştüren yol.'}],
  bard:[{id:'lore',name:'Bilgelik Okulu',level:3,description:'Ek yetkinlikler ve 6. seviyede iki Ek Büyülü Sır.'}],
  cleric:[{id:'life',name:'Yaşam Alanı',level:1,description:'Şifacılık ve ağır zırh eğitimi; alan büyüleri ayrıca daima hazırdır.'}],
  druid:[{id:'land',name:'Toprak Çemberi',level:2,description:'Seçilen araziye bağlı çember büyüleri ve ek bir basit büyü; arazi büyülerini kâğıda ayrıca kaydet.'}],
  fighter:[{id:'champion',name:'Şampiyon',level:3,description:'Silah ustalığı ve gelişmiş kritik vuruş.'},{id:'eldritch-knight',name:'Büyülü Şövalye',level:3,description:'Büyücü listesinden sınırlı büyü öğrenir; çoğu büyüsü Koruma veya Çağrışım okulundandır.'}],
  monk:[{id:'open-hand',name:'Açık El Yolu',level:3,description:'Silahsız dövüş ve beden kontrolü.'}],
  paladin:[{id:'devotion',name:'Adanmışlık Yemini',level:3,description:'Yemin büyüleri ayrıca daima hazırdır; yeteneklerini kaynak bölümüne kaydet.'}],
  ranger:[{id:'hunter',name:'Avcı',level:3,description:'Avına göre dövüş üstünlükleri seçer.'}],
  rogue:[{id:'thief',name:'Hırsız',level:3,description:'Hızlı eller, tırmanış ve eşya kullanımı.'},{id:'arcane-trickster',name:'Büyülü Düzenbaz',level:3,description:'Büyücü listesinden büyü öğrenir; çoğu Efsunlama veya Yanılsama okulundandır. Büyücü Eli zorunlu basit büyülerindan biridir.'}],
  sorcerer:[{id:'draconic',name:'Ejderha Soyu',level:1,description:'Her seviyede +1 azami can; zırh yokken 13 + Çeviklik Zırh Sınıfı.'}],
  warlock:[{id:'fiend',name:'İblis Efendi',level:1,description:'Koruyucunun genişlettiği büyüler öğrenme seçenekleridir; otomatik bilinen veya hazır büyüler değildir.'}],
  wizard:[{id:'evocation',name:'Çağrışım Okulu',level:2,description:'Yıkıcı ve enerjisel büyülerde uzmanlaşır.'}],
}
export const races = [
  {id:'human',name:'İnsan',speed:30,description:'Çeşitli halklar. 2014 standart insanında altı niteliğe +1; nihai değerlerini elle uygula.'},
  {id:'hill-dwarf',name:'Tepe Cücesi',speed:25,description:'Dayanıklılık +2, Bilgelik +1; her seviyede +1 azami can. Nitelik artışlarını nihai değerlere elle uygula.'},
  {id:'high-elf',name:'Yüksek Elf',speed:30,description:'Çeviklik +2, Zekâ +1; Zekâ ile kullanılan bir Büyücü basit büyüsü ve ek dil. Soy büyüsünü not ve kaynak bölümünde ayrıca takip et; sınıf büyü listesine otomatik eklenmez.'},
  {id:'lightfoot-halfling',name:'Hafifayak Buçukluk',speed:25,description:'Çeviklik +2, Karizma +1. Nitelik artışları nihai değerlere elle uygulanır.'},
  {id:'dragonborn',name:'Ejderdoğan',speed:30,description:'Kuvvet +2, Karizma +1; seçilen soya bağlı nefes ve direnç.'},
  {id:'rock-gnome',name:'Kaya Gnomu',speed:25,description:'Zekâ +2, Dayanıklılık +1; zanaat ve aygıt geleneği.'},
  {id:'half-elf',name:'Yarı Elf',speed:30,description:'Karizma +2, iki ayrı niteliğe +1; seçilen iki beceride yetkinlik.'},
  {id:'half-orc',name:'Yarı Ork',speed:30,description:'Kuvvet +2, Dayanıklılık +1; Gözdağı yetkinliği, dirençli beden ve yabanî kritik vuruş.'},
  {id:'tiefling',name:'Tiefling',speed:30,description:'Karizma +2, Zekâ +1; ateş direnci ve soy büyüleri. Ek büyüleri kişisel kayıt olarak ekle.'},
  {id:'custom',name:'Özel soy / halk',speed:30,description:'Aruzahr soyunu ve DM tarafından verilen özelliklerini notlara yaz; hareket hızını elle değiştirebilirsin.'},
]
export const backgrounds = [
  {id:'acolyte',name:'Tapınak Öğrencisi',skills:['insight','religion'] as SkillId[],description:'Sezgi ve Din; iki dil, dinî topluluğun desteği.'},
  {id:'custom',name:'Özel geçmiş',skills:[] as SkillId[],description:'2014 özel geçmiş kuralıyla iki beceri, toplam iki araç/dil seç; ayrıntıları DM ile belirle.'},
]
export const raceDefinitions = races
export const backgroundDefinitions = backgrounds
export const armorDefinitions: {id:string;name:string;baseAC:number;kind:'none'|'light'|'medium'|'heavy';dexCap:number|null;stealthDisadvantage?:boolean;strength?:number}[] = [
  {id:'none',name:'Zırhsız',baseAC:10,kind:'none',dexCap:null}, {id:'padded',name:'Dolgulu Zırh',baseAC:11,kind:'light',dexCap:null,stealthDisadvantage:true},
  {id:'leather',name:'Deri Zırh',baseAC:11,kind:'light',dexCap:null}, {id:'studded-leather',name:'Çivili Deri',baseAC:12,kind:'light',dexCap:null},
  {id:'hide',name:'Post Zırh',baseAC:12,kind:'medium',dexCap:2}, {id:'chain-shirt',name:'Zincir Gömlek',baseAC:13,kind:'medium',dexCap:2},
  {id:'scale-mail',name:'Pul Zırh',baseAC:14,kind:'medium',dexCap:2,stealthDisadvantage:true}, {id:'breastplate',name:'Göğüslük',baseAC:14,kind:'medium',dexCap:2},
  {id:'half-plate',name:'Yarım Plaka',baseAC:15,kind:'medium',dexCap:2,stealthDisadvantage:true},
  {id:'ring-mail',name:'Halka Zırh',baseAC:14,kind:'heavy',dexCap:0,stealthDisadvantage:true}, {id:'chain-mail',name:'Zincir Zırh',baseAC:16,kind:'heavy',dexCap:0,stealthDisadvantage:true,strength:13},
  {id:'splint',name:'Şerit Zırh',baseAC:17,kind:'heavy',dexCap:0,stealthDisadvantage:true,strength:15}, {id:'plate',name:'Tam Plaka',baseAC:18,kind:'heavy',dexCap:0,stealthDisadvantage:true,strength:15},
]
export const abilityModifier = (score:number) => Math.floor((score-10)/2)
export const proficiencyBonus = (level:number) => 2 + Math.floor((Math.max(1,Math.min(20,level))-1)/4)
export function skillBonus(c:PlayerCharacter,id:SkillId) {
  const skill=skills.find(s=>s.id===id)!
  const proficient=c.skillProficiencies.includes(id),expert=c.expertise.includes(id)&&proficient
  const remarkable=c.classId==='fighter'&&c.subclass==='champion'&&c.level>=7&&['str','dex','con'].includes(skill.ability)
  const half=proficient?0:remarkable?Math.ceil(proficiencyBonus(c.level)/2):c.classId==='bard'&&c.level>=2?Math.floor(proficiencyBonus(c.level)/2):0
  return abilityModifier(c.scores[skill.ability])+(expert?2:proficient?1:0)*proficiencyBonus(c.level)+half
}
export function savingThrow(c:PlayerCharacter,id:AbilityId) {
  const all=c.classId==='monk'&&c.level>=14
  return abilityModifier(c.scores[id])+((all||classById(c.classId).saves.includes(id)||c.extraSaveProficiencies.includes(id))?proficiencyBonus(c.level):0)
}
export function armorClass(c:PlayerCharacter) {
  const armor=armorDefinitions.find(a=>a.id===c.armorId)||armorDefinitions[0]
  const dex=abilityModifier(c.scores.dex)
  let base=armor.baseAC+(armor.kind==='heavy'?0:armor.dexCap===null?dex:Math.min(dex,armor.dexCap))
  if(armor.kind==='none') {
    if(c.classId==='barbarian')base=Math.max(base,10+dex+abilityModifier(c.scores.con))
    if(c.classId==='monk'&&!c.shield)base=Math.max(base,10+dex+abilityModifier(c.scores.wis))
    if(c.classId==='sorcerer'&&c.subclass==='draconic')base=Math.max(base,13+dex)
  }
  return base+(c.shield?2:0)+c.acBonus
}
export function maxHitPoints(c:PlayerCharacter) {
  const die=classById(c.classId).hitDie,con=abilityModifier(c.scores.con)
  const racial=c.raceId==='hill-dwarf'?c.level:0,draconic=c.classId==='sorcerer'&&c.subclass==='draconic'?c.level:0
  const base=c.maxHpOverride??(Math.max(1,die+con)+(c.level-1)*Math.max(1,Math.floor(die/2)+1+con)+racial+draconic)
  return c.exhaustion>=4?Math.floor(base/2):base
}
const fullSlots = [
  [],[2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],
  [4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],
  [4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1],
]
export const isThirdCaster = (c:PlayerCharacter) => c.level>=3&&((c.classId==='fighter'&&c.subclass==='eldritch-knight')||(c.classId==='rogue'&&c.subclass==='arcane-trickster'))
export function spellSlots(c:PlayerCharacter):number[] {
  const definition=classById(c.classId)
  const effective=definition.casting==='full'?c.level:definition.casting==='half'&&c.level>=2?Math.ceil(c.level/2):isThirdCaster(c)?Math.ceil(c.level/3):0
  return Array.from({length:9},(_,i)=>fullSlots[effective]?.[i]||0)
}
export function pactMagic(c:PlayerCharacter) {
  if(c.classId!=='warlock')return {slots:0,level:0}
  return {slots:c.level===1?1:c.level<11?2:c.level<17?3:4,level:Math.min(5,Math.ceil(c.level/2))}
}
const bardKnown=[0,4,5,6,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22]
const sorcererKnown=[0,2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15]
const warlockKnown=[0,2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15]
const rangerKnown=[0,0,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11]
const thirdKnown=[0,0,0,3,4,4,4,5,6,6,7,8,8,9,10,10,11,11,11,12,13]
export type SpellLimits={mode:'none'|'prepared'|'known'|'book'|'pact';ability:AbilityId|null;maxLevel:number;cantrips:number;known:number|null;prepared:number|null;minimumBook:number;arcanumLevels:number[]}
export function spellLimits(c:PlayerCharacter):SpellLimits {
  const cls=classById(c.classId),third=isThirdCaster(c),pact=pactMagic(c),slots=spellSlots(c)
  const ability=third?'int':cls.spellAbility
  const active=cls.casting==='full'||cls.casting==='pact'||(cls.casting==='half'&&c.level>=2)||third
  const maxLevel=pact.level||slots.reduce((highest,count,index)=>count?index+1:highest,0)
  const lowCantrips=c.level>=10?4:c.level>=4?3:2,highCantrips=c.level>=10?5:c.level>=4?4:3
  const cantrips=!active?0:third?(c.classId==='rogue'?3:2)+(c.level>=10?1:0):c.classId==='sorcerer'?highCantrips+1:['cleric','wizard'].includes(c.classId)?highCantrips:['paladin','ranger'].includes(c.classId)?0:lowCantrips+(c.classId==='druid'&&c.subclass==='land'&&c.level>=2?1:0)
  const mode:SpellLimits['mode']=!active?'none':c.classId==='wizard'?'book':c.classId==='warlock'?'pact':['cleric','druid','paladin'].includes(c.classId)?'prepared':'known'
  const prepared=mode==='book'||mode==='prepared'?Math.max(1,(c.classId==='paladin'?Math.floor(c.level/2):c.level)+abilityModifier(c.scores[ability!])):null
  const known=third?thirdKnown[c.level]:c.classId==='bard'?bardKnown[c.level]+(c.subclass==='lore'&&c.level>=6?2:0):c.classId==='sorcerer'?sorcererKnown[c.level]:c.classId==='ranger'?rangerKnown[c.level]:c.classId==='warlock'?warlockKnown[c.level]:null
  return {mode,ability:active?ability:null,maxLevel,cantrips,known,prepared,minimumBook:c.classId==='wizard'?6+2*(c.level-1):0,arcanumLevels:c.classId==='warlock'?[6,7,8,9].filter(l=>c.level>=l*2-1):[]}
}
/** These subclass spells are always prepared and do not consume preparation. */
export function alwaysPreparedSpellIds(c:PlayerCharacter):string[] {
  const life:[number,string[]][]=[[1,['bless','cure-wounds']],[3,['lesser-restoration','spiritual-weapon']],[5,['beacon-of-hope','revivify']],[7,['death-ward','guardian-of-faith']],[9,['mass-cure-wounds','raise-dead']]]
  const devotion:[number,string[]][]=[[3,['protection-from-evil-and-good','sanctuary']],[5,['lesser-restoration','zone-of-truth']],[9,['beacon-of-hope','dispel-magic']],[13,['freedom-of-movement','guardian-of-faith']],[17,['commune','flame-strike']]]
  const rows=c.classId==='cleric'&&c.subclass==='life'?life:c.classId==='paladin'&&c.subclass==='devotion'?devotion:[]
  return rows.filter(([level])=>c.level>=level).flatMap(([,spells])=>spells)
}
export function expandedSpellIds(c:PlayerCharacter):string[] {
  if(c.classId!=='warlock'||c.subclass!=='fiend')return []
  const spells:[number,string[]][]=[[1,['burning-hands','command']],[2,['blindness-deafness','scorching-ray']],[3,['fireball','stinking-cloud']],[4,['fire-shield','wall-of-fire']],[5,['flame-strike','hallow']]]
  return spells.filter(([grade])=>grade<=spellLimits(c).maxLevel).flatMap(([,ids])=>ids)
}
export function canSelectSpell(c:PlayerCharacter,spell:PlayerSpell) {
  const limits=spellLimits(c)
  if(limits.mode==='none')return false
  if(alwaysPreparedSpellIds(c).includes(spell.id))return true
  const list=isThirdCaster(c)?'wizard':c.classId
  const secrets=c.classId==='bard'&&(c.level>=10||(c.subclass==='lore'&&c.level>=6))
  if(!spell.classes.includes(list)&&!expandedSpellIds(c).includes(spell.id)&&!secrets)return false
  if(spell.level===0)return limits.cantrips>0
  return spell.level<=limits.maxLevel||limits.arcanumLevels.includes(spell.level)
}
/** Innate casting and feat/invocation rituals need their own source/ability;
 * this helper covers only ritual casting granted by the selected base class. */
export function canRitualCast(c:PlayerCharacter,spell:PlayerSpell) {
  if(!spell.ritual||spell.level===0||!canSelectSpell(c,spell))return false
  if(c.classId==='wizard'||c.classId==='bard')return c.spellbook.includes(spell.id)
  if(c.classId==='cleric'||c.classId==='druid')return c.preparedSpells.includes(spell.id)||alwaysPreparedSpellIds(c).includes(spell.id)
  return false
}
export function spellChoiceCounts(c:PlayerCharacter,allSpells:PlayerSpell[]) {
  const limits=spellLimits(c),rows=c.spellbook.map(id=>allSpells.find(s=>s.id===id)).filter((s):s is PlayerSpell=>!!s)
  const secretsLimit=c.classId==='bard'?(c.level>=10?2:0)+(c.level>=14?2:0)+(c.level>=18?2:0)+(c.subclass==='lore'&&c.level>=6?2:0):0
  const selectedCantrips=rows.filter(s=>s.level===0)
  // A cantrip learned through Magical Secrets consumes a Spells Known choice,
  // rather than one of the separate Cantrips Known entries on the bard table.
  const secretCantrips=secretsLimit?Math.max(selectedCantrips.filter(s=>!s.classes.includes('bard')).length,selectedCantrips.length-limits.cantrips):0
  return {cantrips:selectedCantrips.length-secretCantrips,known:rows.filter(s=>s.level>0&&(c.classId!=='warlock'||s.level<=5)).length+secretCantrips,secrets:rows.filter(s=>s.level>0&&!s.classes.includes('bard')).length*(c.classId==='bard'?1:0)+secretCantrips,secretsLimit}
}
export function spellSelectionWarnings(c:PlayerCharacter,allSpells:PlayerSpell[]=[]) {
  const limits=spellLimits(c),warnings:string[]=[],selected=c.spellbook.map(id=>allSpells.find(s=>s.id===id)).filter((s):s is PlayerSpell=>!!s)
  const counts=spellChoiceCounts(c,allSpells)
  if(allSpells.length)for(const id of new Set([...c.spellbook,...c.preparedSpells]))if(!allSpells.some(s=>s.id===id))warnings.push(`${id}: bu büyünün açıklaması yüklenen arşivde bulunamadı. Kayıt korunuyor; ilgili özel büyü dosyasını yeniden ekle.`)
  if(counts.cantrips>limits.cantrips)warnings.push(`${counts.cantrips} basit büyü seçili; bu sınıf/seviye ${limits.cantrips} basit büyü bilir. Soy veya yetenekten gelen ek basit büyüleri notlara yaz.`)
  if(limits.known!==null&&counts.known>limits.known)warnings.push(`Bu sınıf/seviye ${limits.known} büyü bilir; ${counts.known} büyü seçili.`)
  const prepared=c.preparedSpells.map(id=>allSpells.find(s=>s.id===id)).filter((s):s is PlayerSpell=>!!s&&s.level>0&&!alwaysPreparedSpellIds(c).includes(s.id))
  if(limits.prepared!==null&&prepared.length>limits.prepared)warnings.push(`${prepared.length} büyü hazır; normal hazırlık sınırı ${limits.prepared}. Alan/yemin büyüleri ayrıca kaydedilebilir.`)
  if(limits.prepared===null&&c.preparedSpells.length)warnings.push('Bu sınıf günlük büyü hazırlamaz; bilinen büyülerini doğrudan kullanır.')
  for(const spell of selected)if(!canSelectSpell(c,spell))warnings.push(`${spell.name}: mevcut sınıf/seviyenin normal büyü listesinde kullanılamıyor. Kayıt korunur; DM ile kontrol et.`)
  for(const spell of prepared)if(!c.spellbook.includes(spell.id))warnings.push(`${spell.name} hazırlanmış fakat seçili büyü kitabında/listede yok.`)
  for(const degree of [6,7,8,9])if(c.classId==='warlock'&&selected.filter(s=>s.level===degree).length>1)warnings.push(`${degree}. derece Gizemli Sır için yalnız bir büyü seçilir.`)
  if(c.classId==='bard'&&counts.secrets>counts.secretsLimit)warnings.push(`Sınıf dışı büyüler Büyülü Sırlar sınırını aşıyor (${counts.secretsLimit}).`)
  if(isThirdCaster(c))warnings.push(c.classId==='fighter'?'Büyülü Şövalye: çoğu öğrenilen büyü Koruma/Tezahür olmalı; 3., 8., 14. ve 20. seviyelerdeki serbest seçimleri DM ile izle.':'Büyülü Düzenbaz: Büyücü Eli zorunludur; çoğu büyü Efsun/Yanılsama olmalı. 3., 8., 14. ve 20. seviye serbest seçimlerini DM ile izle.')
  return warnings
}
export function derivedStats(c:PlayerCharacter) {
  const limits=spellLimits(c),mod=limits.ability?abilityModifier(c.scores[limits.ability]):null
  const armor=armorDefinitions.find(a=>a.id===c.armorId)||armorDefinitions[0]
  const raceSpeed=races.find(r=>r.id===c.raceId)?.speed||30
  const monkBonus=c.classId==='monk'&&c.level>=2&&c.armorId==='none'&&!c.shield?10+Math.floor((c.level-2)/4)*5:0
  const heavyPenalty=armor.strength&&c.scores.str<armor.strength&&c.raceId!=='hill-dwarf'?10:0
  const baseSpeed=c.speedOverride??Math.max(0,raceSpeed+monkBonus+(c.classId==='barbarian'&&c.level>=5&&armor.kind!=='heavy'?10:0)-heavyPenalty)
  const initiativeHalf=c.classId==='bard'&&c.level>=2?Math.floor(proficiencyBonus(c.level)/2):c.classId==='fighter'&&c.subclass==='champion'&&c.level>=7?Math.ceil(proficiencyBonus(c.level)/2):0
  return {proficiency:proficiencyBonus(c.level),armorClass:armorClass(c),maxHp:maxHitPoints(c),initiative:abilityModifier(c.scores.dex)+c.initiativeBonus+initiativeHalf,speed:c.exhaustion>=5?0:c.exhaustion>=2?baseSpeed/2:baseSpeed,passivePerception:10+skillBonus(c,'perception')-(c.exhaustion>=1?5:0),spellAbility:limits.ability,spellDC:mod===null?null:8+proficiencyBonus(c.level)+mod,spellAttack:mod===null?null:proficiencyBonus(c.level)+mod,slots:spellSlots(c),pact:pactMagic(c),spellLimits:limits}
}
export function characterWarnings(c:PlayerCharacter,allSpells:PlayerSpell[]=[]) {
  const warnings=spellSelectionWarnings(c,allSpells),sub=subclasses[c.classId].find(s=>s.id===c.subclass)
  if(sub&&c.level<sub.level)warnings.push(`${sub.name} ${sub.level}. seviyede açılır.`)
  if(c.hp>maxHitPoints(c))warnings.push('Mevcut can azami canı aşıyor; seviye veya nitelik değişikliğinden sonra kontrol et.')
  if(c.hitDiceUsed>c.level)warnings.push('Harcanan can zarı sayısı mevcut seviyeyi aşıyor.')
  if(c.expertise.some(id=>!c.skillProficiencies.includes(id)))warnings.push('Uzmanlık seçilen beceride önce yetkinlik gerektirir.')
  if(c.skillProficiencies.length<classById(c.classId).skillCount)warnings.push('Sınıfının başlangıç becerilerini henüz tamamlamadın; geçmiş ve soy ek yetkinlik verebilir.')
  if(c.classId==='monk'&&(c.armorId!=='none'||c.shield))warnings.push('Keşişin zırhsız savunma ve hareket üstünlükleri zırh/kalkanla çalışmaz.')
  if(armorDefinitions.find(a=>a.id===c.armorId)?.stealthDisadvantage)warnings.push('Seçili zırh Gizlenme kontrollerine dezavantaj verir; bu, becerinin sayısal bonusunu değiştirmez.')
  if(c.classId==='druid'&&c.subclass==='land')warnings.push('Toprak Çemberi: seçtiğin araziye ait çember büyülerini ve ek dilleri/özellikleri ayrıca not et. Arazi seçimi otomatik uygulanmaz.')
  if(c.classId==='paladin'&&c.level>=6)warnings.push('Koruyucu Aura: bilinçliyken Karizma değiştiricin (en az +1) kendi ve yakındaki müttefiklerinin kurtarışlarına eklenir. Koşullu aura bu taban değerlere otomatik eklenmez.')
  if(c.classId==='rogue'&&c.level>=11)warnings.push('Güvenilir Yetenek: yetkin olduğun beceri kontrollerinde d20 sonucu 9 veya daha düşükse 10 sayılır; bu taban beceri sayısına ek bir bonus değildir.')
  if(c.classId==='cleric'&&c.subclass==='life')warnings.push('Yaşam Alanı: alan büyüleri her zaman hazırdır ve normal hazırlık sayısına katılmaz. Şifa Çırağı gibi koşullu iyileştirme bonuslarını zar sonucuna ayrıca uygula.')
  if(c.raceId==='high-elf'||c.raceId==='tiefling')warnings.push('Soydan gelen büyüler sınıf büyü defterine otomatik eklenmez; kendi kullanım hakkını, niteliğini ve zorluk derecesini kaynak/not bölümünde takip et.')
  if(c.classId==='wizard')warnings.push('Büyü kitabına kopyalama bedeli/süresi ve Gizemli Toparlanma ile geri alınan yuvaları masada belirle; kısa dinlenme bunları kendiliğinden yenilemez.')
  if(c.exhaustion)warnings.push(c.exhaustion>=6?'Tükenmişlik 6: 2014 kurallarında karakter ölür.':`Tükenmişlik ${c.exhaustion}: hızın 2. düzeyde yarılanması, 4. düzeyde azami canın yarılanması ve 5. düzeyde hızın sıfırlanması otomatik hesaplanır. Kontrol/saldırı/kurtarış dezavantajlarını ayrıca uygula; uzun dinlenmede yiyecek ve su varsa bir düzey azaltılır.`)
  return warnings
}
export const signed = (value:number) => value>=0?'+'+value:String(value)
export const allAbilityIds = abilityIds
