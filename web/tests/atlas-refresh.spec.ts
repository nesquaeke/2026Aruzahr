import { expect, test } from '@playwright/test'

test('a focused road connects the actual settlement pins and leaves other roads hidden', async ({ page }) => {
  await page.goto('/#/atlas/kemige-basan-yol')
  const route = page.getByTestId('route-kemige-basan-yol')
  await expect(route).toBeVisible()
  await page.waitForTimeout(1000)
  await expect(page.locator('.atlas-route:not(.route-hidden)')).toHaveCount(1)
  await expect(page.locator('.map-pin.route-stop:not(.is-hidden)')).toHaveCount(4)
  const errors = await route.locator('.route-line').evaluate(pathElement => {
    const path = pathElement as SVGPathElement
    const transform = path.getScreenCTM()!
    return ['ternhaven', 'marhalden'].map((id, index) => {
      const p = path.getPointAtLength(index ? path.getTotalLength() : 0).matrixTransform(transform)
      const r = document.querySelector(`[data-testid="marker-${id}"]`)!.getBoundingClientRect()
      return Math.hypot(p.x - r.x - r.width / 2, p.y - r.y - r.height / 2)
    })
  })
  errors.forEach(error => expect(error).toBeLessThan(2))
  await expect(page.locator('.route-itinerary li')).toHaveCount(4)
  await page.getByRole('navigation', { name: 'Ticaret rotası seç' }).getByRole('button', { name: 'Kralın Yolu', exact: true }).click()
  await expect(page.locator('.atlas-route:not(.route-hidden)')).toHaveCount(1)
  await expect(page.getByTestId('route-kralin-yolu')).toBeVisible()
  await expect(page.locator('.route-itinerary')).toContainText('Valdareth')
})

test('the world view starts quietly and labels remain separate after focusing and panning', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('marker-xotar')).toBeVisible()
  await expect(page.locator('.atlas-route:not(.route-hidden)')).toHaveCount(0)
  await page.getByRole('button', { name: 'Hardlane', exact: true }).last().click()
  await page.waitForTimeout(1000)
  const overlap = () => page.locator('.map-pin:not(.is-hidden):not(.label-muted):not(.selected) .pin-label').evaluateAll(labels => {
    const rects = labels.filter(l => getComputedStyle(l).display !== 'none' && getComputedStyle(l).visibility !== 'hidden').map(l => l.getBoundingClientRect())
    return rects.some((a, i) => rects.slice(i + 1).some(b => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top))
  })
  expect(await overlap()).toBe(false)
  const viewer = await page.getByTestId('atlas-viewer').boundingBox()
  await page.mouse.move(viewer!.x + viewer!.width * .6, viewer!.y + viewer!.height * .7)
  await page.mouse.down(); await page.mouse.move(viewer!.x + viewer!.width * .4, viewer!.y + viewer!.height * .6, { steps: 12 }); await page.mouse.up()
  await page.waitForTimeout(700)
  expect(await overlap()).toBe(false)
})

test('Fracture has source lore, different cultural voices and working chapter shortcuts', async ({ page }) => {
  await page.goto('/#/wiki/buyuk-kirilma')
  await expect(page.locator('.lore-section-card')).toHaveCount(16)
  await expect(page.locator('.fracture-layers > button')).toHaveCount(5)
  await page.getByRole('tab', { name: 'Danstsud’un sesi' }).click()
  await expect(page.getByRole('tabpanel')).toContainText('Bakır Ana')
  await page.getByRole('tab', { name: 'Honud’un sesi' }).click()
  await expect(page.getByRole('tabpanel')).toContainText('iki büyük çocuğun')
  await page.locator('.fracture-layers').getByRole('button', { name: /İklim Kırılması/ }).click()
  await expect(page.locator('#article-section-9 details')).toHaveAttribute('open', '')
  await expect(page.locator('#article-section-9')).toContainText('doğuya yönelen göçü')
  await page.getByRole('button', { name: 'Tam lore', exact: true }).click()
  await expect(page.locator('.article-content')).toContainText('Hurnas Ithíl')
  await expect(page.locator('.article-content')).toContainText('Canavarlar Çağı')
})

test('every public record reference and character portrait resolves', async ({ page }) => {
  await page.goto('/#/wiki/rina')
  const audit = await page.evaluate(async () => {
    const data = await import('/src/data.ts' as string)
    const { characters } = await import('/src/lore/characters.ts' as string)
    const { portraitFor } = await import('/src/media.ts' as string)
    const records = [...data.regions, ...data.mapLocations, ...data.loreArticles, data.historyArticle] as { id: string; related?: string[] }[]
    const ids = new Set(records.map(r => r.id))
    return {
      duplicates: records.map(r => r.id).filter((id, i, list) => list.indexOf(id) !== i),
      missing: records.flatMap(r => (r.related || []).filter(id => !ids.has(id)).map(id => `${r.id} → ${id}`)),
      portraitMissing: characters.filter((c: { portrait: string }) => !portraitFor(c.portrait)).map((c: { id: string }) => c.id),
      rina: characters.find((c: { id: string }) => c.id === 'rina').affiliation,
      lysandra: data.articleById('lysandra'),
    }
  })
  expect(audit.duplicates).toEqual([])
  expect(audit.missing).toEqual([])
  expect(audit.portraitMissing).toEqual([])
  expect(audit.rina).toContain('Ser Valerius')
  expect(audit.lysandra).toBeUndefined()
  await page.getByTestId('related-locations').getByRole('button', { name: 'Ser Valerius Kişi', exact: true }).click()
  await expect(page.locator('.article-title h1')).toHaveText('Ser Valerius')
})

test('every kingdom, Danstsud settlement and gallery has real images; the bestiary enlarges and navigates on mobile', async ({ page, request }) => {
  await page.goto('/#/wiki/karlan-canlilari')
  const sources = await page.evaluate(async () => {
    const { places, regions } = await import('/src/data.ts' as string)
    const { artFor } = await import('/src/presentation.ts' as string)
    const { faunaArt, artworks } = await import('/src/media.ts' as string)
    return { covers: [...regions.map((r: { id: string }) => artFor(r.id, r.id)), ...places.filter((p: { region: string }) => p.region === 'danstsud').map((p: { id: string; region: string }) => artFor(p.id, p.region)), ...faunaArt.map((a: { src: string }) => a.src)] as string[], gallery: Object.values(artworks).map(a => (a as { src: string }).src) }
  })
  expect(sources.covers).toHaveLength(75)
  for (const src of new Set([...sources.covers, ...sources.gallery])) {
    const response = await request.get(src)
    expect(response.ok(), src).toBe(true)
    expect(response.headers()['content-type'], src).toContain('image/webp')
    expect((await response.body()).subarray(8, 12).toString(), src).toBe('WEBP')
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('#article-section-0').getByRole('button', { name: 'Karlan Taç Keçisi görselini büyüt' }).click()
  const dialog = page.getByRole('dialog', { name: 'Görsel galerisi' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading')).toHaveText('Karlan Taç Keçisi')
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByRole('heading')).toHaveText('Veyrakar Kar Kartalı')
  await expect.poll(() => dialog.locator('img').evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await page.goto('/#/wiki/rina')
  await expect(page.getByTestId('character-passport')).toContainText('Ser Valerius')
  await expect(page.locator('.article-content')).not.toContainText('darbeci')
})
