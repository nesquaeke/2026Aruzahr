import { expect, test } from '@playwright/test'
import { canonicalId, mapLocations, places } from '../src/data'

// Independently rechecked building/roof anchors in the author's 8192 × 5668
// source, including the latest names supplied by the author. Stable IDs retain
// links to existing wiki pages. No new lore is part of this correction.
const namedAnchors: [string, string, number, number][] = [
  ['Aelmar', 'aelmar', 3300, 3070], ['Thesar', 'thessar', 3730, 3280],
  ['Yornhal', 'yornhal', 4240, 3240], ['Vornic', 'vornic', 4520, 3290],
  ['Frethar', 'fehar', 4860, 3370], ['Nuvik', 'nuvik', 5750, 3200],
  ['Telvar', 'telvai', 5700, 3380], ['Velyra', 'velyra', 6250, 3560],
  ['Korthen', 'korhenden', 6925, 3750], ['Rymar', 'rymar', 7220, 3470],
  ['Othmar', 'othmar', 7100, 3260], ['Eldwen', 'eldwen', 7500, 3270],
  ['Thandor', 'thandor', 7770, 3290], ['Cevan', 'cevan', 8090, 3330],
  ['Lysmar', 'lysmar', 7420, 3590], ['Jathra', 'jathra', 8040, 3610],
  ['Lurnvale', 'lurnvalf', 7740, 3790], ['Melthir', 'melthir', 7500, 4020],
  ['Orinhall', 'orinhal', 8050, 4030], ['Cylwen', 'cylwen', 7820, 4310],
  ['Halden', 'halden', 7700, 4540], ['Runeth', 'runeth', 7260, 4660],
  ['Teyla', 'teyla', 8080, 4720], ['Eroth', 'eroth', 6870, 4910],
  ['Vosir', 'vossir', 6930, 4660], ['Lamden', 'lamden', 6600, 4640],
  ['Lanvar', 'janvar', 7000, 5450], ['Tyelmar', 'tyelmar', 4490, 3600],
  ['Velthar', 'velthar', 4560, 3910], ['Arden', 'arden', 4850, 3760],
  ['Brolin', 'brolin', 4890, 3990],
]
const correctedAnchors: [string, string, number, number][] = [
  ['Harven', 'harven', 4795, 5505], ['Tolvur', 'tolvur', 5385, 5538],
  ['Theld', 'theld', 6504, 4327], ['Uldar', 'uldar', 5210, 4400],
  ['Fevric', 'fevric', 5260, 4145], ['Naeron', 'naeron', 5218, 3890],
]

test('all author-listed names identify unique map places at rechecked image anchors', () => {
  for (const [name, id, x, y] of [...namedAnchors, ...correctedAnchors]) {
    const matches = mapLocations.filter(place => place.id === id)
    expect(matches, name).toHaveLength(1)
    const place = matches[0]
    expect([place.name, place.mapLabel, ...(place.aliases || [])], name).toContain(name)
    expect(Math.abs(place.point[0] * 8192 - x), name).toBeLessThan(0.005)
    expect(Math.abs(place.point[1] * 5668 - y), name).toBeLessThan(0.005)
  }
  expect(places.every(place => place.point !== null)).toBe(true)
  expect(canonicalId('frethar')).toBe('fehar')
  expect(places.some(place => place.id === 'frethar')).toBe(false)
})

for (const [label, anchors] of [['named settlements', namedAnchors], ['six corrected settlements', correctedAnchors]] as const) {
  test(`${label}: visible pin symbols align with original image pixels`, async ({ page }) => {
    test.setTimeout(120000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    for (const [name, id, x, y] of anchors) {
      await page.evaluate(id => { location.hash = `/atlas/${id}` }, id)
      const pin = page.getByTestId(`marker-${id}`)
      await expect(pin, name).toBeVisible()
      await expect(pin.locator('.pin-label'), name).toHaveText(name)
      // The route SVG covers the original image rectangle. Its browser matrix
      // is an independent coordinate projection, not the marker's own layout.
      await expect.poll(() => page.evaluate(({ id, x, y }) => {
        const svg = document.querySelector<SVGSVGElement>('.route-overlay svg')!
        const target = new DOMPoint(x, y).matrixTransform(svg.getScreenCTM()!)
        const symbol = document.querySelector(`[data-testid="marker-${id}"] .pin-symbol`)!.getBoundingClientRect()
        return Math.hypot(target.x - symbol.x - symbol.width / 2, target.y - symbol.y - symbol.height / 2)
      }, { id, x, y }), { message: name }).toBeLessThan(1)
      await pin.click()
      await expect(pin).toHaveAttribute('aria-pressed', 'true')
      await expect(page.getByTestId('detail-panel')).toBeVisible()
    }
  })
}

test('corrected spellings and legacy URLs resolve the same places without duplicate pins', async ({ page }) => {
  test.setTimeout(60000)
  await page.goto('/')
  for (const [name, id] of namedAnchors.filter(([name]) => ['Thesar', 'Telvar', 'Korthen', 'Lurnvale', 'Orinhall', 'Vosir', 'Lanvar', 'Frethar'].includes(name))) {
    expect(canonicalId(name.toLocaleLowerCase('tr')), name).toBe(id)
    await page.getByRole('textbox', { name: 'Atlas ve wiki içinde ara' }).fill(name)
    await page.getByTestId(`location-result-${id}`).click()
    await expect(page.getByTestId(`marker-${id}`).locator('.pin-label')).toHaveText(name)
  }
})
