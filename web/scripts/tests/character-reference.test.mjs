import {before,after,test} from 'node:test'
import assert from 'node:assert/strict'
import {createServer} from 'vite'

let server,reference,model,rules
before(async()=>{
  server=await createServer({configFile:false,cacheDir:'node_modules/.vite-test-character-reference',server:{middlewareMode:true,watch:null,hmr:false},appType:'custom',logLevel:'error'})
  reference=await server.ssrLoadModule('/src/player/character-options.ts')
  model=await server.ssrLoadModule('/src/player/model.ts')
  rules=await server.ssrLoadModule('/src/player/rules.ts')
})
after(async()=>{await server?.close()})

test('reference covers twelve complete class progressions without leaking another subclass',()=>{
  assert.equal(Object.keys(reference.classFeatureReferences).length,12)
  for(const definition of rules.classDefinitions){
    const c=model.newPlayerCharacter(definition.id)
    const base=reference.featuresForCharacter(c)
    assert.ok(base.some(row=>row.level===1),definition.id+' first level')
    assert.ok(base.some(row=>row.level===20),definition.id+' capstone')
    assert.ok(base.every(row=>row.level>=1&&row.level<=20&&!row.subclass))
    for(const subclass of rules.subclasses[definition.id]){
      c.subclass=subclass.id
      const rows=reference.featuresForCharacter(c)
      assert.ok(rows.some(row=>row.subclass===subclass.id),subclass.id+' feature guide')
      assert.ok(rows.every(row=>!row.subclass||row.subclass===subclass.id))
    }
  }
})
test('resource recommendations follow changing 2014 pools without changing existing resources',()=>{
  const resources=(c)=>reference.featuresForCharacter(c).filter(row=>row.level<=c.level&&row.resource).map(row=>row.resource(c)).filter(Boolean)
  let c=model.newPlayerCharacter('barbarian')
  for(const [level,amount] of [[1,2],[3,3],[6,4],[12,5],[17,6]]){c.level=level;assert.equal(resources(c).find(row=>row.id==='ref-barbarian-rage').max,amount)}
  c.level=20;assert.equal(resources(c).some(row=>row.id==='ref-barbarian-rage'),false)
  c=model.newPlayerCharacter('bard');c.scores.cha=16
  assert.equal(resources(c)[0].max,3);assert.equal(resources(c)[0].reset,'long')
  c.level=5;assert.equal(resources(c)[0].reset,'short')
  c=model.newPlayerCharacter('fighter');c.level=17
  assert.equal(resources(c).find(row=>row.id==='ref-fighter-action-surge').max,2)
  assert.equal(resources(c).find(row=>row.id==='ref-fighter-indomitable').max,3)
  c=model.newPlayerCharacter('paladin');c.level=2
  assert.equal(resources(c).find(row=>row.id==='ref-paladin-lay-on-hands').max,10)
  for(const definition of rules.classDefinitions)for(const subclass of rules.subclasses[definition.id])for(let level=1;level<=20;level++){
    c=model.newPlayerCharacter(definition.id);c.level=level;c.subclass=subclass.id
    const suggestions=resources(c)
    assert.equal(new Set(suggestions.map(row=>row.id)).size,suggestions.length)
    c.resources=suggestions.map(reference.createReferenceResource)
    assert.deepEqual(model.parsePlayerCharacter(c).resources,c.resources)
  }
})
test('reapplying explicit language and proficiency grants is idempotent and preserves unrelated text',()=>{
  const once=reference.mergeReferenceText('Ortak Dil; Eski Karlan işaretleri',['Elfçe','Ortak Dil'])
  assert.equal(once,'Ortak Dil; Eski Karlan işaretleri, Elfçe')
  assert.equal(reference.mergeReferenceText(once,['Elfçe','Ortak Dil']),once)
  assert.deepEqual(reference.mergeReferenceSkills(['perception'],['perception','insight']),['perception','insight'])
  assert.deepEqual(reference.mergeReferenceSkills(['perception','insight'],['perception','insight']),['perception','insight'])
})
test('nine SRD ancestry guides preserve choice requirements and innate daily resources',()=>{
  assert.equal(reference.raceReferences.length,9)
  const elf=reference.raceReferences.find(row=>row.id==='high-elf')
  assert.deepEqual(elf.skills,['perception']);assert.equal(elf.extraLanguages,1)
  const halfElf=reference.raceReferences.find(row=>row.id==='half-elf')
  assert.equal(halfElf.skillChoices,2);assert.equal(halfElf.extraLanguages,1)
  const dwarf=reference.raceReferences.find(row=>row.id==='hill-dwarf')
  assert.equal(dwarf.toolChoices.length,3)
  const tiefling=reference.raceReferences.find(row=>row.id==='tiefling')
  const c=model.newPlayerCharacter('wizard')
  assert.equal(tiefling.resources(c).length,0)
  c.level=3;assert.equal(tiefling.resources(c).length,1)
  c.level=5;assert.equal(tiefling.resources(c).length,2)
  assert.ok(tiefling.resources(c).every(row=>row.reset==='long'))
})
