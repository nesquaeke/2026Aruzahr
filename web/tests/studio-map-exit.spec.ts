import { test, expect } from '@playwright/test'
import { bootStudio, panel, project, publicFrame } from './studio-fixtures'
test.describe.configure({ timeout: 60000 })
test('şehir seçimi kamerayı kilitlemez; gezinme serbest kalır ve harita düğme/Escape ile kapanır', async ({
  page,
}) => {
  await bootStudio(page)
  await panel(page, 'Harita')
  const choice = page.getByLabel('Şehre odaklan', { exact: true })
  await choice.focus()
  await choice.selectOption('marhalden')
  await expect(choice).not.toBeFocused()
  await expect(choice).toHaveValue('')
  const map = page.getByTestId('studio-preview').getByTestId('broadcast-map')
  await expect(
    map.getByRole('button', { name: 'Haritayı yakınlaştır', exact: true }),
  ).toBeEnabled()
  await expect
    .poll(async () => (await project(page))?.draft.camera)
    .toBeTruthy()
  const before = (await project(page))!.draft.camera!
  const rect = (await map.locator('.openseadragon-canvas').boundingBox())!
  await page.mouse.move(rect.x + rect.width * 0.6, rect.y + rect.height * 0.6)
  await page.mouse.down()
  await page.mouse.move(rect.x + rect.width * 0.4, rect.y + rect.height * 0.5, {
    steps: 12,
  })
  await page.mouse.up()
  await map
    .getByRole('button', { name: 'Haritayı uzaklaştır', exact: true })
    .click()
  await expect
    .poll(async () =>
      Math.abs((await project(page))!.draft.camera!.zoom - before.zoom),
    )
    .toBeGreaterThan(0.2)
  const moved = (await project(page))!.draft.camera!
  await page.waitForTimeout(1600)
  const stable = (await project(page))!.draft.camera!
  expect(stable.x).toBeCloseTo(moved.x, 3)
  expect(stable.y).toBeCloseTo(moved.y, 3)
  expect(stable.zoom).toBeCloseTo(moved.zoom, 2)
  expect((await publicFrame(page)).title).toBe('CANLI: eski')
  await page
    .locator('.panel-map')
    .getByRole('button', { name: 'Haritayı kapat · sahneye dön', exact: true })
    .click()
  await expect(
    page.getByTestId('studio-preview').getByTestId('broadcast-scene'),
  ).toBeVisible()
  await choice.selectOption('frostbay')
  await expect(map).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(
    page.getByTestId('studio-preview').getByTestId('broadcast-map'),
  ).toHaveCount(0)
  expect((await publicFrame(page)).title).toBe('CANLI: eski')
})
test('üç aynı resimli görev adımı hazırlık bilgisini gösterir, arayı kaldırır ve açık komutla yayınlanır', async ({
  page,
}) => {
  await bootStudio(page)
  await page.evaluate(async () => {
    const module = '/src/studio/model.ts'
    const { loadProject, storeProject } = await import(module)
    const p = await loadProject()
    p.draft.intermission = true
    await storeProject(p)
  })
  await page.reload()
  await expect(page.getByTestId('studio-take')).toBeEnabled()
  await panel(page, 'Görev')
  const steps = [
    'Varış · İki yatak',
    'Araştırma · Üç saatlik iniş',
    'Karar · Şişe kimin?',
  ].map((title, i) => ({
    id: 'step-' + i,
    title,
    summary: 'Özel olay ' + i,
    readAloud: 'Okunacak söz ' + i,
    actions: [],
    checks: [],
    choices: [],
    backgroundId: 'winter-ilac',
    portraitIds: ['sena-erven', 'miren-aska'],
    publicTitle: 'Revir',
  }))
  await page
    .getByTestId('broadcast-import-dm')
    .setInputFiles({
      name: 'dm.json',
      mimeType: 'application/json',
      buffer: Buffer.from(
        JSON.stringify({
          version: 2,
          title: 'Deneme',
          quests: [{ id: 'ilac', title: 'Son İlaç', body: 'Özel not', steps }],
        }),
      ),
    })
  for (let i = 0; i < 3; i++) {
    await page.locator('.dm-step-tabs button').nth(i).click()
    await expect(page.locator('.dm-now p')).toHaveText('Özel olay ' + i)
    await expect(page.getByTestId('dm-reveal-scene')).toBeDisabled()
    await page.getByTestId('dm-prepare-scene').click()
    await expect(page.getByTestId('dm-prepare-status')).toContainText(
      steps[i].title,
    )
    await expect(page.locator('.dm-action-help')).toContainText(
      'aynı arka planı',
    )
    await expect(
      page.getByTestId('studio-preview').getByTestId('broadcast-break'),
    ).toHaveCount(0)
    await expect(
      page.getByTestId('studio-preview').locator('.broadcast-actor'),
    ).toHaveCount(2)
    expect((await publicFrame(page)).title).toBe('CANLI: eski')
  }
  await page.getByTestId('dm-reveal-scene').click()
  await expect.poll(async () => (await publicFrame(page)).title).toBe('Revir')
  expect(JSON.stringify(await publicFrame(page))).not.toContain('Özel olay')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByTestId('dm-prepare-status').scrollIntoViewIfNeeded()
  await expect(page.getByTestId('dm-prepare-status')).toBeVisible()
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390)
})
