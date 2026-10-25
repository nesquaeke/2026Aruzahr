import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import {
  bootStudio,
  panel,
  publicFrame,
  project,
  take,
} from './studio-fixtures'
test.describe.configure({ timeout: 60000 })
test('özel kampanya paketi resim, ses, karar ve DM ilerlemesini temiz profilde geri getirir', async ({
  page,
  browser,
}) => {
  await bootStudio(page)
  await panel(page, 'Görev')
  const pack = {
    version: 2,
    title: 'SECRET-CAMPAIGN',
    quests: [
      {
        id: 'private',
        title: 'Görev',
        body: 'SECRET-NOTES',
        steps: [
          {
            id: 'entry',
            title: 'Kapı',
            summary: 'SECRET-CLUE',
            readAloud: 'Kapıya geldiniz.',
            actions: [],
            checks: [],
            choices: [],
            backgroundId: 'winter-ilac',
            portraitIds: [],
            publicTitle: 'Revir',
          },
        ],
      },
    ],
  }
  await page.getByTestId('broadcast-import-dm').setInputFiles({
    name: 'dm.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(pack)),
  })
  await page.getByTestId('dm-prepare-scene').click()
  await page.getByLabel('Oyuncuların kararı').fill('SECRET-DECISION')
  await page
    .getByRole('button', {
      name: 'Bu kararı hatırlatmaya dönüştür',
      exact: true,
    })
    .click()
  await page
    .getByRole('button', { name: 'Sahneyi kaydet', exact: true })
    .click()
  await take(page, 'Revir')
  await panel(page, 'Ses')
  await page
    .locator('.panel-sound input[type=file]')
    .setInputFiles('public/audio/builtin-fire.wav')
  await expect(
    page
      .locator('.panel-sound details summary')
      .filter({ hasText: 'builtin-fire' }),
  ).toBeVisible()
  await panel(page, 'Yayın')
  const download = page.waitForEvent('download')
  await page
    .locator('.panel-broadcast')
    .getByRole('button', { name: 'Özel kampanya paketini indir', exact: true })
    .click()
  const file = await download,
    path = (await file.path())!,
    raw = JSON.parse(await readFile(path, 'utf8'))
  expect(raw.format).toBe('aruzahr-campaign')
  expect(JSON.stringify(raw)).toContain('SECRET-DECISION')
  expect(Object.keys(raw.assets).length).toBeGreaterThanOrEqual(2)
  expect(JSON.stringify(await publicFrame(page))).not.toContain('SECRET')
  const context = await browser.newContext(),
    fresh = await context.newPage()
  await fresh.goto('http://127.0.0.1:5173/#/broadcast')
  await fresh
    .getByRole('button', { name: 'Kontrolü bu pencereye al', exact: true })
    .click()
  await fresh.getByRole('button', { name: 'Gelişmiş masaya geç', exact: true }).click()
  await expect(fresh.getByTestId('studio-take')).toBeEnabled()
  await panel(fresh, 'Yayın')
  await fresh.locator('.panel-broadcast input[type=file]').setInputFiles(path)
  await expect(
    fresh.getByRole('dialog', { name: 'Kampanya içe aktarma' }),
  ).toBeVisible()
  await fresh
    .getByRole('button', { name: 'Bu kampanyayla değiştir', exact: true })
    .click()
  await expect.poll(async () => (await project(fresh))?.scenes.length).toBe(1)
  await expect
    .poll(async () => (await project(fresh))?.audioAssets.length)
    .toBe(1)
  await panel(fresh, 'Görev')
  await expect(fresh.getByLabel('Oyuncuların kararı')).toHaveValue(
    'SECRET-DECISION',
  )
  await expect(fresh.getByTestId('dm-reveal-scene')).toBeDisabled()
  await fresh.getByTestId('dm-prepare-scene').click()
  await expect(fresh.getByTestId('dm-reveal-scene')).toBeEnabled()
  expect(JSON.stringify(await publicFrame(fresh))).not.toContain('SECRET')
  await context.close()
})
test('eksik veya değiştirilmiş paket çalışan kampanyayı değiştirmez', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Yayın')
  const p = await project(page)
  const malformed = {
    ...p,
    program: {
      ...p.program,
      scene: {
        ...p.program.scene,
        src: '/__aruzahr-broadcast/asset/' + 'f'.repeat(64),
      },
    },
    mediaVault: {},
  }
  await page.locator('.panel-broadcast input[type=file]').setInputFiles({
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(malformed)),
  })
  await expect(page.getByRole('status')).toContainText('görseli eksik')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect((await publicFrame(page)).title).toBe('CANLI: eski')
  expect((await project(page))?.id).toBe(p.id)
  const audio =
    'data:audio/wav;base64,' +
    (await readFile('public/audio/builtin-fire.wav')).toString('base64')
  await page
    .locator('.panel-broadcast input[type=file]')
    .setInputFiles({
      name: 'bad-audio.json',
      mimeType: 'application/json',
      buffer: Buffer.from(
        JSON.stringify({
          ...p,
          audioAssets: [
            {
              id: 'f'.repeat(64),
              name: 'Bozuk ses',
              src: audio,
              type: 'ambience',
              license: 'Test',
            },
          ],
        }),
      ),
    })
  await expect(page.getByRole('status')).toContainText(
    'Ses dosyası bütünlüğü doğrulanamadı',
  )
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect((await project(page))?.id).toBe(p.id)
})
test('birleştirme çakışan kimlikleri ayırır ve maske/sahne bağlantılarını korur', async ({
  page,
}) => {
  await bootStudio(page)
  const result = await page.evaluate(async () => {
    const path = '/src/studio/model.ts'
    const { newProject, mergeProjects, sceneCard, validateProject } =
      await import(path)
    const a = newProject(),
      b = newProject(),
      person = {
        id: 'same-person',
        sourceId: 'taren-olt',
        realName: 'Gizli',
        knownName: 'Yolcu',
        revealed: false,
        src: a.draft.scene.src,
        role: '',
        city: '',
        affiliation: '',
        voice: '',
        aim: '',
        relationship: '',
        notes: '',
        kind: 'ally',
        hp: 10,
        maxHp: 10,
        ac: 10,
      }
    a.cast = [person]
    b.cast = [person]
    b.draft.actors = [
      {
        id: person.id,
        name: 'Yolcu',
        src: person.src,
        kind: 'image',
        x: 0,
        y: 0,
        w: 50,
        h: 50,
        hidden: false,
      },
    ]
    const first = sceneCard(a.draft, 'A'),
      second = sceneCard(b.draft, 'B', {
        'same-person': [{ x: 0, y: 0, w: 100, h: 25 }],
      })
    first.id = 'same-scene'
    second.id = 'same-scene'
    a.scenes = [first]
    b.scenes = [second]
    b.facts = [
      {
        id: 'f',
        label: 'Karar',
        value: 'Köprü yıkıldı',
        sceneIds: ['same-scene'],
        questIds: [],
        enabled: true,
      },
    ]
    const merged = validateProject(mergeProjects(a, b))
    return {
      cast: merged.cast.map((c: any) => c.id),
      scenes: merged.scenes.map((s: any) => s.id),
      actor: merged.scenes[1].state.actors[0].id,
      covers: Object.keys(merged.scenes[1].covers),
      linked: merged.facts[0].sceneIds,
    }
  })
  expect(new Set(result.cast).size).toBe(2)
  expect(new Set(result.scenes).size).toBe(2)
  expect(result.covers).toEqual([result.actor])
  expect(result.linked).toEqual([result.scenes[1]])
})
test('kapatılan ipucu pikselleri halka açık resimden çıkarılır; dosya adı gönderilmez', async ({
  page,
}) => {
  await bootStudio(page)
  await page.evaluate(async () => {
    const path = '/src/studio/model.ts'
    const { loadProject, storeProject } = await import(path)
    const p = await loadProject()
    const c = document.createElement('canvas')
    c.width = 100
    c.height = 100
    const x = c.getContext('2d')!
    x.fillStyle = 'red'
    x.fillRect(0, 0, 100, 50)
    x.fillStyle = 'blue'
    x.fillRect(0, 50, 100, 50)
    const src = c.toDataURL('image/png')
    p.draft.actors = [
      {
        id: 'clue',
        name: 'Bulunan mektup',
        src,
        kind: 'image',
        x: 20,
        y: 10,
        w: 50,
        h: 70,
        hidden: false,
      },
    ]
    p.covers = { clue: [{ x: 0, y: 0, w: 100, h: 50 }] }
    await storeProject(p)
  })
  await page.reload()
  await expect(page.getByTestId('studio-take')).toBeEnabled()
  await take(page, 'HAZIRLIK: yeni')
  const frame = await publicFrame(page)
  const src = frame.actors[0].src
  expect(src).toMatch(/^\/__aruzahr-broadcast\/asset\/[a-f0-9]{64}$/)
  const pixels = await page.evaluate(async (src) => {
    const img = new Image()
    img.src = src
    await img.decode()
    const c = document.createElement('canvas')
    c.width = 100
    c.height = 100
    const x = c.getContext('2d')!
    x.drawImage(img, 0, 0)
    return {
      top: [...x.getImageData(50, 25, 1, 1).data],
      bottom: [...x.getImageData(50, 75, 1, 1).data],
    }
  }, src)
  expect(pixels.top[0]).toBeLessThan(35)
  expect(pixels.top[1]).toBeLessThan(35)
  expect(pixels.bottom[2]).toBeGreaterThan(200)
  expect(pixels.bottom[0]).toBeLessThan(30)
})
test('tam sıfırlama stüdyo ve eski kayıtları temizler, ilgisiz anahtarı korur', async ({
  page,
}) => {
  await bootStudio(page)
  await page
    .getByRole('button', { name: 'Sahneyi kaydet', exact: true })
    .click()
  await page.evaluate(() => {
    localStorage.setItem('aruzahr-director-notes', 'SECRET-RESET')
    localStorage.setItem('unrelated-app', 'KEEP')
  })
  await panel(page, 'Yayın')
  await page
    .getByRole('button', {
      name: 'Bu cihazdaki tüm Aruzahr verilerini sıfırla',
      exact: true,
    })
    .click()
  const dialog = page.getByRole('dialog', { name: 'Tüm verileri sıfırla' })
  await expect(
    dialog.getByRole('button', { name: 'Her şeyi sıfırla', exact: true }),
  ).toBeDisabled()
  await dialog.getByRole('button', { name: 'Vazgeç', exact: true }).click()
  expect(
    await page.evaluate(() => localStorage.getItem('aruzahr-director-notes')),
  ).toBe('SECRET-RESET')
  await page
    .getByRole('button', {
      name: 'Bu cihazdaki tüm Aruzahr verilerini sıfırla',
      exact: true,
    })
    .click()
  await dialog.getByLabel('Tüm verileri sıfırlama onayı').fill('SIFIRLA')
  await dialog
    .getByRole('button', { name: 'Her şeyi sıfırla', exact: true })
    .click()
  await expect(page.getByTestId('studio-workspace')).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect.poll(async () => (await project(page))?.scenes.length).toBe(0)
  expect(await page.evaluate(() => localStorage.getItem('unrelated-app'))).toBe(
    'KEEP',
  )
  expect(
    await page.evaluate(() => localStorage.getItem('aruzahr-director-notes')),
  ).not.toBe('SECRET-RESET')
})

