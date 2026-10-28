import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { bootStudio, publicFrame } from './studio-fixtures'

for (const kind of ['starting','ending'] as const) {
  test(`${kind}: independent OBS output keeps the camera static and returns to the identical frame after one period`, async ({page}) => {
    const privateCalls:string[]=[]
    page.on('request',request=>{if(/__aruzahr|\/dm\//.test(request.url()))privateCalls.push(request.url())})
    await page.goto(`/#/broadcast/${kind}?capture=1`)
    await page.waitForFunction(()=>window.__aruzahrSlate?.ready)
    const result=await page.evaluate(()=>{
      const render=window.__aruzahrSlate!,canvas=document.querySelector('canvas')!,ctx=canvas.getContext('2d')!
      render.draw(0);const first=canvas.toDataURL(),inside=ctx.getImageData(900,100,500,650).data.slice(),stone=ctx.getImageData(400,800,200,100).data.slice()
      render.draw(5);const moving=canvas.toDataURL(),stoneAfter=ctx.getImageData(400,800,200,100).data
      render.draw(render.duration);const last=canvas.toDataURL()
      return{loop:first===last,motion:first!==moving,staticStone:stone.every((v,i)=>v===stoneAfter[i]),width:canvas.width,height:canvas.height,insideLength:inside.length}
    })
    expect(result).toMatchObject({loop:true,motion:true,staticStone:true,width:1920,height:1080})
    expect(privateCalls).toEqual([])
    await expect(page.getByRole('navigation')).toHaveCount(0)
    await expect(page.locator('audio,video')).toHaveCount(0)
  })
}

test('reduced-motion output stays still, covers a 4K screen without scrolling, and never loads the private game',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.setViewportSize({width:3840,height:2160})
  await page.goto('/#/broadcast/starting')
  await page.waitForFunction(()=>{const canvas=document.querySelector('canvas');return canvas&&canvas.width===3840})
  // Fonts and artwork are asynchronous; wait until the image is actually painted.
  await expect.poll(()=>page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).getContext('2d')!.getImageData(100,100,1,1).data[3])).toBe(255)
  const first=await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).toDataURL())
  await page.waitForTimeout(150)
  expect(await page.locator('canvas').evaluate(c=>(c as HTMLCanvasElement).toDataURL())).toBe(first)
  expect(await page.evaluate(()=>({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight}))).toEqual({w:3840,h:2160})
})

test('library has both real downloads, previews and a complete camera and music guide',async({page,request})=>{
  await page.goto('/#/broadcast/screens')
  await expect(page.getByRole('heading',{name:'Hikâyenin iki eşiği.'})).toBeVisible()
  await expect(page.getByRole('link',{name:'MP4 indir',exact:true})).toHaveCount(2)
  for(const link of await page.getByRole('link',{name:'MP4 indir',exact:true}).all())expect((await request.get((await link.getAttribute('href'))!)).ok()).toBe(true)
  const guide=await request.get('/downloads/Aruzahr-OBS-Kurulum-Rehberi.md')
  expect(guide.ok()).toBe(true)
  expect(await guide.text()).toContain('Spotify kişisel dinleme içindir')
  await page.setViewportSize({width:390,height:844})
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390)
})

test('opening the slate library from the DM desk leaves the live game unchanged',async({page})=>{
  await bootStudio(page)
  const before=await publicFrame(page)
  const opening=page.waitForEvent('popup')
  await page.getByRole('link',{name:'Yayın ekranları ↗',exact:true}).click()
  const popup=await opening
  await expect(popup.getByRole('heading',{name:'Hikâyenin iki eşiği.'})).toBeVisible()
  expect(await publicFrame(page)).toEqual(before)
  await popup.close()
})

test('both delivered MP4s have valid 1080p H264 streams, 600 frames, 20 seconds and no bundled audio',async()=>{
  const manifest=JSON.parse(await readFile('public/downloads/Aruzahr-Yayin-Ekranlari.json','utf8'))
  expect(manifest.videos).toHaveLength(2)
  for(const video of manifest.videos){
    const path='public/downloads/'+video.file
    const bytes=await readFile(path)
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(video.sha256)
    const info=JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',path],{encoding:'utf8'}))
    expect(info.streams).toHaveLength(1)
    expect(info.streams[0]).toMatchObject({codec_type:'video',codec_name:'h264',width:1920,height:1080,pix_fmt:'yuv420p',color_range:'tv',color_space:'bt709',nb_frames:'600',avg_frame_rate:'30/1'})
    expect(Number(info.format.duration)).toBeCloseTo(20,2)
    expect(video.loopEndpointsIdentical).toBe(true)
    expect(bytes.length).toBeLessThan(20*1024*1024)
  }
})
