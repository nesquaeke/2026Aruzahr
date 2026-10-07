import { expect, test } from '@playwright/test'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

test('original map tiles, region selection, wiki and return to map work', async ({ page }) => {
  const errors: string[] = []
  const tiles: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('response', response => { if (response.url().includes('aruzahr_files/') && response.ok()) tiles.push(response.url()) })
  await page.goto('/')
  await expect(page.getByTestId('marker-xotar')).toBeVisible()
  await expect.poll(() => tiles.length).toBeGreaterThan(0)
  await page.getByTestId('marker-xotar').click()
  await expect(page.getByTestId('detail-panel')).toContainText('Çölün kalbi')
  await page.getByRole('button', { name: 'Wiki sayfasını aç' }).click()
  await expect(page).toHaveURL(/#\/wiki\/xotar$/)
  await expect(page.getByRole('heading', { name: 'Kumun altında yaşam' })).toBeVisible()
  await page.getByRole('button', { name: 'Haritada göster' }).click()
  await expect(page.getByTestId('detail-panel')).toContainText('Xotar')
  await expect(page.getByTestId('zoom-level')).not.toHaveText('100%')
  expect(errors).toEqual([])
})

test('city search, bookmarks persist and zoom controls change the view', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('textbox', { name: 'Atlas ve wiki içinde ara' }).fill('Valdareth')
  await page.locator('.place-search-result').filter({ hasText: 'Valdareth' }).click()
  await expect(page.getByTestId('detail-panel')).toContainText('soylu başkent')
  await page.getByRole('button', { name: 'Valdareth kaydet', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Valdareth kaydını kaldır' })).toBeVisible()
  await expect(page.getByTestId('zoom-level')).not.toHaveText('100%')
  await page.waitForTimeout(1400)
  const before = parseInt((await page.getByTestId('zoom-level').textContent())!)
  await page.getByRole('button', { name: 'Yakınlaştır', exact: true }).click()
  await expect.poll(async () => parseInt((await page.getByTestId('zoom-level').textContent())!)).toBeGreaterThan(before)
  await page.getByRole('button', { name: 'Haritanın tamamını göster' }).click()
  await expect(page.getByTestId('detail-panel')).toHaveCount(0)
  await expect(page.getByTestId('zoom-level')).toHaveText('100%')
  await page.getByRole('button', { name: 'Kaydedilen yerleri göster' }).click()
  await expect(page.locator('.place-search-result')).toContainText('Valdareth')
  await page.goto('/#/wiki/buyuk-kirilma')
  await page.getByRole('button', { name: 'Kaydı kaydet', exact: true }).click()
  await page.reload()
  await page.getByRole('button', { name: 'Kaydedilen yerleri göster' }).click()
  await expect(page.locator('.place-search-result').filter({ hasText: 'Büyük Kırılma' })).toBeVisible()
})

test('city layer is interactive and permanent wiki links survive reload', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('marker-valdareth')).toBeHidden()
  await page.getByRole('button', { name: 'Yerleşimler', exact: true }).click()
  await expect(page.getByTestId('marker-valdareth')).toBeVisible()
  await page.getByTestId('marker-valdareth').click()
  await expect(page.getByTestId('detail-panel')).toContainText('Valdareth')
  await page.goto('/#/wiki/honud')
  await expect(page.getByRole('heading', { name: 'Honud', exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Ruhlar ve sözlü büyü' })).toBeVisible()
  await page.goto('/#/wiki/not-a-location')
  await expect(page.getByRole('heading', { name: 'Kayıt bulunamadı.' })).toBeVisible()
})

test('keyboard search, help, focus view and reduced motion are usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByTestId('marker-xotar')).toBeVisible()
  await expect(page.locator('.atmosphere')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Atmosfer efektleri' })).toBeDisabled()
  await page.keyboard.press('/')
  await expect(page.getByRole('textbox', { name: 'Atlas ve wiki içinde ara' })).toBeFocused()
  await page.getByRole('textbox', { name: 'Atlas ve wiki içinde ara' }).fill('HONUD')
  await expect(page.locator('.region-list .region-link')).toHaveCount(1)
  await page.getByRole('button', { name: 'Aramayı temizle' }).click()
  await page.getByRole('button', { name: 'Kullanım rehberi' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await page.getByRole('button', { name: 'Odak moduna geç' }).click()
  await expect(page.locator('.map-shell')).toHaveClass(/focus-mode/)
  await page.getByRole('button', { name: 'Odak modundan çık' }).click()
  await expect(page.locator('.map-shell')).not.toHaveClass(/focus-mode/)
})

test('mobile navigation, map and wiki fit without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByTestId('marker-xotar')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Bölge menüsünü aç' }).click()
  await page.locator('.region-list').getByRole('button', { name: /Honud/ }).click()
  await expect(page.getByTestId('detail-panel')).toContainText('Honud')
  await page.getByRole('button', { name: 'Wiki sayfasını aç' }).click()
  await expect(page.getByRole('heading', { name: 'Honud', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('published artifacts omit DM secrets and development server blocks raw lore files', async ({ request }) => {
  const secretPhrases = ['Yarethus’un Kutsal İzi', 'Halendar’ın Kızıl Kıvılcımı', 'PROJECT: BROKEN OATH', 'Deli Kral Halendar’ın Ateş Mahkemesi', 'Denge Ritüeli', 'DM NOTU']
  function inspect(directory: string) {
    for (const name of readdirSync(directory, { withFileTypes: true })) {
      const file = join(directory, name.name)
      if (name.isDirectory()) inspect(file)
      else {
        expect(file).not.toMatch(/\.(docx|pdf)$/)
        if (/\.(js|html|json|txt)$/.test(file)) {
          const text = readFileSync(file, 'utf8')
          for (const phrase of secretPhrases) expect(text).not.toContain(phrase)
        }
      }
    }
  }
  inspect('dist')
  for (const name of ['Valhunar.pdf', 'Main questler.docx', 'ANA HİKÂYE DOKÜMANI.docx']) {
    const response = await request.get(`/@fs/workspace/2026Aruzahr/${encodeURIComponent(name)}`)
    expect(response.status()).toBe(403)
    expect(response.headers()['content-type'] || '').not.toMatch(/pdf|officedocument/)
  }
})
