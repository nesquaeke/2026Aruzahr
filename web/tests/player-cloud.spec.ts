import { test, expect, type Page } from '@playwright/test';

const host='https://jrjwhgjqykztacijwwcr.supabase.co';
const storageKey='aruzahr-player-characters-v1';
async function openCloud(page:Page){
  await page.getByText('Hesabım ve bulut kayıtları',{exact:true}).click();
  return page.locator('.pw-cloud');
}

test('cloud stays idle before login and does not send local characters automatically',async({page})=>{
  const calls:string[]=[];
  await page.route(`${host}/**`,async route=>{calls.push(route.request().url());await route.abort();});
  await page.goto('/#/play');
  const panel=await openCloud(page);
  await expect(panel.getByRole('button',{name:'Giriş yap',exact:true})).toBeVisible();
  await expect(panel.getByLabel('Parola',{exact:true})).toHaveAttribute('type','password');
  expect(calls).toEqual([]);
});

test('explicit cloud backup and restore preserve the original; logout clears access',async({page})=>{
  const requests:{path:string;auth:string|undefined}[]=[];
  let snapshot:unknown;
  await page.route(`${host}/**`,async route=>{
    const req=route.request(), u=new URL(req.url());
    requests.push({path:u.pathname,auth:req.headers().authorization});
    let data:unknown=[];
    if(u.pathname==='/auth/v1/token')data={access_token:'test-access-token',user:{id:'test-owner',email:'player@example.com'}};
    else if(req.method()==='POST'&&u.pathname==='/rest/v1/player_snapshots'){
      const body=req.postDataJSON();expect(body.owner_id).toBe('test-owner');snapshot=body.payload;
    } else if(u.searchParams.get('select')==='payload')data=[{payload:snapshot}];
    else if(snapshot)data=[{id:'snapshot-id',name:'Karlan Yolcusu',created_at:'2026-10-29T12:00:00Z'}];
    await route.fulfill({status:200,json:data});
  });
  await page.goto('/#/play');
  await page.getByRole('button',{name:'Karakter oluştur',exact:true}).click();
  const dialog=page.getByRole('dialog',{name:'Yeni karakter oluştur'});
  await dialog.getByLabel('Yeni karakterin adı').fill('Karlan Yolcusu');
  await dialog.getByRole('button',{name:'Karakter defterini aç'}).click();
  const before=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).characters[0],storageKey);
  const panel=await openCloud(page);
  await panel.getByLabel('E-posta',{exact:true}).fill('player@example.com');
  await panel.getByLabel('Parola',{exact:true}).fill('example-password');
  await panel.getByRole('button',{name:'Giriş yap',exact:true}).click();
  await expect(panel.getByText('Henüz bulut kaydı yok.',{exact:true})).toBeVisible();
  await panel.getByLabel('Kaydedilecek karakter').selectOption(before.id);
  await panel.getByRole('button',{name:'Buluta yeni yedek kaydet',exact:true}).click();
  await expect(panel.getByRole('button',{name:'Cihazıma kopyala',exact:true})).toBeVisible();
  expect(snapshot).toEqual(before);
  await panel.getByRole('button',{name:'Cihazıma kopyala',exact:true}).click();
  await expect(panel.getByRole('status')).toContainText('Yerel kopya açıldı');
  const after=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).characters,storageKey);
  expect(after).toHaveLength(2);expect(after[0]).toEqual(before);
  expect(after[1].id).not.toBe(before.id);expect(after[1].name).toBe('Karlan Yolcusu (buluttan)');
  await panel.getByRole('button',{name:'Çıkış yap',exact:true}).click();
  await expect(panel.getByRole('button',{name:'Giriş yap',exact:true})).toBeVisible();
  expect(requests.filter(r=>r.path.startsWith('/rest/')).every(r=>r.auth==='Bearer test-access-token')).toBe(true);
  const local=await page.evaluate(()=>JSON.stringify(localStorage));
  expect(local).not.toContain('test-access-token');expect(local).not.toContain('example-password');
});

test('missing SQL table is explained without replacing local records',async({page})=>{
  await page.route(`${host}/**`,async route=>{
    if(new URL(route.request().url()).pathname==='/auth/v1/token')await route.fulfill({json:{access_token:'test-token',user:{id:'owner',email:'a@example.com'}}});
    else await route.fulfill({status:404,json:{code:'PGRST205',message:'missing relation'}});
  });
  await page.goto('/#/play');const panel=await openCloud(page);
  await panel.getByLabel('E-posta',{exact:true}).fill('a@example.com');
  await panel.getByLabel('Parola',{exact:true}).fill('long-password');
  await panel.getByRole('button',{name:'Giriş yap',exact:true}).click();
  await expect(panel.getByRole('status')).toContainText('Supabase SQL Editor');
  await expect(panel.getByRole('button',{name:'Bulut listesini yenile'})).toBeEnabled();
});
