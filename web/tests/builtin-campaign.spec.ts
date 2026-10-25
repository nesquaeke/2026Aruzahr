import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const bookPath = 'public/dm/On-Kis-Karari-DM.json'
const modulePath = '/src/builtin-campaign.ts'
const custom = {
  version: 2,
  title: 'Benim düzenlediğim kampanya',
  quests: [
    {
      id: 'custom-quest',
      title: 'Kendi hikâyem',
      body: 'USER-LOCAL-ONLY-2605',
    },
  ],
}

async function blank(page: any) {
  await page.goto('/#/atlas')
  await page.evaluate(() => {
    for (const key of [
      'aruzahr-director-pack',
      'aruzahr-director-progress',
      'aruzahr-director-notes',
    ])
      localStorage.removeItem(key)
  })
}

test('hazır hikâye şifresiz yüklenir; on bölüm ve otuz kısa sahne rehberi vardır', async ({
  page,
}) => {
  await blank(page)
  const result = await page.evaluate(async (path) => {
    const { ensureBuiltinCampaign } = await import(path)
    const result = await ensureBuiltinCampaign()
    return {
      ...result,
      stored: JSON.parse(localStorage.getItem('aruzahr-director-pack')!),
    }
  }, modulePath)
  expect(result.installed).toBe(true)
  expect(result.pack.quests).toHaveLength(10)
  expect(result.pack.quests.flatMap((q: any) => q.steps)).toHaveLength(30)
  for (const q of result.pack.quests) {
    for (const guide of [q.quick, ...q.steps.map((s: any) => s.quick)])
      for (const key of ['where', 'time', 'goal', 'next'])
        expect(guide[key].length).toBeGreaterThan(5)
  }
  expect(result.pack.quests[0].briefing.backgroundId).toBe('winter-yuk-avlusu')
  expect(result.pack.quests[0].steps[1].backgroundId).toBe(
    'winter-buzlu-galeri',
  )
  expect(result.stored).toEqual(result.pack)
  await page.goto('/DM-Paketini-Ac.html')
  await expect(
    page.getByRole('heading', { name: 'Hikâye hazır. Şifre gerekmiyor.' }),
  ).toBeVisible()
  await expect(page.locator('input[type=password]')).toHaveCount(0)
  const download = page.waitForEvent('download')
  await page
    .getByRole('link', { name: 'Kitap dosyalarını ZIP olarak indir' })
    .click()
  const file = await download
  expect(file.suggestedFilename()).toBe('On-Kis-Karari-DM-Paketi.zip')
})

test('kullanıcının başka kampanyası hazır kitap için değiştirilmez ve gereksiz istek yapılmaz', async ({
  page,
}) => {
  await blank(page)
  let requests = 0
  await page.route('**/dm/On-Kis-Karari-DM.json', async (route) => {
    requests++
    await route.abort()
  })
  const result = await page.evaluate(
    async ({ path, custom }) => {
      localStorage.setItem('aruzahr-director-pack', JSON.stringify(custom))
      localStorage.setItem('aruzahr-director-notes', 'BENİM SERBEST NOTUM')
      const { ensureBuiltinCampaign } = await import(path)
      return {
        result: await ensureBuiltinCampaign(),
        notes: localStorage.getItem('aruzahr-director-notes'),
      }
    },
    { path: modulePath, custom },
  )
  expect(requests).toBe(0)
  expect(result.result.pack).toEqual(custom)
  expect(result.result.installed).toBe(false)
  expect(result.notes).toBe('BENİM SERBEST NOTUM')
})

