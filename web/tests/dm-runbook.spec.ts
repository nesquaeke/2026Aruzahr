import { test, expect } from '@playwright/test'
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { bootStudio, panel, publicFrame, project } from './studio-fixtures'
const secret = 'PRIVATE-RUNBOOK-2605'
const briefing = {
  previous: secret + ' önceki olay',
  arrival: 'Yük avlusuna iş için geldiler.',
  purpose: 'Kervanı batıya ulaştırmak.',
  stakes: 'Zaman ve yük hesabı.',
  opening: 'Taş kapının önünde iki araba bekliyor.',
  transition: 'Tanışma bitince ilk adıma geç.',
  cast: [
    {
      name: 'Deneme rehberi',
      role: 'Ücretli izci',
      wants: secret + ' özel amaç',
      meeting: 'Kaymış bir arabada yardım ister.',
      line: 'Şu kayışı tutar mısın?',
    },
  ],
  backgroundId: 'winter-marhalden',
  portraitIds: ['sena-erven'],
  publicTitle: 'Sevk avlusu',
}
const step = (id: string) => ({
  id,
  title: 'Adım ' + id,
  summary: 'Durum ' + id,
  readAloud: 'Oyuncuya okunacak söz ' + id,
  actions: ['Teknik not'],
  checks: ['DC 12'],
  choices: [],
  backgroundId: 'winter-ilac',
  portraitIds: ['sena-erven'],
  publicTitle: 'Revir',
  runbook: {
    entry: secret + ' sahne girişi',
    beats: [
      {
        title: 'Karşılaşmayı oynat',
        text: 'Rehberle kapıda konuşun.',
        line: 'Sabah kapıyı ben açacağım.',
      },
    ],
    questions: [
      { question: 'Neden buradayız?', answer: 'Yükü teslim etmek için.' },
    ],
    next: secret + ' sonraki bağlantı',
  },
})
const pack = {
  version: 2,
  title: 'Özel oynatım kitabı',
  quests: [
    {
      id: 'book-q',
      title: 'Yolculuk',
      body: secret + ' tam metin',
      briefing,
      steps: [step('a'), step('b')],
    },
  ],
}
async function upload(page: any, data: any = pack) {
  await panel(page, 'Görev')
  await page.getByTestId('broadcast-import-dm').setInputFiles({
    name: 'book.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  })
}
test.describe.configure({ timeout: 60000 })
test('oynatım alanları doğrulanır ve eski sürüm paketleri korunur', async ({
  page,
}) => {
  await bootStudio(page)
  const result = await page.evaluate(async (raw) => {
    const path = '/src/dm-guide.ts'
    const { parseDMPack } = await import(path)
    const checked = parseDMPack(raw)
    let rejected = false
    try {
      parseDMPack({
        ...raw,
        quests: [
          {
            ...raw.quests[0],
            briefing: { ...raw.quests[0].briefing, cast: 'invalid' },
          },
        ],
      })
    } catch {
      rejected = true
    }
    const legacy = parseDMPack({
      version: 1,
      title: 'Eski',
      quests: [{ id: 'legacy', title: 'Eski görev', body: 'Metin' }],
    })
    return {
      brief: checked.quests[0].briefing,
      guide: checked.quests[0].steps[0].runbook,
      rejected,
      legacy: legacy.version,
    }
  }, pack)
  expect(result.brief.cast[0].wants).toContain(secret)
  expect(result.guide.beats[0].title).toBe('Karşılaşmayı oynat')
  expect(result.rejected).toBe(true)
  expect(result.legacy).toBe(1)
})
test('geniş DM masası giriş, kişiler, konuşma ve geçişi okutur; yalnız seçilmiş görsel yayınlanır', async ({
  page,
}) => {
  await bootStudio(page)
  await upload(page)
  await page
    .getByRole('button', { name: 'Geniş DM okuma masasını aç', exact: true })
    .click()
  const dialog = page.getByRole('dialog', { name: 'Özel DM okuma masası' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('.dm-book-purpose')).toContainText(
    'Kervanı batıya',
  )
  await dialog.getByText('Kim kimdir? · 1 kişi / grup', { exact: true }).click()
  await expect(dialog.locator('.dm-book-cast')).toContainText(
    secret + ' özel amaç',
  )
  await dialog
    .getByRole('button', { name: 'Giriş manzarasını hazırla', exact: true })
    .click()
  expect((await publicFrame(page)).title).toBe('CANLI: eski')
  await dialog
    .getByRole('button', { name: 'Girişi oyunculara göster', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).title)
    .toBe('Sevk avlusu')
  expect(JSON.stringify(await publicFrame(page))).not.toContain(secret)
  await expect(dialog.getByTestId('dm-runbook')).toContainText(
    'Karşılaşmayı oynat',
  )
  await dialog.locator('.dm-step-tabs button').nth(1).click()
  await expect(dialog.locator('.dm-now p')).toHaveText('Durum b')
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByTestId('studio-workspace')).toBeVisible()
  await page
    .getByRole('button', { name: 'Geniş DM okuma masasını aç', exact: true })
    .click()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(dialog).toBeVisible()
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await dialog
    .getByRole('button', { name: 'Okuma masasını kapat · Esc', exact: true })
    .click()
  await expect(dialog).toHaveCount(0)
})
test('aynı kitabın yeni anlatımını yüklemek sahne ilerlemesini ve kararları korur', async ({
  page,
}) => {
  await bootStudio(page)
  await upload(page)
  await page.locator('.dm-step-tabs button').nth(1).click()
  await page.getByLabel('Oyuncuların kararı').fill('Köprü için söz verdiler.')
  await page
    .getByRole('button', { name: 'Görevi tamamlandı işaretle', exact: true })
    .click()
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem('aruzahr-director-progress') || '{}')
            .steps?.['book-q'],
      ),
    )
    .toBe(1)
  await upload(page, {
    ...pack,
    quests: [
      {
        ...pack.quests[0],
        briefing: { ...briefing, purpose: 'Yeni açıklama, aynı görev.' },
      },
    ],
  })
  await expect(page.getByLabel('Oyuncuların kararı')).toHaveValue(
    'Köprü için söz verdiler.',
  )
  await expect(page.locator('.dm-step-counter')).toHaveText('SAHNE 2 / 2')
  await expect(
    page.getByRole('button', {
      name: 'Görev tamamlandı · geri al',
      exact: true,
    }),
  ).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(page.getByTestId('studio-take')).toBeEnabled()
  await expect(page.locator('.dm-book-purpose')).toContainText('Yeni açıklama')
  await expect
    .poll(async () => (await project(page))?.dmStorage['aruzahr-director-pack'])
    .toContain('Yeni açıklama')
  expect(JSON.stringify(await publicFrame(page))).not.toContain(secret)
})
test('on iki sahne ve sekiz portre bağımsız yüksek ayrıntılı kaynak boyutlarında sunulur', async ({
  request,
}) => {
  const ids = [
    'ilac',
    'kopru',
    'ekmek',
    'varkul',
    'uyku',
    'baba',
    'kayik',
    'bahce',
    'ambar',
    'kul',
    'marhalden',
    'kamp',
    'sena-erven',
    'miren-aska',
    'bera-hald',
    'iven-rusk',
    'elda-sorren',
    'neris-vel',
    'maeron-vesk',
    'taren-olt',
  ]
  const hashes = new Set<string>()
  for (const [i, id] of ids.entries()) {
    const path = 'public/illustrations/winter-' + id + '.webp'
    const data = await readFile(path),
      meta = await sharp(data).metadata()
    hashes.add(createHash('sha256').update(data).digest('hex'))
    if (i < 12) {
      expect(meta.width, id).toBeGreaterThanOrEqual(1600)
      expect(meta.height, id).toBeGreaterThanOrEqual(900)
      expect(meta.width! / meta.height!, id).toBeCloseTo(16 / 9, 2)
    } else {
      expect(meta.width, id).toBeGreaterThanOrEqual(1000)
      expect(meta.height, id).toBeGreaterThanOrEqual(1400)
    }
    expect(
      (await request.get('/illustrations/winter-' + id + '.webp')).status(),
    ).toBe(200)
  }
  expect(hashes.size).toBe(20)
})
