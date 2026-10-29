import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const old=JSON.parse(readFileSync('tests/fixtures/bridge-previous.json','utf8'));
const fresh=JSON.parse(readFileSync('public/dm/On-Kis-Karari-DM.json','utf8'));
test('bridge rewrite preserves scene identity and updates supplied text without overwriting DM edits',async({page})=>{
 await page.goto('/#/atlas');
 const result=await page.evaluate(async({old,fresh})=>{
  const {upgradeBuiltinCampaign}=await import('/src/builtin-campaign.ts');
  const saved=structuredClone(fresh);saved.edition=old.edition;saved.quests[1]=structuredClone(old.quest);
  saved.quests[1].steps[1].readAloud='DM KENDİ METNİ';
  return await upgradeBuiltinCampaign(saved,fresh);
 },{old,fresh});
 expect(result.quests[1].steps.map((s:any)=>s.id)).toEqual(old.quest.steps.map((s:any)=>s.id));
 expect(result.quests[1].steps[1].readAloud).toBe('DM KENDİ METNİ');
 expect(result.quests[1].steps[0].readAloud).toBe(fresh.quests[1].steps[0].readAloud);
 expect(result.quests[1].briefing.arrival).toContain('BATI = parti');
 for(let i=0;i<10;i++)if(i!==1)expect(result.quests[i]).toEqual(fresh.quests[i]);
});
