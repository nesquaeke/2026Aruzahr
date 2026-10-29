import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {parseSidePack} from '../src/side-quests';
import {artworks} from '../src/media';
import {bootStudio,panel,publicFrame,project} from './studio-fixtures';
const pack=parseSidePack(JSON.parse(readFileSync('public/dm/Yan-Gorevler.json','utf8')));
test('camp reuses the same bandits and all three old armored portraits are separate native images',async()=>{
 const q=pack.quests.find(q=>q.id==='sonmus-ocak')!;
 expect(q.steps).toHaveLength(3);expect(q.warning).toContain('AYNI kişilerdir');
 expect(q.steps[1].enemyIds).toEqual(['forest-len','forest-rusk','camp-tova-unit']);
 for(const [unitId,artId] of [['forest-len','camp-len'],['forest-rusk','camp-rusk'],['camp-tova-unit','camp-tova']]){
  expect(pack.units.filter(u=>u.id===unitId)).toHaveLength(1);
  expect(pack.units.find(u=>u.id===unitId)?.artId).toBe(artId);
  expect(artworks[artId].portrait).toBe(true);
  const m=await sharp('public'+artworks[artId].src).metadata();expect(m.width).toBe(1024);expect(m.height).toBe(1536);
 }
 expect(readFileSync('public/dm/Terk-Edilmis-Kamp.html','utf8')).toContain('Portreler ve savaş kartları');
});
test('all three portraits can be prepared from camp encounter cards without publishing',async({page})=>{
 await bootStudio(page);const before=JSON.stringify(await publicFrame(page));await panel(page,'Yan Görevler');
 const desk=page.getByTestId('side-quest-desk');await desk.getByRole('button',{name:/Sönmüş Ocak · Terk Edilmiş Kamp/}).click();
 await desk.getByRole('navigation',{name:'Yan görev adımları'}).getByRole('button',{name:'2 · Eski zırhların içindekiler'}).click();
 const portraits=desk.getByRole('button',{name:'Portreyi hazırlığa ekle',exact:true});await expect(portraits).toHaveCount(3);
 for(let i=0;i<3;i++)await portraits.nth(i).click();
 expect(JSON.stringify(await publicFrame(page))).toBe(before);
 await desk.getByRole('button',{name:'Bu karşılaşmayı savaş masasına ekle'}).click();
 await expect.poll(async()=>(await project(page)).encounter.items.length).toBe(3);
 const p=await project(page);expect(p.encounter.items.every((u:any)=>u.hidden)).toBe(true);expect(p.combatOnAir).toBe(false);
});
