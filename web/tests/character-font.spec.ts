import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {bootStudio,panel} from './studio-fixtures';
test.describe.configure({mode:'serial'});

test('uploaded font and license remain intact; Turkish character name uses the actual font on mobile',async({page})=>{
  const response=await page.request.get('/fonts/EnchantedLand/Enchanted%20Land.otf');
  expect(await response.body()).toEqual(readFileSync('public/fonts/EnchantedLand/Enchanted Land.otf'));
  expect((await page.request.get('/fonts/EnchantedLand/readme.txt')).status()).toBe(200);
  await page.setViewportSize({width:390,height:844});await page.goto('/#/wiki/mac');
  await expect(page.getByRole('heading',{name:'Mac',exact:true})).toBeVisible();
  await page.evaluate(()=>document.fonts.load('32px "Enchanted Land"','Çığ Şövalyesi İdil Üçışık'));
  await expect(page.locator('.character-nameplate strong').first()).toHaveCSS('font-family',/Enchanted Land/);
  await expect(page.locator('.article-title h1')).toHaveCSS('font-family',/Enchanted Land/);
  const session=await page.context().newCDPSession(page);await session.send('DOM.enable');await session.send('CSS.enable');
  const {root}=await session.send('DOM.getDocument');const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector:'.article-title h1'});
  const {fonts}=await session.send('CSS.getPlatformFontsForNode',{nodeId});
  expect(fonts.some(f=>f.familyName==='Enchanted Land'&&f.glyphCount>0)).toBe(true);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({path:'/tmp/aruzahr-enchanted-mac.png'});
});

test('broadcast portrait names use the new typeface even after lazy studio styles load',async({page})=>{
  await bootStudio(page);await panel(page,'Kişi / yer bul');
  const directory=page.locator('.studio-center').getByTestId('studio-directory');
  await directory.getByRole('searchbox',{name:'Kişi, yer ve karşılaşma bul'}).fill('Mac');
  await directory.locator('[data-directory-id="tugg"]').click();
  await directory.getByRole('button',{name:/Portreyi hazırlığa ekle/}).click();
  await panel(page,'Sahne');
  await expect(page.locator('.studio-center .broadcast-actor-name').filter({hasText:'Mac'}).first()).toHaveCSS('font-family',/Enchanted Land/);
});
