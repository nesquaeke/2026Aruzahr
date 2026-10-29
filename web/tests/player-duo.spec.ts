import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {importPlayerFile} from '../src/player/model';
import {characterById} from '../src/lore/characters';
import {portraitFor} from '../src/media';
import {macSmallSkill,ciotelSmallSkill} from '../src/lore/player-small-skills';
import {longRest,shortRest} from '../src/player/model';

test('portable Ciotel file is valid, anonymous and preserves uploaded mechanical values',()=>{
 const text=readFileSync('public/downloads/Ciotel-Veyr-Aruzahr.json','utf8'),raw=JSON.parse(text),character=importPlayerFile(text)[0];
 const audit=JSON.parse(readFileSync('../docs/gelistirme/CIOTEL_KARAKTER_KAYDI.json','utf8'));
 const stable=(v:any):string=>JSON.stringify(v&&typeof v==='object'?Array.isArray(v)?v.map((x:any)=>JSON.parse(stable(x))):Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(stable(v[k]))])):v);
 const mechanical=Object.fromEntries(audit.mechanicalFields.map((k:string)=>[k,raw[k]]));
 expect(createHash('sha256').update(stable(mechanical)).digest('hex')).toBe(audit.mechanicalSha256);
 expect(character.name).toBe('Ciotel Veyr');expect(character.playerName).toBe('');expect(character.notes).toBe('');
 expect(character.classId).toBe('rogue');expect(character.level).toBe(1);expect(character.hp).toBe(9);
 expect(character.scores).toEqual({str:10,dex:16,con:12,int:15,wis:12,cha:10});
 expect(character.portrait).toMatch(/^data:image\/webp;base64,/);expect(Buffer.byteLength(text)).toBeLessThan(750000);
 expect(character.skillProficiencies).not.toContain('persuasion');expect(character.expertise).toEqual([]);
 expect(character.resources).toEqual([...audit.originalResources,audit.authorizedAddedResource]);
 expect(character.resources.at(-1)).toMatchObject({id:'ciotel-cikis-gozu',max:1,used:0,reset:'long'});
 const used={...character,resources:character.resources.map(r=>({...r,used:1}))};
 expect(shortRest(used).resources.at(-1)?.used).toBe(1);expect(longRest(used).resources.at(-1)?.used).toBe(0);
 expect(macSmallSkill).toMatchObject({max:1,used:0,reset:'long'});
 expect(macSmallSkill.description).toContain('tepkini harcayarak');
 expect(ciotelSmallSkill.description).toContain('d20 +2 +1d4');
 expect(characterById('ciotella')?.city).toBe('morihael');expect(characterById('ciotella')?.origin).toBe('Frostbay');
 expect(portraitFor('jeremiah')?.src).toBe('/illustrations/jeremiah-remaster.webp');
});

test('both character biographies have their new portraits and the requested story',async({page})=>{
 await page.goto('/#/wiki/ciotel-veyr');
 await expect(page.getByRole('heading',{name:'Ciotel Veyr',exact:true})).toBeVisible();
 await expect(page.getByTestId('abilities-ciotella').locator('dd strong')).toHaveText(['10','16','12','15','12','10']);
 await expect(page.getByRole('link',{name:'Oyuncu Masası için karakter dosyasını indir'})).toHaveAttribute('href','/downloads/Ciotel-Veyr-Aruzahr.json');
 await expect(page.locator('.hero-portrait-button img')).toHaveAttribute('src','/illustrations/ciotella.webp');
 await expect(page.locator('.wiki-article')).toContainText('Arkadaşları içeride kaldı');
 await expect(page.locator('.wiki-article')).toContainText('Çıkış Gözü');
 await page.goto('/#/wiki/jeremiah');
 await expect(page.getByRole('heading',{name:'Jeremiah',exact:true})).toBeVisible();
 await expect(page.locator('.hero-portrait-button img')).toHaveAttribute('src','/illustrations/jeremiah-remaster.webp');
 await expect(page.locator('.wiki-article')).toContainText('yankı düğümü');
 await expect(page.locator('.wiki-article')).toContainText('İkna kontrollerine otomatik dezavantaj');
 await expect(page.locator('.wiki-article')).toContainText('Buz Kıymığı');
 await expect.poll(()=>page.locator('.hero-portrait-button img').evaluate((i:HTMLImageElement)=>i.naturalHeight)).toBe(1536);
});

test('aliases locate Ciotel and the gallery shows only the fresh Jeremiah portrait',async({page})=>{
 await page.goto('/#/characters');await page.getByLabel('Karakter adı veya görevi').fill('Ciotella');
 await expect(page.locator('.character-card[data-character-id="ciotella"]')).toBeVisible();
 await page.goto('/#/gallery');await page.getByLabel('Görsellerde ara').fill('Jeremiah');
 await expect(page.locator('.gallery-tile')).toHaveCount(1);
 await expect(page.locator('.gallery-tile img')).toHaveAttribute('src','/illustrations/jeremiah-remaster.webp');
 await page.setViewportSize({width:390,height:844});await page.goto('/#/wiki/ciotella');
 await expect(page.getByRole('heading',{name:'Ciotel Veyr',exact:true})).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
