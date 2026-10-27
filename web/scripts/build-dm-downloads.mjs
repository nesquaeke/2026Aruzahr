import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { deflateRawSync } from 'node:zlib'

const dir = new URL('../public/dm/', import.meta.url)
const jsonName = 'On-Kis-Karari-DM.json'
const raw = await readFile(new URL(jsonName, dir), 'utf8')
const pack = JSON.parse(raw)
const sceneCount = pack.quests.reduce((n, q) => n + q.steps.length, 0)
const eventCount = pack.quests.reduce((n, q) => n + (q.events?.length || 0), 0)
if (
  pack.quests.length !== 10 ||
  pack.quests.some((q) => !q.steps.length || q.steps.length > 12) ||
  new Set(pack.quests.flatMap((q) => q.steps.map((s) => s.id))).size !==
    sceneCount
)
  throw new Error('Invalid ready campaign scene structure.')
const esc = (text) =>
  String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
const para = (text) => `<p>${esc(text)}</p>`
const quote = (text) => `<blockquote>${esc(text)}</blockquote>`
const facts = (quick) =>
  `<dl><dt>Nerede?</dt><dd>${esc(quick.where)}</dd><dt>Ne zaman?</dt><dd>${esc(quick.time)}</dd><dt>Amacın ne?</dt><dd>${esc(quick.goal)}</dd><dt>Sonra?</dt><dd>${esc(quick.next)}</dd></dl>`
const list = (values) =>
  `<ul>${values.map((v) => `<li>${esc(v)}</li>`).join('')}</ul>`
const sceneName = (questId, sceneId) => {
  const q = pack.quests.find((quest) => quest.id === questId)
  const s = q?.steps.find((scene) => scene.id === sceneId)
  return q && s ? `${q.title} · ${s.title}` : `${questId} · ${sceneId}`
}
const dossierHtml = (dossiers = []) =>
  !dossiers.length
    ? ''
    : `<details class="dossiers"><summary>Kişi rehberi · DM için ${dossiers.length} kişi</summary>${dossiers.map((d) => `<section><h4>${esc(d.name)}</h4>${para(d.role)}<dl><dt>Görünüş</dt><dd>${esc(d.appearance)}</dd><dt>İstediği</dt><dd>${esc(d.wants)}</dd><dt>Bildiği</dt><dd>${esc(d.knows)}</dd><dt>Nasıl konuşur?</dt><dd>${esc(d.voice)}</dd></dl><p class="visual">Portre: ${esc(d.portraitId || 'yok')}</p>${d.lines.map((line) => `<strong>${esc(line.cue)}</strong>${quote(line.line)}`).join('')}</section>`).join('')}</details>`
const eventHtml = (event, questId) =>
  `<details class="side-event" id="${esc(event.id)}"><summary>İsteğe bağlı · ${esc(event.title)} · ${esc(event.duration)}</summary><p><strong>Ne zaman açılır?</strong> ${esc(sceneName(questId, event.at))}</p>${para(event.hook)}<div class="visual">Görsel: <strong>${esc(event.backgroundId)}</strong><br>Portreler: ${esc(event.castIds.join(', ') || 'yok')}</div><h4>Oyunculara oku</h4>${quote(event.readAloud)}<h4>Sırayla oynat</h4><ol>${event.beats.map((beat) => `<li><h5>${esc(beat.title)}</h5>${para(beat.text)}${beat.line ? quote(beat.line) : ''}</li>`).join('')}</ol>${event.checks.length ? `<h4>Kontroller</h4>${list(event.checks)}` : ''}<h4>Kararlar ve yankıları</h4>${event.choices.map((choice) => `<h5>${esc(choice.label)}</h5>${para(choice.result)}<p><strong>İleride:</strong> ${esc(choice.echo)}</p>`).join('')}<aside><strong>Ne zaman geri döner?</strong><p><a href="#${esc(event.followup.sceneId)}">${esc(sceneName(event.followup.questId, event.followup.sceneId))}</a></p>${para(event.followup.reminder)}</aside><p class="notice">Bu olay isteğe bağlıdır. Oynanmamış bir seçim veya sonuç gerçekleşmiş sayılmaz; kararını ve kendi notunu Yayın Masası’nda kaydet.</p></details>`
