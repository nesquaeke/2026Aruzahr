import { expect, test, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { customPlayerSpellTemplate, customSpellStorageKey, parsePlayerSpellPack } from '../src/player/spells'

const characterKey='aruzahr-player-characters-v1'
async function create(page:Page){
  await page.goto('http://127.0.0.1:5173/#/play')
  await page.getByRole('button',{name:'Karakter oluştur',exact:true}).click()
  const dialog=page.getByRole('dialog',{name:'Yeni karakter oluştur'})
  await dialog.getByLabel('Yeni karakterin adı').fill('Eşik Araştırmacısı')
  await dialog.getByLabel('Başlangıç sınıfı').selectOption('wizard')
  await dialog.getByLabel('Başlangıç seviyesi').fill('2')
  await dialog.getByRole('button',{name:'Karakter defterini aç',exact:true}).click()
  await expect(page.getByRole('heading',{name:'Eşik Araştırmacısı',exact:true})).toBeVisible()
  await page.getByRole('navigation',{name:'Karakter bölümleri'}).getByRole('button',{name:'Büyüler',exact:true}).click()
  const tools=page.getByTestId('spell-archive-tools')
  await expect(tools.locator('.sat-counts dd').first()).toHaveText('319')
  return tools
}
const savedCharacter=(page:Page)=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{}').characters[0],characterKey)
const savedSpells=(page:Page)=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{"spells":[]}').spells,customSpellStorageKey)

test('a custom cantrip can be created without JSON, found in its school, explicitly learned and retained after reload',async({page})=>{
  const tools=await create(page)
  const before=(await savedCharacter(page)).spellbook
  await tools.getByRole('button',{name:'Yeni büyü / basit büyü ekle',exact:true}).click()
  const form=tools.locator('form')
  await form.getByLabel('Türkçe büyü adı',{exact:true}).fill('Karlan Eşik Kıvılcımı')
  await form.getByLabel('Büyü etkisi',{exact:true}).fill('Elindeki küçük taşın yüzeyinde soluk bir koruma işareti belirir. Bu masa büyüsü hasar vermez.')
  await form.getByLabel('Derecesi',{exact:true}).selectOption('0')
  await form.getByLabel('Büyü okulu',{exact:true}).selectOption('abjuration')
  await form.getByRole('button',{name:'Büyüyü arşive kaydet',exact:true}).click()
  await expect(tools.locator('.sat-counts dd').first()).toHaveText('320')
  const custom=(await savedSpells(page))[0]
  expect(custom).toMatchObject({name:'Karlan Eşik Kıvılcımı',level:0,school:'abjuration',classes:['wizard']})
  expect(custom.id).toMatch(/^ozel-/)
  expect((await savedCharacter(page)).spellbook).toEqual(before)
  await page.getByLabel('Büyü okulu',{exact:true}).selectOption('abjuration')
  await page.getByRole('searchbox',{name:'Türkçe veya İngilizce büyü ara'}).fill(custom.name)
  const card=page.locator(`[data-spell-id="${custom.id}"]`)
  await expect(card).toBeVisible()
  await card.locator('footer button').first().click()
  await expect.poll(async()=>(await savedCharacter(page)).spellbook).toContain(custom.id)
  await page.reload()
  await page.getByRole('navigation',{name:'Karakter bölümleri'}).getByRole('button',{name:'Büyüler',exact:true}).click()
  await page.getByRole('searchbox',{name:'Türkçe veya İngilizce büyü ara'}).fill(custom.name)
  await expect(page.locator(`[data-spell-id="${custom.id}"]`)).toBeVisible()
  expect((await savedCharacter(page)).spellbook).toContain(custom.id)
})

test('missing required fields or an empty class list never write a spell, and repeated names receive independent IDs',async({page})=>{
  const tools=await create(page)
  await tools.getByRole('button',{name:'Yeni büyü / basit büyü ekle',exact:true}).click()
  const form=tools.locator('form'),name=form.getByLabel('Türkçe büyü adı',{exact:true}),description=form.getByLabel('Büyü etkisi',{exact:true})
  await form.getByRole('button',{name:'Büyüyü arşive kaydet',exact:true}).click()
  expect(await name.evaluate((input:HTMLInputElement)=>input.validity.valueMissing)).toBe(true)
  expect(await description.evaluate((input:HTMLTextAreaElement)=>input.validity.valueMissing)).toBe(true)
  expect(await savedSpells(page)).toEqual([])
  await name.fill('İsimsiz Mühür');await description.fill('İlk kaydın özel oyun etkisi.')
  await form.getByRole('checkbox',{name:'Büyücü',exact:true}).uncheck()
  await form.getByRole('button',{name:'Büyüyü arşive kaydet',exact:true}).click()
  await expect(tools.getByRole('alert')).toContainText('en az bir sınıf')
  expect(await savedSpells(page)).toEqual([])
  await form.getByRole('checkbox',{name:'Büyücü',exact:true}).check()
  await form.getByRole('button',{name:'Büyüyü arşive kaydet',exact:true}).click()
  await expect.poll(async()=>(await savedSpells(page)).length).toBe(1)
  await tools.getByRole('button',{name:'Yeni büyü / basit büyü ekle',exact:true}).click()
  await form.getByLabel('Türkçe büyü adı',{exact:true}).fill('İsimsiz Mühür')
  await form.getByLabel('Büyü etkisi',{exact:true}).fill('İkinci kaydın ayrı oyun etkisi.')
  await form.getByRole('button',{name:'Büyüyü arşive kaydet',exact:true}).click()
  await expect.poll(async()=>(await savedSpells(page)).length).toBe(2)
  const records=await savedSpells(page)
  expect(new Set(records.map((spell:any)=>spell.id)).size).toBe(2)
  expect(records.map((spell:any)=>spell.description)).toEqual(['İlk kaydın özel oyun etkisi.','İkinci kaydın ayrı oyun etkisi.'])
  expect((await savedCharacter(page)).spellbook).toEqual([])
})

test('form-created spells export separately and can be imported by a fresh player without automatically learning them',async({page,browser})=>{
  const tools=await create(page)
  await tools.getByRole('button',{name:'Yeni büyü / basit büyü ekle',exact:true}).click()
  const form=tools.locator('form')
  await form.getByLabel('Türkçe büyü adı',{exact:true}).fill('Yolcunun Soğuk Mührü')
  await form.getByLabel('Büyü etkisi',{exact:true}).fill('Bu özel büyünün etkisi yalnız bu masa için kaydedilir.')
  await form.getByRole('button',{name:'Büyüyü arşive kaydet',exact:true}).click()
  await expect(tools.getByRole('button',{name:'Özel arşivimi indir',exact:true})).toBeEnabled()
  const pending=page.waitForEvent('download')
  await tools.getByRole('button',{name:'Özel arşivimi indir',exact:true}).click()
  const downloaded=await pending,raw=await readFile((await downloaded.path())!,'utf8'),pack=parsePlayerSpellPack(JSON.parse(raw))
  expect(pack.spells).toHaveLength(1)
  expect(pack.spells[0].name).toBe('Yolcunun Soğuk Mührü')
  const context=await browser.newContext()
  try{
    const fresh=await context.newPage(),freshTools=await create(fresh)
    await freshTools.getByLabel('Özel büyü JSON dosyası').setInputFiles({name:'Ozel-Arsiv.json',mimeType:'application/json',buffer:Buffer.from(raw)})
    await expect(freshTools.locator('.sat-counts dd').first()).toHaveText('320')
    await fresh.getByRole('searchbox',{name:'Türkçe veya İngilizce büyü ara'}).fill(pack.spells[0].name)
    await expect(fresh.locator(`[data-spell-id="${pack.spells[0].id}"]`)).toBeVisible()
    expect((await savedCharacter(fresh)).spellbook).toEqual([])
  }finally{await context.close()}
})

test('legacy Turkish school names normalize to the existing filter keys while original custom schools are preserved',()=>{
  for(const [legacy,canonical] of [['Koruma','abjuration'],['Çağırma','conjuration'],['Kehanet','divination'],['Efsun','enchantment'],['Tezahür','evocation'],['Evokasyon','evocation'],['Yanılsama','illusion'],['Nekromansi','necromancy'],['Dönüştürme','transmutation'],['Dönüşüm','transmutation']]){
    const pack=structuredClone(customPlayerSpellTemplate);pack.spells[0].school=legacy
    expect(parsePlayerSpellPack(pack).spells[0].school).toBe(canonical)
  }
  const pack=structuredClone(customPlayerSpellTemplate);pack.spells[0].school='Karlan Runik Okulu'
  expect(parsePlayerSpellPack(pack).spells[0].school).toBe('Karlan Runik Okulu')
})
