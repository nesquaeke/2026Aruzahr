import { test, expect, type Page } from '@playwright/test'
import { publicFrame } from './studio-fixtures'

async function releaseOwner(page: Page) {
  const claim = await page.request.post('/__aruzahr-broadcast/studio/claim', {
    data: { id: 'story-integration-' + Date.now(), force: true },
  })
  const lease = await claim.json()
  await page.request.post('/__aruzahr-broadcast/studio/release', {
    data: {},
    headers: { 'x-studio-owner': lease.key },
  })
}
test.describe.configure({ timeout: 60000 })

test('ilk açılış sade hikâyedir; oyuncu ve wiki hazır DM metnini istemez, kişisel karar yayına girmez', async ({
  page,
  browser,
}) => {
  await releaseOwner(page)
  await page.goto('/#/broadcast')
  await expect(page.getByTestId('story-workspace')).toBeVisible()
  await expect(page.getByTestId('story-show')).toBeEnabled()
  expect(
    await page.evaluate(() => localStorage.getItem('aruzahr-studio-layout')),
  ).toBeNull()
  const book = await (
    await page.request.get('/dm/On-Kis-Karari-DM.json')
  ).json()
  await expect(
    page.getByRole('button', { name: 'Sahne görselini büyüt' }).locator('img'),
  ).toHaveAttribute('src', /winter-yuk-avlusu/)
  const context = await browser.newContext(),
    live = await context.newPage(),
    requested: string[] = []
  live.on('request', (request) => {
    if (request.url().includes('/dm/')) requested.push(request.url())
  })
  await live.goto('http://127.0.0.1:5173/#/broadcast/live')
  await page.getByText('Not al / bu adımı değiştir', { exact: true }).click()
  await page.getByLabel('Hikâye karar notu').fill('PERSONAL-STORY-CHOICE-2605')
  await page.getByTestId('story-show').click()
  await expect
    .poll(async () => (await publicFrame(page)).title)
    .toBe(book.quests[0].briefing.publicTitle)
  const wire = JSON.stringify(await publicFrame(page))
  expect(wire).not.toContain('PERSONAL-STORY-CHOICE-2605')
  expect(wire).not.toContain(book.quests[0].briefing.opening)
  expect(requested).toEqual([])
  await live.goto('http://127.0.0.1:5173/#/wiki')
  await expect(
    live.getByRole('heading', { name: /Haritanın ardındaki/ }).first(),
  ).toBeVisible()
  expect(requested).toEqual([])
  await context.close()
})

test('yalnız kampanya veritabanındaki özel hikâye hazır kitap yüklenmeden geri gelir', async ({
  page,
}) => {
  await releaseOwner(page)
  await page.goto('/#/wiki')
  await page.evaluate(async () => {
    const path = '/src/studio/model.ts'
    const { newProject, storeProject } = await import(path)
    const pack = {
      version: 2,
      title: 'Kendi yolculuğum',
      quests: [
        {
          id: 'my-local-chapter',
          title: 'Kişisel Bölüm',
          body: 'USER-IDB-ONLY-BODY',
          steps: [
            {
              id: 'my-stage',
              title: 'Özel Sahnem',
              summary: 'Kendi olayım',
              readAloud: 'Veritabanında saklanan açılış konuşmam.',
              actions: [],
              checks: [],
              choices: [],
              backgroundId: 'winter-ilac',
              portraitIds: [],
              publicTitle: 'Revir',
            },
          ],
        },
      ],
    }
    const p = newProject()
    p.dmStorage = {
      'aruzahr-director-pack': JSON.stringify(pack),
      'aruzahr-director-notes': 'USER-IDB-ONLY-NOTES',
      'aruzahr-director-progress': JSON.stringify({
        quest: 'my-local-chapter',
        steps: { 'my-local-chapter': 0 },
        done: [],
        decisions: { 'my-local-chapter': 'USER-IDB-ONLY-CHOICE' },
      }),
    }
    await storeProject(p)
  })
  await page.goto('/#/broadcast')
  await expect(page.getByTestId('story-workspace')).toBeVisible()
  await expect(page.locator('.story-chapter h1')).toHaveText('Kişisel Bölüm')
  await expect(page.locator('.story-speech blockquote')).toHaveText(
    'Veritabanında saklanan açılış konuşmam.',
  )
  await page.getByText('Not al / bu adımı değiştir', { exact: true }).click()
  await expect(page.getByLabel('Hikâye karar notu')).toHaveValue(
    'USER-IDB-ONLY-CHOICE',
  )
  expect(
    await page.evaluate(() => localStorage.getItem('aruzahr-director-notes')),
  ).toBe('USER-IDB-ONLY-NOTES')
})

test('tam sıfırlama kişisel notları siler; sonraki açılış şifresiz temiz hikâyeye döner', async ({
  page,
}) => {
  await releaseOwner(page)
  await page.goto('/#/broadcast')
  await expect(page.getByTestId('story-show')).toBeEnabled()
  await page.getByRole('button', { name: 'Sonraki adım', exact: true }).click()
  await page.getByText('Not al / bu adımı değiştir', { exact: true }).click()
  await page.getByLabel('Hikâye karar notu').fill('RESET-PERSONAL-2605')
  await page
    .getByRole('button', { name: 'Gelişmiş masaya geç', exact: true })
    .click()
  await page
    .getByRole('navigation', { name: 'Studio araçları' })
    .getByRole('button', { name: 'Yayın', exact: true })
    .click()
  await page
    .getByRole('button', {
      name: 'Bu cihazdaki tüm Aruzahr verilerini sıfırla',
      exact: true,
    })
    .click()
  const dialog = page.getByRole('dialog', {
    name: 'Tüm verileri sıfırla',
    exact: true,
  })
  await dialog.getByLabel('Tüm verileri sıfırlama onayı').fill('SIFIRLA')
  await dialog
    .getByRole('button', { name: 'Her şeyi sıfırla', exact: true })
    .click()
  await expect(page.getByTestId('story-workspace')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Hikâyeyi buradan başlat', exact: true }),
  ).toBeVisible()
  const progress = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('aruzahr-director-progress') || '{}'),
  )
  expect(JSON.stringify(progress)).not.toContain('RESET-PERSONAL-2605')
  expect(progress.quest).toBe('son-ilac')
  expect(progress.steps['son-ilac']).toBe(0)
})