function dossierMarkdown(dossiers = []) {
  if (!dossiers.length) return []
  const lines = ['## Kişi rehberi — DM için', '']
  for (const d of dossiers) {
    lines.push(
      `### ${d.name} — ${d.role}`,
      '',
      '**Görünüş:** ' + d.appearance,
      '',
      '**İstediği:** ' + d.wants,
      '',
      '**Bildiği:** ' + d.knows,
      '',
      '**Nasıl konuşur?** ' + d.voice,
      '',
      '**Portre:** ' + (d.portraitId || 'yok'),
      '',
    )
    for (const line of d.lines)
      lines.push('**' + line.cue + '**', '', '> ' + line.line, '')
  }
  return lines
}
function eventMarkdown(event, questId) {
  const lines = [
    '## İsteğe bağlı olay · ' + event.title,
    '',
    '**Ne zaman açılır?** ' + sceneName(questId, event.at),
    '',
    '**Masada:** ' + event.duration,
    '',
    event.hook,
    '',
    '**Görsel:** ' + event.backgroundId,
    '',
    '**Portreler:** ' + (event.castIds.join(', ') || 'yok'),
    '',
    '### Oyunculara oku',
    '',
    '> ' + event.readAloud.replaceAll('\n', '\n> '),
    '',
    '### Sırayla oynat',
    '',
  ]
  for (const beat of event.beats)
    lines.push(
      '**' + beat.title + '**',
      '',
      beat.text,
      '',
      ...(beat.line ? ['> ' + beat.line, ''] : []),
    )
  if (event.checks.length)
    lines.push(
      '### Kontroller',
      '',
      ...event.checks.map((check) => '- ' + check),
      '',
    )
  lines.push('### Kararlar ve yankıları', '')
  for (const choice of event.choices)
    lines.push(
      '**' + choice.label + '**',
      '',
      choice.result,
      '',
      '**İleride:** ' + choice.echo,
      '',
    )
  lines.push(
    '**Ne zaman geri döner?** ' +
      sceneName(event.followup.questId, event.followup.sceneId),
    '',
    event.followup.reminder,
    '',
    'Bu olay isteğe bağlıdır. Oynanmamış bir seçim veya sonuç gerçekleşmiş sayılmaz; kararını ve kendi notunu Yayın Masası’nda kaydet.',
    '',
  )
  return lines
}
const playHtml = (p) =>
  !p
    ? ''
    : `<aside><strong>Masada ${esc(p.duration)}</strong>${para(p.pressure)}<p><strong>Sahne biter:</strong> ${esc(p.continueWhen)}</p></aside>${p.encounter ? `<details open><summary>Karşılaşma · ${esc(p.encounter.name)}</summary>${para(p.encounter.goal)}${para(p.encounter.trigger)}${para(p.encounter.space)}${list(p.encounter.rounds)}${p.encounter.units.map((u) => `<h5>${u.count} × ${esc(u.name)} · Zırh ${u.ac} · Can ${u.hp}</h5>${para(u.speed)}${para(u.attack)}${para(u.tactics)}${para(u.morale)}`).join('')}<h5>Dövüş dışında</h5>${list(p.encounter.exits)}${para(p.encounter.failure)}${para(p.encounter.scale)}</details>` : ''}<details><summary>Karakterler ne söyler?</summary>${p.dialogue.map((d) => `<h5>${esc(d.speaker)}</h5>${para(d.direction)}${d.exchanges.map((x) => `<strong>${esc(x.cue)}</strong>${quote(x.line)}`).join('')}`).join('')}</details><details><summary>Duraksama ve alternatif yollar</summary>${para(p.ifIdle)}${p.paths.map((path) => `<p><a href="#${esc(path.to)}">${esc(path.label)}</a></p>`).join('')}</details>`
