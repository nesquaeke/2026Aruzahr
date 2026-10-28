import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const source = JSON.parse(await readFile(new URL('./data/5e-SRD-Spells-2014.json', import.meta.url), 'utf8'))
const translations = (await Promise.all([1,2,3].map(async n => JSON.parse(await readFile(new URL(`../src/player/translations/spells-${n}.json`, import.meta.url), 'utf8'))))).flat()
const byId = new Map(translations.map(t => [t.id,t]))
if (translations.length !== 319 || byId.size !== 319 || source.length !== 319) throw Error('Expected exactly 319 unique, translated SRD 2014 spells.')
const schoolNames = { abjuration:'Koruma',conjuration:'Çağırma',divination:'Kehanet',enchantment:'Efsun',evocation:'Tezahür',illusion:'Yanılsama',necromancy:'Nekromansi',transmutation:'Dönüştürme' }
function terms(text) {
  return text.replace(/^Up to /,'En çok ').replace(/^Until dispelled$/,'Büyü bozulana kadar').replace(/^Instantaneous$/,'Anlık').replace(/^Special$/,'Özel').replace(/^Unlimited$/,'Sınırsız').replace(/^Sight$/,'Görüş alanı').replace(/^Touch$/,'Dokunma').replace(/^Self$/,'Kendisi').replace(/bonus action/g,'bonus eylem').replace(/\breaction\b/g,'tepki').replace(/\baction\b/g,'eylem').replace(/minutes?/g,'dakika').replace(/hours?/g,'saat').replace(/rounds?/g,'tur').replace(/days?/g,'gün').replace(/feet/g,'fit').replace(/miles?/g,'mil')
}
const spells = source.map(s => {
  const t=byId.get(s.index)
  if (!t || !['name','description','higherLevels','material'].every(k=>typeof t[k]==='string') || t.description.length<20 || !t.name.trim()) throw Error('Incomplete translation: '+s.index)
  if (s.higher_level?.length && !t.higherLevels.trim()) throw Error('Missing higher-level rules: '+s.index)
  if (s.material && !t.material.trim()) throw Error('Missing material: '+s.index)
  if (!schoolNames[s.school.index]) throw Error('Unknown school')
  return {id:s.index,name:t.name,englishName:s.name,level:s.level,school:schoolNames[s.school.index],classes:s.classes.map(c=>c.index),castingTime:terms(s.casting_time),range:terms(s.range),components:s.components,material:t.material,duration:terms(s.duration),concentration:s.concentration,ritual:s.ritual,description:t.description,higherLevels:t.higherLevels,source:'SRD 5.1 · 2014 · Türkçe uyarlama'}
})
const pack = {version:1,title:'Aruzahr · 2014 Türkçe Büyü Arşivi',source:'System Reference Document 5.1, Wizards of the Coast LLC · CC BY 4.0; 5e-bits/5e-database veri düzeni · MIT',spells}
const folder = new URL('../public/rules/',import.meta.url)
await mkdir(folder,{recursive:true})
await writeFile(new URL('spells-2014-tr.json',folder),JSON.stringify(pack,null,2)+'\n')
await writeFile(new URL('spells-2014-manifest.json',folder),JSON.stringify({edition:'2014',count:319,levels:Object.fromEntries(Array.from({length:10},(_,n)=>[n,spells.filter(s=>s.level===n).length])),sha256:createHash('sha256').update(JSON.stringify(pack)).digest('hex'),source:'5e-bits/5e-database · src/2014/en/5e-SRD-Spells.json',adaptation:'Türkçe oyun metni; sayısal kurallar ve kaynak kimlikleri korunur.'},null,2)+'\n')
console.log('Built 319 Turkish 2014 SRD spells.')
