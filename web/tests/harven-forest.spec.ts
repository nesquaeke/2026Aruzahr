import {test,expect} from '@playwright/test';
import {readFileSync,existsSync} from 'node:fs';
import {parseSidePack} from '../src/side-quests';
import {artworks} from '../src/media';
import {bootStudio,panel,publicFrame} from './studio-fixtures';
const pack=parseSidePack(JSON.parse(readFileSync('public/dm/Yan-Gorevler.json','utf8')));
test('forest route is connected, has three small encounters and separate real artwork',()=>{
 const q=pack.quests.find(q=>q.id==='harven-orman-yolu')!;
 expect(q.steps).toHaveLength(6);expect(q.steps[0].exits).toEqual(['pusu']);
 for(const r of q.steps){expect(existsSync('public'+artworks[r.artId].src)).toBe(true);for(const id of r.enemyIds)expect(pack.units.some(u=>u.id===id)).toBe(true);}
 expect(q.steps.filter(r=>r.enemyIds.length)).toHaveLength(3);
 expect(q.steps[4].truth).toContain('en fazla 5 gümüş');expect(q.steps[4].truth).toContain('silah, zırh');
 expect(pack.units.find(u=>u.id==='forest-kokdis')?.hp).toBe(9);
 expect(q.steps[3].truth).toContain('uyku ilacı veya zehir yok');
 expect(readFileSync('public/dm/Harven-Orman-Yolu.html','utf8')).toContain('Küçük savaş kartları');
});
test('new adventure and images are reachable in the DM desk without changing the broadcast',async({page})=>{
 await bootStudio(page);const before=JSON.stringify(await publicFrame(page));await panel(page,'Yan Görevler');
 const desk=page.getByTestId('side-quest-desk');await desk.getByRole('button',{name:/Harven Yolu · Üç Sessiz İşaret/}).click();
 await expect(desk.getByRole('heading',{name:'1 · Üç yol, bir işaret'})).toBeVisible();
 await desk.getByRole('navigation',{name:'Yan görev adımları'}).getByRole('button',{name:'2 · Devrilen çam'}).click();
 await expect(desk).toContainText('Len');await expect(desk).toContainText('Rusk');
 expect(JSON.stringify(await publicFrame(page))).toBe(before);
});
