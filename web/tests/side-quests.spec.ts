import {expect,test} from '@playwright/test';
import {readFileSync,existsSync} from 'node:fs';
import {parseSidePack,rigSolved,drawSideLoot} from '../src/side-quests';
import {artworks} from '../src/media';
import {bootStudio,panel,project,publicFrame} from './studio-fixtures';
test.describe.configure({mode:'serial'});
const pack=parseSidePack(JSON.parse(readFileSync('public/dm/Yan-Gorevler.json','utf8')));
test('dungeon is connected, has an alternative exit, exactly three guards and real separate artwork files',()=>{
  expect(pack.quests.map(q=>q.steps.length)).toEqual([8,3,3,6,3]);
  for(const q of pack.quests)for(const r of q.steps){expect(artworks[r.artId],r.artId).toBeDefined();expect(existsSync('public'+artworks[r.artId].src)).toBe(true);for(const link of r.exits)expect(q.steps.some(x=>x.id===link)).toBe(true);}
  expect(pack.units.filter(u=>u.kind==='ally')).toHaveLength(3);
  expect(pack.units.filter(u=>u.id==='bren'||u.id==='dessa')).toHaveLength(2);
  const traversed=new Set<string>(), todo=['agiz'];
  while(todo.length){const id=todo.pop()!;if(traversed.has(id))continue;traversed.add(id);todo.push(...pack.quests[0].steps.find(r=>r.id===id)!.exits);}
  expect(traversed.has('damar')).toBe(true);expect(traversed.has('atolye')).toBe(true);
  expect(Object.values(artworks).some(a=>a.src.includes('DM-Haritasi'))).toBe(false);
  expect(pack.loot.filter(i=>i.draw)).toHaveLength(5);
});
test('rig has exactly one solution and reward draws never repeat or create a fourth item by themselves',()=>{
  const answers:number[][]=[];
  for(const a of [1,2,3,5,8])for(const b of [1,2,3,5,8])for(const c of [1,2,3,5,8])if(rigSolved(a,b,c))answers.push([a,b,c]);
  expect(answers).toEqual([[2,3,5]]);
  const used:string[]=[];for(let i=0;i<5;i++){const draw=drawSideLoot(pack.loot,used,1)!;expect(used).not.toContain(draw.item.id);used.push(draw.item.id);}
  expect(drawSideLoot(pack.loot,used,1)).toBeNull();expect(()=>drawSideLoot(pack.loot,[],21)).toThrow();
});
test('DM reads and saves side quests without changing the main campaign or on-air scene',async({page})=>{
  await bootStudio(page);const before=JSON.stringify(await publicFrame(page));
  const main=await page.evaluate(()=>localStorage.getItem('aruzahr-director-pack'));
  await panel(page,'Yan Görevler');const desk=page.getByTestId('side-quest-desk');
  await expect(desk.getByRole('heading',{name:'Frostbay · Aynı leke'})).toBeVisible();
  await desk.getByLabel('Özel yan görev notum').fill('ÖZEL SIR: örnek not, canlıya gitmez.');
  await desk.getByRole('button',{name:'10 dakika keşif geçti'}).click();
  await desk.getByRole('button',{name:'10 dakika keşif geçti'}).click();
  await desk.getByRole('button',{name:'10 dakika keşif geçti'}).click();
  await expect(desk.locator('.sq-clock')).toContainText('Üç muhafız girişe ulaştı');
  await desk.getByLabel('Yan görevlerde ara').fill('Orvek');
  await expect(desk.locator('.sq-search-results button')).not.toHaveCount(0);
  await desk.locator('.sq-search-results button').first().click();
  await expect(desk.locator('.sq-brief')).toContainText('Evde Üç Kişi Var');
  expect(JSON.stringify(await publicFrame(page))).toBe(before);
  expect(await page.evaluate(()=>localStorage.getItem('aruzahr-director-pack'))).toBe(main);
  await expect.poll(async()=>(await project(page)).journal.find((e:any)=>e.id==='sidequests-progress-v1')?.text).toContain('ÖZEL SIR');
  await page.screenshot({path:'/tmp/aruzahr-side-quests.png',fullPage:false});
});
test('repair gates the rig, wrong settings remain recoverable, ore cannot be claimed twice and progress survives reload',async({page})=>{
  await bootStudio(page);await panel(page,'Yan Görevler');const desk=page.getByTestId('side-quest-desk');
  await desk.getByRole('button',{name:'Maden aracı',exact:true}).click();
  await desk.getByRole('button',{name:'Aracı dene',exact:true}).click();
  await expect(desk.getByRole('status')).toContainText('tamamlanmadan araç çalışmaz');
  const rig=desk.locator('.sq-rig');for(let i=0;i<3;i++)await rig.getByRole('checkbox').nth(i).check();
  for(let i=0;i<3;i++)await rig.getByRole('button',{name:'Aracı dene',exact:true}).click();
  await expect(rig.getByRole('button',{name:'Aracı dene',exact:true})).toBeDisabled();
  await rig.getByRole('button',{name:'Havalığı temizle · 1 dakika'}).click();
  await rig.getByLabel('A · ön kol',{exact:true}).selectOption('2');await rig.getByLabel('B · orta kol',{exact:true}).selectOption('3');await rig.getByLabel('C · arka kol',{exact:true}).selectOption('5');
  await rig.getByRole('button',{name:'Aracı dene',exact:true}).click();await rig.getByRole('button',{name:'Soluköz çekirdeğini al',exact:true}).click();
  await expect(rig.getByRole('button',{name:'Tek çekirdek alındı'})).toBeDisabled();
  await expect.poll(async()=>(await project(page)).journal.find((e:any)=>e.id==='sidequests-progress-v1')?.text).toContain('"ore":true');
  await page.reload();await expect(page.getByTestId('studio-workspace')).toBeVisible();await panel(page,'Yan Görevler');await desk.getByRole('button',{name:'Maden aracı',exact:true}).click();
  await expect(desk.getByRole('button',{name:'Tek çekirdek alındı'})).toBeDisabled();
});
test('three distinct player rewards are recorded privately and a fourth is blocked',async({page})=>{
  await bootStudio(page);await panel(page,'Yan Görevler');const desk=page.getByTestId('side-quest-desk');
  await desk.getByRole('button',{name:'Ganimet ve zar',exact:true}).click();
  await desk.getByRole('checkbox',{name:'Sandık güvene alındı; dağıtımı aç'}).check();
  for(const name of ['Mac','Oyuncu İki','Oyuncu Üç']){
    await desk.getByLabel('Ganimet alacak kişi').fill(name);await desk.getByLabel('Ganimet d20 sonucu').fill('1');await desk.getByRole('button',{name:'Ödülü kaydet',exact:true}).click();
  }
  await desk.getByLabel('Ganimet alacak kişi').fill('Dördüncü');await expect(desk.getByRole('button',{name:'Ödülü kaydet',exact:true})).toBeDisabled();
  await expect.poll(async()=>{const entry=(await project(page)).journal.find((e:any)=>e.id==='sidequests-progress-v1');return entry?JSON.parse(entry.text).awards.length:0;}).toBe(3);
  const state=JSON.parse((await project(page)).journal.find((e:any)=>e.id==='sidequests-progress-v1').text);
  expect(state.awards).toHaveLength(3);expect(new Set(state.awards.map((a:any)=>a.item)).size).toBe(3);
  expect(JSON.stringify(await publicFrame(page))).not.toContain('Oyuncu İki');
});
test('art is prepared before explicit take and dungeon enemies are hidden on the combat desk',async({page})=>{
  await bootStudio(page);await panel(page,'Yan Görevler');const desk=page.getByTestId('side-quest-desk');const before=JSON.stringify(await publicFrame(page));
  await desk.getByRole('button',{name:'Bu sahne resmini hazırla'}).click();
  expect(JSON.stringify(await publicFrame(page))).toBe(before);
  await expect.poll(async()=>(await project(page)).draft.scene.id).toBe('side-frostbay-market');
  await page.getByTestId('studio-take').click();
  await expect.poll(async()=>(await publicFrame(page)).scene.id).toBe('side-frostbay-market');
  expect(JSON.stringify(await publicFrame(page))).not.toContain('Kör Terazi');
  await desk.getByRole('button',{name:'3 · Yazı odası',exact:true}).click();
  await desk.getByRole('button',{name:'Bu karşılaşmayı savaş masasına ekle'}).click();
  await expect.poll(async()=>(await project(page)).encounter.items.find((u:any)=>u.id==='side-unit-bren')?.hidden).toBe(true);
  const p=await project(page);expect(p.encounter.items.find((u:any)=>u.id==='side-unit-bren').hidden).toBe(true);expect(p.combatOnAir).toBe(false);
  await panel(page,'Yan Görevler');await desk.getByRole('button',{name:'Bu karşılaşmayı savaş masasına ekle'}).click();
  expect((await project(page)).encounter.items.filter((u:any)=>u.id==='side-unit-bren')).toHaveLength(1);
});
test('audience route never requests the private side quest packet',async({page})=>{
  const dm:string[]=[];page.on('request',r=>{if(r.url().includes('/dm/'))dm.push(r.url());});
  await page.goto('/#/broadcast/live');await expect(page.getByTestId('broadcast-live')).toBeVisible();expect(dm).toEqual([]);
});

test('gallery has eight uncropped item studies and the guild article uses its own painting',async({page})=>{
  await page.goto('/#/gallery');
  await page.getByRole('button',{name:/Eşyalar & madenler/}).click();
  await expect(page.locator('.gallery-tile-item')).toHaveCount(8);
  await expect.poll(()=>page.locator('.gallery-tile-item img').first().evaluate((i:HTMLImageElement)=>i.naturalHeight)).toBe(1536);
  await expect(page.locator('.gallery-tile-item img').first()).toHaveCSS('object-fit','contain');
  await page.goto('/#/wiki/marhalden-uc-muhur');
  await expect(page.locator('.article-cover')).toHaveCSS('background-image',/side-marhalden-guild/);
});
