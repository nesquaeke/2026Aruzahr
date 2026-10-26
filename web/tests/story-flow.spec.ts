import { test, expect, type Page } from '@playwright/test'
import { bootStudio, publicFrame } from './studio-fixtures'
async function story(page: Page) {
  await bootStudio(page)
  await page
    .getByRole('button', { name: 'Sade hikâyeye dön', exact: true })
    .click()
  await expect(page.getByTestId('story-workspace')).toBeVisible()
  await expect(page.getByTestId('story-show')).toBeEnabled()
}
test('hazır hikâye şifresiz açılır; bölüm, zaman, amaç ve görseller tek ekrandadır', async ({
  page,
}) => {
  await story(page)
  await expect(
    page.getByRole('heading', { name: 'Hikâyeyi buradan başlat' }),
  ).toBeVisible()
  await expect(
    page
      .getByRole('navigation', { name: 'Hikâye bölümleri' })
      .getByRole('button'),
  ).toHaveCount(10)
  await expect(page.getByTestId('story-context')).toContainText('NEREDE')
  await expect(page.getByTestId('story-context')).toContainText('NE ZAMAN')
  await expect(page.getByTestId('story-context')).toContainText('AMAÇ')
  await expect(
    page.getByRole('button', { name: 'Sahne görselini büyüt' }).locator('img'),
  ).toHaveAttribute('src', /winter-yuk-avlusu/)
  const pack = await (
    await page.request.get('/dm/On-Kis-Karari-DM.json')
  ).json()
  await expect(page.locator('.story-next p')).toHaveText(
    pack.quests[0].briefing.transition,
  )
  await page.getByText('Not al / bu adımı değiştir', { exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Sonra ne olacak', exact: true })
    .fill('Önce avluyu oynat, ardından ertesi sabah revire geç.')
  await expect(page.locator('.story-next p')).toHaveText(
    'Önce avluyu oynat, ardından ertesi sabah revire geç.',
  )
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('aruzahr-director-pack')!).quests[0]
          .quick.next,
    ),
  ).toBe(pack.quests[0].quick.next)
  await page.getByRole('button', { name: 'Sonraki adım', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: pack.quests[0].steps[0].title, exact: true }),
  ).toBeVisible()
  await expect(page.locator('.story-speech blockquote')).toHaveText(
    pack.quests[0].steps[0].readAloud,
  )
  await expect(page.locator('.story-visual img')).toHaveAttribute(
    'src',
    /winter-ocak-gecesi/,
  )
  await expect(page.locator('.story-people>article img')).toHaveCount(
    pack.quests[0].steps[0].portraitIds.length,
  )
  expect((await publicFrame(page)).title).toBe('CANLI: eski')
})
test('okuma ve hazırlık yayını korur; tek göster komutu yalnız seçilen görsel ve portreleri yayımlar', async ({
  page,
  browser,
}) => {
  await story(page)
  const audience = await browser.newContext(),
    live = await audience.newPage()
  await live.goto('http://127.0.0.1:5173/#/broadcast/live')
  await page
    .getByRole('button', { name: 'Sadece hazırla', exact: true })
    .click()
  await expect(
    page.getByRole('button', { name: 'Hazırlıkta hazır', exact: true }),
  ).toBeVisible()
  expect((await publicFrame(page)).title).toBe('CANLI: eski')
  const book = await (
    await page.request.get('/dm/On-Kis-Karari-DM.json')
  ).json()
  let releaseFrame!: () => void
  const waitForFrame = new Promise<void>((resolve) => {
    releaseFrame = resolve
  })
  await page.route('**/__aruzahr-broadcast/studio/frame', async (route) => {
    if (
      route.request().postDataJSON()?.state?.title ===
      book.quests[0].briefing.publicTitle
    )
      await waitForFrame
    await route.continue()
  })
  await page.getByTestId('story-show').click()
  await expect(page.locator('.story-on-air')).toHaveText('Yayına gönderiliyor…')
  expect((await publicFrame(page)).title).toBe('CANLI: eski')
  releaseFrame()
  await expect(page.locator('.story-on-air')).toHaveText('Bu sahne yayında')
  await page.unroute('**/__aruzahr-broadcast/studio/frame')
  const frame = await publicFrame(page)
  expect(frame.title).toBe(book.quests[0].briefing.publicTitle)
  expect(JSON.stringify(frame)).not.toContain(book.quests[0].briefing.opening)
  await expect(
    live.locator('.studio-output > .broadcast-stage .broadcast-stage-heading'),
  ).toContainText(frame.title)
  await page.getByRole('button', { name: 'Sonraki adım', exact: true }).click()
  await expect(page.locator('.story-on-air')).toHaveText(
    'Yayını değiştirmeden okuyorsun',
  )
  expect((await publicFrame(page)).title).toBe(frame.title)
  await page.getByTestId('story-show').click()
  await expect(page.locator('.story-on-air')).toHaveText('Bu sahne yayında')
  await page.getByText('Not al / bu adımı değiştir', { exact: true }).click()
  await page
    .getByLabel('Hikâye sahne görseli', { exact: true })
    .selectOption('winter-marhalden')
  await expect(page.locator('.story-on-air')).toHaveText(
    'Yayını değiştirmeden okuyorsun',
  )
  await audience.close()
})
test('bölümler arası geçiş, sade düzenleme ve ilerleme yeniden açılınca korunur; önizleme ve telefon kullanılabilir', async ({
  page,
}) => {
  await story(page)
  const phases = page.getByRole('navigation', { name: 'Bu bölümün adımları' })
  await phases.getByRole('button').last().click()
  await page.getByRole('button', { name: 'Sonraki adım', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Köprünün İki Tarafı', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Hikâyeyi buradan başlat' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Sonraki adım', exact: true }).click()
  await page.getByText('Not al / bu adımı değiştir', { exact: true }).click()
  await page
    .getByLabel('Hikâye karar notu')
    .fill('Parti iki arabayı bölüştürdü.')
  await page
    .getByLabel('Hikâye anlatımını düzenle')
    .fill('Köprünün zincirleri soğukta geriliyor. Yolcular susarak bekliyor.')
  await page.reload()
  await expect(page.getByTestId('story-workspace')).toBeVisible()
  await expect(page.locator('.story-speech blockquote')).toHaveText(
    'Köprünün zincirleri soğukta geriliyor. Yolcular susarak bekliyor.',
  )
  await page.getByText('Not al / bu adımı değiştir', { exact: true }).click()
  await expect(page.getByLabel('Hikâye karar notu')).toHaveValue(
    'Parti iki arabayı bölüştürdü.',
  )
  await page.getByRole('button', { name: 'Sahne görselini büyüt' }).click()
  const modal = page.getByRole('dialog', { name: 'Sahne görseli', exact: true })
  await expect(modal).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(modal.getByRole('button', { name: 'Kapat' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(modal).not.toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByTestId('story-show')).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false)
  await page
    .getByRole('button', { name: 'Gelişmiş masaya geç', exact: true })
    .click()
  await expect(
    page.getByRole('navigation', { name: 'Studio araçları' }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Sade hikâyeye dön', exact: true })
    .click()
  await expect(page.locator('.story-speech blockquote')).toHaveText(
    'Köprünün zincirleri soğukta geriliyor. Yolcular susarak bekliyor.',
  )
})
