import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { bootStudio, publicFrame } from './studio-fixtures'
import sharp from 'sharp'
const book = JSON.parse(
  await readFile('public/dm/On-Kis-Karari-DM.json', 'utf8'),
)
const legacy = JSON.parse(
  await readFile('tests/fixtures/winter-legacy.json', 'utf8'),
)

test('expanded chapters parse and malformed opponents and broken branches are rejected', async ({
  page,
}) => {
  await page.goto('/#/atlas')
  const result = await page.evaluate(async (raw) => {
    const { parseDMPack } = await import('/src/dm-guide.ts')
    const good = parseDMPack(raw),
      rejected = []
    for (const failure of ['stats', 'branch']) {
      const bad = structuredClone(raw)
      if (failure === 'stats')
        bad.quests[0].steps.find(
          (s: any) => s.play.encounter,
        ).play.encounter.units[0].hp = -1
      else
        bad.quests[0].steps[0].play.paths = [
          { label: 'Yanlış hedef', to: 'does-not-exist' },
        ]
      try {
        parseDMPack(bad)
      } catch {
        rejected.push(failure)
      }
    }
    return { good, rejected }
  }, book)
  expect(result.good.quests.flatMap((q: any) => q.steps)).toHaveLength(61)
  expect(result.rejected).toEqual(['stats', 'branch'])
  expect(book.quests[0].steps).toHaveLength(7)
  for (const q of book.quests) {
    expect(q.steps.some((s: any) => s.play.encounter)).toBe(true)
    expect(q.steps.some((s: any) => s.play.dialogue.length)).toBe(true)
    for (const s of q.steps) {
      expect(s.runbook.beats.length).toBeGreaterThanOrEqual(3)
      expect(s.readAloud.length).toBeGreaterThan(100)
      expect(s.play.continueWhen.length).toBeGreaterThan(30)
      if (s.play.encounter)
        expect(s.play.encounter.scale).toContain('1. seviye')
    }
  }
  const first = book.quests[0].steps.find((s: any) => s.id === 'son-ilac-2')
    .play.encounter
  expect(first.units).toHaveLength(1)
  expect(first.units[0]).toMatchObject({ count: 1, ac: 12, hp: 9 })
  expect(first.units[0].attack).toContain('1d4')
})

test('old thirty-scene save upgrades by identity and keeps custom prose, added scenes, notes and decisions', async ({
  page,
}) => {
  await page.goto('/#/atlas')
  const result = await page.evaluate(async (old) => {
    const { parseDMPack } = await import('/src/dm-guide.ts')
    const { ensureBuiltinCampaign } = await import('/src/builtin-campaign.ts')
    const edited = structuredClone(old)
    edited.quests[0].steps[0].readAloud = 'BENİM YAZDIĞIM ANLATI'
    edited.quests[0].steps[0].backgroundId = 'my-art'
    edited.quests[0].steps.splice(1, 0, {
      ...edited.quests[0].steps[0],
      id: 'my-extra',
      title: 'Kendi molam',
    })
    const progress = {
      quest: 'son-ilac',
      steps: { 'son-ilac': 2 },
      done: ['ac-cocuk'],
      decisions: { 'son-ilac': 'Kişisel karar' },
    }
    localStorage.setItem('aruzahr-director-pack', JSON.stringify(edited))
    localStorage.setItem('aruzahr-director-progress', JSON.stringify(progress))
    localStorage.setItem('aruzahr-director-notes', 'BENİM ÖZEL DEFTERİM')
    const result = await ensureBuiltinCampaign()
    parseDMPack(result.pack)
    const second = await ensureBuiltinCampaign()
    return {
      result,
      second,
      notes: localStorage.getItem('aruzahr-director-notes'),
    }
  }, legacy)
  const q = result.result.pack.quests[0]
  expect(q.steps).toHaveLength(8)
  expect(q.steps.find((s: any) => s.id === 'son-ilac-1')).toMatchObject({
    readAloud: 'BENİM YAZDIĞIM ANLATI',
    backgroundId: 'my-art',
  })
  expect(q.steps.find((s: any) => s.id === 'son-ilac-2').readAloud).toBe(
    book.quests[0].steps.find((s: any) => s.id === 'son-ilac-2').readAloud,
  )
  expect(
    q.steps[q.steps.findIndex((s: any) => s.id === 'my-extra') - 1].id,
  ).toBe('son-ilac-1')
  expect(q.steps[result.result.progress.steps['son-ilac']].id).toBe(
    'son-ilac-2',
  )
  expect(result.result.progress.done).toContain('ac-cocuk')
  expect(result.result.progress.decisions['son-ilac']).toBe('Kişisel karar')
  expect(result.notes).toBe('BENİM ÖZEL DEFTERİM')
  expect(result.second.updated).toBe(false)
})

