import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import {
  bootStudio,
  panel,
  project,
  publicFrame,
  take,
} from './studio-fixtures'
test.describe.configure({ timeout: 60000 })

test('özel harita işaretleri, kalibrasyon, kamera yer imi ve dikkat halkası ayrı yayınlanır', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Harita')
  await page
    .getByLabel('Şehre odaklan', { exact: true })
    .selectOption('marhalden')
  const preview = page.getByTestId('studio-preview'),
    map = preview.getByTestId('broadcast-map')
  await expect(
    map.getByRole('button', { name: 'Haritayı yakınlaştır', exact: true }),
  ).toBeEnabled()
  await page.getByRole('button', { name: 'Yer işareti', exact: true }).click()
  const box = (await map.locator('.openseadragon-canvas').boundingBox())!
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5)
  await page.mouse.click(box.x + box.width * 0.65, box.y + box.height * 0.5)
  await expect
    .poll(async () => (await project(page))?.mapMarkers.length)
    .toBe(2)
  expect((await publicFrame(page)).studio.markers).toEqual([])
  const items = page
    .locator('.panel-map details')
    .filter({ has: page.locator('summary') })
  const first = items.filter({ hasText: 'Yer işareti 1' }).first()
  await first.locator('summary').click()
  await first.getByLabel('Yalnız DM’ye göster').uncheck()
  await first.getByLabel('Tür', { exact: true }).selectOption('route')
  await page.getByText('Mesafe ölçeği · isteğe bağlı', { exact: true }).click()
  await expect(page.locator('.panel-map output')).toContainText(
    'Ölçek ve iki işaret gerekli',
  )
  await page
    .getByLabel('8192 piksel yatay genişlik (km)', { exact: true })
    .fill('1000')
  const marks = (await project(page))!.mapMarkers
  await page.getByLabel('İlk işaret', { exact: true }).selectOption(marks[0].id)
  await page
    .getByLabel('İkinci işaret', { exact: true })
    .selectOption(marks[1].id)
  await expect(page.locator('.panel-map output')).toContainText(
    'km · kuş uçuşu',
  )
  await page.getByLabel('Yer imi adı', { exact: true }).fill('Marhalden kapısı')
  await page
    .getByRole('button', { name: 'Bu görünümü kaydet', exact: true })
    .click()
  await expect.poll(async () => (await project(page))?.bookmarks.length).toBe(1)
  await take(page, 'HAZIRLIK: yeni')
  const frame = await publicFrame(page)
  expect(frame.mode).toBe('map')
  expect(frame.studio.markers).toHaveLength(1)
  expect(frame.studio.markers[0].id).toBe(marks[0].id)
  expect(frame.studio.markers[0].hidden).toBeUndefined()
  await page
    .getByRole('button', { name: 'Canlı dikkat halkası', exact: true })
    .click()
  await page.mouse.click(box.x + box.width * 0.55, box.y + box.height * 0.55)
  await expect
    .poll(async () =>
      (await publicFrame(page)).studio.markers.some(
        (m: any) => m.kind === 'ping' && m.expires > Date.now(),
      ),
    )
    .toBe(true)
})

test('oyuncu özeti yalnız açık kayıtlardan çıkar ve ara ekranına özel metin taşınmaz', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Defter')
  await page
    .getByLabel('DM kaydı', { exact: true })
    .fill('SECRET: Kaçakçının gerçek adı ve ihanet planı.')
  await page
    .getByLabel('Oyunculara açık cümle · isteğe bağlı', { exact: true })
    .fill('Kervan Marhalden kapısına ulaştı.')
  await page.getByRole('button', { name: 'Deftere ekle', exact: true }).click()
  await page
    .getByRole('button', {
      name: 'Kayıtlardan özet taslağı çıkar',
      exact: true,
    })
    .click()
  await expect(
    page.getByLabel('Özel DM özeti · düzenlenebilir', { exact: true }),
  ).toContainText('SECRET')
  await expect(
    page.getByLabel('Oyunculara açık özet · düzenlenebilir', { exact: true }),
  ).toHaveValue('• Kervan Marhalden kapısına ulaştı.')
  const downloading = page.waitForEvent('download')
  await page
    .getByRole('button', { name: 'Oyuncu özetini indir', exact: true })
    .click()
  const file = await downloading
  const text = await readFile((await file.path())!, 'utf8')
  expect(text).not.toContain('SECRET')
  expect(text).toContain('Kervan')
  await page
    .getByRole('button', { name: 'Açık özeti ara ekranına koy', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.break.summary)
    .toContain('Kervan')
  expect(JSON.stringify(await publicFrame(page))).not.toContain('SECRET')
})

