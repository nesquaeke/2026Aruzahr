import { test, expect } from '@playwright/test'
import { createHash } from 'node:crypto'
import {
  bootStudio,
  panel,
  publicFrame,
  project,
  take,
} from './studio-fixtures'
test.describe.configure({ timeout: 60000 })
test('aynı tarayıcıdaki ikinci masa devralmayı açıkça ister ve eski masa kaydı ezmez', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Sahne')
  await page.getByLabel('Hazırlık sahne başlığı').fill('Birinci masanın kaydı')
  await take(page, 'Birinci masanın kaydı')
  await expect
    .poll(async () => (await project(page))?.program.title)
    .toBe('Birinci masanın kaydı')
  const second = await page.context().newPage()
  await second.goto('/#/broadcast')
  await expect(second.locator('.studio-owner-banner')).toBeVisible()
  await expect(second.getByTestId('studio-take')).toBeDisabled()
  await second
    .getByRole('button', { name: 'Kontrolü bu pencereye al', exact: true })
    .click()
  await expect(second.getByTestId('studio-take')).toBeEnabled()
  await expect(page.locator('.studio-owner-banner')).toBeVisible()
  await panel(second, 'Sahne')
  await second.getByLabel('Hazırlık sahne başlığı').fill('İkinci masa')
  await take(second, 'İkinci masa')
  await expect
    .poll(async () => (await project(second))?.program.title)
    .toBe('İkinci masa')
  await page.waitForTimeout(1800)
  expect((await project(page))?.program.title).toBe('İkinci masa')
  await expect(page.getByTestId('studio-take')).toBeDisabled()
  await second.close()
})
test('telefon kumandası sahneyi hazırlayıp ayrı eylemle yayına alır', async ({
  page,
  browser,
}) => {
  await bootStudio(page)
  await panel(page, 'Sahne')
  await page.getByLabel('Hazırlık sahne başlığı').fill('Telefon sahnesi')
  await page
    .getByRole('button', { name: 'Sahneyi kaydet', exact: true })
    .click()
  await panel(page, 'Yayın')
  await page
    .getByRole('button', {
      name: '10 dakikalık eşleştirme kodu üret',
      exact: true,
    })
    .click()
  const pin = await page.locator('.st-pair-pin').innerText()
  const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    }),
    remote = await context.newPage()
  await remote.goto('http://127.0.0.1:5173/#/broadcast/remote?code=' + pin)
  await remote.getByRole('button', { name: 'Bağlan', exact: true }).click()
  await remote
    .getByRole('button', { name: 'Telefon sahnesi · hazırla', exact: true })
    .click()
  await expect(page.getByTestId('studio-preview')).toContainText(
    'Telefon sahnesi',
  )
  expect((await publicFrame(page)).title).toBe('CANLI: eski')
  await remote.getByRole('button', { name: 'Yayına al', exact: true }).click()
  await expect
    .poll(async () => (await publicFrame(page)).title)
    .toBe('Telefon sahnesi')
  await remote.getByRole('button', { name: 'Ara / devam', exact: true }).click()
  await expect
    .poll(async () => (await publicFrame(page)).intermission)
    .toBe(true)
  expect(
    await remote.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
  await context.close()
})
test('oylama tek tarayıcı oyunu sınırlar; sonuçlar canlı katmana ulaşır ve kapanınca oy alınmaz', async ({
  page,
  browser,
}) => {
  await bootStudio(page)
  await panel(page, 'Yayın')
  await page
    .getByLabel('Açık soru', { exact: true })
    .fill('Kervan nereye gitsin?')
  await page
    .getByLabel('Seçenekler · her satıra bir tane')
    .fill('Harven\nFrostbay')
  await page.getByRole('button', { name: 'Oylamayı aç', exact: true }).click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.poll?.title)
    .toBe('Kervan nereye gitsin?')
  const code = (await publicFrame(page)).studio.poll.code
  const context = await browser.newContext(),
    voter = await context.newPage()
  await voter.goto('http://127.0.0.1:5173/#/broadcast/vote?code=' + code)
  await voter.getByRole('button', { name: /^Harven/ }).click()
  await expect(voter.getByRole('status')).toContainText('Oyun kaydedildi')
  await expect
    .poll(async () => (await publicFrame(page)).studio.poll.options[0].votes)
    .toBe(1)
  await voter.reload()
  await voter.getByRole('button', { name: /^Frostbay/ }).click()
  await expect(voter.getByRole('status')).toContainText('oy kullanıldı')
  await page
    .getByRole('button', { name: 'Oylamayı kapat', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.poll.open)
    .toBe(false)
  const reply = await voter.request.post('/__aruzahr-broadcast/studio/vote', {
    data: { code, voter: 'another-voter', option: '1' },
  })
  expect(reply.ok()).toBe(false)
  await context.close()
})
test('ara geri sayımı durur ve uzar; süre bitince gizli hazırlık kendiliğinden açılmaz', async ({
  page,
  browser,
}) => {
  await bootStudio(page)
  await panel(page, 'Yayın')
  await page.getByLabel('Dakika', { exact: true }).fill('1')
  await page
    .getByRole('button', { name: 'Geri sayımla ara ver', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).intermission)
    .toBe(true)
  const first = (await publicFrame(page)).studio.break.until
  await page
    .getByRole('button', { name: 'Süreyi durdur / sürdür', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.break.until)
    .toBe(null)
  const paused = (await publicFrame(page)).studio.break.paused
  expect(paused).toBeGreaterThan(0)
  await page.getByRole('button', { name: '5 dakika ekle', exact: true }).click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.break.paused)
    .toBe(paused + 300000)
  await page
    .getByRole('button', { name: 'Süreyi durdur / sürdür', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).studio.break.until)
    .toBeGreaterThan(first)
  const ctx = await browser.newContext(),
    live = await ctx.newPage()
  await live.goto('http://127.0.0.1:5173/#/broadcast/live')
  await expect(live.getByTestId('broadcast-break')).toBeVisible()
  await expect(live.locator('.studio-break-countdown')).toBeVisible()
  await page
    .locator('.panel-broadcast')
    .getByRole('button', { name: 'Moladan dön', exact: true })
    .click()
  await expect(live.getByTestId('broadcast-break')).toHaveCount(0)
  await expect(live.getByText('CANLI: eski', { exact: true })).toBeVisible()
  await ctx.close()
})
test('OBS WebSocket 5 kimlik doğrulaması ve kayıtlı sahne eşleştirmesi protokol üzerinden çalışır', async ({
  page,
}) => {
  const password = 'local-test-only',
    salt = 'fixture-salt',
    challenge = 'fixture-challenge',
    hash = (v: string) => createHash('sha256').update(v).digest('base64'),
    expected = hash(hash(password + salt) + challenge)
  const calls: string[] = [],
    auth: string[] = []
  await page.routeWebSocket('ws://127.0.0.1:4455', (ws) => {
    ws.send(
      JSON.stringify({
        op: 0,
        d: {
          obsWebSocketVersion: '5.5.0',
          rpcVersion: 1,
          authentication: { salt, challenge },
        },
      }),
    )
    ws.onMessage((data) => {
      const m = JSON.parse(String(data))
      if (m.op === 1) {
        auth.push(m.d.authentication)
        if (m.d.authentication === expected)
          ws.send(JSON.stringify({ op: 2, d: { negotiatedRpcVersion: 1 } }))
        else ws.close({ code: 4009, reason: 'Authentication failed' })
      }
      if (m.op === 6) {
        calls.push(m.d.requestType)
        ws.send(
          JSON.stringify({
            op: 7,
            d: {
              requestType: m.d.requestType,
              requestId: m.d.requestId,
              requestStatus: { result: true, code: 100 },
              responseData:
                m.d.requestType === 'GetSceneList'
                  ? {
                      scenes: [
                        { sceneName: 'Aruzahr - Sahne' },
                        { sceneName: 'Aruzahr - Ara' },
                      ],
                    }
                  : {},
            },
          }),
        )
      }
    })
  })
  await bootStudio(page)
  await page
    .getByRole('button', { name: 'Sahneyi kaydet', exact: true })
    .click()
  await panel(page, 'Yayın')
  await page
    .getByText('OBS WebSocket 5 · isteğe bağlı', { exact: true })
    .click()
  await page.getByLabel('OBS WebSocket şifresi', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'OBS’ye bağlan', exact: true }).click()
  await expect(page.getByText('OBS bağlı', { exact: true })).toBeVisible()
  expect(auth).toEqual([expected])
  await panel(page, 'Sahne')
  await page
    .getByText('Kayıtlı sahnenin özel bilgileri', { exact: true })
    .click()
  await page
    .getByLabel('Yayına alırken OBS sahnesi')
    .selectOption('Aruzahr - Sahne')
  await take(page, 'HAZIRLIK: yeni')
  await expect.poll(() => calls.includes('SetCurrentProgramScene')).toBe(true)
  expect(JSON.stringify(await publicFrame(page))).not.toContain(password)
})
test('ses tek ana izleyici kaynağında çalar, aynı ortam yeniden başlamaz, susturma durdurur', async ({
  page,
  browser,
}) => {
  await bootStudio(page)
  await panel(page, 'Ses')
  await page.getByLabel('Sesin çıkacağı pencere').selectOption('audience')
  await page.getByLabel('ambience ses seçimi').selectOption('builtin-wind')
  const ctx = await browser.newContext()
  await ctx.addInitScript(() => {
    const Native = window.Audio
    ;(window as any).__studioAudios = []
    window.Audio = class extends Native {
      constructor(src?: string) {
        super(src)
        ;(window as any).__studioAudios.push(this)
      }
    }
  })
  const first = await ctx.newPage()
  await first.goto('http://127.0.0.1:5173/#/broadcast/live')
  await take(page, 'HAZIRLIK: yeni')
  const unlock = first.getByRole('button', {
    name: /Sesi başlat|Ses engellendi/,
  })
  await unlock.click({ timeout: 1500 }).catch(() => {})
  await expect
    .poll(() =>
      first.evaluate(
        () =>
          (window as any).__studioAudios.filter(
            (a: HTMLAudioElement) => !a.paused,
          ).length,
      ),
    )
    .toBe(1)
  const count = await first.evaluate(
    () => (window as any).__studioAudios.length,
  )
  const second = await ctx.newPage()
  await second.goto('http://127.0.0.1:5173/#/broadcast/live')
  await second.waitForTimeout(1800)
  expect(
    await second.evaluate(
      () =>
        (window as any).__studioAudios.filter(
          (a: HTMLAudioElement) => !a.paused,
        ).length,
    ),
  ).toBe(0)
  await take(page, 'HAZIRLIK: yeni')
  expect(
    await first.evaluate(() => (window as any).__studioAudios.length),
  ).toBe(count)
  await page
    .getByRole('button', { name: 'Acil sessizlik', exact: true })
    .click()
  await expect
    .poll(() =>
      first.evaluate(
        () =>
          (window as any).__studioAudios.filter(
            (a: HTMLAudioElement) => !a.paused,
          ).length,
      ),
    )
    .toBe(0)
  await ctx.close()
})
test('kilitli ve gruplanmış portreler birlikte tutarlı taşınır; geri alma geometriyi geri getirir', async ({
  page,
}) => {
  await bootStudio(page)
  await page.evaluate(async () => {
    const path = '/src/studio/model.ts'
    const { loadProject, storeProject } = await import(path)
    const p = await loadProject(),
      src = p.draft.scene.src
    p.draft.actors = [
      {
        id: 'a',
        name: 'Bir',
        src,
        kind: 'portrait',
        x: 10,
        y: 10,
        w: 12,
        h: 30,
        hidden: false,
        group: 'g',
      },
      {
        id: 'b',
        name: 'İki',
        src,
        kind: 'portrait',
        x: 45,
        y: 10,
        w: 12,
        h: 30,
        hidden: false,
        group: 'g',
      },
    ]
    await storeProject(p)
  })
  await page.reload()
  await expect(page.getByTestId('studio-take')).toBeEnabled()
  const preview = page.getByTestId('studio-preview'),
    actor = preview.getByTestId('broadcast-actor-a'),
    bounds = (await actor.boundingBox())!,
    stage = (await preview.boundingBox())!
  await page.mouse.move(
    bounds.x + bounds.width * 0.5,
    bounds.y + bounds.height * 0.3,
  )
  await page.mouse.down()
  await page.mouse.move(
    bounds.x + bounds.width * 0.5 + stage.width * 0.1,
    bounds.y + bounds.height * 0.3,
    { steps: 8 },
  )
  await page.mouse.up()
  await expect
    .poll(async () => (await project(page))?.draft.actors[0].x)
    .toBeCloseTo(20, 0)
  const p = await project(page)
  expect(p!.draft.actors[1].x - p!.draft.actors[0].x).toBeCloseTo(35, 1)
  await page.keyboard.press('Control+z')
  await expect
    .poll(async () => (await project(page))?.draft.actors[0].x)
    .toBe(10)
  await panel(page, 'Sahne')
  const row = page.locator('.st-layer').filter({ hasText: 'Bir' }).first()
  await row.locator('summary').click()
  await row.getByRole('button', { name: 'Kilitle', exact: true }).click()
  await actor.focus()
  await actor.press('ArrowRight')
  await expect
    .poll(async () => (await project(page))?.draft.actors[0].locked)
    .toBe(true)
  expect((await project(page))?.draft.actors[0].x).toBe(10)
})
