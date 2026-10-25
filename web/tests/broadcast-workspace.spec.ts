import { readFile } from 'node:fs/promises'
import { expect, test, type Locator, type Page } from '@playwright/test'
import type { BroadcastState } from '../src/broadcast-state'

test.describe.configure({ timeout: 60_000 })

async function stored(page: Page): Promise<BroadcastState | null> {
  return page.evaluate(async () => {
    const source = '/src/broadcast-state.ts'
    const { loadBroadcast } = await import(source)
    return loadBroadcast()
  })
}

async function boot(page: Page, mode: BroadcastState['mode'] = 'scene') {
  // The audience route can seed a clean fixture without a director autosave
  // racing the IndexedDB transaction. Interactions below use the public UI.
  await page.goto('/#/broadcast/live')
  await expect(page.getByTestId('broadcast-live')).toBeVisible()
  await page.evaluate(async initialMode => {
    const source = '/src/broadcast-state.ts'
    const { newBroadcastState, saveBroadcast } = await import(source)
    const state = newBroadcastState()
    state.mode = initialMode
    await saveBroadcast(state)
  }, mode)
  await page.goto('/#/broadcast')
  await expect(page.getByTestId('broadcast-workspace')).toBeVisible()
  if (mode === 'map') await expect(page.getByRole('button', { name: 'Haritayı yakınlaştır', exact: true })).toBeEnabled()
}

async function panel(page: Page, label: string) {
  await page.getByRole('navigation', { name: 'Yönetim panelleri' }).getByRole('button', { name: label, exact: true }).click()
}

async function openLive(page: Page) {
  const popup = page.waitForEvent('popup')
  await page.getByTestId('broadcast-open-live').click()
  const live = await popup
  await expect(live.getByTestId('broadcast-live')).toBeVisible()
  await expect(page.getByText('Yayın penceresi bağlı', { exact: true })).toHaveCount(1)
  return live
}

async function chooseScene(page: Page, id: string, search: string) {
  await panel(page, 'Görseller')
  const library = page.getByTestId('broadcast-library')
  await library.getByRole('button', { name: /Sahneler/ }).click()
  await library.getByRole('searchbox').fill(search)
  await library.locator(`[data-asset-id="${id}"] .broadcast-asset-select`).click()
}

async function addPortrait(page: Page, id = 'vardek', search = 'Vardek') {
  await panel(page, 'Görseller')
  const library = page.getByTestId('broadcast-library')
  await library.getByRole('button', { name: /Karakterler/ }).click()
  await library.getByRole('searchbox').fill(search)
  await library.locator(`[data-asset-id="${id}"] .broadcast-asset-select`).click()
}

async function exportSession(page: Page) {
  await panel(page, 'Oturum')
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Oturum yedeğini indir', exact: true }).click()
  const download = await pending
  expect(download.suggestedFilename()).toMatch(/\.aruzahr\.json$/)
  const path = await download.path()
  expect(path).not.toBeNull()
  const text = await readFile(path!, 'utf8')
  return { text, state: JSON.parse(text) as BroadcastState }
}

async function importSession(page: Page, state: unknown) {
  await panel(page, 'Oturum')
  await page.getByTestId('broadcast-load-session').setInputFiles({
    name: 'session.aruzahr.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(state)),
  })
}

async function drag(page: Page, target: Locator, dx: number, dy: number) {
  await target.scrollIntoViewIfNeeded()
  const bounds = await target.boundingBox()
  expect(bounds).not.toBeNull()
  const x = bounds!.x + bounds!.width / 2, y = bounds!.y + bounds!.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx, y + dy, { steps: 8 })
  await page.mouse.up()
}

async function drawLine(page: Page, offset = 0) {
  const bounds = await page.getByTestId('broadcast-map').boundingBox()
  expect(bounds).not.toBeNull()
  const x = bounds!.x + bounds!.width * .4, y = bounds!.y + bounds!.height * .45 + offset
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 90, y + 32, { steps: 10 })
  await page.mouse.up()
}