test('eski on görev yeni görsellerle zenginleşir; düzenlenen metin ve kararlar aynen kalır', async ({
  page,
}) => {
  const original = JSON.parse(await readFile(bookPath, 'utf8'))
  const old = structuredClone(original)
  old.quests.forEach((q: any) => {
    delete q.quick
    q.steps.forEach((s: any) => delete s.quick)
  })
  old.quests[0].body = 'KULLANICI DEĞİŞTİRDİĞİ METİN'
  old.quests[0].briefing.backgroundId = 'winter-marhalden'
  old.quests[0].steps[1].backgroundId = 'winter-ilac'
  old.quests[0].steps[1].readAloud = 'BENİM KONUŞMAM'
  old.quests[2].steps[1].backgroundId = 'winter-ekmek'
  old.quests[3].steps[0].backgroundId = 'user-custom-art'
  const progress = {
    quest: 'ac-cocuk',
    steps: { 'ac-cocuk': 2 },
    done: ['son-ilac'],
    decisions: { 'son-ilac': 'Kararım değişmesin.' },
  }
  await blank(page)
  const result = await page.evaluate(
    async ({ path, old, progress }) => {
      localStorage.setItem('aruzahr-director-pack', JSON.stringify(old))
      localStorage.setItem(
        'aruzahr-director-progress',
        JSON.stringify(progress),
      )
      localStorage.setItem('aruzahr-director-notes', 'SERBEST NOT')
      const { ensureBuiltinCampaign } = await import(path)
      const result = await ensureBuiltinCampaign()
      return {
        result,
        rawProgress: localStorage.getItem('aruzahr-director-progress'),
        notes: localStorage.getItem('aruzahr-director-notes'),
      }
    },
    { path: modulePath, old, progress },
  )
  expect(result.result.updated).toBe(true)
  expect(result.result.pack.quests[0].body).toBe(old.quests[0].body)
  expect(result.result.pack.quests[0].steps[1].readAloud).toBe('BENİM KONUŞMAM')
  expect(result.result.pack.quests[0].steps[1].backgroundId).toBe(
    'winter-buzlu-galeri',
  )
  expect(result.result.pack.quests[2].steps[1].backgroundId).toBe(
    'winter-un-ambari',
  )
  expect(result.result.pack.quests[3].steps[0].backgroundId).toBe(
    'user-custom-art',
  )
  expect(result.rawProgress).toBe(JSON.stringify(progress))
  expect(result.notes).toBe('SERBEST NOT')
})

test('yükleme beklerken içe alınan özel kampanya sonradan hazır kitapla ezilmez', async ({
  page,
}) => {
  await blank(page)
  const raw = await readFile(bookPath, 'utf8')
  let release: (() => void) | undefined
  const paused = new Promise<void>((resolve) => {
    release = resolve
  })
  let started: (() => void) | undefined
  const request = new Promise<void>((resolve) => {
    started = resolve
  })
  await page.route('**/dm/On-Kis-Karari-DM.json', async (route) => {
    started!()
    await paused
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: raw,
    })
  })
  await page.evaluate(async (path) => {
    const { ensureBuiltinCampaign } = await import(path)
    ;(window as any).pendingBuiltin = ensureBuiltinCampaign()
  }, modulePath)
  await request
  await page.evaluate(
    (custom) =>
      localStorage.setItem('aruzahr-director-pack', JSON.stringify(custom)),
    custom,
  )
  release!()
  const result = await page.evaluate(
    async () => await (window as any).pendingBuiltin,
  )
  expect(result.pack).toEqual(custom)
  expect(result.installed).toBe(false)
  expect(result.updated).toBe(false)
})

test('kısa rehber alanları sınırlı doğrulanır ve bilinmeyen alanlar taşınmaz', async ({
  page,
}) => {
  await blank(page)
  const result = await page.evaluate(async () => {
    const { parseDMPack } = await import('/src/dm-guide.ts')
    const base = {
      version: 1,
      title: 'Özel',
      quests: [
        {
          id: 'q',
          title: 'Q',
          body: 'Metin',
          quick: {
            where: 'Mekân',
            time: 'Zaman',
            goal: 'Amaç',
            next: 'Devam',
            leak: 'NOT ALLOWED',
          },
        },
      ],
    }
    const checked = parseDMPack(base)
    let rejected = false
    try {
      parseDMPack({
        ...base,
        quests: [
          {
            ...base.quests[0],
            quick: { ...base.quests[0].quick, where: 'x'.repeat(601) },
          },
        ],
      })
    } catch {
      rejected = true
    }
    return { quick: checked.quests[0].quick, rejected }
  })
  expect(result.quick).toEqual({
    where: 'Mekân',
    time: 'Zaman',
    goal: 'Amaç',
    next: 'Devam',
  })
  expect(result.rejected).toBe(true)
})
