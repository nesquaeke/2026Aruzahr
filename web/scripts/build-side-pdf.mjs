import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {chromium} from '@playwright/test';
const publicRoot=fileURLToPath(new URL('../public/',import.meta.url));
// JPEG encoding only for the PDF's embedded paintings; site originals stay intact.
const cache=new Map();
const server=createServer(async(req,res)=>{try{
  const path=resolve(publicRoot,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!path.startsWith(publicRoot.endsWith(sep)?publicRoot:publicRoot+sep)){res.writeHead(403);res.end();return;}
  let data=await readFile(path),type=path.endsWith('.html')?'text/html; charset=utf-8':path.endsWith('.svg')?'image/svg+xml':'application/octet-stream';
  if(path.endsWith('.webp')){if(!cache.has(path))cache.set(path,await sharp(data).jpeg({quality:83,mozjpeg:true}).toBuffer());data=cache.get(path);type='image/jpeg';}
  res.writeHead(200,{'Content-Type':type});res.end(data);
}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
  const page=await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/dm/Yan-Gorevler-Oynatim-Kitabi.html`);
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.complete?Promise.resolve():new Promise(resolve=>{i.onload=resolve;i.onerror=resolve;}))));
  const failures=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).map(i=>i.src));if(failures.length)throw Error('Eksik resim: '+failures.join(', '));
  const path=publicRoot+'dm/Hardlane-Yan-Gorevler-Oynatim-Kitabi.pdf';
  await page.pdf({path,format:'A4',printBackground:true,margin:{top:'12mm',bottom:'12mm',left:'12mm',right:'12mm'}});
  console.log('PDF:',(await stat(path)).size,'bayt; site tablolarının boyutu değişmedi.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