function playMarkdown(p) {
  if (!p) return []
  const lines = [
    '### Masada oynat',
    '',
    `Süre: ${p.duration}`,
    '',
    p.pressure,
    '',
    '**Sahne ne zaman biter?** ' + p.continueWhen,
    '',
    '**Oyuncular duraksarsa:** ' + p.ifIdle,
    '',
  ]
  if (p.encounter) {
    const e = p.encounter
    lines.push(
      '### Karşılaşma · ' + e.name,
      '',
      '**Amaç:** ' + e.goal,
      '',
      '**Başlangıç:** ' + e.trigger,
      '',
      '**Alan:** ' + e.space,
      '',
      ...e.rounds.map((r, i) => `${i + 1}. ${r}`),
      '',
    )
    for (const u of e.units)
      lines.push(
        `**${u.count} × ${u.name} — Zırh ${u.ac}, Can ${u.hp}, Hız ${u.speed}**`,
        '',
        u.attack,
        '',
        u.tactics,
        '',
        u.morale,
        '',
      )
    lines.push(
      '**Dövüş dışındaki yollar:**',
      '',
      ...e.exits.map((x) => '- ' + x),
      '',
      '**Aksilik:** ' + e.failure,
      '',
      e.scale,
      '',
    )
  }
  for (const d of p.dialogue) {
    lines.push('### ' + d.speaker, '', d.direction, '')
    for (const x of d.exchanges)
      lines.push('**' + x.cue + '**', '', '> ' + x.line, '')
  }
  if (p.paths.length)
    lines.push(
      '**Alternatif sahneler:**',
      '',
      ...p.paths.map((x) => `- ${x.label} → ${x.to}`),
      '',
    )
  return lines
}
const markdown = [
  '# On Kış Kararı — Hazır Hikâye',
  '',
  'Siteyi açınca hikâye hazır gelir. Şifre girmen veya dosya yüklemen gerekmez. Bu dosya, DM için indirilebilir okuma kopyasıdır. Oyunculara yalnız seçtiğin görsel ve başlık gösterilir; kendi notlarını bu kitaba ekleyip paylaşmadan önce gözden geçir.',
  '',
  'Ana rota: Marhalden → Batı Aldara yük köprüsü → Harven → Mavric → Frostbay. Ternhaven ve Dranthol ayrıca kararlaştırılan ek sevktir. Cevher Çizgisi tamamlanmış yol değildir.',
  '',
]
const chapters = []
const route = [
  '# Yol Haritası',
  '',
  'Bölümler bir yük sözleşmesiyle bağlanır. Aşağıdaki sıra bir yönetim yardımıdır; oyuncular bir seçeneği reddettiğinde zorunlu ceza veya gizli felaket ekleme.',
  '',
]
for (const [qi, q] of pack.quests.entries()) {
  const b = q.briefing
  markdown.push(
    `# ${qi + 1}. ${q.title}`,
    '',
    `Nerede: ${q.quick.where}`,
    `Ne zaman: ${q.quick.time}`,
    `Amaç: ${q.quick.goal}`,
    `Sonra: ${q.quick.next}`,
    '',
    '## Bölüm başlangıcı',
    '',
    b.previous,
    '',
    b.arrival,
    '',
    b.purpose,
    '',
    '### Oyunculara oku',
    '',
    '> ' + b.opening.replaceAll('\n', '\n> '),
    '',
    '### Kim kimdir?',
    '',
  )
  route.push(
    `## ${qi + 1}. ${q.title}`,
    '',
    `**Yer:** ${q.quick.where}`,
    '',
    `**Zaman:** ${q.quick.time}`,
    '',
    `**Yapılacak:** ${q.quick.goal}`,
    '',
    `**Devam:** ${q.quick.next}`,
    '',
  )
  for (const c of b.cast)
    markdown.push(
      `**${c.name} — ${c.role}**`,
      '',
      `İstediği: ${c.wants}`,
      '',
      `İlk karşılaşma: ${c.meeting}`,
      '',
      '> ' + c.line,
      '',
    )
  markdown.push('İlk sahneye geçiş: ' + b.transition, '')
  const sceneHtml = []
  for (const [si, s] of q.steps.entries()) {
    markdown.push(
      `## ${qi + 1}.${si + 1}. ${s.title}`,
      '',
      `Nerede: ${s.quick.where}`,
      `Ne zaman: ${s.quick.time}`,
      `Amaç: ${s.quick.goal}`,
      `Sonra: ${s.quick.next}`,
      '',
      `Gösterilecek sahne: ${s.publicTitle} · Görsel: ${s.backgroundId} · Portreler: ${s.portraitIds.join(', ') || 'yok'}`,
      '',
      '### Oyunculara oku',
      '',
      '> ' + s.readAloud.replaceAll('\n', '\n> '),
      '',
      '### Sırayla oynat',
      '',
    )
    for (const beat of s.runbook.beats)
      markdown.push(
        `**${beat.title}**`,
        '',
        beat.text,
        '',
        ...(beat.line ? ['> ' + beat.line, ''] : []),
      )
    markdown.push(...playMarkdown(s.play))
    markdown.push('### Oyuncular sorarsa', '')
    for (const qa of s.runbook.questions)
      markdown.push(`**${qa.question}**`, '', qa.answer, '')
    markdown.push(
      '### Kontroller ve ek notlar',
      '',
      ...s.checks.map((x) => '- ' + x),
      ...s.actions.map((x) => '- ' + x),
      '',
      '### Kararlar ve yankılar',
      '',
    )
    for (const c of s.choices)
      markdown.push(
        `**${c.label}**`,
        '',
        c.result,
        '',
        'Sonraki yankı: ' + c.echo,
        '',
      )
    markdown.push('Sonraki geçiş: ' + s.runbook.next, '')
    sceneHtml.push(
      `<section class="scene" id="${esc(s.id)}"><span class="eyebrow">SAHNE ${qi + 1}.${si + 1}</span><h3>${esc(s.title)}</h3>${facts(s.quick)}<div class="visual">Gösterilecek manzara: <strong>${esc(s.publicTitle)}</strong></div><h4>Oyunculara oku</h4>${quote(s.readAloud)}<h4>Sırayla oynat</h4><ol>${s.runbook.beats.map((beat) => `<li><h5>${esc(beat.title)}</h5>${para(beat.text)}${beat.line ? quote(beat.line) : ''}</li>`).join('')}</ol>${playHtml(s.play)}<details><summary>Oyuncular sorarsa</summary>${s.runbook.questions.map((qa) => `<h5>${esc(qa.question)}</h5>${para(qa.answer)}`).join('')}</details><details><summary>Zarlar ve ek notlar</summary><ul>${[...s.checks, ...s.actions].map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details><details><summary>Kararlar ve sonraki yankıları</summary>${s.choices.map((c) => `<h5>${esc(c.label)}</h5>${para(c.result)}${para(c.echo)}`).join('')}</details><aside><strong>Buradan sonra</strong>${para(s.runbook.next)}</aside></section>`,
    )
  }
  markdown.push(...dossierMarkdown(q.dossiers))
  for (const event of q.events || []) {
    markdown.push(...eventMarkdown(event, q.id))
    route.push(
      `**İsteğe bağlı:** ${event.title} (${event.duration})`,
      '',
      '**Açıldığı adım:** ' + sceneName(q.id, event.at),
      '',
      event.hook,
      '',
      `**Göster:** ${event.backgroundId} · Portreler: ${event.castIds.join(', ') || 'yok'}`,
      '',
      '**Geri dönüş:** ' +
        sceneName(event.followup.questId, event.followup.sceneId),
      '',
      event.followup.reminder,
      '',
    )
  }
  chapters.push(
    `<article id="${esc(q.id)}"><span class="eyebrow">BÖLÜM ${qi + 1}</span><h2>${esc(q.title)}</h2>${facts(q.quick)}<details open><summary>Nasıl başlatırım?</summary>${para(b.previous)}${para(b.arrival)}${para(b.purpose)}${quote(b.opening)}<aside><strong>İlk sahneye geçiş</strong>${para(b.transition)}</aside></details><details><summary>Kim kimdir?</summary>${b.cast.map((c) => `<h4>${esc(c.name)}</h4>${para(c.role)}<p><strong>İstediği:</strong> ${esc(c.wants)}</p><p><strong>İlk karşılaşma:</strong> ${esc(c.meeting)}</p>${quote(c.line)}`).join('')}</details>${sceneHtml.join('')}${dossierHtml(q.dossiers)}${q.events?.length ? '<h3>İsteğe bağlı olaylar</h3>' + q.events.map((event) => eventHtml(event, q.id)).join('') : ''}<a class="top" href="#bas">Bölüm listesine dön ↑</a></article>`,
  )
}
const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>On Kış Kararı — DM Oynatım Kitabı</title><style>*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#131715;color:#e3ddcd;font:19px/1.8 Georgia,serif}main{max-width:930px;margin:auto;padding:56px 28px}h1,h2,h3,h4,h5{line-height:1.2;color:#f0e8d5}h1{font-size:clamp(2.4rem,6vw,4rem)}h2{font-size:2.6rem}h3{font-size:1.9rem}h4{font-size:1.25rem}h5{font-size:1.1rem;margin-bottom:8px}a{color:#d5b985}nav{display:grid;gap:8px;padding:24px;background:#1b211d}article{border-top:1px solid #4b513f;padding-top:56px;margin-top:56px}.eyebrow{font:12px/1.5 system-ui;letter-spacing:.2em;color:#b6bc9f}dl{display:grid;grid-template-columns:120px 1fr;gap:9px 20px;background:#20261e;padding:24px;font-size:17px}dt{color:#b7bf9f}dd{margin:0}blockquote{margin:22px 0;padding:20px 26px;border-left:3px solid #ad9568;background:#1d211d;white-space:pre-line}.scene{padding:40px 0;border-top:1px solid #353d32;margin-top:36px}.visual{font:14px/1.6 system-ui;color:#c9bb9e;padding:12px 0}details{margin:18px 0;border:1px solid #343e32;padding:18px}summary{cursor:pointer;color:#d8cbb2;font:600 16px/1.5 system-ui}aside{background:#253023;border-radius:4px;padding:20px;margin:24px 0}aside p{margin-bottom:0}.top{font:14px system-ui}li{padding-left:8px;margin-bottom:20px}p{white-space:pre-line}.notice{font:15px/1.7 system-ui;color:#babcae}@media(max-width:600px){main{padding:28px 18px}dl{grid-template-columns:1fr;gap:4px;padding:18px}dd{margin-bottom:14px}h2{font-size:2rem}}@media print{html{scroll-behavior:auto}body{background:white;color:#222;font-size:11pt}main{max-width:none;padding:0}h1,h2,h3,h4,h5{color:#111}nav,.top{display:none}article{break-before:page}dl,blockquote,aside{background:#f5f3eb}details{display:block}details>*{display:block}summary{font-weight:bold}.scene{break-inside:auto}}</style></head><body><main id="bas"><span class="eyebrow">ARUZAHR · HAZIR HİKÂYE</span><h1>On Kış Kararı</h1><p>Marhalden’den Hardlane’e giden bir yük sözleşmesi, on karar ve geri dönen insanlar.</p><p class="notice">10 bölüm · ${sceneCount} ana sahne · ${eventCount} isteğe bağlı olay. Yan olayların seçimleri Yayın Masası’nda özel olarak kaydedilir; sonraki durakta hatırlatılır.</p><p class="notice">Şifre gerekmez. Hikâye sitede hazırdır; bu kitap DM için çevrimdışı metin kopyasıdır. Manzaralar ve portreler güncel Yayın Masası’nda gösterilir. Kitap görev sırları içerir; oyunculara kitabı değil seçtiğin sahneyi göster.</p><nav aria-label="Bölümler">${pack.quests.map((q, i) => `<a href="#${esc(q.id)}">${i + 1}. ${esc(q.title)}</a>`).join('')}</nav>${chapters.join('')}</main></body></html>\n`
const intro = `ON KIŞ KARARI — ŞİFRESİZ HAZIR HİKÂYE\n\nGüncel siteyi aç: Yayın Masası → Görev → Hikâyeyi yönet. On görev, ${sceneCount} ana sahne ve ${eventCount} isteğe bağlı olay hazır gelir; dosya yüklemene veya şifre girmene gerek yok.\n\nBu ZIP metin yedeğidir. Dosyalar:\n- On-Kis-Karari-DM.json: aynı hazır hikâyenin düzenlenebilir yedeği\n- On-Kis-Karari-DM.md: okunabilir tam metin\n- On-Kis-Karari-Oynatim-Kitabi.html: bölüm listeli çevrimdışı kitap\n- YOL-HARITASI.md: nerede / ne zaman / amaç / sonra özeti\n- ILK-OTURUM.md: ilk bölüm için kısa yönetim rehberi\n- Night-Road-Encounters.json: 12 gece ve yol kartı, 5 pusu / yaratık çatışması\n- GECE-YOL-PUSU.md: karşılaşmaların konuşma, ipucu, savaş ve karar kitabı\n- ONCE-OKU.txt: bu açıklama\n\nYayın görselleri ve portreler sitenin içinde gelir, bu metin ZIP'ine kopyalanmaz. Kendi notların ve kararların ayrıca tarayıcıda kaydedilir. Bu hazır kitap yayımlanmıştır; kişisel kampanya yedeğin ve kendi DM notların kendiliğinden yayımlanmaz.\n`
const firstSession = [
  '# İlk Oturum — Avludan Batı Kapısına',
  '',
  '**Parti: üç oyuncu, 1. seviye.** İlk bölüm tek oturumluk bir öneridir; konuşmalar uzarsa revirde veya galeri dönüşünde ara ver. On görevi bir gecede bitirmeye çalışma.',
  '',
  '## Başlatmadan önce',
  '',
  '- Oyuncuların neden aynı yük işine yazıldığını birlikte belirleyin. Birbirlerine veya Sena’ya önceden dost olmaları şart değil.',
  '- Şehir dışına çıkış, silah, ışık, ip ve başlangıç ekipmanlarını netleştir. Başlangıçta bir uzun dinlenme var; kurtarma sırasında kısa dinlenme mümkün, bir saatin hastalara etkisini önceden söyle.',
  '- Sade masada Son İlaç → Giriş ile başla. Giriş açıklaması DM hazırlığıdır; ilk gerçek sahne avludaki akşamdır.',
  '- Harita ve sahneler seçimle otomatik değişmez. Görseli incele, hazır olunca Oyunculara göster düğmesine bas.',
  '',
  '## Kim kimdir?',
  '',
  '**Sena:** batı sevkinin izcisi, üç gündür öksürüyor. **Sela:** sevk ve ücret işini yürüten kâtip. **Miren:** dört çocuğu olan terzi; beşincisini bekliyor. Hasta çocuk **Arin**. **Ravel:** revir hekimi. **Eren:** bakım işçisi, **Ekin:** galeride mahsur kalan çırak.',
  '',
  '## Oyun içi saat',
  '',
  'Akşam avluda tanışma → gece dinlenme → yaklaşık 06.30 revir. Ravel’in verdiği yaklaşık altı saatlik tedavi aralığı gerçek duvar saati değildir. Galeriye inme, araştırma, dinlenme ve dönüş süresini görünür tut. Yeni bir süre cezasını zar sonucundan sonra icat etme.',
  '',
  '## Sahneler — sırayla',
  '',
]
for (const [i, s] of pack.quests[0].steps.entries())
  firstSession.push(
    `### ${i + 1}. ${s.title}`,
    '',
    `**Yer:** ${s.quick.where}`,
    '',
    `**Masada:** ${s.play.duration}`,
    '',
    `**Amaç:** ${s.quick.goal}`,
    '',
    `**Göster:** ${s.backgroundId} — ${s.publicTitle}`,
    '',
    `**Bitir:** ${s.play.continueWhen}`,
    '',
    `**Sonra:** ${s.runbook.next}`,
    '',
  )
