import { test, expect, type Page } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { customPlayerSpellTemplate } from '../src/player/spells'

const key='aruzahr-player-characters-v1'
async function create(page:Page,classId='wizard',level=2){
  await page.goto('/#/play')
  await page.getByRole('button',{name:'Karakter oluştur',exact:true}).click()
  const dialog=page.getByRole('dialog',{name:'Yeni karakter oluştur'})
  await dialog.getByLabel('Yeni karakterin adı').fill('Karlan Yolcusu')
  await dialog.getByLabel('Başlangıç sınıfı').selectOption(classId)
  await dialog.getByLabel('Başlangıç seviyesi').fill(String(level))
  await dialog.getByRole('button',{name:'Karakter defterini aç'}).click()
  await expect(page.getByRole('heading',{name:'Karlan Yolcusu',exact:true})).toBeVisible()
}
async function section(page:Page,name:string){await page.getByRole('navigation',{name:'Karakter bölümleri'}).getByRole('button',{name,exact:true}).click()}
async function character(page:Page){return page.evaluate(k=>JSON.parse(localStorage.getItem(k)||'{"characters":[]}').characters[0],key)}
async function spellCard(page:Page,id:string){
  await section(page,'Büyüler')
  await page.getByRole('searchbox',{name:'Türkçe veya İngilizce büyü ara'}).fill(id.replaceAll('-',' '))
  return page.locator(`[data-spell-id="${id}"]`)
}

test('wizard level two can browse all grades but only select first-grade wizard spells; level three unlocks second grade',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message))
  await create(page)
  let card=await spellCard(page,'misty-step')
  await expect(card).toBeVisible()
  await expect(card.locator('footer button').first()).toBeDisabled()
  card=await spellCard(page,'magic-missile')
  await card.locator('footer button').first().click()
  await expect.poll(async()=>(await character(page)).spellbook).toContain('magic-missile')
  await page.getByLabel('Büyü sınıfı').selectOption('all')
  await page.getByRole('searchbox',{name:'Türkçe veya İngilizce büyü ara'}).fill('Cure Wounds')
  await expect(page.locator('[data-spell-id="cure-wounds"] footer button').first()).toBeDisabled()
  await section(page,'Kimlik');await page.getByLabel('Karakter seviyesi').fill('3')
  card=await spellCard(page,'misty-step')
  await expect(card.locator('footer button').first()).toBeEnabled()
  await expect.poll(async()=>(await character(page)).spellbook).toContain('magic-missile')
  expect(errors).toEqual([])
})

test('preparation, normal casting and a wizard ritual consume the correct independent resources',async({page})=>{
  await create(page)
  const card=await spellCard(page,'magic-missile')
  await card.locator('footer button').first().click()
  await card.locator('.pw-spell-open').click()
  const dialog=page.getByRole('dialog',{name:'Büyü ayrıntısı'})
  await dialog.getByRole('button',{name:'Büyüyü kullan ve kaydet',exact:true}).click()
  expect((await character(page)).usedSpellSlots[0]).toBe(0)
  await dialog.getByRole('button',{name:'Bugün için hazırla',exact:true}).click()
  await dialog.getByRole('button',{name:'Büyüyü kullan ve kaydet',exact:true}).click()
  await expect.poll(async()=>(await character(page)).usedSpellSlots[0]).toBe(1)
  await page.keyboard.press('Escape')
  const ritual=await spellCard(page,'detect-magic')
  await ritual.locator('footer button').first().click();await ritual.locator('.pw-spell-open').click()
  await dialog.getByRole('button',{name:'Ritüel uygula · yuva harcamaz',exact:true}).click()
  expect((await character(page)).usedSpellSlots[0]).toBe(1)
  expect((await character(page)).preparedSpells).not.toContain('detect-magic')
  await page.keyboard.press('Escape')
  await section(page,'Macerada')
  await page.getByRole('button',{name:'Kısa dinlenme',exact:true}).click()
  await page.getByRole('button',{name:'Kısa dinlenmeyi tamamla',exact:true}).click()
  expect((await character(page)).usedSpellSlots[0]).toBe(1)
})

test('warlock pact slots return on a short rest without healing or becoming ordinary slots',async({page})=>{
  await create(page,'warlock',2)
  const card=await spellCard(page,'hellish-rebuke')
  await card.locator('footer button').first().click();await card.locator('.pw-spell-open').click()
  await page.getByRole('dialog',{name:'Büyü ayrıntısı'}).getByRole('button',{name:'Büyüyü kullan ve kaydet',exact:true}).click()
  await expect.poll(async()=>(await character(page)).pactSlotsUsed).toBe(1)
  expect((await character(page)).usedSpellSlots.every((n:number)=>n===0)).toBe(true)
  await page.keyboard.press('Escape');await section(page,'Macerada')
  await page.getByLabel('Mevcut can',{exact:true}).fill('2')
  await page.getByRole('button',{name:'Kısa dinlenme',exact:true}).click();await page.getByRole('button',{name:'Kısa dinlenmeyi tamamla',exact:true}).click()
  await expect.poll(async()=>(await character(page)).pactSlotsUsed).toBe(0)
  expect((await character(page)).hp).toBe(2)
})

