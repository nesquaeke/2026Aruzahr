import { before, after, test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'vite'

let server, model, rules, starter, readiness, spells
before(async () => {
  server = await createServer({configFile:false,cacheDir:'node_modules/.vite-test-player-creation',server:{middlewareMode:true,watch:null,hmr:false},appType:'custom',logLevel:'error'})
  model = await server.ssrLoadModule('/src/player/model.ts')
  rules = await server.ssrLoadModule('/src/player/rules.ts')
  starter = await server.ssrLoadModule('/src/player/StartingSpells.tsx')
  readiness = await server.ssrLoadModule('/src/player/CharacterCreationGuide.tsx')
  spells = JSON.parse(await readFile(new URL('../../public/rules/spells-2014-tr.json', import.meta.url),'utf8')).spells
})
after(async () => { await server?.close() })

test('all six starter spell selections use published SRD entries eligible for their first-level class', () => {
  for (const [id, expected] of Object.entries({wizard:9,sorcerer:6,warlock:4,bard:6,cleric:7,druid:6})) {
    const c = model.newPlayerCharacter(id)
    const options = starter.startingSpellOptions(c,spells)
    assert.equal(options.length, expected, id)
    assert.equal(options.every(s => s.level<=1 && s.classes.includes(id) && rules.canSelectSpell(c,s)),true,id)
    const patch = starter.addStartingSpells(c,spells)
    const counts = rules.spellChoiceCounts({...c,...patch},spells),limits=rules.spellLimits(c)
    assert.ok(counts.cantrips<=limits.cantrips,id)
    if(limits.known!==null)assert.ok(counts.known<=limits.known,id)
    assert.deepEqual(c.spellbook,[])
  }
})

test('adding recommendations is repeatable, preserves personal choices and never refills spent resources', () => {
  const c=model.newPlayerCharacter('sorcerer')
  c.spellbook=['burning-hands','sleep','acid-splash']
  c.hp=2;c.usedSpellSlots[0]=2
  const patch=starter.addStartingSpells(c,spells),next={...c,...patch}
  assert.deepEqual(Object.keys(patch),['spellbook'])
  for(const id of c.spellbook)assert.ok(next.spellbook.includes(id))
  assert.equal(rules.spellChoiceCounts(next,spells).known,2)
  assert.equal(next.hp,2);assert.equal(next.usedSpellSlots[0],2)
  assert.deepEqual(starter.addStartingSpells(next,spells),patch)
})

test('Life Domain suggestions leave always-prepared spells out of ordinary choices and never alter preparations', () => {
  const c=model.newPlayerCharacter('cleric');c.subclass='life'
  c.preparedSpells=['healing-word']
  const patch=starter.addStartingSpells(c,spells)
  assert.equal(patch.spellbook.includes('bless'),false)
  assert.equal(patch.spellbook.includes('cure-wounds'),false)
  assert.deepEqual(c.preparedSpells,['healing-word'])
  assert.equal(patch.preparedSpells,undefined)
})

test('readiness distinguishes first-level martial classes from actual casters and does not require portraits or lore', () => {
  const fighter=model.newPlayerCharacter('fighter');fighter.name='Yolcu';fighter.skillProficiencies=['athletics','perception']
  const steps=readiness.getCharacterReadiness(fighter,spells)
  assert.equal(steps.some(s=>s.id==='spells'),false)
  assert.equal(steps.find(s=>s.id==='identity').ready,true)
  assert.equal(steps.find(s=>s.id==='equipment').optional,true)
  const wizard=model.newPlayerCharacter('wizard')
  assert.equal(readiness.getCharacterReadiness(wizard,spells).find(s=>s.id==='spells').ready,false)
})
