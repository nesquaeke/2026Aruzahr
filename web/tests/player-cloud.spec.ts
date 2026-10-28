import { test, expect } from '@playwright/test';

test('unconfigured cloud explains setup without sending player data', async ({page})=>{
  const calls:string[]=[];
  page.on('request',request=>{if(request.url().includes('supabase.co'))calls.push(request.url());});
  await page.goto('/#/play');
  await page.getByText('Hesabım ve bulut kayıtları',{exact:true}).click();
  await expect(page.getByText('Bulut bağlantısı henüz kurulmadı.',{exact:false})).toBeVisible();
  expect(calls).toEqual([]);
  await expect(page.getByTestId('player-workshop')).toBeVisible();
});
