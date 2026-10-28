import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const root=fileURLToPath(new URL('../',import.meta.url)),output=new URL('../public/downloads/',import.meta.url)
await mkdir(output,{recursive:true})
const server=await createServer({root,configFile:false,plugins:[react()],cacheDir:fileURLToPath(new URL('../node_modules/.vite-slate-export/',import.meta.url)),server:{host:'127.0.0.1',port:5188,strictPort:true},logLevel:'error'})
await server.listen()
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})
const report=[]
try{
 for(const [kind,name] of [['starting','Aruzahr-Yayin-Basliyor-1080p'],['ending','Aruzahr-Yayin-Sona-Erdi-1080p']]){
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1})
  await page.goto(`http://127.0.0.1:5188/#/broadcast/${kind}?capture=1`)
  await page.waitForFunction(()=>window.__aruzahrSlate?.ready)
  const duration=await page.evaluate(()=>window.__aruzahrSlate.duration),fps=30,frames=duration*fps
  const read=seconds=>page.evaluate(seconds=>{window.__aruzahrSlate.draw(seconds);return document.querySelector('canvas').toDataURL('image/jpeg',.96).split(',')[1]},seconds)
  if(await read(0)!==await read(duration))throw Error(kind+': döngünün iki ucu eşleşmiyor')
  await page.locator('canvas').screenshot({path:fileURLToPath(new URL(name+'-Onizleme.png',output))})
  const path=fileURLToPath(new URL(name+'.mp4',output))
  const ffmpeg=spawn(process.env.FFMPEG_PATH||'ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-vcodec','mjpeg','-i','pipe:0','-an','-vf','scale=in_range=full:out_range=limited:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-preset','medium','-tune','stillimage','-crf','18','-pix_fmt','yuv420p','-color_range','tv','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-movflags','+faststart','-metadata','title=ARUZAHR '+kind,path],{stdio:['pipe','inherit','inherit']})
  const finished=once(ffmpeg,'close');ffmpeg.stdin.on('error',()=>{})
  for(let i=0;i<frames;i++){
   const data=Buffer.from(await read(i/fps),'base64')
   if(!ffmpeg.stdin.write(data))await once(ffmpeg.stdin,'drain')
   if(i%120===0)console.log(kind+': '+i+'/'+frames+' kare')
  }
  ffmpeg.stdin.end();const [code]=await finished;if(code!==0)throw Error('FFmpeg başarısız: '+code)
  const bytes=await readFile(path)
  report.push({kind,file:name+'.mp4',width:1920,height:1080,fps,duration,frames,audio:false,sourceWidth:1672,sourceHeight:941,loopEndpointsIdentical:true,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')})
  await page.close()
 }
 await writeFile(new URL('Aruzahr-Yayin-Ekranlari.json',output),JSON.stringify({format:'aruzahr-broadcast-slates',version:1,technique:'İki özgün yağlıboya yorum üzerinde sabit kamera, periyodik kar/sis ve ışık kompoziti. Üretken video değildir.',videos:report},null,2)+'\n')
 console.log(JSON.stringify(report,null,2))
}finally{await browser.close();await server.close()}