test('encounter and dialogue cards work; branches change reading without changing the audience', async ({
  page,
}) => {
  await bootStudio(page)
  await expect(page.getByTestId('studio-dm-reader')).toBeVisible()
  const phases = page.locator('.dm-step-tabs')
  const steps = book.quests[0].steps
  await phases
    .getByRole('button')
    .nth(steps.findIndex((s: any) => s.id === 'son-ilac-2') + 1)
    .click()
  const encounter = page.getByTestId('dm-encounter')
  await expect(encounter).toContainText('Galeri')
  await encounter
    .getByText('Turlar, düşmanlar ve çıkış yolları', { exact: true })
    .click()
  await expect(encounter.locator('.dm-enemy')).toContainText('9')
  await expect(encounter.locator('img')).toHaveAttribute(
    'src',
    /winter-galeri-kiskaci/,
  )
  await page.getByText('Karakterler ne söyler?', { exact: true }).click()
  await expect(page.locator('.dm-voices')).toContainText('Ekin')
  const before = await publicFrame(page)
  await phases.getByRole('button').nth(2).click()
  await page
    .getByText('Oyuncular başka bir yol seçtiyse', { exact: true })
    .click()
  const path = steps.find((s: any) => s.id === 'son-ilac-1').play.paths[0]
  await page.getByRole('button', { name: path.label, exact: true }).click()
  await expect(
    page.getByRole('heading', {
      name: steps.find((s: any) => s.id === path.to).title,
      exact: true,
    }),
  ).toBeVisible()
  expect((await publicFrame(page)).studio.takenAt).toBe(before.studio.takenAt)
})

test('new art loads at native dimensions and downloads include the first-session and encounter guides', async ({
  request,
}) => {
  const ids = [
    'ocak-gecesi',
    'kok-sarnici',
    'aldara-halati',
    'harven-kirec',
    'mavric-avkampi',
    'frostbay-cark',
    'borc-odasi',
    'firtina-yarigi',
    'ternhaven-buhar',
    'kul-tanigi',
    'ravel-dorr',
    'galeri-kiskaci',
  ]
  for (const [i, id] of ids.entries()) {
    const response = await request.get('/illustrations/winter-' + id + '.webp')
    expect(response.ok(), id).toBe(true)
    const m = await sharp(await response.body()).metadata()
    expect([m.width, m.height], id).toEqual(i < 10 ? [1672, 941] : [1086, 1448])
  }
  expect(await (await request.get('/dm/ILK-OTURUM.md')).text()).toContain(
    'üç oyuncu, 1. seviye',
  )
  const offline = await (
    await request.get('/dm/On-Kis-Karari-Oynatim-Kitabi.html')
  ).text()
  expect(offline).toContain('Galeri Kıskacı')
  expect(offline).toContain('Karakterler ne söyler?')
})

test('custom scene order and a full twelve-scene personal chapter survive expansion', async ({
  page,
}) => {
  await page.goto('/#/atlas')
  const result = await page.evaluate(
    async ({ old, fresh }) => {
      const { upgradeBuiltinCampaign } = await import(
        '/src/builtin-campaign.ts'
      )
      const { parseDMPack } = await import('/src/dm-guide.ts')
      const reordered = structuredClone(old)
      reordered.quests[0].steps.reverse()
      const order = reordered.quests[0].steps.map((s: any) => s.id)
      const changed = await upgradeBuiltinCampaign(
        parseDMPack(reordered),
        parseDMPack(fresh),
      )
      parseDMPack(changed)
      const full = structuredClone(old)
      const customIds = []
      for (let i = 0; i < 9; i++) {
        const id = 'personal-' + i
        customIds.push(id)
        full.quests[0].steps.push({ ...full.quests[0].steps[0], id })
      }
      const expanded = await upgradeBuiltinCampaign(
        parseDMPack(full),
        parseDMPack(fresh),
      )
      parseDMPack(expanded)
      return {
        order,
        changed: changed.quests[0].steps.map((s: any) => s.id),
        expanded: expanded.quests[0].steps.map((s: any) => s.id),
        customIds,
      }
    },
    { old: legacy, fresh: book },
  )
  expect(result.changed.slice(0, 3)).toEqual(result.order)
  expect(result.expanded).toHaveLength(16)
  for (const id of result.customIds) expect(result.expanded).toContain(id)
})

test('the creature is a selectable scene asset and Ravel is a named portrait without quest revelations in the wiki', async ({
  page,
}) => {
  await bootStudio(page)
  const { chooseScene, project, panel } = await import('./studio-fixtures')
  await chooseScene(page, 'winter-galeri-kiskaci', 'Galeri Kıskacı')
  await expect
    .poll(async () => (await project(page))?.draft.scene?.id)
    .toBe('winter-galeri-kiskaci')
  expect((await publicFrame(page)).scene.id).toBe('marhalden')
  await panel(page, 'Görsel')
  const library = page.getByTestId('broadcast-library')
  await library.getByRole('button', { name: /Karakterler/ }).click()
  await library.getByRole('searchbox').fill('Ravel Dorr')
  await expect(library.locator('[data-asset-id="ravel-dorr"]')).toHaveCount(1)
  await page.goto('/#/wiki/ravel-dorr')
  await expect(
    page.getByRole('heading', { name: 'Ravel Dorr', exact: true }),
  ).toBeVisible()
  await expect(page.locator('.hero-portrait-button img')).toHaveAttribute(
    'src',
    /winter-ravel-dorr/,
  )
  await expect(page.locator('body')).not.toContainText('üç canlı kök')
})
