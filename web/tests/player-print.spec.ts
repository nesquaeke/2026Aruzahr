import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const downloads=fileURLToPath(new URL('../public/downloads/',import.meta.url))
const information=(file:string)=>execFileSync('pdfinfo',[file],{encoding:'utf8'})
const extracted=(file:string)=>execFileSync('pdftotext',['-layout',file,'-'],{encoding:'utf8'})

test('both downloadable blank templates are single-page physical A4 PDFs with Turkish text',async()=>{
  for(const name of ['Aruzahr-Karakter-Kagidi-A4','Aruzahr-Buyu-Defteri-A4']){
    const file=downloads+name+'.pdf'
    expect((await readFile(file)).subarray(0,5).toString()).toBe('%PDF-')
    const info=information(file)
    expect(info).toMatch(/Pages:\s+1\b/)
    const size=info.match(/Page size:\s+([\d.]+) x ([\d.]+)/)!
    expect(size).toBeTruthy()
    expect(Math.abs(Number(size[1])-595.28)).toBeLessThan(2)
    expect(Math.abs(Number(size[2])-841.89)).toBeLessThan(2)
    const content=extracted(file)
    expect(content).toContain('ARUZAHR')
    expect(content).toContain(name.includes('Karakter')?'Beceriler':'Büyü Defteri')
    expect(content).not.toContain('Şaklus')
    const html=await readFile(downloads+name+'.html','utf8')
    expect(html).toContain('data:font/woff2;base64,')
    expect(html).toContain('lang="tr"')
  }
})

test('filled A4 printing retains zero values, arcanum usage and long records across continuation pages',async({page,context},testInfo)=>{
  test.setTimeout(60000)
  await context.addInitScript(()=>{window.print=()=>{document.documentElement.dataset.printRequested='true'}})
  // Let Vite discover the lazy server-renderer dependency before the browser
  // imports it; production already bundles this dependency with the editor.
  await expect(await page.request.get('/src/player/print.tsx')).toBeOK()
  // Exercise the real print module without coupling the document test to the
  // character editor's current tab or optional reference-panel imports.
  await page.goto('/#/wiki')
  const opened=context.waitForEvent('page')
  const printing=page.evaluate(async()=>{
    const {newPlayerCharacter}=await import('/src/player/model.ts')
    const {printPlayerSheet}=await import('/src/player/print.tsx')
    const character=newPlayerCharacter('warlock')
    character.name='İlven Şafakgölgesi'
    character.level=17;character.hp=0;character.tempHp=0;character.coins.gp=0
    character.arcanumUsed=[6]
    character.subclass='fiend';character.houseId='vaeranth'
    character.notes=('Yolcu, Karlan geçidindeki kayıp yükün ve eski sınır taşlarının izini sürer.\n').repeat(85)+'SON-KAYIT-İĞÜŞÖÇ'
    character.personality=('Sessiz bir gözlemci; sözünü tartarak verir.\n').repeat(10)
    character.equipment=Array.from({length:12},(_,i)=>({id:'gear-'+i,name:i===11?'Sondaki Harita Tüpü':'Karlan Geçidi İçin İşaretlenmiş Kışlık Yolcu Donanımı '+i,quantity:i+1,weight:2,notes:'Tam eşya notu '+i}))
    character.attacks=Array.from({length:6},(_,i)=>({id:'attack-'+i,name:'Uzun adlı sınır silahı '+i,ability:'dex' as const,proficient:true,damage:'1d6+3',damageType:'delici',notes:'Saldırı notu '+i}))
    character.resources=[{id:'resource-1',name:'Özel yolcu kaynağı',max:2,used:1,reset:'short' as const}]
    const spell={id:'print-test-spell',name:'Örnek Büyü Metni',englishName:'',level:1,school:'Koruma',classes:['warlock' as const],castingTime:'1 eylem',range:'30 fit',components:['V','S'],material:'',duration:'1 dakika',concentration:true,ritual:false,description:('Büyünün bütün ayrıntıları ve kurtulma koşulları burada yazılıdır.\n').repeat(25)+'BÜYÜ-METNİNİN-SONU',higherLevels:'Üst derecede hedef sayısı artar.',source:'Yalnız yazdırma denemesi'}
    character.spellbook=[spell.id]
    await printPlayerSheet(character,[spell])
  })
  const popup=await opened
  await popup.waitForLoadState('domcontentloaded')
  await printing
  await expect(popup.getByTestId('player-sheet-core')).toBeVisible()
  const core=popup.getByTestId('player-sheet-core')
  // Read exact labelled fields to distinguish a printed 0 from a blank line.
  const values=await core.locator('.sheet-field').evaluateAll(fields=>Object.fromEntries(fields.map(field=>[field.querySelector(':scope > span')?.textContent,field.querySelector(':scope > div')?.textContent])))
  expect(values.Güncel).toBe('0')
  expect(values.Geçici).toBe('0')
  await expect(popup.getByTestId('player-sheet-spells')).toContainText('Gizemli Sır · 6. derece')
  await expect(popup.getByTestId('player-sheet-spells')).toContainText('Bugün kullanıldı')
  await expect(popup.getByTestId('player-sheet-appendix')).toContainText('Sondaki Harita Tüpü')
  await expect(popup.getByTestId('player-sheet-appendix')).toContainText('Saldırı notu 5')
  await popup.emulateMedia({media:'print'})
  const bounds=await core.evaluate(element=>{const box=element.getBoundingClientRect(),footer=element.querySelector('.sheet-page-footer')!.getBoundingClientRect();return{width:box.width,height:box.height,footerBottom:footer.bottom-box.top}})
  expect(bounds.width).toBeCloseTo(210*96/25.4,0)
  expect(bounds.height).toBeCloseTo(297*96/25.4,0)
  expect(bounds.footerBottom).toBeLessThan(bounds.height-28)
  const file=testInfo.outputPath('filled-character-A4.pdf')
  await popup.pdf({path:file,format:'A4',preferCSSPageSize:true,printBackground:true})
  expect(Number(information(file).match(/Pages:\s+(\d+)/)![1])).toBeGreaterThan(2)
  const content=extracted(file)
  for(const marker of ['SON-KAYIT-İĞÜŞÖÇ','BÜYÜ-METNİNİN-SONU','Sondaki Harita Tüpü','Saldırı notu 5','Özel yolcu kaynağı'])expect(content).toContain(marker)
  await popup.close()
})
