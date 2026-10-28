import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const output=new URL('../public/downloads/',import.meta.url)
await mkdir(output,{recursive:true})
const gothic=await readFile(new URL('../public/fonts/GrenzeGotisch-Variable.ttf',import.meta.url))
let fontCSS="@font-face{font-family:'Aruzahr Gothic';font-style:normal;font-weight:100 900;src:url(data:font/ttf;base64,"+gothic.toString('base64')+") format('truetype');}\n"
const fontLicenses=['Grenze Gotisch\n'+await readFile(new URL('../public/licenses/GrenzeGotisch-OFL.txt',import.meta.url),'utf8')]
for(const [font,weights] of [['cormorant-garamond',[400,600]],['dm-sans',[400,500,600]]]){
  const fontRoot=new URL(`../node_modules/@fontsource/${font}/`,import.meta.url)
  fontLicenses.push(font+'\n'+await readFile(new URL('LICENSE',fontRoot),'utf8'))
  for(const weight of weights){
    const css=await readFile(new URL(weight+'.css',fontRoot),'utf8')
    for(const match of css.matchAll(/\/\*[^*]*-latin(?:-ext)?-[^*]*\*\/\s*@font-face\s*\{[^}]*\}/g)){
      const block=match[0],source=block.match(/url\(([^)]+\.woff2)\)/)?.[1]
      if(!source)throw Error('Font source missing')
      const data=await readFile(new URL(source,fontRoot))
      fontCSS+=block.replace(/src:\s*[^;]+;/,`src:url(data:font/woff2;base64,${data.toString('base64')}) format('woff2');`)+'\n'
    }
  }
}
await writeFile(new URL('YAZITIPI-LISANSLARI.txt',output),fontLicenses.join('\n\n—\n\n').replace(/[ \t]+$/gm,''))
const sheetCSS=(await readFile(new URL('../src/player/player-sheet.css',import.meta.url),'utf8')).replace(/@font-face\{font-family:'Aruzahr Gothic';[^}]+\}/g,'')
const server=await createServer({configFile:false,cacheDir:fileURLToPath(new URL('../node_modules/.vite-player-templates/',import.meta.url)),server:{middlewareMode:true,watch:null},appType:'custom',logLevel:'error'})
const templates=[]
try{
  const {default:PlayerSheet,BlankSpellPage}=await server.ssrLoadModule('/src/player/PlayerSheet.tsx')
  const rows=[
    {file:'Aruzahr-Karakter-Kagidi-A4',title:'Aruzahr · Karakter Kâğıdı · A4',element:React.createElement(PlayerSheet)},
    {file:'Aruzahr-Buyu-Defteri-A4',title:'Aruzahr · Büyü Defteri · A4',element:React.createElement('div',{className:'player-sheet-document'},React.createElement(BlankSpellPage))},
  ]
  for(const row of rows){
    const html=`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${row.title}</title><style>${fontCSS}\n${sheetCSS}\nbody{margin:0;background:#e3dfd4;color:#282724}.template-toolbar{max-width:210mm;margin:0 auto;padding:14px 18px;font:14px/1.5 'DM Sans',Arial,sans-serif;display:flex;gap:16px;align-items:center;justify-content:space-between}.template-toolbar button{font:inherit;background:#282724;color:#fff;border:0;border-radius:4px;padding:10px 16px;cursor:pointer}@media print{.template-toolbar{display:none!important}}</style></head><body><nav class="template-toolbar" aria-label="Yazdırma"><span>${row.title}<br><small>Ölçek %100 · Kâğıt A4 · Üst ve alt bilgileri kapat</small></span><button onclick="window.print()">Yazdır / PDF olarak kaydet</button></nav>${renderToStaticMarkup(row.element)}</body></html>`
    const path=new URL(row.file+'.html',output)
    await writeFile(path,html)
    templates.push({...row,path:fileURLToPath(path)})
  }
}finally{await server.close()}
if(process.argv.includes('--html-only')){
  console.log('Generated two self-contained A4 HTML character templates.')
  process.exit(0)
}
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']})
try{
  const report=[]
  for(const row of templates){
    const page=await browser.newPage({viewport:{width:1000,height:1250}})
    await page.setContent(await readFile(row.path,'utf8'),{waitUntil:'load'})
    await page.emulateMedia({media:'print'})
    await page.evaluate(()=>document.fonts.ready)
    const geometry=await page.locator('.aruzahr-sheet-page').evaluate(element=>{const box=element.getBoundingClientRect(),footer=element.querySelector('.sheet-page-footer').getBoundingClientRect();return{width:box.width,height:box.height,contentHeight:element.scrollHeight,footerBottom:footer.bottom-box.top}})
    if(Math.abs(geometry.width-210*96/25.4)>2||Math.abs(geometry.height-297*96/25.4)>2||geometry.footerBottom>geometry.height-28)throw Error('A4 template content overflow: '+JSON.stringify({file:row.file,...geometry}))
    await page.pdf({path:fileURLToPath(new URL(row.file+'.pdf',output)),format:'A4',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false})
    if(row.file==='Aruzahr-Karakter-Kagidi-A4'){
      const preview=await page.locator('.aruzahr-sheet-page').screenshot({animations:'disabled'})
      await sharp(preview).resize({width:700,withoutEnlargement:true}).webp({quality:92}).toFile(fileURLToPath(new URL('Aruzahr-Karakter-Kagidi-Onizleme.webp',output)))
    }
    report.push({file:row.file+'.pdf',...geometry})
    await page.close()
  }
  console.log(JSON.stringify(report,null,2))
}finally{await browser.close()}
