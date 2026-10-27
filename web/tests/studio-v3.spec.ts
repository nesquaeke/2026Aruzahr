import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import {
  bootStudio,
  panel,
  publicFrame,
  project,
  chooseScene,
  take,
} from './studio-fixtures'
test.describe.configure({ timeout: 60000 })
test('hazırlık izole kalır; yayına alma, iptal, önceki yayın ve yeniden açma tutarlıdır', async ({
  page,
  browser,
}) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await bootStudio(page)
  const context = await browser.newContext(),
    live = await context.newPage()
  await live.goto('http://127.0.0.1:5173/#/broadcast/live')
  await expect(live.getByText('CANLI: eski', { exact: true })).toBeVisible()
  await chooseScene(page, 'frostbay', 'Frostbay')
  await panel(page, 'Sahne')
  await page.getByLabel('Hazırlık sahne başlığı').fill('Frostbay hazırlığı')
  await expect(live.getByText('CANLI: eski', { exact: true })).toBeVisible()
  expect((await publicFrame(page)).scene.id).toBe('marhalden')
  await take(page, 'Frostbay hazırlığı')
  await expect
    .poll(() =>
      page
        .locator('.studio-live-preview img')
        .evaluateAll((images) =>
          images.every(
            (img) =>
              (img as HTMLImageElement).complete &&
              (img as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true)
  await expect(
    live.getByText('Frostbay hazırlığı', { exact: true }),
  ).toBeVisible()
  await expect
    .poll(() =>
      live
        .locator('.broadcast-backdrop>img')
        .first()
        .evaluate((el: HTMLImageElement) => el.naturalWidth),
    )
    .toBeGreaterThan(0)
  await page.getByLabel('Hazırlık sahne başlığı').fill('Henüz göstermeyeceğim')
  await page
    .getByRole('button', { name: 'Hazırlığı iptal et', exact: true })
    .click()
  await expect(page.getByLabel('Hazırlık sahne başlığı')).toHaveValue(
    'Frostbay hazırlığı',
  )
  await page.getByRole('button', { name: 'Önceki yayın', exact: true }).click()
  await expect
    .poll(async () => (await publicFrame(page)).title)
    .toBe('CANLI: eski')
  await expect
    .poll(async () => (await project(page))?.program.title)
    .toBe('CANLI: eski')
  await page.reload()
  await expect(page.getByTestId('studio-take')).toBeEnabled()
  await expect(page.getByTestId('studio-program-title')).toHaveText(
    'CANLI: eski',
  )
  expect(errors).toEqual([])
  await context.close()
})
test('kayıtlı sahneler çoğaltılır, sıralanır, silinir ve geri alınır', async ({
  page,
}) => {
  await bootStudio(page)
  await page
    .getByRole('button', { name: 'Bu hazırlığı kaydet', exact: true })
    .click()
  await panel(page, 'Sahne')
  await page
    .getByText('Kayıtlı sahnenin özel bilgileri', { exact: true })
    .click()
  await page.getByLabel('Sahne adı', { exact: true }).fill('Birinci sahne')
  await page
    .getByRole('button', { name: 'Birinci sahne çoğalt', exact: true })
    .click()
  await expect(page.locator('.studio-scene-card')).toHaveCount(2)
  await page
    .getByRole('button', {
      name: 'Birinci sahne · kopya önceye taşı',
      exact: true,
    })
    .click()
  await expect(page.locator('.studio-scene-card').first()).toContainText(
    'Birinci sahne · kopya',
  )
  await page
    .getByRole('button', { name: 'Birinci sahne · kopya favori', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Birinci sahne sil', exact: true })
    .click()
  await expect(page.locator('.studio-scene-card')).toHaveCount(1)
  await page.getByText('Silinen sahneler · 1', { exact: true }).click()
  await page
    .getByRole('button', { name: 'Birinci sahne · geri al', exact: true })
    .click()
  await expect(page.locator('.studio-scene-card')).toHaveCount(2)
  expect((await publicFrame(page)).title).toBe('CANLI: eski')
})
test('gizli kimlik, özel savaş değerleri ve notlar yayın durumuna sızmaz', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Kişi')
  await page.getByLabel('Kişinin adı', { exact: true }).fill('SECRET-REAL-NAME')
  await page.getByLabel('Portre', { exact: true }).selectOption('taren-olt')
  await page.getByRole('button', { name: 'Kişiyi ekle', exact: true }).click()
  const card = page
    .locator('.panel-people details')
    .filter({ hasText: 'SECRET-REAL-NAME' })
    .first()
  await card.locator('summary').click()
  await card.getByLabel('Kimlik oyunculara açık').uncheck()
  await card
    .getByLabel('Oyuncuların bildiği ad', { exact: true })
    .fill('Yabancı yolcu')
  await card.getByLabel('Şimdiki amacı · özel').fill('SECRET-PLAN')
  await card.getByLabel('Özel not', { exact: true }).fill('SECRET-NOTES')
  await card
    .getByRole('button', { name: 'Portreyi hazırlığa ekle', exact: true })
    .click()
  await take(page, 'HAZIRLIK: yeni')
  const wire = JSON.stringify(await publicFrame(page))
  expect(wire).toContain('Yabancı yolcu')
  for (const secret of [
    'SECRET-REAL-NAME',
    'SECRET-PLAN',
    'SECRET-NOTES',
    'taren-olt',
    'realName',
    'relationship',
  ])
    expect(wire).not.toContain(secret)
  await panel(page, 'Savaş')
  await page
    .getByLabel('Kişi listesinden ekle')
    .selectOption({ label: 'SECRET-REAL-NAME' })
  await page.getByRole('button', { name: 'Savaşa ekle', exact: true }).click()
  await page.locator('.st-battle-advanced>summary').click()
  const fighter = page.locator('.st-active-fighter')
  await fighter.getByLabel('Can', { exact: true }).fill('73')
  await fighter.getByLabel('Azami', { exact: true }).fill('100')
  await fighter.getByLabel('Zırh', { exact: true }).fill('19')
  await fighter.getByLabel('Özel savaş notu').fill('SECRET-AC')
  await page.locator('.st-battle-broadcast>summary').click()
  await page.getByLabel('Savaş bilgisini canlı göster').check()
  const fight = await publicFrame(page)
  expect(fight.studio.combat.items[0].name).toBe('Yabancı yolcu')
  expect(fight.studio.combat.items[0]).not.toHaveProperty('hp')
  expect(fight.studio.combat.items[0]).not.toHaveProperty('ac')
  expect(JSON.stringify(fight)).not.toContain('SECRET-AC')
  await fighter.getByLabel('İzleyiciden tamamen gizle').check()
  await expect
    .poll(async () => (await publicFrame(page)).studio.combat.items)
    .toEqual([])
})
test('çoklu zar ve gizli atış farklı taşınır; yalnız toplam ve avantaj gerçek sonuçla eşleşir', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Zar')
  await page.getByLabel('Atan kişi', { exact: true }).fill('Sena')
  await page.getByLabel('Atış adı', { exact: true }).fill('İz sürme')
  await page.getByLabel('Zar ifadesi', { exact: true }).fill('2d6+1d4+3')
  await page.getByRole('button', { name: 'Zarları at', exact: true }).click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.roll?.who)
    .toBe('Sena')
  let roll = (await publicFrame(page)).studio.roll
  expect(roll.total).toBe(
    roll.terms
      .flatMap((t: any) => t.values.map((v: number) => v * t.sign))
      .reduce((a: number, b: number) => a + b, 3),
  )
  const id = roll.id
  await page.getByLabel('Gizli DM atışı').check()
  await page.getByLabel('Atış adı', { exact: true }).fill('SECRET-ROLL')
  await page.getByRole('button', { name: 'Gizli at', exact: true }).click()
  expect((await publicFrame(page)).studio.roll.id).toBe(id)
  expect(JSON.stringify(await publicFrame(page))).not.toContain('SECRET-ROLL')
  await page.getByLabel('Gizli DM atışı').uncheck()
  await page.getByLabel('Zar ifadesi', { exact: true }).fill('1d20')
  await page.getByLabel('Atış türü').selectOption('advantage')
  await page.getByLabel('Ek değer', { exact: true }).fill('5')
  await page.getByLabel('Yalnız sonucu göster').check()
  await page.getByRole('button', { name: 'Zarları at', exact: true }).click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.roll?.onlyTotal)
    .toBe(true)
  roll = (await publicFrame(page)).studio.roll
  expect(roll.terms).toEqual([])
  expect(roll.expression).toBe('')
  expect(roll.total).toBeGreaterThanOrEqual(6)
  expect(roll.total).toBeLessThanOrEqual(25)
})
test('inisiyatif geri alınır; gizli düşman ve sayısal can görünümü seçime göre yayınlanır', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Savaş')
  for (const name of ['Muhafız', 'Yağmacı']) {
    await page.getByLabel('Görünen savaşçı adı').fill(name)
    await page.getByRole('button', { name: 'Savaşa ekle', exact: true }).click()
  }
  await page.locator('.st-battle-broadcast>summary').click()
  await page.getByLabel('Savaş bilgisini canlı göster').check()
  await page.getByRole('button', { name: 'Sıradaki', exact: true }).click()
  await expect(page.locator('.st-turn>span')).toHaveText('Yağmacı')
  await page.getByRole('button', { name: 'Sıradaki', exact: true }).click()
  await expect(page.locator('.st-turn>strong')).toHaveText('Tur 2')
  await page.getByRole('button', { name: 'Önceki hamle', exact: true }).click()
  await expect(page.locator('.st-turn>strong')).toHaveText('Tur 1')
  await expect(page.locator('.st-turn>span')).toHaveText('Yağmacı')
  await page.getByLabel('İzleyiciye can gösterimi').selectOption('number')
  await expect
    .poll(async () => (await publicFrame(page)).studio.combat.items[1].hpText)
    .toBe('10/10')
})
test('görev rehberi hazırlığı kurar; atlama, düzenleme ve karar hatırlatması kaydedilir', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Görev')
  const step = (id: string, title: string) => ({
    id,
    title,
    summary: 'SECRET-SCENE',
    readAloud: 'Oyunculara açık söz',
    actions: ['Kapıyı anlat'],
    checks: ['DC 12'],
    choices: [],
    backgroundId: 'winter-kopru',
    portraitIds: ['taren-olt'],
    publicTitle: 'Köprü kıyısı',
    publicNames: { 'taren-olt': 'Yabancı asker' },
  })
  const pack = {
    version: 2,
    title: 'Özel deneme',
    quests: [
      {
        id: 'bridge',
        title: 'Köprü görevi',
        body: 'SECRET-PACK',
        steps: [step('first', 'Varış'), step('second', 'Karar')],
      },
    ],
  }
  await page.getByTestId('broadcast-import-dm').setInputFiles({
    name: 'dm.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(pack)),
  })
  await page.getByTestId('dm-prepare-scene').click()
  expect((await publicFrame(page)).title).toBe('CANLI: eski')
  await page.getByTestId('dm-reveal-scene').click()
  await expect
    .poll(async () => (await publicFrame(page)).title)
    .toBe('Köprü kıyısı')
  expect((await publicFrame(page)).actors[0].name).toBe('Yabancı asker')
  expect(JSON.stringify(await publicFrame(page))).not.toContain('SECRET')
  await page.getByText('Sahne akışı ve düzenleme', { exact: true }).click()
  await page
    .getByRole('button', { name: 'Bu sahneyi atla', exact: true })
    .click()
  await expect(page.locator('.dm-step-counter')).toHaveText('SAHNE 2 / 2')
  await page.getByLabel('Oyuncuların kararı').fill('Köprü yıkıldı')
  await page
    .getByRole('button', {
      name: 'Bu kararı hatırlatmaya dönüştür',
      exact: true,
    })
    .click()
  await page
    .getByRole('button', { name: 'Görev sahnelerini içe al', exact: true })
    .click()
  await expect(page.locator('.studio-scene-card')).toHaveCount(2)
  await expect
    .poll(async () => (await project(page))?.facts[0]?.value)
    .toBe('Köprü yıkıldı')
  await page.reload()
  await expect(page.getByTestId('studio-take')).toBeEnabled()
  await expect(page.locator('.dm-step-counter')).toHaveText('SAHNE 2 / 2')
})
test('komut araması ve düzenlenebilir kısayol metin yazımına karışmaz', async ({
  page,
}) => {
  await bootStudio(page)
  await page.getByRole('button', { name: /Komutlar/ }).click()
  await page.getByLabel('Komut ara').fill('Haritayı')
  await page
    .getByRole('button', { name: 'Haritayı hazırlığa aç', exact: true })
    .click()
  await expect(
    page.getByTestId('studio-preview').getByTestId('broadcast-map'),
  ).toBeVisible()
  await panel(page, 'Sahne')
  const input = page.getByLabel('Hazırlık sahne başlığı')
  await input.fill('Yeni')
  await input.press('Alt+b')
  expect((await publicFrame(page)).intermission).toBe(false)
  await input.blur()
  await page.keyboard.press('Alt+b')
  await expect
    .poll(async () => (await publicFrame(page)).intermission)
    .toBe(true)
})
for (const [width, height] of [
  [1920, 1080],
  [3840, 2160],
])
  test(`ayrı ${width}×${height} çıkışları alanı doldurur ve şeffaf kaynaklar yalnız katmanlarını gösterir`, async ({
    page,
    browser,
  }) => {
    await bootStudio(page)
    const ctx = await browser.newContext({ viewport: { width, height } }),
      output = await ctx.newPage()
    await output.goto('http://127.0.0.1:5173/#/broadcast/live')
    await expect(
      output.locator('.studio-output > [data-testid="broadcast-stage"]'),
    ).toBeVisible()
    const box = await output
      .locator('.studio-output > [data-testid="broadcast-stage"]')
      .boundingBox()
    expect(box!.width).toBe(width)
    expect(box!.height).toBe(height)
    for (const type of ['portraits', 'dice', 'initiative']) {
      await output.goto(`http://127.0.0.1:5173/#/broadcast/output/${type}`)
      await expect(output.locator('.studio-output-transparent')).toBeVisible()
      await expect(output.locator('.broadcast-backdrop')).toBeHidden()
      expect(
        await output
          .locator('body')
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      ).toBe('rgba(0, 0, 0, 0)')
      await expect(output.getByRole('navigation')).toHaveCount(0)
    }
    await ctx.close()
  })
test('390px yönetim ve telefon ekranı yatay taşmaz', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await bootStudio(page)
  for (const name of [
    'Görev',
    'Sahne',
    'Görsel',
    'Kişi',
    'Harita',
    'Savaş',
    'Zar',
    'Ses',
    'Defter',
    'Yayın',
  ]) {
    await panel(page, name)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      name,
    ).toBeLessThanOrEqual(390)
  }
  await page.goto('/#/broadcast/remote')
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
})
