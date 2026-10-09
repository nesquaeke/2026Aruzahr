import { expect, test } from '@playwright/test'
import { articleById, mapLocations, places, regions } from '../src/data'
import { mapFeatures } from '../src/map-features'

// Names were transcribed from the original 8K drawing, independently of the
// renderer. This inventory protects against a future loss of small settlements.
const newlyVisible = [
  'orunq', 'vaelgrim', 'dravenspire', 'wolfcrag', 'boreals-end', 'deadveil', 'silent-cairn',
  'skeldrun', 'hjorthal', 'winterhavn', 'ashfrost', 'white-woe', 'whisperhold', 'frostgrave',
  'yatesh', 'bleakmoor', 'isenreach', 'eirhollow', 'varnskuld', 'nivor',
  'aelmar', 'thessar', 'morvail', 'yornhal', 'vornic', 'frethar', 'tyelmar', 'arden',
  'nuvik', 'telvai', 'velthar', 'brolin', 'othmar', 'eldwen', 'thandor', 'cevan',
  'velyra', 'rymar', 'lysmar', 'lurnvalf', 'jathra', 'melthir', 'orinhal', 'oren',
  'cylwen', 'halden', 'lamden', 'vossir', 'runeth', 'teyla', 'eroth', 'janvar',
]

test('the original-map inventory has unique pins, populated wikis and valid image anchors', () => {
  const ids = places.map(place => place.id)
  expect(newlyVisible.filter(id => !ids.includes(id))).toEqual([])
  expect(places).toHaveLength(96)
  const entries = [...regions, ...mapLocations, ...mapFeatures]
  expect(new Set(entries.map(entry => entry.id)).size).toBe(entries.length)
  for (const entry of entries) {
    expect(entry.point.every(value => Number.isFinite(value) && value >= 0 && value <= 1), entry.id).toBe(true)
  }
  for (const place of places) {
    expect(place.sections?.length, place.id).toBeGreaterThanOrEqual(2)
    expect(place.sections?.every(section => section.paragraphs.some(text => text.length > 30)), place.id).toBe(true)
  }
  for (const feature of mapFeatures) expect(articleById(feature.article), feature.id).toBeDefined()
})

for (const region of regions) {
  const settlements = places.filter(value => value.region === region.id && value.point !== null)
  // The kingdom has 59 settlements. Separate complete batches keep one long
  // traversal from consuming the browser's whole time budget.
  const batchSize = region.id === 'danstsud' ? 20 : Math.max(1, settlements.length)
  for (let start = 0; start < Math.max(1, settlements.length); start += batchSize) {
  const batch = settlements.slice(start, start + batchSize)
  const suffix = region.id === 'danstsud' ? ` (${start + 1}–${start + batch.length})` : ''
  test(`every ${region.name} settlement${suffix} opens its own pin, panel and wiki`, async ({ page }) => {
    test.setTimeout(180000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.getByTestId('marker-xotar')).toBeVisible()
    for (const place of batch) {
      await page.evaluate(id => { location.hash = `/atlas/${id}` }, place.id)
      const marker = page.getByTestId(`marker-${place.id}`)
      await expect(marker, place.name).toBeVisible()
      await expect(marker).toHaveAttribute('aria-pressed', 'true')
      await marker.click()
      await expect(page.getByTestId('detail-panel').getByRole('heading', { name: place.name, exact: true })).toBeVisible()
      await page.getByRole('button', { name: 'Wiki sayfasını aç' }).click()
      await expect(page.locator('.article-title h1'), place.name).toHaveText(place.name)
      await expect(page.locator('.lore-section-card')).toHaveCount(place.sections!.length)
    }
  })
  }
}

test('fitting the whole map keeps all settlement and geography dots available across resize and country selection', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#/atlas/danstsud')
  await expect(page.getByTestId('marker-valdareth')).toBeVisible()
  await page.getByRole('button', { name: 'Haritanın tamamını göster' }).click()
  await expect(page.getByTestId('zoom-level')).toHaveText('100%')
  await expect(page.locator('.city-pin:not(.is-hidden)')).toHaveCount(places.filter(place => place.point !== null).length)
  await expect(page.locator('.subregion-pin:not(.is-hidden)')).toHaveCount(3)
  await expect(page.locator('.feature-pin:not(.route-pin):not(.is-hidden)')).toHaveCount(mapFeatures.filter(feature => feature.kind !== 'route').length)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.getByRole('button', { name: 'Haritanın tamamını göster' }).click()
  await expect(page.locator('.city-pin:not(.is-hidden)')).toHaveCount(places.filter(place => place.point !== null).length)
  await expect(page.getByTestId('marker-xotar')).toBeVisible()
  await expect(page.getByTestId('marker-orunq')).toBeVisible()
  await expect(page.getByTestId('marker-cevan')).toBeVisible()
})

test('map spellings search the canonical place instead of making duplicate towns', async ({ page }) => {
  await page.goto('/')
  const search = page.getByRole('textbox', { name: 'Atlas ve wiki içinde ara' })
  for (const [alias, id] of [['Galmire', 'gaalmire'], ['Korthen', 'korhenden'], ['Tora', 'toran']]) {
    await search.fill(alias)
    await expect(page.getByTestId(`location-result-${id}`)).toBeVisible()
    await page.getByTestId(`location-result-${id}`).click()
    await expect(page.getByTestId(`marker-${id}`)).toBeVisible()
  }
  await search.fill('Serenth')
  await page.locator('.place-search-result').filter({ hasText: 'Serenith Nehri' }).first().click()
  await expect(page.getByTestId('marker-serenith-nehri')).toBeVisible()
  await expect(page.getByTestId('detail-panel')).toContainText('Serenith Nehri')
})

test('rivers and unnamed map structures open readable geography records', async ({ page }) => {
  test.setTimeout(120000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const id of ['aldara-nehri', 'bati-aldara', 'serenith-nehri', 'teyra-nehri', 'thural-kalkani', 'lakbar-kara-kule', 'lakbar-lav-kalesi', 'lakbar-kizil-igne', 'lakbar-bati-burclari', 'lakbar-guney-kalesi', 'thessar-acigi-feneri', 'runeth-kuzeyi-harabeleri']) {
    const feature = mapFeatures.find(value => value.id === id)!
    await page.evaluate(id => { location.hash = `/atlas/${id}` }, id)
    await expect(page.getByTestId(`marker-${id}`)).toBeVisible()
    await page.getByTestId(`marker-${id}`).click()
    await page.getByRole('button', { name: 'Wiki sayfasını aç' }).click()
    await expect(page.locator('.article-title h1')).toHaveText(articleById(feature.article)!.name)
    await expect(page.locator('.lore-section-card')).toHaveCount(articleById(feature.article)!.sections.length)
  }
})