test('canlıdan kopyalanıp kaydedilen sahne yayından kalkınca da yerel arşivden hazırlanır', async ({
  page,
}) => {
  await bootStudio(page)
  await take(page, 'HAZIRLIK: yeni')
  const old = (await publicFrame(page)).scene.src
  await page
    .getByRole('button', { name: 'Yayını hazırlığa kopyala', exact: true })
    .click()
  await page
    .getByRole('button', { name: 'Sahneyi kaydet', exact: true })
    .click()
  const image = page
    .getByTestId('studio-preview')
    .locator('.broadcast-backdrop img')
  await expect(image).toHaveAttribute('src', /^data:image\//)
  await panel(page, 'Görsel')
  await page
    .getByTestId('broadcast-library')
    .getByRole('searchbox')
    .fill('Valdareth')
  await page
    .locator('[data-asset-id="valdareth"] .broadcast-asset-select')
    .click()
  await panel(page, 'Sahne')
  await page.getByLabel('Hazırlık sahne başlığı').fill('Başkent')
  await take(page, 'Başkent')
  await expect
    .poll(async () => (await page.request.get(old)).status(), {
      timeout: 10000,
    })
    .toBe(404)
  await page.locator('.studio-scene-open').first().click()
  await expect(image).toHaveAttribute('src', /^data:image\//)
  await expect
    .poll(() =>
      image.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    )
    .toBe(true)
  expect((await publicFrame(page)).title).toBe('Başkent')
  await take(page, 'HAZIRLIK: yeni')
  expect(
    (await page.request.get((await publicFrame(page)).scene.src)).ok(),
  ).toBe(true)
})
