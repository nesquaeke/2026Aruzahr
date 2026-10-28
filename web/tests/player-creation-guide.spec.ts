import { expect, test, type Page } from '@playwright/test'

const key = 'aruzahr-player-characters-v1'
async function create(page: Page) {
  await page.goto('/#/play')
  await page.getByRole('button', { name: 'Karakter oluştur', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Yeni karakter oluştur' })
  await dialog.getByLabel('Yeni karakterin adı').fill('Mühür Taşıyan')
  await dialog.getByRole('button', { name: 'Karakter defterini aç' }).click()
  await expect(page.getByRole('heading', { name: 'Mühür Taşıyan', exact: true })).toBeVisible()
}
const saved = (page: Page) => page.evaluate(key => JSON.parse(localStorage.getItem(key) || '{}').characters[0], key)

test('guide action reveals the actual editable fields instead of leaving the user above the form', async ({ page }) => {
  await create(page)
  await page.getByTestId('character-creation-guide').getByRole('button', { name: 'Kimlik seçimlerine git', exact: true }).click()
  const field = page.getByLabel('Karakter adı', { exact: true })
  await expect(field).toBeInViewport()
  await field.fill('Görünür Form')
  await expect.poll(async () => (await saved(page)).name).toBe('Görünür Form')
})

test('ability drafts are previews; standard swaps retain all six values and point buy never exceeds 27', async ({ page }) => {
  await create(page)
  const before = await saved(page)
  await page.getByRole('navigation', { name: 'Karakter bölümleri' }).getByRole('button', { name: 'Nitelikler', exact: true }).click()
  const builder = page.getByTestId('ability-score-builder')
  await builder.getByLabel('Standart dizi · Zekâ', { exact: true }).selectOption('15')
  const values = await builder.locator('.ab-allocations select').evaluateAll(elements => elements.map(el => Number((el as HTMLSelectElement).value)))
  expect(values.sort((a, b) => b - a)).toEqual([15, 14, 13, 12, 10, 8])
  expect((await saved(page)).scores).toEqual(before.scores)
  await builder.getByTestId('ability-allocation-apply').click()
  await expect.poll(async () => (await saved(page)).scores.int).toBe(15)
  expect((await saved(page)).hp).toBe(before.hp)
  await builder.getByRole('button', { name: '27 puan dağıt', exact: true }).click()
  await builder.getByRole('button', { name: 'Dağılımı 8’e sıfırla', exact: true }).click()
  for (const ability of ['Kuvvet', 'Çeviklik', 'Dayanıklılık']) {
    await builder.getByLabel('Puan dağıtımı · ' + ability, { exact: true }).selectOption('15')
  }
  const int = builder.getByLabel('Puan dağıtımı · Zekâ', { exact: true })
  await expect(int.locator('option[value="9"]')).toHaveAttribute('disabled', '')
  await builder.getByTestId('ability-allocation-apply').click()
  await expect.poll(async () => (await saved(page)).scores).toEqual({ str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 })
  await page.reload()
  expect((await saved(page)).scores).toEqual({ str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 })
  expect((await saved(page)).hp).toBe(before.hp)
})

test('ability cost and swap helpers reject invalid allocations rather than creating duplicate or over-budget scores', async ({ page }) => {
  await page.goto('/#/play')
  const result = await page.evaluate(async () => {
    const path = '/src/player/AbilityScoreBuilder.tsx'
    const { pointBuyCost, totalPointBuyCost, swapStandardAllocation } = await import(path)
    const base = { str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 }
    const moved = swapStandardAllocation(base, 'int', 15)
    return {
      costs: [8, 9, 10, 11, 12, 13, 14, 15].map(pointBuyCost),
      invalid: [7, 16, 12.5, NaN].map(value => Number.isFinite(pointBuyCost(value))),
      moved, base,
      total: totalPointBuyCost({ str: 15, dex: 15, con: 15, int: 8, wis: 8, cha: 8 }),
    }
  })
  expect(result.costs).toEqual([0, 1, 2, 3, 4, 5, 7, 9])
  expect(result.invalid).toEqual([false, false, false, false])
  expect(result.moved).toEqual({ str: 12, dex: 14, con: 13, int: 15, wis: 10, cha: 8 })
  expect(result.base.str).toBe(15)
  expect(result.total).toBe(27)
})

test('starting equipment is explicit and repeat-safe; armor and weapons are equipped independently', async ({ page }) => {
  await create(page)
  const before = await saved(page)
  await page.getByRole('navigation', { name: 'Karakter bölümleri' }).getByRole('button', { name: 'Eşya', exact: true }).click()
  const catalog = page.getByTestId('equipment-catalog')
  const apply = catalog.getByTestId('equipment-starter').locator('button.ec-primary')
  await apply.click()
  await expect.poll(async () => (await saved(page)).equipment.length).toBeGreaterThan(5)
  await expect(apply).toBeDisabled()
  const packed = await saved(page)
  expect(packed.armorId).toBe('none')
  expect(packed.attacks).toEqual([])
  expect(packed.coins).toEqual(before.coins)
  expect(packed.hp).toBe(before.hp)
  await catalog.getByRole('button', { name: /^Donanım arşivi/ }).click()
  await catalog.getByRole('searchbox', { name: 'Donanımda ara' }).fill('chain mail')
  await catalog.locator('[data-equipment-id="chain-mail"]').click()
  await catalog.getByTestId('equipment-detail').getByRole('button', { name: 'Kuşan', exact: true }).click()
  await expect.poll(async () => (await saved(page)).armorId).toBe('chain-mail')
  await catalog.getByRole('searchbox', { name: 'Donanımda ara' }).fill('longsword')
  await catalog.locator('[data-equipment-id="longsword"]').click()
  await catalog.getByTestId('equipment-detail').getByRole('button', { name: 'Saldırı listesine ekle', exact: true }).click()
  await expect.poll(async () => (await saved(page)).attacks.length).toBe(1)
  await page.reload()
  expect((await saved(page)).equipment).toEqual(packed.equipment)
  expect((await saved(page)).attacks[0].proficient).toBe(true)
})

test('optional racial bonuses replace a base allocation without stacking and half-elves must choose two different scores', async ({ page }) => {
  await create(page)
  await page.getByLabel('Irk / soy', { exact: true }).selectOption('half-elf')
  await page.getByRole('navigation', { name: 'Karakter bölümleri' }).getByRole('button', { name: 'Nitelikler', exact: true }).click()
  const builder = page.getByTestId('ability-score-builder')
  await builder.getByRole('checkbox', { name: /Bu dağılıma soy artışlarını ekle/ }).check()
  await expect(builder.getByTestId('ability-allocation-apply')).toBeDisabled()
  await builder.getByLabel('Yarı Elf 1. ek nitelik', { exact: true }).selectOption('str')
  await expect(builder.getByLabel('Yarı Elf 2. ek nitelik', { exact: true }).locator('option[value="str"]')).toHaveAttribute('disabled', '')
  await builder.getByLabel('Yarı Elf 2. ek nitelik', { exact: true }).selectOption('con')
  await builder.getByTestId('ability-allocation-apply').click()
  await expect.poll(async () => (await saved(page)).scores.cha).toBe(12)
  const first = (await saved(page)).scores
  await builder.getByTestId('ability-allocation-apply').click()
  expect((await saved(page)).scores).toEqual(first)
})