test('temporary HP, damage, capped healing and autosave survive a reload',async({page})=>{
  await create(page,'fighter',1);const before=await character(page)
  await section(page,'Macerada');await page.getByLabel('Geçici can',{exact:true}).fill('5')
  await page.getByLabel('Can değiştirme miktarı').fill('7');await page.getByRole('button',{name:'− 7 hasar',exact:true}).click()
  await expect.poll(async()=>(await character(page)).hp).toBe(before.hp-2)
  expect((await character(page)).tempHp).toBe(0)
  await page.getByLabel('Can değiştirme miktarı').fill('100');await page.getByRole('button',{name:'+ 100 iyileştir',exact:true}).click()
  await expect.poll(async()=>(await character(page)).hp).toBe(before.hp)
  await page.reload();await section(page,'Macerada');await expect(page.getByLabel('Mevcut can',{exact:true})).toHaveValue(String(before.hp))
})

test('private notes and character choices travel through a JSON backup to a fresh player browser',async({page,browser})=>{
  const requests:string[]=[];page.on('request',r=>{if(/\/dm\/|__aruzahr-broadcast/.test(r.url()))requests.push(r.url())})
  await create(page);await section(page,'Hikâye')
  await page.getByRole('textbox',{name:'Kişisel notlar',exact:true}).fill('OYUNCU-ÖZEL-28: borcumu kimse bilmiyor.')
  const pending=page.waitForEvent('download');await page.getByTitle('Karakter JSON yedeğini indir').click()
  const downloaded=await pending;const raw=await readFile((await downloaded.path())!,'utf8')
  expect(raw).toContain('OYUNCU-ÖZEL-28')
  const context=await browser.newContext();try{
    const fresh=await context.newPage();await fresh.goto('http://127.0.0.1:5173/#/play')
    await fresh.getByLabel('Karakter JSON dosyası').setInputFiles({name:'Yolcu.json',mimeType:'application/json',buffer:Buffer.from(raw)})
    await expect(fresh.getByRole('heading',{name:'Karlan Yolcusu',exact:true})).toBeVisible()
    await section(fresh,'Hikâye');await expect(fresh.getByRole('textbox',{name:'Kişisel notlar',exact:true})).toHaveValue('OYUNCU-ÖZEL-28: borcumu kimse bilmiyor.')
  }finally{await context.close()}
  expect(requests).toEqual([])
})

test('corrupt local character data stays untouched until the user imports a valid repair',async({page})=>{
  const broken='{"version":1,"broken":'
  await page.addInitScript(({key,broken})=>localStorage.setItem(key,broken),{key,broken})
  await page.goto('/#/play')
  await expect(page.getByRole('alert')).toContainText('Kayıt korunuyor')
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(broken)
  const valid=await page.evaluate(async()=>{const path='/src/player/model.ts';return (await import(path)).newPlayerCharacter('wizard')})
  await page.getByLabel('Karakter JSON dosyası').setInputFiles({name:'Onarim.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(valid))})
  await expect(page.getByRole('heading',{name:valid.name,exact:true})).toBeVisible()
  expect((await character(page)).id).toBe(valid.id)
})

test('custom spell import is separate from built-in SRD rows and preserves the character on an invalid import',async({page})=>{
  await create(page);await section(page,'Büyüler')
  const custom=structuredClone(customPlayerSpellTemplate);custom.spells[0].name='Karlan Kıvılcımı';custom.spells[0].id='karlan-test-kivilcimi'
  await page.getByLabel('Özel büyü JSON dosyası').setInputFiles({name:'buyu.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(custom))})
  await page.getByRole('searchbox',{name:'Türkçe veya İngilizce büyü ara'}).fill('Karlan Kıvılcımı')
  const card=page.locator('[data-spell-id="karlan-test-kivilcimi"]');await expect(card).toBeVisible();await card.locator('footer button').first().click()
  await expect.poll(async()=>(await character(page)).spellbook).toContain('karlan-test-kivilcimi')
  custom.spells[0].id='magic-missile'
  await page.getByLabel('Özel büyü JSON dosyası').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(custom))})
  await expect(page.locator('.pw-toast')).toContainText('Yerleşik SRD')
  expect((await character(page)).spellbook).toContain('karlan-test-kivilcimi')
  await expect(card).toBeVisible()
})

test('Life Domain spells are always prepared without occupying normal preparation slots',async({page})=>{
  await create(page,'cleric',1);await page.getByLabel('Sınıf yolu / alt sınıf').selectOption('life')
  const card=await spellCard(page,'bless');await expect(card).toContainText('Her zaman hazır')
  await card.locator('.pw-spell-open').click();await page.getByRole('dialog',{name:'Büyü ayrıntısı'}).getByRole('button',{name:'Büyüyü kullan ve kaydet',exact:true}).click()
  await expect.poll(async()=>(await character(page)).usedSpellSlots[0]).toBe(1)
  expect((await character(page)).preparedSpells).not.toContain('bless')
})

test('mobile creation, spell browsing and the A4 preview remain reachable without horizontal page overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});await create(page)
  for(const tab of ['Kimlik','Nitelikler','Macerada','Büyüler','Eşya','Hikâye','A4 kâğıt']){
    await section(page,tab)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),tab).toBe(false)
  }
  await expect(page.getByTestId('player-sheet-core')).toBeVisible()
  await expect(page.getByRole('button',{name:'Yazdır / PDF',exact:true})).toBeVisible()
})