firstSession.push(
  '## İlk tehlikeyi yönet',
  '',
  'Galeri Kıskacı: **tek yaratık, Zırh 12, Can 9, saldırı +3 / 1d4 ezme**. Bir turda tek saldırı; zehir, çoklu saldırı veya gizli ikinci yaratık yok. 3 cana inince yarığa çekilir; altı metreden fazla kovalamaz. Önceden belirtilen yiyecek, ışık ve gürültü yolları işe yarar. Amaç Ekin’i çıkarmaktır; yaratığı öldürmek şart değildir.',
  '',
  'Kök sarnıcı ayrı bir çevre sorunudur: herkesin yapabileceği somut işleri söyle, aynı başarısız kontrolü tekrar tekrar isteme. Hazırlıkta alınmış ip veya açılmış dönüş kapağı bir yarar sağlamalıdır.',
  '',
  '## Karar ve karşılık',
  '',
  'Üç kök ve Ravel’in yaklaşık bir saatlik hazırlığı iki hastayı da kurtarabilecek gerçek bir çözümdür. Oyuncular bunu kazanmışsa sonradan iptal etme. Bir karakterin gerçek hastalık gideren yeteneği varsa kullan; olay uğruna bağışıklık uydurma. Ekin’in kurtarılması sonrası Ravel’in verdiği 2d4+2 can iyileştiren tek iksir, hastalık ilacından ayrı bir ödüldür.',
  '',
  'Sonuç, tanık ve verilen sözü karar notuna yaz. İlk bölüm sonunda 2. seviyeye geçmek masanın seçeneğidir. Diğer karşılaşmalar da üç 1. seviye karakter için temkinli başlangıç değerleri taşır; bütün yolculuk boyunca seviye 1 kalmaları zorunlu değildir.',
  '',
  '## Sonraki oturuma bağla',
  '',
  'Miren ve Sena’nın durumunu gösterip yükü Sela ile teslim tutanağına bağla. Batı Aldara köprüsündeki ilk sıra sayımı bir sonraki bölümün başlangıcıdır. Marhalden’in genel mülteci kapatma kararı yürürlükte; sevk belgesi herkese sınırsız geçiş hakkı vermez.',
  '',
)
if (pack.quests[0].events?.length) {
  firstSession.push(
    '## İstersen araya al — yan olay',
    '',
    'Yan olaylar ana görevin aciliyetini veya kurtarma süresini geçersiz kılmaz. Uygun sahnede teklif et; grup ilgilenmezse bir ceza eklemeden ana akışa dön. Olayda verilen söz, sonraki durakta karşılık bulabilir.',
    '',
  )
  for (const event of pack.quests[0].events)
    firstSession.push(
      `**${event.title} — ${event.duration}**`,
      '',
      '**Açıldığı adım:** ' + sceneName(pack.quests[0].id, event.at),
      '',
      event.hook,
      '',
      '**Göster:** ' + event.backgroundId,
      '',
      '**Portreler:** ' + (event.castIds.join(', ') || 'yok'),
      '',
      '**İleride hatırlat:** ' +
        sceneName(event.followup.questId, event.followup.sceneId),
      '',
      event.followup.reminder,
      '',
      'Tam konuşma, eylemler ve kararlar: indirilebilir oynatım kitabında ilgili bölümün sonundaki İsteğe bağlı olaylar kısmı.',
      '',
    )
}
const nightRaw = await readFile(new URL('Night-Road-Encounters.json', dir), 'utf8')
const night = JSON.parse(nightRaw)
if (night.cards?.length !== 12) throw new Error('Expected twelve road and night encounter cards.')
const nightBook = ['# Gece, Yol ve Pusu — DM Kartları', '', '3 oyuncu · 1. seviye. Yayın Masası → Görev → Karşılaşmalar · yol, pusu ve gece. Kişi / yer bul menüsünden adla da açabilirsin.', '', 'Kartlar kendiliğinden oynanmaz. Zorunlu savaş yok; tehlike işaretleri, kaçış ve seçimler her kartta belirtilir. Bu kitap DM sırlarını içerir; oyunculara tamamını gönderme.', '']
for (const c of night.cards) {
  nightBook.push(`## ${c.die.min}. ${c.title} — ${c.visibleName}`, '', '**Nerede / ne zaman?** ' + c.arrival, '', '**Portre:** ' + c.portraitId, '', '**Sahne:** ' + (c.sceneId || 'night-camp'), '', '### Oyunculara oku', '', '> ' + c.readAloud.replaceAll('\n', '\n> '), '', '### Yalnız DM — gerçek', '', c.dmTruth, '', ...c.warnings.map(w => '- ' + w), '', '### Araştırma', '', ...c.clues.map(i => `- ${i.dc ? `DC ${i.dc} · ${i.skill}` : 'Zarsız görünür'}: ${i.discovery}`), '')
  if (c.combat) {
    nightBook.push('### Çatışma çıkarsa', '', c.combat.danger, '', '**İşaretler:** ' + c.combat.telegraph, '', '**Düşmanın amacı:** ' + c.combat.enemyGoal, '', ...c.combat.combatants.map(e => `- ${e.name} × ${e.count} — Zırh ${e.ac}, Can ${e.hp}, İnisiyatif ${e.initiative >= 0 ? '+' : ''}${e.initiative}. ${e.attack}`), '', ...c.combat.tactics.map((t,i) => `${i+1}. ${t}`), '', '**Bırakma koşulu:** ' + c.combat.morale, '', '**Kaçış / başka çözüm:** ' + c.combat.escape, '')
  }
  nightBook.push('### Engeli oynat', '', c.obstacle.goal, '', ...c.obstacle.rounds.map((t,i) => `${i+1}. ${t}`), '', '**Başarılı:** ' + c.obstacle.success, '', '**Aksilik:** ' + c.obstacle.failure, '', ...c.obstacle.checks.map(t => '- ' + t), '', '### Konuşmalar', '', c.voice.direction, '')
  for (const line of c.voice.lines) nightBook.push('**' + line.cue + '**', '', '> ' + line.line, '')
  nightBook.push('### Kararlar ve yankıları', '')
  for (const choice of c.choices) nightBook.push('**' + choice.label + '**', '', choice.result, '', '**Sonra:** ' + choice.echo, '')
  nightBook.push('### Ana yola dön', '', c.continuation, '')
}
const files = new Map([
  ['Night-Road-Encounters.json', Buffer.from(nightRaw)],
  ['GECE-YOL-PUSU.md', Buffer.from(nightBook.join('\n').replace(/[ \t]+$/gm, ''))],
  [jsonName, Buffer.from(raw)],
  [
    'On-Kis-Karari-DM.md',
    Buffer.from(markdown.join('\n').replace(/[ \t]+$/gm, '')),
  ],
  ['On-Kis-Karari-Oynatim-Kitabi.html', Buffer.from(html)],
  ['YOL-HARITASI.md', Buffer.from(route.join('\n'))],
  ['ILK-OTURUM.md', Buffer.from(firstSession.join('\n'))],
  ['ONCE-OKU.txt', Buffer.from(intro)],
])
for (const [name, bytes] of files)
  if (name !== jsonName) await writeFile(new URL(name, dir), bytes)

