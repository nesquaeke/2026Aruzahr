import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';
import sharp from 'sharp';

const web=fileURLToPath(new URL('../',import.meta.url)),out=web+'public/downloads/';
const server=await createServer({root:web,configFile:false,cacheDir:web+'node_modules/.vite-jeremiah-sheet',server:{middlewareMode:true,watch:null},appType:'custom',logLevel:'error'});
let character,markup;
try{
 const {newPlayerCharacter,parsePlayerCharacter}=await server.ssrLoadModule('/src/player/model.ts');
 const {derivedStats,maxHitPoints}=await server.ssrLoadModule('/src/player/rules.ts');
 const {applyStarterEquipment,addCatalogAttack,equipCatalogArmor}=await server.ssrLoadModule('/src/player/equipment-catalog.ts');
 const {jeremiahRevision}=await server.ssrLoadModule('/src/lore/player-duo.ts');
 const {characterAbilities}=await server.ssrLoadModule('/src/character-abilities.ts');
 const {default:PlayerSheet}=await server.ssrLoadModule('/src/player/PlayerSheet.tsx');
 const scores=characterAbilities.jeremiah;
 character={...newPlayerCharacter('rogue'),id:'player-jeremiah-draft',name:'Jeremiah',playerName:'',createdAt:'2026-10-29T00:00:00.000Z',updatedAt:'2026-10-29T00:00:00.000Z',level:1,subclass:'',raceId:'human',backgroundId:'custom',origin:'Elorwyn · Lirendil ÇelikKalkan',houseId:'',alignment:'Belirlenmedi',scores:Object.fromEntries(['str','dex','con','int','wis','cha'].map((key,i)=>[key,scores[i]])),skillProficiencies:['acrobatics','sleight-of-hand','stealth','investigation','deception','persuasion'],expertise:['stealth','deception'],languages:'Ortak Dil; Elfçe*; Hırsız Argosu',tools:'Hırsız aletleri; kılık değiştirme seti*',appearance:'Genç yetişkin insan; koyu dalgalı saç, yeşil gözler, dar yüz, rahat fakat dikkatli bakış. Yıpranmış koyu pelerin, şişe yeşili kumaş ceket ve boğazı sıkmayan soluk erik rengi atkı. Sıfırdan yeni portredeki görünüş yorumu.',personality:'Ayrıntıları aklında tutar; kısa konuşur, şakasını bazen bakışıyla tamamlar.',ideals:'Soyadına değil, kendi aklına ve seçtiği insanlara dayanmak ister.',bonds:'Lirendil ÇelikKalkan; Gil ve Volomiyr. Ailesinin adı geçmiş bölümünde açıklanır.',flaws:'Yardım istemekte zorlanır; tehlikeli bir denemeyi şakayla küçümser.',backstory:jeremiahRevision.sections.slice(0,4).flatMap(s=>s.paragraphs).join('\n\n'),notes:[
  'SINIF ONAYLANDI: Kullanıcı 1. seviye Düzenbaz, ileride Arcane Trickster seçti. Alt sınıf 3. seviyede seçilir. İnsan soyu anlatıya göre kullanıldı. Nitelikler, yetkinlikler ve özel geçmiş aşağıda belirtilen düzenlenebilir başlangıç seçimleridir.',
  'Nitelikler sitedeki mevcut editoryal Jeremiah değerleri: STR 9 / DEX 16 / CON 12 / INT 15 / WIS 11 / CHA 15. Atış/puan yöntemi ayrıca DM ile onaylanır. İnsan soy bonusu ikinci kez eklenmedi.',
  'Beceriler: sınıftan Akrobasi, El Çabukluğu, Gizlilik ve Araştırma; özel geçmişten Aldatma ve İkna. Uzmanlık: Gizlilik ve Aldatma. * işaretli Elfçe ve kılık değiştirme seti yetkinliği özel geçmiş için taslak seçimlerdir. Araç yetkinliği, ekipman bulundurmakla aynı değildir; kılık değiştirme seti ayrıca satın alınmadı.',
  'Gizli Saldırı 1d6: tur başına bir kez, finesse veya menzilli bir silahla isabet edince; avantaj ya da hedefin 5 fit yakınında etkisiz olmayan başka düşmanı gerekir. Dezavantaj varken uygulanmaz. Her saldırıya eklenmez; ayrı saldırı zarı atılmaz. Bu kâğıttaki sayaçlar otomatik ek hasar uygulamaz.',
  '1. seviyede Kurnaz Eylem, Arcane Trickster alt sınıfı, büyü yuvaları veya sınıf büyüleri yok. Kurnaz Eylem 2., Arcane Trickster seçimi 3. seviyede gelir. Doğuştan büyü ve yankı düğümü mevcut seviyede yalnız anlatıdır; ücretsiz büyü, otomatik dezavantaj veya sözlü bileşen yasağı yaratmaz.',
  'Envanter sınıfın meç/kısa yay başlangıç seçimi ve hırsız çantasıdır; deri zırh ayrıca kuşanıldı. Başlangıç altını veya ikinci bir geçmiş donanım paketi eklenmedi. Geçmişin ek maddi varlıklarını oyuncu/DM ayrıca belirler.',
  'This work includes material taken from the System Reference Document 5.1 (SRD 5.1) by Wizards of the Coast LLC: https://dnd.wizards.com/resources/systems-reference-document. Licensed under CC BY 4.0: https://creativecommons.org/licenses/by/4.0/legalcode. Türkçe çeviri ve kısaltma: Aruzahr, 2026.',
 ].join('\n\n')};
 character.hp=maxHitPoints(character);
 Object.assign(character,applyStarterEquipment(character));
 Object.assign(character,equipCatalogArmor(character,'leather-armor'));
 for(const id of ['rapier','shortbow','dagger'])Object.assign(character,addCatalogAttack(character,id));
 // This ready-to-play sheet prints the complete ordinary hit damage. The
 // catalog normally stores base dice with the modifier explained in notes.
 character.attacks=character.attacks.map(attack=>({...attack,damage:attack.damage+'+3',notes:attack.notes.replace(/Hasar zarı temel değerdir;[^\n]+/,'Çeviklik +3 yukarıdaki hasara DAHİLDİR; ikinci kez ekleme. İki hafif hançerle iki silah dövüşünün bonus eylem saldırısı 1d4 hasar verir; +3 eklenmez. Meç hafif değildir. Direnç, kritik ve Gizli Saldırı ayrıca değerlendirilir.')}));
 character.portrait='data:image/webp;base64,'+(await readFile(web+'public/illustrations/jeremiah-remaster.webp')).toString('base64');
 character=parsePlayerCharacter(character);
 await writeFile(out+'Jeremiah-Aruzahr.json',JSON.stringify(character,null,2)+'\n');
 // Catalog provenance stays in the editable JSON (duplicate-safe catalog
 // operations use it); repeated technical markers do not belong on paper.
 const cleanNotes=text=>text.split('\n').filter(line=>!/^\[(SRD:|Başlangıç:)/.test(line)).join('\n');
 const printCharacter={...character,equipment:character.equipment.map(item=>({...item,notes:cleanNotes(item.notes)})),attacks:character.attacks.map(attack=>({...attack,notes:cleanNotes(attack.notes)})),portrait:'data:image/jpeg;base64,'+(await sharp(web+'public/illustrations/jeremiah-remaster.webp').jpeg({quality:87,mozjpeg:true}).toBuffer()).toString('base64')};
 markup=renderToStaticMarkup(React.createElement(PlayerSheet,{character:printCharacter,spells:[]}));
 await writeFile(web+'../docs/gelistirme/JEREMIAH_KAGIT_KAYDI.json',JSON.stringify({status:'Sınıf ve seviye kullanıcı tarafından onaylandı; nitelikler mevcut editoryal kayıt, yetkinlikler ve özel geçmiş düzenlenebilir başlangıç seçimleri',level:1,classId:character.classId,futureSubclass:'arcane-trickster (3. seviyede)',scores:character.scores,derived:derivedStats(character),equipment:character.equipment.length,attacks:character.attacks.map(a=>({name:a.name,damage:a.damage,ability:a.ability})),privatePlayerNamePublished:false},null,2)+'\n');
}finally{await server.close();}

let fontCSS='';const licenseParts=[];
for(const [family,path,format] of [['Enchanted Land','public/fonts/EnchantedLand/Enchanted Land.otf','opentype'],['Aruzahr Gothic','public/fonts/GrenzeGotisch-Variable.ttf','truetype']]){
 const bytes=await readFile(web+path);fontCSS+=`@font-face{font-family:'${family}';font-weight:${family==='Aruzahr Gothic'?'100 900':'400'};src:url(data:font/${format==='opentype'?'otf':'ttf'};base64,${bytes.toString('base64')}) format('${format}');}\n`;
}
licenseParts.push(await readFile(web+'public/fonts/EnchantedLand/readme.txt','utf8'),await readFile(web+'public/licenses/GrenzeGotisch-OFL.txt','utf8'),await readFile(web+'public/licenses/SRD-5.1.txt','utf8'),await readFile(web+'public/licenses/5e-database-MIT.txt','utf8'));
for(const [font,weights] of [['cormorant-garamond',[400,600]],['dm-sans',[400,500,600]]]){
 const dir=web+`node_modules/@fontsource/${font}/`;licenseParts.push(await readFile(dir+'LICENSE','utf8'));
 for(const weight of weights){const css=await readFile(dir+weight+'.css','utf8');for(const m of css.matchAll(/\/\*[^*]*-latin(?:-ext)?-[^*]*\*\/\s*@font-face\s*\{[^}]*\}/g)){const block=m[0],source=block.match(/url\(([^)]+\.woff2)\)/)?.[1];if(!source)throw Error('Font bulunamadı.');const bytes=await readFile(dir+source);fontCSS+=block.replace(/src:\s*[^;]+;/,`src:url(data:font/woff2;base64,${bytes.toString('base64')}) format('woff2');`)+'\n';}}
}
const sheetCSS=(await readFile(web+'src/player/player-sheet.css','utf8')).replace(/@font-face\{[^}]+\}/g,'');
const html=`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Jeremiah · A4 karakter kâğıdı · 1. seviye Düzenbaz</title><style>${fontCSS}\n${sheetCSS}\nbody{margin:0;background:#ded6c3}.toolbar{max-width:210mm;margin:auto;padding:18px;font:14px/1.7 'DM Sans',Arial,sans-serif}.player-sheet-document .sheet-page-header h2{font:400 25pt/1 'Enchanted Land','Cormorant Garamond',Georgia,serif;letter-spacing:.01em}.sheet-flow-page .sheet-appendix-section{margin-top:2.8mm}.sheet-flow-page .sheet-appendix-section>h3{font-size:14pt;padding-bottom:.8mm;margin-bottom:1.3mm}.sheet-flow-page .sheet-appendix-section p{font-size:8.5pt;line-height:1.45}.sheet-flow-page .sheet-appendix-item{margin:1.6mm 0;padding-bottom:1.6mm;break-inside:avoid}.sheet-flow-page .sheet-appendix-item p{font-size:8pt;line-height:1.35}.toolbar button{padding:10px 16px;cursor:pointer}@media print{.toolbar{display:none}}</style></head><body><nav class="toolbar"><strong>Jeremiah · D&amp;D 5e 2014 · 1. seviye Düzenbaz</strong><p>Portre, hikâye ve donanım dolu. Sınıf onaylandı; nitelik, beceri ve özel geçmiş seçimleri düzenlenebilir. Yazdırırken A4, %100 ölçek, üst-alt bilgiler kapalı.</p><button onclick="window.print()">Yazdır / PDF kaydet</button></nav>${markup}</body></html>`;
await writeFile(out+'Jeremiah-Karakter-Kagidi-A4.html',html);await writeFile(out+'Jeremiah-Yazitipi-Lisanslari.txt',licenseParts.join('\n\n---\n\n'));
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 const page=await browser.newPage({viewport:{width:1000,height:1250}});await page.setContent(html,{waitUntil:'load'});await page.emulateMedia({media:'print'});await page.evaluate(()=>document.fonts.ready);
 const bounds=await page.locator('.aruzahr-sheet-page').first().evaluate(e=>{const r=e.getBoundingClientRect(),f=e.querySelector('.sheet-page-footer').getBoundingClientRect();return {width:r.width,height:r.height,footerBottom:f.bottom-r.top};});
 if(Math.abs(bounds.width-210*96/25.4)>2||Math.abs(bounds.height-297*96/25.4)>2||bounds.footerBottom>bounds.height-28)throw Error('A4 içerik taşması: '+JSON.stringify(bounds));
 await page.pdf({path:out+'Jeremiah-Karakter-Kagidi-A4.pdf',format:'A4',preferCSSPageSize:true,printBackground:true,pageRanges:'1'});
 await page.pdf({path:out+'Jeremiah-Karakter-Defteri-A4.pdf',format:'A4',preferCSSPageSize:true,printBackground:true});
 await page.locator('.aruzahr-sheet-page').first().screenshot({path:'/tmp/jeremiah-sheet-preview.png'});
 await sharp('/tmp/jeremiah-sheet-preview.png').resize({width:800,withoutEnlargement:true}).webp({quality:92}).toFile(out+'Jeremiah-Karakter-Kagidi-Onizleme.webp');
 console.log('JSON, bağımsız HTML, A4 PDF ve önizleme hazır.',bounds);
}finally{await browser.close();}
