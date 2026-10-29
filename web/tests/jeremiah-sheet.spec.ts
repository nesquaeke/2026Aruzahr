import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {importPlayerFile,playerStorageKey,newPlayerCharacter,exportPlayers} from '../src/player/model';
import {derivedStats,skillBonus,savingThrow} from '../src/player/rules';

const file='public/downloads/Jeremiah-Aruzahr.json';
test('Jeremiah is playable as rogue 1 without premature magic or missing gear',()=>{
 const c=importPlayerFile(readFileSync(file,'utf8'))[0],stats=derivedStats(c);
 expect(c.name).toBe('Jeremiah');expect(c.playerName).toBe('');
 expect(c.classId).toBe('rogue');expect(c.level).toBe(1);expect(c.subclass).toBe('');
 expect(c.scores).toEqual({str:9,dex:16,con:12,int:15,wis:11,cha:15});
 expect(stats).toMatchObject({armorClass:14,maxHp:9,initiative:3,proficiency:2});
 expect(c.hp).toBe(9);expect(c.skillProficiencies).toHaveLength(6);
 expect(skillBonus(c,'stealth')).toBe(7);expect(skillBonus(c,'deception')).toBe(6);
 expect(savingThrow(c,'dex')).toBe(5);expect(savingThrow(c,'int')).toBe(4);
 expect(c.attacks.map(a=>a.damage)).toEqual(['1d8+3','1d6+3','1d4+3']);
 expect(c.attacks.every(a=>a.proficient&&a.ability==='dex')).toBe(true);
 expect(c.attacks[0].notes).toContain('ikinci kez ekleme');
 expect(c.equipment.some(e=>e.name==='Hançer'&&e.quantity===2)).toBe(true);
 expect(c.equipment.some(e=>e.name==='Ok'&&e.quantity===20)).toBe(true);
 expect(c.armorId).toBe('leather');expect(stats.slots.every(n=>n===0)).toBe(true);
 expect(c.spellbook).toEqual([]);expect(c.portrait).toMatch(/^data:image\/webp;base64,/);
 expect(c.notes).toContain('SINIF ONAYLANDI');expect(c.backstory).toContain('yankı düğümü');
 expect(Buffer.byteLength(readFileSync(file))).toBeLessThan(750000);
});

test('filled A4 PDF preserves the biography, weapons and final inventory details',()=>{
 const pdf='public/downloads/Jeremiah-Karakter-Defteri-A4.pdf';
 expect(execFileSync('pdfinfo',['public/downloads/Jeremiah-Karakter-Kagidi-A4.pdf'],{encoding:'utf8'})).toMatch(/Pages:\s+1\b/);
 const info=execFileSync('pdfinfo',[pdf],{encoding:'utf8'});
 const dimensions=info.match(/Page size:\s+([\d.]+) x ([\d.]+)/)!;
 expect(Math.abs(Number(dimensions[1])-595.28)).toBeLessThan(2);
 expect(Math.abs(Number(dimensions[2])-841.89)).toBeLessThan(2);
 const text=execFileSync('pdftotext',['-layout',pdf,'-'],{encoding:'utf8'});
 for(const value of ['Jeremiah','Gizli Saldırı','yankı düğümü','Kısa yay','Çantanın Tam Listesi','Kayıt eki'])expect(text).toContain(value);
 const c=importPlayerFile(readFileSync(file,'utf8'))[0];
 expect(text).toContain(c.equipment.at(-1)!.name);
});

test('wiki downloads work and importing Jeremiah preserves another player character',async({page})=>{
 const existing=newPlayerCharacter('fighter');existing.name='Mevcut Yolcu';
 await page.addInitScript(([key,value])=>localStorage.setItem(key,value),[playerStorageKey,exportPlayers([existing])]);
 await page.goto('/#/wiki/jeremiah');
 const pdf=page.getByRole('link',{name:'Portreli A4 karakter kâğıdını indir · PDF'});
 await expect(pdf).toHaveAttribute('href','/downloads/Jeremiah-Karakter-Kagidi-A4.pdf');
 const response=await page.request.get(await pdf.getAttribute('href')||'');expect(response.ok()).toBe(true);
 expect((await response.body()).subarray(0,5).toString()).toBe('%PDF-');
 await expect(page.getByRole('link',{name:'Oyuncu Masası için karakter dosyasını indir'})).toHaveAttribute('href','/downloads/Jeremiah-Aruzahr.json');
 await page.goto('/#/play');await page.getByLabel('Karakter JSON dosyası').setInputFiles(file);
 await expect(page).toHaveURL(/#\/play\/player-jeremiah-draft$/);
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)||'{}').characters?.map((c:{name:string})=>c.name),playerStorageKey)).toEqual(['Mevcut Yolcu','Jeremiah']);
});

test('standalone printable sheet fits its A4 core and has no network dependencies',async({page})=>{
 const requests:string[]=[];page.on('request',request=>requests.push(request.url()));
 await page.setContent(readFileSync('public/downloads/Jeremiah-Karakter-Kagidi-A4.html','utf8'));
 await page.emulateMedia({media:'print'});await page.evaluate(()=>document.fonts.ready);
 const bounds=await page.getByTestId('player-sheet-core').evaluate(e=>{const box=e.getBoundingClientRect(),footer=e.querySelector('.sheet-page-footer')!.getBoundingClientRect();return {height:box.height,footer:footer.bottom-box.top};});
 expect(bounds.height).toBeCloseTo(297*96/25.4,0);expect(bounds.footer).toBeLessThan(bounds.height-28);
 await expect(page.getByTestId('player-sheet-core').locator('.sheet-attack-row').first()).toContainText('1d8+3');
 expect(requests.filter(url=>url.startsWith('http'))).toEqual([]);
});