// Deterministic ZIP using only Node built-ins (UTF-8 names, deflate, CRC-32).
const crcTable = Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1
  return n >>> 0
})
const crc32 = (data) => {
  let crc = 0xffffffff
  for (const byte of data) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}
const records = [],
  index = []
let offset = 0
for (const [name, data] of files) {
  const filename = Buffer.from(name),
    compressed = deflateRawSync(data),
    crc = crc32(data)
  const local = Buffer.alloc(30)
  local.writeUInt32LE(0x04034b50, 0)
  local.writeUInt16LE(20, 4)
  local.writeUInt16LE(0x800, 6)
  local.writeUInt16LE(8, 8)
  local.writeUInt16LE(0x21, 12)
  local.writeUInt32LE(crc, 14)
  local.writeUInt32LE(compressed.length, 18)
  local.writeUInt32LE(data.length, 22)
  local.writeUInt16LE(filename.length, 26)
  records.push(local, filename, compressed)
  const central = Buffer.alloc(46)
  central.writeUInt32LE(0x02014b50, 0)
  central.writeUInt16LE(20, 4)
  central.writeUInt16LE(20, 6)
  central.writeUInt16LE(0x800, 8)
  central.writeUInt16LE(8, 10)
  central.writeUInt16LE(0x21, 14)
  central.writeUInt32LE(crc, 16)
  central.writeUInt32LE(compressed.length, 20)
  central.writeUInt32LE(data.length, 24)
  central.writeUInt16LE(filename.length, 28)
  central.writeUInt32LE(offset, 42)
  index.push(central, filename)
  offset += local.length + filename.length + compressed.length
}
const directory = Buffer.concat(index),
  end = Buffer.alloc(22)
end.writeUInt32LE(0x06054b50, 0)
end.writeUInt16LE(files.size, 8)
end.writeUInt16LE(files.size, 10)
end.writeUInt32LE(directory.length, 12)
end.writeUInt32LE(offset, 16)
await writeFile(
  new URL('On-Kis-Karari-DM-Paketi.zip', dir),
  Buffer.concat([...records, directory, end]),
)
console.log(
  `Built ${files.size}-file password-free book ZIP in ${fileURLToPath(dir)}`,
)
