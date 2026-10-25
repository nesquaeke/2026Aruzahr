import {test, expect} from '@playwright/test'
import { readFile } from 'node:fs/promises'
const secret='PRIVATE-ROADMAP-1129'
const step=(id:string,title:string)=>({id,title,summary:secret+' güncel olay',readAloud:'Kamusal okunacak metin',actions:['DM eylemi'],checks:['DC 12'],choices:[{label:'Seçim',result:secret+' sonuç',echo:secret+' yankı'}],backgroundId:'winter-ilac',portraitIds:['sena-erven','miren-aska'],publicTitle:'Marhalden · Revir'})
const pack={version:2,title:'Deneme kampanyası',quests:[{id:'test-a',title:'Görev A',body:secret+' not',location:'marhalden',objective:'Bir karar ver',people:['Sena: yardım ister'],steps:[step('a1','Varış'),step('a2','Karar')]},{id:'test-b',title:'Görev B',body:secret+' diğer not',steps:[step('b1','Yeni yer')]}]}
async function panel(page:any,name:string){await page.getByRole('navigation',{name:'Yönetim panelleri'}).getByRole('button',{name,exact:true}).click()}
async function boot(page:any){await page.goto('/#/broadcast/classic');await expect(page.getByTestId('broadcast-workspace')).toBeVisible()}
async function importPack(page:any){await panel(page,'Görevler');await page.getByTestId('broadcast-import-dm').setInputFiles({name:'dm.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(pack))});await expect(page.locator('.dm-now p').filter({hasText:secret+' güncel olay'})).toBeVisible()}
test('yapılandırılmış rehber sahneyi perde arkasında kurar, yalnız görselleri gösterir; karar ve adımlar yedekle korunur',async({page})=>{
 await boot(page);await importPack(page)
 const live=await page.context().newPage();await live.goto('/#/broadcast/live');await expect(live.getByTestId('broadcast-live')).toBeVisible()
 await page.getByTestId('dm-prepare-scene').click();await expect(live.getByTestId('broadcast-curtain')).toBeVisible();await expect(live.locator('.broadcast-actor')).toHaveCount(2)
 await expect(live.locator('[data-testid="broadcast-scene"] img')).toHaveAttribute('src','/illustrations/winter-ilac.webp')
 await page.getByTestId('dm-reveal-scene').click();await expect(live.getByTestId('broadcast-curtain')).toHaveCount(0)
 expect(await live.locator('body').innerText()).not.toContain(secret)
 await page.getByRole('button',{name:'Sonraki',exact:true}).click();await page.getByLabel('Oyuncuların kararı').fill(secret+' oyuncu kararı')
 await page.getByRole('button',{name:'Görevi tamamlandı işaretle',exact:true}).click()
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Defteri indir',exact:true}).click();const d=await pending;const saved=JSON.parse(await readFile((await d.path())!,'utf8'));expect(saved.progress.steps['test-a']).toBe(1);expect(saved.progress.done).toContain('test-a');expect(saved.progress.decisions['test-a']).toContain(secret)
 await page.reload();await panel(page,'Görevler');await expect(page.locator('.dm-step-counter')).toHaveText('SAHNE 2 / 2');await expect(page.getByLabel('Oyuncuların kararı')).toHaveValue(secret+' oyuncu kararı')
 await panel(page,'Oturum');const backup=page.waitForEvent('download');await page.getByRole('button',{name:'Oturum yedeğini indir',exact:true}).click();const b=await backup;expect(await readFile((await b.path())!,'utf8')).not.toContain(secret)
 await page.getByRole('navigation',{name:'Yönetim panelleri'}).getByRole('button',{name:'Görevler',exact:true}).click()
 await page.getByTestId('broadcast-import-dm').setInputFiles({name:'restored.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...pack,progress:{quest:'test-b',steps:{'test-b':0},done:['test-a'],decisions:{'test-a':'önceki karar'}}}))})
 await expect(page.getByTestId('broadcast-dm-notes')).toHaveValue(secret+' diğer not')
 await live.close()
})
test('ara ekranı bağımsız profilde eşleşir; sahneye dönünce portreler ve taşlar korunur',async({page,browser})=>{
 await boot(page);await importPack(page);await page.getByTestId('dm-prepare-scene').click();await page.getByTestId('dm-reveal-scene').click()
 const context=await browser.newContext(),live=await context.newPage();await live.goto('http://127.0.0.1:5173/#/broadcast/live');await expect(live.locator('.broadcast-actor')).toHaveCount(2)
 await page.getByLabel('Ara ekranı mesajı').fill('Çay molası · 10 dakika');await page.getByTestId('broadcast-break-toggle').click();await expect(live.getByTestId('broadcast-break')).toBeVisible();await expect(live.getByTestId('broadcast-break')).toContainText('Çay molası · 10 dakika')
 await page.getByTestId('broadcast-break-toggle').click();await expect(live.getByTestId('broadcast-break')).toHaveCount(0);await expect(live.locator('.broadcast-actor')).toHaveCount(2);await context.close()
})
for(const [width,height]of [[1920,1080],[3840,2160]])test(`izleyici ${width}×${height} alanı tam doldurur`,async({page})=>{
 await page.setViewportSize({width,height});await page.goto('/#/broadcast/live');const stage=page.getByTestId('broadcast-stage');await expect(stage).toBeVisible();const rect=await stage.boundingBox();expect(rect!.width).toBeCloseTo(width,0);expect(rect!.height).toBeCloseTo(height,0);expect(await page.locator('.broadcast-stage-heading>span').evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(width*.015);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width)
})
test('tüm site sıfırlama onay ister, özel kayıtları siler, başka uygulama anahtarına dokunmaz',async({page})=>{
 await boot(page);await importPack(page);await page.evaluate(()=>{localStorage.setItem('aruzahr-book-marks','{"test":1}');localStorage.setItem('unrelated-app','KEEP')})
 await panel(page,'Oturum');await page.getByRole('button',{name:'Bu cihazdaki tüm Aruzahr verilerini sıfırla',exact:true}).click();const dialog=page.getByRole('dialog');await expect(dialog.getByRole('button',{name:'Her şeyi sıfırla',exact:true})).toBeDisabled();await dialog.getByRole('button',{name:'Vazgeç',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('aruzahr-director-pack'))).toContain('Görev A')
 await page.getByRole('button',{name:'Bu cihazdaki tüm Aruzahr verilerini sıfırla',exact:true}).click();await dialog.getByLabel('Sıfırlama onayı').fill('SIFIRLA');await dialog.getByRole('button',{name:'Her şeyi sıfırla',exact:true}).click();await expect(page.getByTestId('broadcast-workspace')).toBeVisible();await expect(page.getByRole('dialog')).toHaveCount(0)
 const values=await page.evaluate(()=>({pack:localStorage.getItem('aruzahr-director-pack'),books:localStorage.getItem('aruzahr-book-marks'),unrelated:localStorage.getItem('unrelated-app')}));expect(values).toEqual({pack:null,books:null,unrelated:'KEEP'})
 await panel(page,'Görevler');await expect(page.locator('.dm-empty')).toBeVisible();await expect(page.getByTestId('broadcast-dm-notes')).toHaveValue('')
})
test('izleyici F ile tam ekrana geçer; hareket azaltma tercihinde ara döngüsü durur',async({page})=>{
 await boot(page);await page.getByTestId('broadcast-break-toggle').click();const live=await page.context().newPage();await live.goto('/#/broadcast/live');await expect(live.getByTestId('broadcast-break')).toBeVisible()
 await live.keyboard.press('f');await expect.poll(()=>live.evaluate(()=>!!document.fullscreenElement)).toBe(true);await live.keyboard.press('f');await expect.poll(()=>live.evaluate(()=>!!document.fullscreenElement)).toBe(false)
 await live.emulateMedia({reducedMotion:'reduce'});expect(await live.locator('.broadcast-break-map').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');await live.close()
})
