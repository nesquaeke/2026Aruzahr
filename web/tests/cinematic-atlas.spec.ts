import { expect, test } from '@playwright/test'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { places, regions } from '../src/data'
import { mapFeatures } from '../src/map-features'
import {
  cinematicHeightAt, cinematicLandAt, cinematicTargets,
  createCinematicField, settlementGround, WORLD_DEPTH, WORLD_WIDTH,
  type CinematicField,
} from '../src/cinematic-atlas-data'

test.describe('source-bound full world relief', () => {
  let field: CinematicField
  test.beforeAll(async () => {
    const { data, info } = await sharp(fileURLToPath(new URL('../public/cinematic-map/land-mask.png', import.meta.url)))
      .ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    field = createCinematicField(data, info.width, info.height)
  })
  test('all canonical targets survive and every settlement has bounded actual land for its model', () => {
    expect(places).toHaveLength(95)
    expect(cinematicTargets).toHaveLength(regions.length + 98 + mapFeatures.length)
    expect(new Set(cinematicTargets.map(p => p.id)).size).toBe(cinematicTargets.length)
    const original = places.map(p => ({ id: p.id, point: p.point && [...p.point] }))
    for (const place of places) {
      const point = settlementGround(place.point!, field)
      expect(point, place.id).not.toBeNull()
      expect(cinematicLandAt(point!, field), place.id).toBe(true)
      expect(Math.hypot((point![0] - place.point![0]) * WORLD_WIDTH, (point![1] - place.point![1]) * WORLD_DEPTH), place.id).toBeLessThanOrEqual(WORLD_WIDTH * .022)
    }
    expect(places.map(p => ({ id: p.id, point: p.point && [...p.point] }))).toEqual(original)
  })
  test('independent source sea checkpoints never raise mountains; overlapping country crops retain their coasts', () => {
    for (const [x, y] of [[3200,3350],[4000,3650],[5300,2975],[6240,2800],[7450,2980],[4600,3830],[3500,4500],[4350,4850],[6110,3060],[6450,2990],[4000,3650],[3260,2400]]) {
      const uv: [number,number] = [x / 8192, y / 5668]
      expect(cinematicLandAt(uv, field), `${x},${y}`).toBe(false)
      expect(cinematicHeightAt(uv, field), `${x},${y}`).toBeLessThan(0)
    }
    for (const id of ['volriks-maw','eldrascar','norrvar','frostheimr','isenreach','varnskuld'])
      expect(cinematicLandAt(places.find(p => p.id === id)!.point!, field), id).toBe(true)
  })
})

test.describe('third atlas mode', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test.setTimeout(120000)
  test('new full-world mode loads, selects foreign and Danstsud cities, keeps pins and camera, then exits', async ({ page }) => {
    const errors: string[] = []; page.on('pageerror', error => errors.push(String(error)))
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#/atlas')
    await page.getByTestId('toggle-cinematic').click()
    const viewer = page.getByTestId('cinematic-viewer')
    await expect(viewer).toHaveAttribute('data-ready', 'true', { timeout: 45000 })
    await expect(viewer).toHaveAttribute('data-original-texture', 'false')
    await expect(viewer).toHaveAttribute('data-target-count', '137')
    await expect(viewer).toHaveAttribute('data-city-count', '95')
    expect(await page.locator('.cinematic-pins .map-pin').count()).toBe(137)
    for (const id of ['morihael','frostheimr','eldrascar','valdareth','lirendil']) {
      await page.evaluate(id => { location.hash = '/atlas/' + id }, id)
      await expect(page.getByTestId('marker-' + id)).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByTestId('marker-' + id)).toBeVisible()
      await expect(page.getByTestId('toggle-cinematic')).toHaveAttribute('aria-pressed', 'true')
    }
    await page.getByRole('button', { name: 'Üstten görünüm', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Eğimli görünüm', exact: true })).toHaveAttribute('aria-pressed', 'true')
    const before = Number(await viewer.getAttribute('data-camera-zoom'))
    await page.getByRole('button', { name: 'Yakınlaştır', exact: true }).click()
    await expect.poll(async () => Number(await viewer.getAttribute('data-camera-zoom'))).toBeGreaterThan(before)
    await page.getByRole('button', { name: 'Özgün haritaya dön', exact: true }).click()
    await expect(page.getByTestId('atlas-viewer')).toBeVisible()
    await expect(page.getByTestId('marker-lirendil')).toHaveAttribute('aria-pressed', 'true')
    expect(errors).toEqual([])
  })
  test('failed coastline fetch returns to the preserved original map without losing selection', async ({ page }) => {
    await page.route('**/cinematic-map/land-mask.png', route => route.abort())
    await page.goto('/#/atlas/valdareth')
    await page.getByTestId('toggle-cinematic').click()
    await expect(page.getByTestId('atlas-viewer')).toBeVisible({ timeout: 30000 })
    await expect(page.getByTestId('marker-valdareth')).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: 'Özgün 2D', exact: true })).toHaveAttribute('aria-pressed', 'true')
  })
  test('compact screen controls and full-world pins remain reachable without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/#/atlas/morihael')
    await page.getByTestId('toggle-cinematic').click()
    await expect(page.getByTestId('cinematic-viewer')).toHaveAttribute('data-ready', 'true', { timeout: 45000 })
    await expect(page.getByTestId('marker-morihael')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false)
    for (const b of await page.locator('.cinematic-controls button,.cinematic-exit').evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON()))) {
      expect(b.left).toBeGreaterThanOrEqual(0)
      expect(b.right).toBeLessThanOrEqual(390)
    }
  })
})
