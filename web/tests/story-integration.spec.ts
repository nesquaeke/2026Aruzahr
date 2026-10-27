import { test, expect, type Page } from '@playwright/test'
import { panel, publicFrame } from './studio-fixtures'

async function releaseOwner(page: Page) {
  const claim = await page.request.post('/__aruzahr-broadcast/studio/claim', { data: { id: 'unified-integration-' + Date.now(), force: true } })
  const lease = await claim.json()
  await page.request.post('/__aruzahr-broadcast/studio/release', { data: {}, headers: { 'x-studio-owner': lease.key } })
}
test.describe.configure({ timeout: 60000 })

test('ilk açılış tek masadır; eski düzen tercihi silinir, canlı/telefon/wiki DM dosyası istemez ve kişisel karar yayına girmez', async ({ page, browser }) => {
  await releaseOwner(page)
  await page.goto('/#/wiki')
  await page.evaluate(() => localStorage.setItem('aruzahr-studio-layout', 'simple'))
  await page.goto('/#/broadcast')
  await expect(page.getByTestId('studio-dm-reader')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Giriş manzarasını hazırla', exact: true })).toBeEnabled()
  expect(await page.evaluate(() => localStorage.getItem('aruzahr-studio-layout'))).toBeNull()
  const book = await (await page.request.get('/dm/On-Kis-Karari-DM.json')).json()
  const context = await browser.newContext(), live = await context.newPage(), requested: string[] = []
  live.on('request', request => { if (request.url().includes('/dm/')) requested.push(request.url()) })
  try {
    await live.goto('http://127.0.0.1:5173/#/broadcast/live')
    await page.getByLabel('Oyuncuların kararı', { exact: true }).fill('PERSONAL-UNIFIED-CHOICE-2710')
    await page.getByRole('button', { name: 'Giriş manzarasını hazırla', exact: true }).click()
    await page.getByRole('button', { name: 'Girişi oyunculara göster', exact: true }).click()
    await expect.poll(async () => (await publicFrame(page)).title).toBe(book.quests[0].briefing.publicTitle)
    const wire = JSON.stringify(await publicFrame(page))
    expect(wire).not.toContain('PERSONAL-UNIFIED-CHOICE-2710')
    expect(wire).not.toContain(book.quests[0].briefing.opening)
    expect(requested).toEqual([])
    await live.goto('http://127.0.0.1:5173/#/broadcast/remote')
    await expect(live.locator('body')).toContainText(/Bağlan|kumanda|eşleştir/i)
    expect(requested).toEqual([])
    await live.goto('http://127.0.0.1:5173/#/wiki')
    await expect(live.getByRole('heading', { name: /Haritanın ardındaki/ }).first()).toBeVisible()
    expect(requested).toEqual([])
  } finally { await context.close() }
})

test('veritabanındaki özel hikâye hazır kitap isteği yapılmadan ve özel kararlarıyla geri gelir', async ({ page }) => {
  await releaseOwner(page)
  await page.goto('/#/wiki')
  await page.evaluate(async () => {
    const path = '/src/studio/model.ts'
    const { newProject, storeProject } = await import(path)
    const pack = { version: 2, title: 'Kendi yolculuğum', quests: [{ id: 'my-local-chapter', title: 'Kişisel Bölüm', body: 'USER-IDB-ONLY-BODY', steps: [{ id: 'my-stage', title: 'Özel Sahnem', summary: 'Kendi olayım', readAloud: 'Veritabanında saklanan açılış konuşmam.', actions: [], checks: [], choices: [], backgroundId: 'winter-ilac', portraitIds: [], publicTitle: 'Revir' }] }] }
    const p = newProject()
    p.dmStorage = {
      'aruzahr-director-pack': JSON.stringify(pack),
      'aruzahr-director-notes': 'USER-IDB-ONLY-NOTES',
      'aruzahr-director-progress': JSON.stringify({ quest: 'my-local-chapter', steps: { 'my-local-chapter': 0 }, done: [], decisions: { 'my-local-chapter': 'USER-IDB-ONLY-CHOICE' } }),
    }
    await storeProject(p)
  })
  const requested: string[] = []
  page.on('request', request => { if (request.url().endsWith('/dm/On-Kis-Karari-DM.json')) requested.push(request.url()) })
  await page.goto('/#/broadcast')
  await expect(page.getByTestId('studio-dm-reader')).toBeVisible()
  await expect(page.locator('.dm-current > h2')).toHaveText('Kişisel Bölüm')
  await expect(page.locator('.dm-read blockquote')).toHaveText('Veritabanında saklanan açılış konuşmam.')
  await expect(page.getByLabel('Oyuncuların kararı', { exact: true })).toHaveValue('USER-IDB-ONLY-CHOICE')
  expect(await page.evaluate(() => localStorage.getItem('aruzahr-director-notes'))).toBe('USER-IDB-ONLY-NOTES')
  expect(requested).toEqual([])
})

test('tam sıfırlama kişisel kararları, karşılaşma notlarını ve eski düzeni silip hazır zinciri yeniden açar', async ({ page }) => {
  await releaseOwner(page)
  await page.goto('/#/broadcast')
  await expect(page.getByRole('button', { name: 'İlk sahneye geç', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'İlk sahneye geç', exact: true }).click()
  await page.getByLabel('Oyuncuların kararı', { exact: true }).fill('RESET-PERSONAL-2710')
  await page.evaluate(() => {
    const p = JSON.parse(localStorage.getItem('aruzahr-director-progress') || '{}')
    p.night = { selected: 'ulvenin-evi', trigger: 'camp', notes: { 'ulvenin-evi': 'RESET-NIGHT-2710' }, choices: {}, revealed: {} }
    localStorage.setItem('aruzahr-director-progress', JSON.stringify(p))
    window.dispatchEvent(new Event('studio-dm-change'))
  })
  await panel(page, 'Yayın')
  await page.getByRole('button', { name: 'Bu cihazdaki tüm Aruzahr verilerini sıfırla', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Tüm verileri sıfırla', exact: true })
  await dialog.getByLabel('Tüm verileri sıfırlama onayı').fill('SIFIRLA')
  await dialog.getByRole('button', { name: 'Her şeyi sıfırla', exact: true }).click()
  await expect(page.getByTestId('studio-dm-reader')).toBeVisible()
  await expect(page.getByRole('button', { name: 'İlk sahneye geç', exact: true })).toBeVisible()
  const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('aruzahr-director-progress') || '{}'))
  expect(JSON.stringify(progress)).not.toContain('RESET-PERSONAL-2710')
  expect(JSON.stringify(progress)).not.toContain('RESET-NIGHT-2710')
  expect(progress.quest).toBe('son-ilac')
  expect(progress.steps['son-ilac']).toBe(0)
  expect(await page.evaluate(() => localStorage.getItem('aruzahr-studio-layout'))).toBeNull()
})

test('ElevenLabs anahtarı eksikse ses bölümü kurulumu açıklar; kendiliğinden ses üretmez', async ({ page }) => {
  await releaseOwner(page)
  const generated: string[] = []
  page.on('request', request => { if (request.url().includes('/__aruzahr-voices/generate')) generated.push(request.url()) })
  await page.route('**/__aruzahr-voices/status', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ configured: false, provider: 'ElevenLabs', maxCharacters: 2500 }) }))
  await page.goto('/#/broadcast')
  await expect(page.getByTestId('studio-dm-reader')).toBeVisible()
  await panel(page, 'Ses')
  const voice = page.getByTestId('elevenlabs-panel')
  await voice.locator(':scope > summary').click()
  await expect(voice).toContainText('API anahtarı henüz eklenmedi.')
  await expect(voice).toContainText('web/.env.local')
  await expect(voice.getByRole('button', { name: 'Ses üret · ElevenLabs', exact: true })).toHaveCount(0)
  expect(generated).toEqual([])
})
