import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { parsePlayerSpellPack } from '../src/player/spells'

const pack=JSON.parse(await readFile('public/rules/spells-2014-tr.json','utf8'))
test('the complete 319-spell SRD catalogue has Turkish mechanics, levels and class lists',()=>{
  const parsed=parsePlayerSpellPack(pack)
  expect(parsed.spells).toHaveLength(319)
  expect(new Set(parsed.spells.map(s=>s.id)).size).toBe(319)
  expect([...new Set(parsed.spells.map(s=>s.level))].sort()).toEqual([0,1,2,3,4,5,6,7,8,9])
  for(const spell of parsed.spells){
    expect(spell.name.length,spell.id).toBeGreaterThan(2)
    expect(spell.description.length,spell.id).toBeGreaterThan(20)
    for(const value of [spell.description,spell.higherLevels,spell.material,spell.duration,spell.range,spell.castingTime])
      expect(value,spell.id).not.toMatch(/\bYou can\b|\bsaving throw\b|\bspell slot\b|\bTODO\b|\breeylem\b/)
  }
  const spells=Object.fromEntries(parsed.spells.map(s=>[s.id,s]))
  expect(spells.shield.castingTime).toBe('1 tepki')
  expect(spells['magic-missile']).toMatchObject({level:1,classes:expect.arrayContaining(['wizard','sorcerer'])})
  expect(spells['misty-step'].level).toBe(2)
  expect(spells.fireball.level).toBe(3)
  expect(spells['detect-magic'].ritual).toBe(true)
  expect(spells['cure-wounds'].classes).not.toContain('wizard')
})

test('malformed or ambiguous spell packs are rejected before any local write',()=>{
  for(const mutate of [
    (v:any)=>v.spells.push(v.spells[0]),
    (v:any)=>v.spells[0].level=10,
    (v:any)=>v.spells[0].classes=['not-a-class'],
    (v:any)=>v.spells[0].id='../../private',
    (v:any)=>v.spells[0].description='',
    (v:any)=>v.spells[0].components=['script'],
    (v:any)=>v.spells[0].concentration='yes',
  ]){const value=structuredClone(pack);mutate(value);expect(()=>parsePlayerSpellPack(value)).toThrow()}
})