test('tarayıcı ilk ses iznini reddederse başlatma düğmesi aynı ortamı yeniden oynatır', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const native = HTMLMediaElement.prototype.play
    let first = true
    ;(window as any).__playCalls = 0
    HTMLMediaElement.prototype.play = function () {
      ;(window as any).__playCalls++
      if (first) {
        first = false
        return Promise.reject(
          new DOMException('User gesture required', 'NotAllowedError'),
        )
      }
      return native.call(this)
    }
  })
  await bootStudio(page)
  await panel(page, 'Ses')
  await page
    .getByLabel('ambience ses seçimi', { exact: true })
    .selectOption('builtin-fire')
  await take(page, 'HAZIRLIK: yeni')
  const unlock = page.getByRole('button', {
    name: 'Ses engellendi · başlat',
    exact: true,
  })
  await expect(unlock).toBeVisible()
  const before = await page.evaluate(() => (window as any).__playCalls)
  await unlock.click()
  await expect(unlock).toHaveCount(0)
  expect(
    await page.evaluate(() => (window as any).__playCalls),
  ).toBeGreaterThan(before)
  await panel(page, 'Yayın')
  await expect(
    page.locator('.st-status').filter({ hasText: 'Ses kaynağı:' }),
  ).toContainText('Çalıyor')
})

test('kampanya birleştirmesi çakışan görev ve sahne ilerlemesini, çıkışları ve karar bağlarını korur', async ({
  page,
}) => {
  await bootStudio(page)
  const merged = await page.evaluate(async () => {
    const model = '/src/studio/model.ts'
    const { newProject, mergeProjects, validateProject } = await import(model)
    const a = newProject(),
      b = newProject()
    const pack = {
      version: 2,
      title: 'Paket',
      quests: [
        {
          id: 'same-quest',
          title: 'Görev',
          body: 'Özel',
          steps: [
            {
              id: 'one',
              title: 'Kapı',
              summary: 'Durum',
              readAloud: 'Ses',
              actions: [],
              checks: [],
              choices: [],
              backgroundId: 'marhalden',
              portraitIds: [],
              publicTitle: 'Kapı',
              exits: [{ label: 'İleri', sceneId: 'two' }],
            },
            {
              id: 'two',
              title: 'Köprü',
              summary: 'Durum',
              readAloud: 'Ses',
              actions: [],
              checks: [],
              choices: [],
              backgroundId: 'marhalden',
              portraitIds: [],
              publicTitle: 'Köprü',
            },
          ],
        },
      ],
    }
    a.dmStorage = {
      'aruzahr-director-pack': JSON.stringify(pack),
      'aruzahr-director-progress': JSON.stringify({
        quest: 'same-quest',
        steps: { 'same-quest': 0 },
        done: [],
        decisions: { 'same-quest': 'Mevcut karar' },
        skipped: [],
      }),
    }
    b.dmStorage = {
      'aruzahr-director-pack': JSON.stringify(pack),
      'aruzahr-director-progress': JSON.stringify({
        quest: 'same-quest',
        steps: { 'same-quest': 1 },
        done: ['same-quest'],
        decisions: { 'same-quest': 'Gelen karar' },
        skipped: ['one'],
      }),
    }
    b.facts = [
      {
        id: 'f',
        label: 'Hatırla',
        value: 'Gelen karar',
        sceneIds: ['dm:same-quest:one'],
        questIds: ['same-quest'],
        enabled: true,
      },
    ]
    const result = validateProject(mergeProjects(a, b))
    return {
      pack: JSON.parse(result.dmStorage['aruzahr-director-pack']),
      progress: JSON.parse(result.dmStorage['aruzahr-director-progress']),
      fact: result.facts[0],
      program: result.program.title,
      currentProgram: a.program.title,
    }
  })
  const q = merged.pack.quests[1]
  expect(q.id).not.toBe('same-quest')
  expect(q.steps[0].id).not.toBe('one')
  expect(q.steps[0].exits[0].sceneId).toBe(q.steps[1].id)
  expect(merged.progress.steps[q.id]).toBe(1)
  expect(merged.progress.decisions[q.id]).toBe('Gelen karar')
  expect(merged.progress.decisions['same-quest']).toBe('Mevcut karar')
  expect(merged.progress.skipped).toContain(q.steps[0].id)
  expect(merged.fact.questIds).toEqual([q.id])
  expect(merged.fact.sceneIds).toEqual(['dm:' + q.id + ':' + q.steps[0].id])
  expect(merged.program).toBe(merged.currentProgram)
})