async function tokenUV(token: Locator) {
  return token.evaluate(element => {
    const tokenBounds = element.getBoundingClientRect()
    const ink = element.closest('[data-testid="broadcast-map"]')!.querySelector('.bm-ink')!
    const mapBounds = ink.getBoundingClientRect()
    return {
      x: (tokenBounds.x + tokenBounds.width / 2 - mapBounds.x) / mapBounds.width,
      y: (tokenBounds.y + tokenBounds.height / 2 - mapBounds.y) / mapBounds.height,
    }
  })
}

test('ayrı yayın penceresi yalnızca sahneyi gösterir; arka plan, çoklu portre ve perde eşzamanlanır', async ({ page }, testInfo) => {
  await boot(page)
  const live = await openLive(page)
  await expect(live.getByRole('navigation')).toHaveCount(0)
  await expect(live.getByRole('textbox')).toHaveCount(0)
  await expect(live.getByTestId('broadcast-workspace')).toHaveCount(0)
  await expect(live.getByTestId('broadcast-dm-notes')).toHaveCount(0)
  await expect(live.getByRole('button', { name: 'Tam ekran · F', exact: true })).toHaveCount(1)
  await expect(live.locator('.broadcast-stage button')).toHaveCount(0)

  await chooseScene(page, 'valdareth', 'Valdareth')
  await expect(live.getByTestId('broadcast-scene').getByRole('img')).toHaveAttribute('alt', 'Valdareth')
  await addPortrait(page)
  await addPortrait(page, 'kaelen', 'Yüzbaşı Kaelen')
  await expect(page.getByTestId(/^broadcast-actor-/)).toHaveCount(2)
  await expect(live.getByTestId(/^broadcast-actor-/)).toHaveCount(2)
  await expect(live.getByRole('img', { name: 'Sir Vardek', exact: true })).toBeVisible()
  await expect(live.getByRole('img', { name: 'Yüzbaşı Kaelen', exact: true })).toBeVisible()
  await testInfo.attach('operator', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
  await testInfo.attach('clean-live', { body: await live.screenshot(), contentType: 'image/png' })

  await page.getByTestId('broadcast-blackout').click()
  await expect(live.getByTestId('broadcast-curtain')).toBeVisible()
  await expect(live.getByTestId('broadcast-curtain')).toHaveCSS('background-color', 'rgb(11, 17, 25)')
  await page.keyboard.press('b')
  await expect(live.getByTestId('broadcast-curtain')).toHaveCount(0)
  await expect(live.getByTestId(/^broadcast-actor-/)).toHaveCount(2)
  await live.close()
})

test('yüklenen parti portresi yuvarlak taşa dönüşür; sürüklenen dünya konumu yakınlaştırmada ve yeniden açılışta korunur', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await boot(page, 'map')
  await page.getByTestId('broadcast-library').getByRole('button', { name: /Yerel/ }).click()
  const portrait = await page.evaluate(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 80; canvas.height = 80
    const context = canvas.getContext('2d')!
    context.fillStyle = '#475c55'; context.fillRect(0, 0, 80, 80)
    context.fillStyle = '#e1c49c'; context.beginPath(); context.arc(40, 30, 16, 0, Math.PI * 2); context.fill()
    context.fillStyle = '#293647'; context.fillRect(18, 49, 44, 31)
    return canvas.toDataURL('image/png').split(',')[1]
  })
  await page.getByLabel('Yerel görseller yükle').setInputFiles({ name: 'Özel parti portresi.png', mimeType: 'image/png', buffer: Buffer.from(portrait, 'base64') })
  await expect.poll(async () => (await stored(page))?.customAssets.length).toBe(1)
  await panel(page, 'Parti')
  await page.getByLabel('Parti üyesinin adı', { exact: true }).fill('Luna Yolcu')
  await page.getByLabel('Parti üyesinin portresi', { exact: true }).selectOption({ label: 'Özel parti portresi' })
  await page.getByTestId('broadcast-add-party').click()
  await expect.poll(async () => (await stored(page))?.tokens.length).toBe(1)
  const initial = (await stored(page))!.tokens[0]
  const token = page.getByTestId(`map-token-${initial.id}`)
  await expect(token).toBeVisible()
  await expect(token).toHaveCSS('border-radius', '50%')
  await expect(token.locator('img')).toHaveAttribute('src', /^data:image\/webp;base64,/)
  await expect.poll(() => token.locator('img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await drag(page, token, 45, 24)
  await expect.poll(async () => (await stored(page))!.tokens[0].x).toBeGreaterThan(initial.x + .005)
  const moved = (await stored(page))!.tokens[0]
  expect(moved.y).toBeGreaterThan(initial.y)
  const projection = await tokenUV(token)
  expect(projection.x).toBeCloseTo(moved.x, 3)
  expect(projection.y).toBeCloseTo(moved.y, 3)
  await page.getByRole('button', { name: 'Haritayı yakınlaştır', exact: true }).click()
  await expect.poll(async () => (await stored(page))?.camera?.zoom).toBeGreaterThan(1.2)
  const zoomed = await tokenUV(token)
  expect(zoomed.x).toBeCloseTo(moved.x, 3)
  expect(zoomed.y).toBeCloseTo(moved.y, 3)
  expect((await stored(page))!.tokens[0]).toEqual(moved)

  // The same upload and entered PC name can become a portrait layer after
  // placing its round map token, without turning it into a wide image reveal.
  await expect(page.getByLabel('Parti üyesinin adı', { exact: true })).toHaveValue('Luna Yolcu')
  await page.getByRole('button', { name: 'Portreyi sahneye ekle', exact: true }).click()
  await expect.poll(async () => (await stored(page))?.actors.length).toBe(1)
  const partyPortrait = (await stored(page))!.actors[0]
  expect(partyPortrait.name).toBe('Luna Yolcu')
  expect(partyPortrait.kind).toBe('portrait')
  expect(partyPortrait.assetId).toBe(moved.assetId)
  expect(partyPortrait.src).toBe(moved.src)
  expect(partyPortrait.w).toBeLessThan(partyPortrait.h)
  await expect(page.getByTestId(`broadcast-actor-${partyPortrait.id}`)).toHaveClass(/\bportrait\b/)
  await expect(page.getByTestId(`broadcast-actor-${partyPortrait.id}`).getByRole('img')).toHaveAttribute('alt', 'Luna Yolcu')

  await page.reload()
  await expect(page.getByTestId(`map-token-${initial.id}`)).toBeVisible()
  const reopened = (await stored(page))!
  expect(reopened.tokens[0]).toEqual(moved)
  expect(reopened.customAssets[0].src).toBe(moved.src)
  expect(reopened.actors[0]).toEqual(partyPortrait)
})

test('kalem izi harita koordinatlarında kalır; yakınlaştırma, geri alma ve temizleme doğru izleri korur', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await boot(page, 'map')
  const paths = page.getByTestId('broadcast-map').locator('.bm-ink > path')
  await page.getByRole('button', { name: 'Kalem', exact: true }).click()
  await drawLine(page)
  await expect(paths).toHaveCount(1)
  await expect.poll(async () => (await stored(page))?.strokes.length).toBe(1)
  const stroke = (await stored(page))!.strokes[0]
  expect(stroke.kind).toBe('pen')
  expect(stroke.points.length).toBeGreaterThan(3)
  const path = await paths.first().getAttribute('d')
  const before = await page.locator('.bm-ink').boundingBox()
  await page.getByRole('button', { name: 'Haritayı yakınlaştır', exact: true }).click()
  await expect.poll(async () => (await page.locator('.bm-ink').boundingBox())!.width).toBeGreaterThan(before!.width * 1.3)
  await expect(paths.first()).toHaveAttribute('d', path!)
  expect((await stored(page))!.strokes[0]).toEqual(stroke)
  const firstPoint = await paths.first().evaluate(element => {
    const point = (element as SVGPathElement).getPointAtLength(0)
    return [point.x / 8192, point.y / 5668]
  })
  expect(firstPoint[0]).toBeCloseTo(stroke.points[0][0], 5)
  expect(firstPoint[1]).toBeCloseTo(stroke.points[0][1], 5)
  await page.getByRole('button', { name: 'Ok çiz', exact: true }).click()
  await drawLine(page, 35)
  await expect(paths).toHaveCount(2)
  await expect(paths.nth(1)).toHaveAttribute('marker-end', /^url\(#broadcast-arrow-/)
  await page.getByRole('button', { name: 'Son çizimi geri al', exact: true }).click()
  await expect(paths).toHaveCount(1)
  await expect(paths.first()).toHaveAttribute('d', path!)
  await page.getByRole('button', { name: 'Bütün çizimleri temizle', exact: true }).click()
  await expect(paths).toHaveCount(0)
  await expect.poll(async () => (await stored(page))?.strokes.length).toBe(0)
  await page.reload()
  await expect(page.getByRole('button', { name: 'Haritayı yakınlaştır', exact: true })).toBeEnabled()
  await expect(paths).toHaveCount(0)
})

test('sahne portresi sürüklenir, köşesinden boyutlanır ve aynı geometriyle yeniden açılır', async ({ page }) => {
  await boot(page)
  await addPortrait(page)
  await expect.poll(async () => (await stored(page))?.actors.length).toBe(1)
  const initial = (await stored(page))!.actors[0]
  const actor = page.getByTestId(`broadcast-actor-${initial.id}`)
  await drag(page, actor, 72, -45)
  await expect.poll(async () => (await stored(page))!.actors[0].x).toBeGreaterThan(initial.x)
  const moved = (await stored(page))!.actors[0]
  expect(moved.y).toBeLessThan(initial.y)
  await actor.hover()
  await drag(page, actor.getByRole('button', { name: /boyutlandır$/ }), 31, 22)
  await expect.poll(async () => (await stored(page))!.actors[0].w).toBeGreaterThan(moved.w)
  const resized = (await stored(page))!.actors[0]
  expect(resized.h).toBeGreaterThan(moved.h)
  expect(resized.x).toBeCloseTo(moved.x, 4)
  expect(resized.y).toBeCloseTo(moved.y, 4)
  await panel(page, 'Parti')
  const nameInput = page.getByRole('textbox', { name: /katmanının adı$/ })
  await nameInput.press('End')
  await nameInput.pressSequentially(' · Gece nöbeti')
  await nameInput.press('Tab')
  await expect.poll(async () => (await stored(page))!.actors[0].name).toBe('Sir Vardek · Gece nöbeti')
  await expect(actor.locator('.broadcast-actor-name')).toHaveText('Sir Vardek · Gece nöbeti')
  const renamed = (await stored(page))!.actors[0]
  const geometry = await actor.boundingBox()
  await page.reload()
  await expect(actor).toBeVisible()
  expect((await stored(page))!.actors[0]).toEqual(renamed)
  const restored = await actor.boundingBox()
  expect(restored!.x).toBeCloseTo(geometry!.x, 0)
  expect(restored!.y).toBeCloseTo(geometry!.y, 0)
  expect(restored!.width).toBeCloseTo(geometry!.width, 0)
  expect(restored!.height).toBeCloseTo(geometry!.height, 0)
})

test('indirilen oturum gerçek verilerle geri açılır; bozuk veya geçersiz dosya çalışan sahneyi değiştirmez', async ({ page }) => {
  await boot(page)
  await chooseScene(page, 'valdareth', 'Valdareth')
  await addPortrait(page)
  await page.getByLabel('Yayındaki sahne başlığı').fill('Kuzey kapısında bir buluşma')
  const backup = await exportSession(page)
  expect(backup.state.scene.id).toBe('valdareth')
  expect(backup.state.actors).toHaveLength(1)
  expect(backup.state.title).toBe('Kuzey kapısında bir buluşma')
  await page.getByLabel('Yayındaki sahne başlığı').fill('Geçici değişiklik')
  await importSession(page, backup.state)
  await expect(page.getByLabel('Yayındaki sahne başlığı')).toHaveValue(backup.state.title)
  await expect.poll(async () => stored(page)).toEqual(backup.state)

  await page.getByTestId('broadcast-load-session').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{broken') })
  await expect(page.getByText('Yayın dosyası okunamadı. Geçerli bir .aruzahr.json dosyası seçin.', { exact: true })).toBeVisible()
  await importSession(page, { ...backup.state, actors: [{ ...backup.state.actors[0], x: -10 }] })
  await expect(page.getByText(/Yayın dosyası geçersiz: Sahne yatay konumu/)).toBeVisible()
  expect(await stored(page)).toEqual(backup.state)
  await expect(page.getByLabel('Yayındaki sahne başlığı')).toHaveValue(backup.state.title)
})

test('özel DM paketi ve düzenlenen notlar yayın kanalına, dosya yedeğine veya izleyici görünümüne sızmaz', async ({ page }) => {
  await boot(page)
  const live = await openLive(page)
  await page.evaluate(() => {
    const scope = window as typeof window & { broadcastTestWire: string[]; broadcastTestWatch: BroadcastChannel }
    scope.broadcastTestWire = []
    scope.broadcastTestWatch = new BroadcastChannel('aruzahr-broadcast-v1')
    scope.broadcastTestWatch.onmessage = event => scope.broadcastTestWire.push(JSON.stringify(event.data))
  })
  const secret = 'PRIVATE-DM-SENTINEL-925137'
  await panel(page, 'Görevler')
  await page.getByTestId('broadcast-import-dm').setInputFiles({
    name: 'private-dm.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ version: 1, title: `${secret} başlık`, quests: [{ id: 'son-sicak-tas', title: 'Gizli anlaşma', body: `${secret} asıl sır` }, { id: 'nobetin-payi', title: 'İkinci görev', body: `${secret} ikinci not` }] })),
  })
  await expect(page.getByTestId('broadcast-dm-notes')).toHaveValue(`${secret} asıl sır`)
  await page.getByTestId('broadcast-dm-notes').fill(`${secret} düzenlenen not`)
  await page.locator('.broadcast-quest-card').filter({ hasText: 'Nöbetin Payı' }).click()
  await expect(page.getByTestId('broadcast-dm-notes')).toHaveValue(`${secret} ikinci not`)
  await page.locator('.broadcast-quest-card').filter({ hasText: 'Son Sıcak Tas' }).click()
  await expect(page.getByTestId('broadcast-dm-notes')).toHaveValue(`${secret} düzenlenen not`)
  await page.getByLabel('Yayındaki sahne başlığı').fill('Oyuncuların görebildiği açık başlık')
  await expect(live.getByText('Oyuncuların görebildiği açık başlık', { exact: true })).toBeVisible()
  const backup = await exportSession(page)
  expect(backup.text).not.toContain(secret)
  expect(backup.state).not.toHaveProperty('notes')
  expect(backup.state).not.toHaveProperty('dmPack')
  const wire = await page.evaluate(() => (window as typeof window & { broadcastTestWire: string[] }).broadcastTestWire)
  expect(wire.length).toBeGreaterThan(0)
  expect(wire.join('\n')).not.toContain(secret)
  expect(await live.locator('body').innerText()).not.toContain(secret)
  await expect(live.getByTestId('broadcast-dm-notes')).toHaveCount(0)
  await expect(live.getByRole('navigation')).toHaveCount(0)
  await page.reload()
  await expect(page.getByTestId('broadcast-workspace')).toBeVisible()
  await panel(page, 'Görevler')
  await expect(page.getByTestId('broadcast-dm-notes')).toHaveValue(`${secret} düzenlenen not`)
  await page.getByTestId('broadcast-import-dm').setInputFiles({ name: 'serbest-not.md', mimeType: 'text/markdown', buffer: Buffer.from(`${secret} serbest defter`) })
  await expect(page.getByTestId('broadcast-dm-notes')).toHaveValue(`${secret} serbest defter`)
  const privateDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Defteri indir', exact: true }).click()
  const privateFile = await privateDownload
  expect(privateFile.suggestedFilename()).toBe('Aruzahr-DM-Notlari.txt')
  expect(await readFile((await privateFile.path())!, 'utf8')).toBe(`${secret} serbest defter`)
  expect(await live.locator('body').innerText()).not.toContain(secret)
  await live.close()
})

test('gerçek çoklu zar sonucu iki pencerede aynı toplamı gösterir ve değiştirilmiş toplam reddedilir', async ({ page }) => {
  await boot(page)
  const live = await openLive(page)
  await panel(page, 'Zar')
  await page.getByRole('button', { name: 'd6 zarı', exact: true }).click()
  await page.getByRole('spinbutton', { name: 'Zar adedi', exact: true }).fill('3')
  await page.getByRole('spinbutton', { name: 'Ek değer', exact: true }).fill('-2')
  await page.getByRole('button', { name: /Zarları at/ }).click()
  await expect.poll(async () => (await stored(page))?.roll?.values.length).toBe(3)
  const snapshot = (await stored(page))!
  const roll = snapshot.roll!
  expect(roll.sides).toBe(6)
  expect(roll.modifier).toBe(-2)
  expect(roll.values.every(value => Number.isInteger(value) && value >= 1 && value <= 6)).toBe(true)
  const actualTotal = roll.values.reduce((sum, value) => sum + value, -2)
  expect(roll.total).toBe(actualTotal)
  await expect(page.getByTestId('dice-total')).toHaveText(String(actualTotal))
  const audienceResult = live.getByTestId('broadcast-dice-display')
  await expect(audienceResult).toHaveAttribute('data-roll-id', roll.id)
  await expect(audienceResult.locator('.bd-stage-total')).toHaveText(String(actualTotal))
  await expect(audienceResult.locator('.bd-stage-breakdown')).toContainText(roll.values.join(' + '))
  await importSession(page, { ...snapshot, roll: { ...roll, total: actualTotal + 1 } })
  await expect(page.getByText('Yayın dosyası geçersiz: Zar toplamı tek tek sonuçlarla eşleşmiyor.', { exact: true })).toBeVisible()
  expect((await stored(page))!.roll).toEqual(roll)
  await expect(audienceResult.locator('.bd-stage-total')).toHaveText(String(actualTotal))
  await live.close()
})

test('390 pikselde bütün yönetim panelleri ve temiz yayın yatay taşma olmadan kullanılabilir', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await boot(page)
  for (const label of ['Görseller', 'Parti', 'Zar', 'Görevler', 'Oturum']) {
    await panel(page, label)
    const dimensions = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }))
    expect(dimensions.content, `${label} paneli yatay taşmamalı`).toBeLessThanOrEqual(dimensions.width)
  }
  await panel(page, 'Görseller')
  await page.evaluate(() => scrollTo(0, 0))
  await testInfo.attach('phone-390px', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
  const live = await openLive(page)
  await live.setViewportSize({ width: 390, height: 844 })
  const liveDimensions = await live.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }))
  expect(liveDimensions.content).toBeLessThanOrEqual(liveDimensions.width)
  const stage = await live.getByTestId('broadcast-stage').boundingBox()
  expect(stage!.width / stage!.height).toBeCloseTo(16 / 9, 2)
  await expect(live.getByRole('navigation')).toHaveCount(0)
  await live.close()
})
