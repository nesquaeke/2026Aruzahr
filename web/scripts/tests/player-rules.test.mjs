import { before, after, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'vite'

let server, rules, model
before(async () => {
  server=await createServer({configFile:false,server:{middlewareMode:true,watch:null},appType:'custom',logLevel:'error'})
  rules=await server.ssrLoadModule('/src/player/rules.ts')
  model=await server.ssrLoadModule('/src/player/model.ts')
})
after(async()=>{await server?.close()})

test('all twelve classes match 240 independent SRD 2014 progression rows', async()=>{
  const fixture=JSON.parse(await readFile(new URL('./fixtures/srd-2014-progression.json',import.meta.url),'utf8'))
  assert.equal(rules.classDefinitions.length,12)
  for(const row of fixture.rows){
    const c=model.newPlayerCharacter(row.id);c.level=row.level
    const stats=rules.derivedStats(c),limit=rules.spellLimits(c),normal=Array.from({length:9},(_,i)=>row.spells['spell_slots_level_'+(i+1)]||0)
    assert.equal(stats.proficiency,row.pb,row.id+' '+row.level+' proficiency')
    if(row.id==='warlock'){
      assert.deepEqual(stats.slots,Array(9).fill(0))
      const grade=normal.reduce((highest,count,index)=>count?index+1:highest,0)
      assert.equal(stats.pact.level,grade)
      assert.equal(stats.pact.slots,normal[grade-1])
    } else assert.deepEqual(stats.slots,normal,row.id+' '+row.level+' slots')
    assert.equal(limit.cantrips,row.spells.cantrips_known||0,row.id+' '+row.level+' cantrips')
    if(row.spells.spells_known!==undefined)assert.equal(limit.known,row.spells.spells_known,row.id+' '+row.level+' known')
  }
})
test('character level and spell grade remain distinct; half and third casters start at the correct level',()=>{
  const spell={id:'sample',classes:['wizard'],level:2}
  let c=model.newPlayerCharacter('wizard');c.level=2
  assert.equal(rules.canSelectSpell(c,spell),false)
  c.level=3;assert.equal(rules.canSelectSpell(c,spell),true)
  c=model.newPlayerCharacter('paladin');assert.equal(rules.spellLimits(c).maxLevel,0)
  c.level=2;assert.deepEqual(rules.spellSlots(c),[2,0,0,0,0,0,0,0,0])
  c=model.newPlayerCharacter('fighter');c.level=2;c.subclass='eldritch-knight';assert.equal(rules.spellLimits(c).mode,'none')
  c.level=3;assert.equal(rules.spellLimits(c).cantrips,2);assert.equal(rules.spellLimits(c).known,3)
  c.level=7;assert.deepEqual(rules.spellSlots(c),[4,2,0,0,0,0,0,0,0])
  c=model.newPlayerCharacter('rogue');c.subclass='arcane-trickster';c.level=3;assert.equal(rules.spellLimits(c).cantrips,3)
})
test('AC, hit points, proficiency, expertise and half proficiency use their own 2014 rules',()=>{
  assert.equal(rules.abilityModifier(9),-1)
  let c=model.newPlayerCharacter('barbarian');c.scores.dex=14;c.scores.con=16
  assert.equal(rules.armorClass(c),15);c.shield=true;assert.equal(rules.armorClass(c),17)
  c.armorId='plate';c.scores.dex=8;assert.equal(rules.armorClass(c),20)
  c=model.newPlayerCharacter('monk');c.scores.dex=16;c.scores.wis=14;assert.equal(rules.armorClass(c),15)
  c.shield=true;assert.equal(rules.armorClass(c),15) // ordinary 10 + Dex + shield; monk formula disabled
  c=model.newPlayerCharacter('bard');c.level=2;c.scores.dex=14
  assert.equal(rules.skillBonus(c,'acrobatics'),3)
  c.skillProficiencies=['acrobatics'];assert.equal(rules.skillBonus(c,'acrobatics'),4)
  c.expertise=['acrobatics'];assert.equal(rules.skillBonus(c,'acrobatics'),6)
  c=model.newPlayerCharacter('wizard');assert.equal(rules.maxHitPoints(c),7);c.level=2;assert.equal(rules.maxHitPoints(c),12)
  c.raceId='hill-dwarf';assert.equal(rules.maxHitPoints(c),14)
})
test('rests do not grant free healing or convert pact magic into normal slots; arcanum is daily',()=>{
  let c=model.newPlayerCharacter('warlock');c.level=11;c.hp=3;c.tempHp=5;c.pactSlotsUsed=3;c.hitDiceUsed=8;c.arcanumUsed=[6]
  c.resources=[{id:'a',name:'Kısa',max:2,used:2,reset:'short'},{id:'b',name:'Uzun',max:2,used:2,reset:'long'},{id:'c',name:'El',max:1,used:1,reset:'manual'}]
  const short=model.shortRest(c)
  assert.equal(short.hp,3);assert.equal(short.tempHp,5);assert.equal(short.pactSlotsUsed,0);assert.deepEqual(short.arcanumUsed,[6]);assert.equal(short.resources[1].used,2);assert.equal(c.pactSlotsUsed,3)
  const long=model.longRest(c)
  assert.equal(long.hp,rules.maxHitPoints(c));assert.equal(long.tempHp,0);assert.equal(long.hitDiceUsed,3);assert.deepEqual(long.arcanumUsed,[]);assert.equal(long.resources[2].used,1)
  assert.throws(()=>model.spendSpellSlot(c,5),/yuvası/)
  assert.throws(()=>model.spendArcanum(c,6),/kullanıldı/)
  c.arcanumUsed=[];assert.deepEqual(model.spendArcanum(c,6).arcanumUsed,[6]);assert.throws(()=>model.spendArcanum(c,7),/açılmadı/)
  c=model.newPlayerCharacter('fighter');c.hp=2;c.hitDiceUsed=0
  const rested=model.useHitDie(c,5)
  assert.equal(rested.hp,9);assert.equal(rested.hitDiceUsed,1);assert.equal(c.hp,2)
  assert.throws(()=>model.useHitDie(rested,5),/kalmadı/)
  c.hp=0;assert.throws(()=>model.longRest(c),/en az 1 can/)
})
test('damage consumes temporary HP first, healing caps at maximum and spell slots cannot overspend',()=>{
  let c=model.newPlayerCharacter('wizard');c.tempHp=4;c.hp=7
  c=model.applyDamage(c,6);assert.equal(c.tempHp,0);assert.equal(c.hp,5)
  c=model.heal(c,100);assert.equal(c.hp,7)
  c=model.spendSpellSlot(c,1);c=model.spendSpellSlot(c,1);assert.throws(()=>model.spendSpellSlot(c,1),/yuvası/)
  assert.throws(()=>model.spendSpellSlot(c,0),/1–9/)
  assert.throws(()=>model.applyDamage(c,Infinity),/Hasar/)
})
test('versioned backups preserve private notes and all tracking without accepting malformed or remote portraits',()=>{
  const c=model.newPlayerCharacter('warlock');c.level=11;c.notes='ÖZEL OYUNCU NOTU';c.spellbook=['eldritch-blast'];c.arcanumUsed=[6];c.pactSlotsUsed=2;c.usedSpellSlots[0]=1
  assert.deepEqual(model.importPlayerFile(model.exportPlayers([c]))[0],c)
  assert.deepEqual(model.importPlayerFile(model.exportPlayerCharacter(c))[0],c)
  for(const mutate of [x=>x.level=21,x=>x.scores.int=NaN,x=>x.portrait='https://tracking.invalid/a.png',x=>x.portrait='data:image/svg+xml;base64,PHN2Zy8+',x=>x.skillProficiencies=['fake'],x=>x.usedSpellSlots[1]=-1,x=>x.arcanumUsed=[4],x=>x.resources=[{id:'same',name:'x',max:1,used:0,reset:'manual'},{id:'same',name:'y',max:1,used:0,reset:'manual'}]]){
    const changed=structuredClone(c);mutate(changed);assert.throws(()=>model.parsePlayerCharacter(changed))
  }
  assert.throws(()=>model.importPlayerFile(model.exportPlayers([c,c])),/yinelenen/)
  assert.throws(()=>model.importPlayerFile('{bad'),/JSON/)
  assert.deepEqual(model.importPlayerFile(model.exportPlayers([])),[])
  const partial=structuredClone(c);delete partial.scores.wis;assert.throws(()=>model.parsePlayerCharacter(partial),/eksiksiz/)
})

test('domain and oath spells stay always prepared while fiend spells only expand the learning list',()=>{
  const spell=(id,classes=['wizard'])=>({id,classes,level:1,ritual:false,name:id})
  let c=model.newPlayerCharacter('cleric');c.subclass='life';c.level=3
  assert.deepEqual(rules.alwaysPreparedSpellIds(c),['bless','cure-wounds','lesser-restoration','spiritual-weapon'])
  c.preparedSpells=['bless','cure-wounds','lesser-restoration','spiritual-weapon']
  c.spellbook=[...c.preparedSpells]
  assert.equal(rules.spellSelectionWarnings(c,c.spellbook.map(id=>spell(id,['cleric']))).some(w=>w.includes('normal hazırlık sınırı')),false)
  c=model.newPlayerCharacter('paladin');c.subclass='devotion';c.level=3
  assert.equal(rules.canSelectSpell(c,spell('sanctuary',['cleric'])),true)
  assert.equal(rules.alwaysPreparedSpellIds(c).includes('sanctuary'),true)
  c=model.newPlayerCharacter('warlock');c.subclass='fiend';c.level=5
  assert.equal(rules.canSelectSpell(c,{...spell('fireball'),level:3}),true)
  assert.deepEqual(rules.alwaysPreparedSpellIds(c),[])
})

test('ritual casting follows the class and current preparation, never a pact or ordinary slot shortcut',()=>{
  const spell={id:'detect-magic',classes:['wizard','cleric','druid','bard'],level:1,ritual:true}
  let c=model.newPlayerCharacter('wizard');c.spellbook=[spell.id]
  assert.equal(rules.canRitualCast(c,spell),true)
  c.spellbook=[];assert.equal(rules.canRitualCast(c,spell),false)
  c=model.newPlayerCharacter('cleric');c.spellbook=[spell.id]
  assert.equal(rules.canRitualCast(c,spell),false)
  c.preparedSpells=[spell.id];assert.equal(rules.canRitualCast(c,spell),true)
  c=model.newPlayerCharacter('bard');c.spellbook=[spell.id];assert.equal(rules.canRitualCast(c,spell),true)
  c=model.newPlayerCharacter('warlock');c.spellbook=[spell.id]
  assert.equal(rules.canRitualCast(c,{...spell,classes:['warlock']}),false)
  assert.equal(rules.canRitualCast({...c,classId:'wizard'},{...spell,ritual:false}),false)
})

test('champion physical checks, 2014 exhaustion and an explicitly supplied rest are calculated separately',()=>{
  let c=model.newPlayerCharacter('fighter');c.subclass='champion';c.level=7;c.scores.dex=14;c.scores.str=16
  assert.equal(rules.derivedStats(c).initiative,4)
  assert.equal(rules.skillBonus(c,'athletics'),5)
  c.skillProficiencies=['athletics'];assert.equal(rules.skillBonus(c,'athletics'),6)
  c=model.newPlayerCharacter('wizard');c.level=2;c.hp=2;c.maxHpOverride=21
  const normalPassive=rules.derivedStats(c).passivePerception
  c.exhaustion=2;assert.equal(rules.derivedStats(c).speed,15);assert.equal(rules.derivedStats(c).passivePerception,normalPassive-5)
  c.exhaustion=4;assert.equal(rules.maxHitPoints(c),10)
  assert.equal(model.longRest(c).exhaustion,4)
  const supplied=model.longRest(c,{foodAndWater:true})
  assert.equal(supplied.exhaustion,3);assert.equal(supplied.hp,21)
  c.exhaustion=5;assert.equal(rules.derivedStats(c).speed,0)
  c.exhaustion=6;assert.throws(()=>model.heal(c,10),/Ölü/);assert.throws(()=>model.longRest(c,{foodAndWater:true}),/Ölü/)
})

test('damage while down, temporary HP and massive damage preserve death rules and concentration',()=>{
  let c=model.newPlayerCharacter('wizard');c.hp=0;c.tempHp=5;c.concentration='detect-magic'
  let hurt=model.applyDamage(c,2)
  assert.equal(hurt.tempHp,3);assert.equal(hurt.deathFailures,1);assert.equal(hurt.concentration,'')
  c.deathSuccesses=3;c.deathFailures=2;hurt=model.applyDamage(c,1)
  assert.equal(hurt.deathSuccesses,0);assert.equal(hurt.deathFailures,1)
  c=model.newPlayerCharacter('wizard');c.hp=2
  const dead=model.applyDamage(c,2+rules.maxHitPoints(c))
  assert.equal(dead.hp,0);assert.equal(dead.deathFailures,3);assert.throws(()=>model.heal(dead,10),/Ölü/)
  assert.equal(model.applyDamage(c,1).deathFailures,0)
})

test('missing custom spell definitions remain recorded with a warning and Magical Secrets counts cantrips',()=>{
  const c=model.newPlayerCharacter('bard');c.level=6;c.subclass='lore';c.spellbook=['custom-gone','a','b','c']
  const rows=['a','b','c'].map(id=>({id,name:id,classes:['wizard'],level:0}))
  const warnings=rules.spellSelectionWarnings(c,rows)
  assert(warnings.some(w=>w.includes('custom-gone')&&w.includes('korunuyor')))
  assert(warnings.some(w=>w.includes('Büyülü Sırlar sınırını aşıyor (2)')))
  assert(c.spellbook.includes('custom-gone'))
})

test('a bard can use Magical Secrets for cantrips without spending normal Cantrips Known twice',()=>{
  const c=model.newPlayerCharacter('bard');c.level=6;c.subclass='lore'
  const rows=[...Array.from({length:3},(_,i)=>({id:'bard-cantrip-'+i,name:'Bard'+i,classes:['bard'],level:0})),...Array.from({length:2},(_,i)=>({id:'secret-'+i,name:'Secret'+i,classes:['wizard'],level:0})),...Array.from({length:9},(_,i)=>({id:'known-'+i,name:'Known'+i,classes:['bard'],level:1}))]
  c.spellbook=rows.map(s=>s.id)
  assert.deepEqual(rules.spellChoiceCounts(c,rows),{cantrips:3,known:11,secrets:2,secretsLimit:2})
  assert.deepEqual(rules.spellSelectionWarnings(c,rows),[])
  const extra={id:'extra',name:'Extra',classes:['wizard'],level:0};rows.push(extra);c.spellbook.push(extra.id)
  const warnings=rules.spellSelectionWarnings(c,rows)
  assert(warnings.some(w=>w.includes('11 büyü bilir; 12 büyü seçili')))
  assert(warnings.some(w=>w.includes('Büyülü Sırlar sınırını aşıyor (2)')))
})

test('corrupt local data and a full storage quota never overwrite the previous character archive',()=>{
  const previous=globalThis.localStorage
  let raw='{broken private archive',writes=0
  globalThis.localStorage={getItem:()=>raw,setItem:()=>{writes++;throw Error('QuotaExceeded')}}
  try {
    assert.throws(()=>model.loadPlayers(),/Mevcut veri silinmedi/)
    assert.equal(writes,0);assert.equal(raw,'{broken private archive')
    const c=model.newPlayerCharacter('wizard')
    assert.throws(()=>model.savePlayers([c]),/kaydedilemedi/)
    assert.equal(raw,'{broken private archive')
  } finally {if(previous===undefined)delete globalThis.localStorage;else globalThis.localStorage=previous}
})