test('kanala atanmamış yerel ara ortamı da yüklenir ve yayında çözülebilir', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Ses')
  await page
    .locator('.panel-sound input[type=file]')
    .setInputFiles('public/audio/builtin-fire.wav')
  await expect
    .poll(async () => (await project(page))?.audioAssets.length)
    .toBe(1)
  const asset = (await project(page))!.audioAssets[0]
  await panel(page, 'Yayın')
  await page.getByLabel('Ara ortamı', { exact: true }).selectOption(asset.id)
  await page
    .getByRole('button', { name: 'Geri sayımla ara ver', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.break.ambientId)
    .toBe(asset.id)
  expect(
    (await page.request.get('/__aruzahr-broadcast/asset/' + asset.id)).status(),
  ).toBe(200)
  expect((await publicFrame(page)).studio.audio.ambience).toBeUndefined()
})

test('önceki canlı sahnede kullanılan ses yanlışlıkla silinmez', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Ses')
  await page
    .locator('.panel-sound input[type=file]')
    .setInputFiles('public/audio/builtin-fire.wav')
  await expect
    .poll(async () => (await project(page))?.audioAssets.length)
    .toBe(1)
  const asset = (await project(page))!.audioAssets[0]
  await page
    .getByLabel('ambience ses seçimi', { exact: true })
    .selectOption(asset.id)
  await take(page, 'HAZIRLIK: yeni')
  await page.getByLabel('ambience ses seçimi', { exact: true }).selectOption('')
  await panel(page, 'Sahne')
  await page.getByLabel('Hazırlık sahne başlığı').fill('Sessiz sahne')
  await take(page, 'Sessiz sahne')
  await panel(page, 'Ses')
  const row = page
    .locator('.panel-sound details')
    .filter({
      has: page.locator('summary').filter({ hasText: 'builtin-fire' }),
    })
  await row.locator('summary').click()
  await expect(
    row.getByRole('button', {
      name: 'Sahnede kullanımda · önce kanaldan çıkar',
      exact: true,
    }),
  ).toBeDisabled()
  await page.getByRole('button', { name: 'Önceki yayın', exact: true }).click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.audio.ambience?.id)
    .toBe(asset.id)
})

test('canlı efekt sayfa yenilenince aynı tetikleyiciyle yeniden çalmaz', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Native = window.Audio
    ;(window as any).__studioAudios = []
    window.Audio = class extends Native {
      constructor(src?: string) {
        super(src)
        ;(window as any).__studioAudios.push(this)
      }
    }
  })
  await bootStudio(page)
  await panel(page, 'Ses')
  await page
    .getByLabel('effect ses seçimi', { exact: true })
    .selectOption('builtin-knock')
  await page
    .getByRole('button', { name: 'Efekti canlı çal', exact: true })
    .click()
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as any).__studioAudios.filter(
            (a: HTMLAudioElement) => !a.paused,
          ).length,
      ),
    )
    .toBe(1)
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(
            sessionStorage.getItem('aruzahr-studio-heard-effects') || '[]',
          ).length,
      ),
    )
    .toBe(1)
  await expect(page.locator('.studio-save')).toHaveText('Kaydedildi')
  await page.reload()
  await expect(page.getByTestId('studio-take')).toBeEnabled()
  await page.waitForTimeout(1500)
  expect(await page.evaluate(() => (window as any).__studioAudios.length)).toBe(
    0,
  )
})
