import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { deflateRawSync } from 'node:zlib'

const dir = new URL('../public/dm/', import.meta.url)
const jsonName = 'On-Kis-Karari-DM.json'
const raw = await readFile(new URL(jsonName, dir), 'utf8')
const pack = JSON.parse(raw)
if (pack.quests.length !== 10 || pack.quests.reduce((n, q) => n + q.steps.length, 0) !== 30)
  throw new Error('Ready campaign must contain 10 quests and 30 scenes.')
const esc = text => String(text || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const para = text => `<p>${esc(text)}</p>`
const quote = text => `<blockquote>${esc(text)}</blockquote>`
const facts = quick => `<dl><dt>Nerede?</dt><dd>${esc(quick.where)}</dd><dt>Ne zaman?</dt><dd>${esc(quick.time)}</dd><dt>Amacın ne?</dt><dd>${esc(quick.goal)}</dd><dt>Sonra?</dt><dd>${esc(quick.next)}</dd></dl>`
const markdown = ['# On Kış Kararı — Hazır Hikâye', '', 'Siteyi açınca hikâye hazır gelir. Şifre girmen veya dosya yüklemen gerekmez. Bu dosya, DM için indirilebilir okuma kopyasıdır. Oyunculara yalnız seçtiğin görsel ve başlık gösterilir; kendi notlarını bu kitaba ekleyip paylaşmadan önce gözden geçir.', '', 'Ana rota: Marhalden → Batı Aldara yük köprüsü → Harven → Mavric → Frostbay. Ternhaven ve Dranthol ayrıca kararlaştırılan ek sevktir. Cevher Çizgisi tamamlanmış yol değildir.', '']
const chapters = []
const route = ['# Yol Haritası', '', 'Bölümler bir yük sözleşmesiyle bağlanır. Aşağıdaki sıra bir yönetim yardımıdır; oyuncular bir seçeneği reddettiğinde zorunlu ceza veya gizli felaket ekleme.', '']
for (const [qi, q] of pack.quests.entries()) {
  const b = q.briefing
  markdown.push(`# ${qi + 1}. ${q.title}`, '', `Nerede: ${q.quick.where}`, `Ne zaman: ${q.quick.time}`, `Amaç: ${q.quick.goal}`, `Sonra: ${q.quick.next}`, '', '## Bölüm başlangıcı', '', b.previous, '', b.arrival, '', b.purpose, '', '### Oyunculara oku', '', '> ' + b.opening.replaceAll('\n', '\n> '), '', '### Kim kimdir?', '')
  route.push(`## ${qi + 1}. ${q.title}`, '', `**Yer:** ${q.quick.where}`, '', `**Zaman:** ${q.quick.time}`, '', `**Yapılacak:** ${q.quick.goal}`, '', `**Devam:** ${q.quick.next}`, '')
  for (const c of b.cast) markdown.push(`**${c.name} — ${c.role}**`, '', `İstediği: ${c.wants}`, '', `İlk karşılaşma: ${c.meeting}`, '', '> ' + c.line, '')
  markdown.push('İlk sahneye geçiş: ' + b.transition, '')
  const sceneHtml = []
  for (const [si, s] of q.steps.entries()) {
    markdown.push(`## ${qi + 1}.${si + 1}. ${s.title}`, '', `Nerede: ${s.quick.where}`, `Ne zaman: ${s.quick.time}`, `Amaç: ${s.quick.goal}`, `Sonra: ${s.quick.next}`, '', `Gösterilecek sahne: ${s.publicTitle}`, '', '### Oyunculara oku', '', '> ' + s.readAloud.replaceAll('\n', '\n> '), '', '### Sırayla oynat', '')
    for (const beat of s.runbook.beats) markdown.push(`**${beat.title}**`, '', beat.text, '', ...(beat.line ? ['> ' + beat.line, ''] : []))
    markdown.push('### Oyuncular sorarsa', '')
    for (const qa of s.runbook.questions) markdown.push(`**${qa.question}**`, '', qa.answer, '')
    markdown.push('### Kontroller ve ek notlar', '', ...s.checks.map(x => '- ' + x), ...s.actions.map(x => '- ' + x), '', '### Kararlar ve yankılar', '')
    for (const c of s.choices) markdown.push(`**${c.label}**`, '', c.result, '', 'Sonraki yankı: ' + c.echo, '')
    markdown.push('Sonraki geçiş: ' + s.runbook.next, '')
    sceneHtml.push(`<section class="scene" id="${esc(s.id)}"><span class="eyebrow">SAHNE ${qi + 1}.${si + 1}</span><h3>${esc(s.title)}</h3>${facts(s.quick)}<div class="visual">Gösterilecek manzara: <strong>${esc(s.publicTitle)}</strong></div><h4>Oyunculara oku</h4>${quote(s.readAloud)}<h4>Sırayla oynat</h4><ol>${s.runbook.beats.map(beat => `<li><h5>${esc(beat.title)}</h5>${para(beat.text)}${beat.line ? quote(beat.line) : ''}</li>`).join('')}</ol><details><summary>Oyuncular sorarsa</summary>${s.runbook.questions.map(qa => `<h5>${esc(qa.question)}</h5>${para(qa.answer)}`).join('')}</details><details><summary>Zarlar ve ek notlar</summary><ul>${[...s.checks, ...s.actions].map(x => `<li>${esc(x)}</li>`).join('')}</ul></details><details><summary>Kararlar ve sonraki yankıları</summary>${s.choices.map(c => `<h5>${esc(c.label)}</h5>${para(c.result)}${para(c.echo)}`).join('')}</details><aside><strong>Buradan sonra</strong>${para(s.runbook.next)}</aside></section>`)
  }
  chapters.push(`<article id="${esc(q.id)}"><span class="eyebrow">BÖLÜM ${qi + 1}</span><h2>${esc(q.title)}</h2>${facts(q.quick)}<details open><summary>Nasıl başlatırım?</summary>${para(b.previous)}${para(b.arrival)}${para(b.purpose)}${quote(b.opening)}<aside><strong>İlk sahneye geçiş</strong>${para(b.transition)}</aside></details><details><summary>Kim kimdir?</summary>${b.cast.map(c => `<h4>${esc(c.name)}</h4>${para(c.role)}<p><strong>İstediği:</strong> ${esc(c.wants)}</p><p><strong>İlk karşılaşma:</strong> ${esc(c.meeting)}</p>${quote(c.line)}`).join('')}</details>${sceneHtml.join('')}<a class="top" href="#bas">Bölüm listesine dön ↑</a></article>`)
}
const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>On Kış Kararı — DM Oynatım Kitabı</title><style>*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#131715;color:#e3ddcd;font:19px/1.8 Georgia,serif}main{max-width:930px;margin:auto;padding:56px 28px}h1,h2,h3,h4,h5{line-height:1.2;color:#f0e8d5}h1{font-size:clamp(2.4rem,6vw,4rem)}h2{font-size:2.6rem}h3{font-size:1.9rem}h4{font-size:1.25rem}h5{font-size:1.1rem;margin-bottom:8px}a{color:#d5b985}nav{display:grid;gap:8px;padding:24px;background:#1b211d}article{border-top:1px solid #4b513f;padding-top:56px;margin-top:56px}.eyebrow{font:12px/1.5 system-ui;letter-spacing:.2em;color:#b6bc9f}dl{display:grid;grid-template-columns:120px 1fr;gap:9px 20px;background:#20261e;padding:24px;font-size:17px}dt{color:#b7bf9f}dd{margin:0}blockquote{margin:22px 0;padding:20px 26px;border-left:3px solid #ad9568;background:#1d211d;white-space:pre-line}.scene{padding:40px 0;border-top:1px solid #353d32;margin-top:36px}.visual{font:14px/1.6 system-ui;color:#c9bb9e;padding:12px 0}details{margin:18px 0;border:1px solid #343e32;padding:18px}summary{cursor:pointer;color:#d8cbb2;font:600 16px/1.5 system-ui}aside{background:#253023;border-radius:4px;padding:20px;margin:24px 0}aside p{margin-bottom:0}.top{font:14px system-ui}li{padding-left:8px;margin-bottom:20px}p{white-space:pre-line}.notice{font:15px/1.7 system-ui;color:#babcae}@media(max-width:600px){main{padding:28px 18px}dl{grid-template-columns:1fr;gap:4px;padding:18px}dd{margin-bottom:14px}h2{font-size:2rem}}@media print{html{scroll-behavior:auto}body{background:white;color:#222;font-size:11pt}main{max-width:none;padding:0}h1,h2,h3,h4,h5{color:#111}nav,.top{display:none}article{break-before:page}dl,blockquote,aside{background:#f5f3eb}details{display:block}details>*{display:block}summary{font-weight:bold}.scene{break-inside:auto}}</style></head><body><main id="bas"><span class="eyebrow">ARUZAHR · HAZIR HİKÂYE</span><h1>On Kış Kararı</h1><p>Marhalden’den Hardlane’e giden bir yük sözleşmesi, on karar ve geri dönen insanlar.</p><p class="notice">Şifre gerekmez. Hikâye sitede hazırdır; bu kitap DM için çevrimdışı metin kopyasıdır. Manzaralar ve portreler güncel Yayın Masası’nda gösterilir. Kitap görev sırları içerir; oyunculara kitabı değil seçtiğin sahneyi göster.</p><nav aria-label="Bölümler">${pack.quests.map((q, i) => `<a href="#${esc(q.id)}">${i + 1}. ${esc(q.title)}</a>`).join('')}</nav>${chapters.join('')}</main></body></html>\n`
const intro = `ON KIŞ KARARI — ŞİFRESİZ HAZIR HİKÂYE\n\nGüncel siteyi aç: Yayın Masası → Hikâyeyi yönet. On görev ve otuz sahne hazır gelir; dosya yüklemene veya şifre girmene gerek yok.\n\nBu ZIP metin yedeğidir. Dosyalar:\n- On-Kis-Karari-DM.json: aynı hazır hikâyenin düzenlenebilir yedeği\n- On-Kis-Karari-DM.md: okunabilir tam metin\n- On-Kis-Karari-Oynatim-Kitabi.html: bölüm listeli çevrimdışı kitap\n- YOL-HARITASI.md: nerede / ne zaman / amaç / sonra özeti\n- ONCE-OKU.txt: bu açıklama\n\nYayın görselleri ve portreler sitenin içinde gelir, bu metin ZIP'ine kopyalanmaz. Kendi notların ve kararların ayrıca tarayıcıda kaydedilir. Bu hazır kitap yayımlanmıştır; kişisel kampanya yedeğin ve kendi DM notların kendiliğinden yayımlanmaz.\n`
const files = new Map([[jsonName, Buffer.from(raw)], ['On-Kis-Karari-DM.md', Buffer.from(markdown.join('\n').replace(/[ \t]+$/gm, ''))], ['On-Kis-Karari-Oynatim-Kitabi.html', Buffer.from(html)], ['YOL-HARITASI.md', Buffer.from(route.join('\n'))], ['ONCE-OKU.txt', Buffer.from(intro)]])
for (const [name, bytes] of files) if (name !== jsonName) await writeFile(new URL(name, dir), bytes)

// Deterministic ZIP using only Node built-ins (UTF-8 names, deflate, CRC-32).
const crcTable = Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1
  return n >>> 0
})
const crc32 = data => {
  let crc = 0xffffffff
  for (const byte of data) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}
