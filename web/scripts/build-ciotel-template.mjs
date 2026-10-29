import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
const input=process.argv[2];if(!input)throw Error('Kullanım: node scripts/build-ciotel-template.mjs SOURCE.json');
const web=fileURLToPath(new URL('../',import.meta.url));
const source=JSON.parse(await readFile(input,'utf8'));
const server=await createServer({root:web,configFile:false,cacheDir:web+'node_modules/.vite-ciotel-template',server:{middlewareMode:true,watch:null},appType:'custom'});
try{
 const {ciotel}=await server.ssrLoadModule('/src/lore/player-duo.ts');
 const {ciotelSmallSkill}=await server.ssrLoadModule('/src/lore/player-small-skills.ts');
 const portrait=await readFile(web+'public/illustrations/ciotella.webp');
 const output={...source,id:'player-ciotel-veyr',name:ciotel.name,playerName:'',notes:'',createdAt:'2026-10-29T00:00:00.000Z',updatedAt:'2026-10-29T00:00:00.000Z',portrait:'data:image/webp;base64,'+portrait.toString('base64'),appearance:'Dikkat çekmeyen büyük, kapüşonlu bir pelerinin altında pahalı kumaşlardan iyi dikilmiş kıyafetler taşır. Gözünün üzerinde küçük bir çizik, dar bir keçi sakalı ve bir altın köpek dişi vardır. Hafif sırıtışı ile yerinde durmayan bakışı yüzünden eksik olmaz.',backstory:ciotel.sections.slice(0,4).flatMap(s=>s.paragraphs).join('\n\n')};
 // The user subsequently authorized one minor talent; all other mechanical
 // fields and every original resource remain unchanged.
 if((source.resources||[]).some(r=>r.id===ciotelSmallSkill.id))throw Error('Özgün yüklemeyi kullan; yeni yetenek zaten bu kaynakta var.');
 output.resources=[...(source.resources||[]),{...ciotelSmallSkill}];
 const excluded=new Set(['id','name','playerName','notes','createdAt','updatedAt','appearance','portrait','backstory','resources']);
 const fields=Object.keys(source).filter(k=>!excluded.has(k)).sort();
 const stable=v=>JSON.stringify(v&&typeof v==='object'?Array.isArray(v)?v.map(x=>JSON.parse(stable(x))):Object.fromEntries(Object.keys(v).sort().map(k=>[k,JSON.parse(stable(v[k]))])):v);
 const mechanical=c=>Object.fromEntries(fields.map(k=>[k,c[k]]));
 const sha=c=>createHash('sha256').update(stable(mechanical(c))).digest('hex');
 if(sha(source)!==sha(output))throw Error('Mekanik değerler değişmiş.');
 const encoded=JSON.stringify(output,null,2)+'\n';if(Buffer.byteLength(encoded)>750000)throw Error('Taşınabilir dosya bulut boyutunu aşıyor.');
 await writeFile(web+'public/downloads/Ciotel-Veyr-Aruzahr.json',encoded);
 await writeFile(web+'../docs/gelistirme/CIOTEL_KARAKTER_KAYDI.json',JSON.stringify({source:'Kullanıcının Ciotella-Aruzahr.json yüklemesi. Özgün dosya kişisel oyuncu adı içerdiğinden depoya kopyalanmadı.',mechanicalFields:fields,mechanicalSha256:sha(output),originalResources:source.resources||[],authorizedAddedResource:ciotelSmallSkill,publicChanges:['Yeni görünen ad ve ayrı şablon kimliği','Yeni portre ve düzenlenmiş görünüş/öykü','Kişisel oyuncu adı ve özel notlar boş bırakıldı','Son kullanıcı isteğiyle büyüsüz Çıkış Gözü, uzun dinlenmede 1 kullanım eklendi; diğer mekanikler ve özgün kaynaklar korundu'],bytes:Buffer.byteLength(encoded)},null,2)+'\n');
 console.log('Taşınabilir karakter dosyası hazır:',Buffer.byteLength(encoded),'bayt. Mekanik değerler korundu.');
}finally{await server.close();}
