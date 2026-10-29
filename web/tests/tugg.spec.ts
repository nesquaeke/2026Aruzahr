import {expect,test} from '@playwright/test';
import {characterById} from '../src/lore/characters';
import {characterAbilities} from '../src/character-abilities';

test('player source is preserved and broadcast portrait has no invented map location',async({page})=>{
  expect(characterAbilities.tugg).toEqual([12,16,13,10,10,8]);
  expect(characterById('tugg')?.city).toBe('');
  expect(characterById('tugg')?.locationUnknown).toBe(true);
  await page.goto('/#/characters');
  const asset=await page.evaluate(async()=>{
    const source='/src/BroadcastLibrary.tsx';
    const {broadcastAssets}=await import(source);
    return broadcastAssets.find((a:{id:string})=>a.id==='tugg');
  });
  expect(asset?.src).toBe('/illustrations/tugg.webp');
  expect(asset?.locationId).toBeUndefined();
});

test('Mac is searchable, has an ordinary frame, readable stats and an enlarged portrait',async({page})=>{
  await page.goto('/#/characters');
  await page.getByLabel('Karakter adı veya görevi').fill('Mac');
  const entry=page.locator('.character-directory-entry').filter({has:page.locator('[data-character-id="tugg"]')});
  await expect(entry).toHaveCount(1);
  await expect(entry).toContainText('Konumu bilinmiyor');
  await expect(entry.locator('.character-card')).toHaveAttribute('data-power-tier','ordinary');
  await entry.getByRole('link',{name:/Hayatı ve bağları/}).click();
  await expect(page.getByRole('heading',{name:'Mac',exact:true})).toBeVisible();
  await expect(page.getByTestId('character-passport')).toContainText('Bilinmiyor');
  await expect(page.getByTestId('abilities-tugg').locator('dd strong')).toHaveText(['12','16','13','10','10','8']);
  await page.getByRole('button',{name:'Mac portresini büyüt'}).click();
  const dialog=page.getByRole('dialog',{name:'Görsel galerisi'});
  await expect(dialog).toBeVisible();
  await expect.poll(()=>dialog.locator('img').first().evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBe(1024);
});

test('gallery portrait links back to the character wiki and unknown location does not appear under a country',async({page})=>{
  await page.goto('/#/gallery');
  await page.getByLabel('Görsellerde ara').fill('Mac');
  await expect(page.locator('.gallery-tile').filter({has:page.getByRole('img',{name:'Mac',exact:true})})).toHaveCount(1);
  await page.getByRole('button',{name:'Mac: Karakteri tanı'}).click();
  await expect(page.getByRole('heading',{name:'Mac',exact:true})).toBeVisible();
  await page.goto('/#/characters');
  await page.getByLabel('Karakter adı veya görevi').fill('Mac');
  await page.getByLabel('Karakterin ülkesi').selectOption('danstsud');
  await expect(page.locator('.character-directory-entry [data-character-id="tugg"]')).toHaveCount(0);
});

test('new Mac address and old Tugg address both open Mac biography',async({page})=>{
  for(const path of ['mac','tugg']){
    await page.goto('/#/wiki/'+path);
    await expect(page.getByRole('heading',{name:'Mac',exact:true})).toBeVisible();
    await expect(page.getByTestId('abilities-tugg').locator('dd strong')).toHaveText(['12','16','13','10','10','8']);
  }
});