const records = [], index = []
let offset = 0
for (const [name, data] of files) {
  const filename = Buffer.from(name), compressed = deflateRawSync(data), crc = crc32(data)
  const local = Buffer.alloc(30)
  local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x800, 6); local.writeUInt16LE(8, 8)
  local.writeUInt16LE(0x21, 12); local.writeUInt32LE(crc, 14); local.writeUInt32LE(compressed.length, 18); local.writeUInt32LE(data.length, 22); local.writeUInt16LE(filename.length, 26)
  records.push(local, filename, compressed)
  const central = Buffer.alloc(46)
  central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x800, 8); central.writeUInt16LE(8, 10); central.writeUInt16LE(0x21, 14)
  central.writeUInt32LE(crc, 16); central.writeUInt32LE(compressed.length, 20); central.writeUInt32LE(data.length, 24); central.writeUInt16LE(filename.length, 28); central.writeUInt32LE(offset, 42)
  index.push(central, filename); offset += local.length + filename.length + compressed.length
}
const directory = Buffer.concat(index), end = Buffer.alloc(22)
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.size, 8); end.writeUInt16LE(files.size, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16)
await writeFile(new URL('On-Kis-Karari-DM-Paketi.zip', dir), Buffer.concat([...records, directory, end]))
console.log(`Built ${files.size}-file password-free book ZIP in ${fileURLToPath(dir)}`)
