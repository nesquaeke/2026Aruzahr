import { before, after, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'vite'

let server, equipment, model, rules, source
before(async()=>{
  server=await createServer({configFile:false,cacheDir:'node_modules/.vite-test-equipment',server:{middlewareMode:true,watch:null,hmr:false},appType:'custom',logLevel:'error'})
  equipment=await server.ssrLoadModule('/src/player/equipment-catalog.ts')
  model=await server.ssrLoadModule('/src/player/model.ts')
  rules=await server.ssrLoadModule('/src/player/rules.ts')
  source=JSON.parse(await readFile(new URL('../data/5e-SRD-Equipment-2014.json',import.meta.url),'utf8'))
})
after(async()=>{await server?.close()})

test('all 237 SRD base equipment records retain independent source statistics and Turkish names',()=>{
  const rows=equipment.equipmentCatalog
  assert.equal(source.length,237);assert.equal(rows.length,237)
  assert.equal(new Set(rows.map(row=>row.id)).size,237)
  const counts=Object.fromEntries(equipment.equipmentCategories.map(({id})=>[id,rows.filter(row=>row.category===id).length]))
  assert.deepEqual(counts,{weapon:37,armor:13,gear:116,tools:31,mounts:40})
  const damageTypes={bludgeoning:'Ezici',piercing:'Delici',slashing:'Kesici'}
  for(const raw of source){
    const item=equipment.equipmentById(raw.index)
    assert(item,raw.index);assert(item.name.trim(),raw.index+' Turkish name');assert.equal(item.englishName,raw.name)
    assert.equal(item.weight,raw.weight??null,raw.index+' weight')
    if(!['caltrops','barding-ring-mail'].includes(raw.index))assert.deepEqual(item.cost,raw.cost,raw.index+' cost')
    assert.equal(item.bundleQuantity,raw.index==='caltrops'?1:raw.quantity??1,raw.index+' bundle')
    if(raw.weapon_category){
      assert.equal(item.weapon.kind,raw.weapon_category.toLowerCase());assert.equal(item.weapon.rangeKind,raw.weapon_range.toLowerCase())
      assert.equal(item.weapon.damageDice,raw.damage?.damage_dice??'—');assert.equal(item.weapon.damageType,damageTypes[raw.damage?.damage_type.index]??'Özel')
      assert.deepEqual(item.properties,raw.properties.map(p=>p.index));assert.equal(item.weapon.normalRange,raw.range.normal)
    }
    if(raw.armor_class){
      assert.equal(item.armor.baseAC,raw.armor_class.base);assert.equal(item.armor.dexBonus,raw.armor_class.dex_bonus)
      assert.equal(item.armor.strength,raw.str_minimum);assert.equal(item.armor.stealthDisadvantage,raw.stealth_disadvantage)
    }
    if(raw.desc?.length||raw.special?.length)assert(item.description.length>20,raw.index+' translated usage')
  }
  assert.deepEqual(equipment.equipmentById('caltrops').cost,{quantity:1,unit:'gp'})
  assert.deepEqual(equipment.equipmentById('barding-ring-mail').cost,{quantity:120,unit:'gp'})
})

test('pack contents resolve and ammunition tracks individual weight without charging a bundle per arrow',()=>{
  const packs=equipment.equipmentCatalog.filter(item=>item.contents)
  assert.equal(packs.length,7)
  for(const pack of packs)for(const content of pack.contents)assert(equipment.equipmentById(content.id),pack.id+' '+content.id)
  assert.deepEqual(equipment.equipmentWeight(equipment.equipmentById('explorers-pack')),{weight:59,complete:true})
  let c=model.newPlayerCharacter('ranger')
  c={...c,...equipment.addCatalogEquipment(c,'arrow')}
  assert.equal(equipment.inventoryCatalogCount(c,'arrow'),20)
  assert.equal(c.equipment[0].weight,0.05);assert.equal(c.equipment[0].quantity*c.equipment[0].weight,1)
  c={...c,...equipment.addCatalogEquipment(c,'crossbow-bolt')}
  assert.equal(c.equipment[1].weight,0.075);assert.equal(c.equipment[1].quantity*c.equipment[1].weight,1.5)
  c={...c,...equipment.addCatalogEquipment(c,'explorers-pack')}
  const packRows=c.equipment.filter(row=>row.notes.includes('Kâşif çantası içinden'))
  assert.equal(packRows.reduce((total,row)=>total+row.quantity*row.weight,0),59)
  assert.equal(c.equipment.some(row=>row.id.endsWith('-explorers-pack')),false)
  assert.equal(equipment.equipmentWeight(equipment.equipmentById('warhorse')).complete,false)
})

test('catalog and class starter actions preserve private/manual data, currencies, attacks and equipped armor',()=>{
  for(const starter of equipment.starterEquipment){
    let c=model.newPlayerCharacter(starter.classId)
    c.notes='Only the player may read this';c.coins.gp=31;c.armorId='plate';c.shield=true
    c.equipment=[{id:'manual-row',name:'Aile yadigârı',quantity:1,weight:2,notes:'Do not replace'}]
    const before=structuredClone(c)
    const patch=equipment.applyStarterEquipment(c)
    assert.deepEqual(Object.keys(patch),['equipment']);assert.deepEqual(c,before)
    assert.deepEqual(patch.equipment[0],before.equipment[0])
    c={...c,...patch}
    assert.equal(c.coins.gp,31);assert.equal(c.armorId,'plate');assert.equal(c.shield,true);assert.equal(c.notes,before.notes)
    assert.equal(equipment.starterEquipmentApplied(c),true);assert.throws(()=>equipment.applyStarterEquipment(c),/daha önce/)
    assert.equal(new Set(c.equipment.map(row=>row.id)).size,c.equipment.length)
    assert.doesNotThrow(()=>model.parsePlayerCharacter(c))
  }
  assert.equal(equipment.starterEquipment.length,12)
  const wizard=model.newPlayerCharacter('wizard'),patch=equipment.applyStarterEquipment(wizard)
  assert(patch.equipment.some(row=>row.notes.includes('[SRD:spellbook]')))
  assert(!patch.equipment.some(row=>row.id.endsWith('-scholars-pack')))
})

test('invalid quantities, identifier collisions and full inventory fail without mutating the character',()=>{
  let c=model.newPlayerCharacter('fighter'),before=structuredClone(c)
  for(const quantity of [0,-1,1.2,100001,NaN,Infinity])assert.throws(()=>equipment.addCatalogEquipment(c,'arrow',quantity),/adedi/)
  assert.throws(()=>equipment.addCatalogEquipment(c,'explorers-pack',100000),/adedi/)
  assert.deepEqual(c,before)
  c.equipment=[{id:'srd-item-dagger',name:'Private manual dagger',quantity:1,weight:1,notes:'Keep me'}]
  before=structuredClone(c);assert.throws(()=>equipment.addCatalogEquipment(c,'dagger'),/elle yazılmış/);assert.deepEqual(c,before)
  c.equipment=Array.from({length:150},(_,i)=>({id:'manual-'+i,name:'Item',quantity:1,weight:1,notes:''}))
  before=structuredClone(c);assert.throws(()=>equipment.addCatalogEquipment(c,'dagger'),/150/);assert.throws(()=>equipment.applyStarterEquipment(c),/150/);assert.deepEqual(c,before)
})

test('weapon proficiency and attack abilities follow class/race and 2014 finesse rules',()=>{
  const item=id=>equipment.equipmentById(id)
  let c=model.newPlayerCharacter('wizard');c.raceId='human';c.scores.str=10;c.scores.dex=16
  assert.equal(equipment.isWeaponProficient(c,item('quarterstaff')),true)
  assert.equal(equipment.isWeaponProficient(c,item('longsword')),false)
  c.raceId='high-elf';assert.equal(equipment.isWeaponProficient(c,item('longsword')),true)
  c.raceId='hill-dwarf';assert.equal(equipment.isWeaponProficient(c,item('warhammer')),true)
  assert.equal(equipment.weaponAbility(c,item('dagger')),'dex');assert.equal(equipment.weaponAbility(c,item('handaxe')),'str')
  c.scores.str=18;assert.equal(equipment.weaponAbility(c,item('dart')),'str');assert.equal(equipment.weaponAbility(c,item('net')),'dex')
  assert.throws(()=>equipment.addCatalogAttack(c,'longsword',{ability:'dex'}),/niteliği/)
  assert.throws(()=>equipment.addCatalogAttack(c,'dagger',{ability:'int'}),/Kuvvet veya Çeviklik/)
  c=model.newPlayerCharacter('monk');c.level=17;c.scores.dex=16;c.scores.str=10
  assert.equal(equipment.weaponAbility(c,item('quarterstaff')),'dex')
  assert.equal(equipment.addCatalogAttack(c,'quarterstaff').attacks.at(-1).damage,'1d10')
  c.armorId='leather';assert.equal(equipment.weaponAbility(c,item('quarterstaff')),'str')
})

test('explicit attack actions keep inventory intact, reject duplicate uses, and respect shields and nets',()=>{
  let c=model.newPlayerCharacter('fighter');c.shield=false
  const before=structuredClone(c),patch=equipment.addCatalogAttack(c,'longsword',{twoHanded:true})
  assert.deepEqual(Object.keys(patch),['attacks']);assert.equal(patch.attacks.at(-1).damage,'1d10');assert.deepEqual(c,before)
  c={...c,...patch};assert.throws(()=>equipment.addCatalogAttack(c,'longsword',{twoHanded:true}),/zaten/)
  c.shield=true;assert.throws(()=>equipment.addCatalogAttack(c,'longsword',{twoHanded:true}),/Kalkan/)
  assert.throws(()=>equipment.addCatalogAttack(c,'longbow'),/Kalkan/)
  c.shield=false
  const net=equipment.addCatalogAttack(c,'net').attacks.at(-1)
  assert.equal(net.damage,'—');assert(net.notes.includes('değiştiricisi hasara eklenmez'))
  c.attacks=Array.from({length:30},(_,i)=>({...net,id:'manual-'+i}))
  assert.throws(()=>equipment.addCatalogAttack(c,'dagger'),/30/)
})

test('armor and shields require an explicit equip action, use canonical AC ids, and never equip barding',()=>{
  const legal=new Set(rules.armorDefinitions.map(row=>row.id))
  for(const item of equipment.equipmentCatalog.filter(row=>row.armor&&!row.armor.shield))assert(legal.has(item.armor.armorId),item.id)
  let c=model.newPlayerCharacter('fighter');c.armorId='none';c.shield=false
  const added=equipment.addCatalogEquipment(c,'chain-mail')
  assert.equal(added.armorId,undefined);assert.equal(c.armorId,'none')
  c={...c,...added,...equipment.equipCatalogArmor({...c,...added},'chain-mail')}
  assert.equal(c.armorId,'chain-mail');assert.equal(equipment.inventoryCatalogCount(c,'chain-mail'),1)
  c={...c,...equipment.equipCatalogArmor(c,'shield')}
  assert.equal(c.shield,true);assert.equal(c.armorId,'chain-mail');assert.equal(rules.armorClass(c),18)
  assert.throws(()=>equipment.equipCatalogArmor(c,'barding-plate-armor'),/binek/)
  c=model.newPlayerCharacter('wizard');assert.equal(equipment.armorProficiency(c,equipment.equipmentById('plate-armor')),false)
  c=model.newPlayerCharacter('cleric');c.subclass='life';assert.equal(equipment.armorProficiency(c,equipment.equipmentById('plate-armor')),true)
})
