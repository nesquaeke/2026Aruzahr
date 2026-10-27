import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { bootStudio, publicFrame } from './studio-fixtures'
import { characters } from '../src/lore/characters'
import { artworkFor, portraitFor } from '../src/media'
import { abilities, characterAbilities } from '../src/character-abilities'
import { powerFor } from '../src/character-card-profiles'
import { articleById, locationById } from '../src/data'
import sharp from 'sharp'
const pack = JSON.parse(
  await readFile('public/dm/On-Kis-Karari-DM.json', 'utf8'),
)
const previous = JSON.parse(
  await readFile('tests/fixtures/winter-expanded.json', 'utf8'),
)
const people = [
  'eren-keld',
  'ekin-sar',
  'kesra-venn',
  'haldor-pell',
  'veyra-senn',
  'orsa-dren',
  'dalen-marr',
  'ressa-korr',
]

test('all optional events have playable actions, choices, valid cast and return anchors; public biographies keep outcomes private', () => {
  expect(pack.quests.flatMap((q: any) => q.steps)).toHaveLength(61)
  expect(pack.quests.flatMap((q: any) => q.events || [])).toHaveLength(10)
  expect(pack.quests.every((q: any) => q.events?.length === 1)).toBe(true)
  const ids = new Set<string>()
  for (const q of pack.quests) {
    expect(q.dossiers.length).toBeGreaterThanOrEqual(2)
    for (const e of q.events) {
      expect(ids.has(e.id)).toBe(false)
      ids.add(e.id)
      expect(q.steps.some((s: any) => s.id === e.at)).toBe(true)
      expect(
        pack.quests
          .find((q: any) => q.id === e.followup.questId)
          ?.steps.some((s: any) => s.id === e.followup.sceneId),
      ).toBe(true)
      expect(e.readAloud.length).toBeGreaterThan(100)
      expect(e.beats.length).toBeGreaterThanOrEqual(3)
      expect(e.choices).toHaveLength(3)
      expect(artworkFor(e.backgroundId)).toBeDefined()
      for (const id of e.castIds) expect(portraitFor(id), id).toBeDefined()
      const wiki = JSON.stringify(q.dossiers.map((d: any) => articleById(d.id)))
      expect(wiki).not.toContain(e.readAloud)
      for (const c of e.choices) {
        expect(c.result.length).toBeGreaterThan(50)
        expect(c.echo.length).toBeGreaterThan(30)
        expect(wiki).not.toContain(c.result)
      }
    }
  }
  expect(characters).toHaveLength(182)
  for (const id of people) {
    const c = characters.filter((c) => c.id === id)
    expect(c, id).toHaveLength(1)
    expect(locationById(c[0].city), id).toBeDefined()
    expect(portraitFor(c[0].portrait)?.id, id).toBe('living-' + id)
    expect(characterAbilities[id], id).toHaveLength(abilities.length)
    expect(characterAbilities[id].every((n) => n >= 3 && n <= 20)).toBe(true)
    expect(powerFor(id), id).toBe(
      id === 'orsa-dren' ? 'distinguished' : 'ordinary',
    )
  }
})

test('side event parsing rejects broken links and duplicate identities; local progress validates choices, notes and pinned people', async ({
  page,
}) => {
  await page.goto('/#/wiki')
  const result = await page.evaluate(async (raw) => {
    const { parseDMPack, parseProgress } = await import('/src/dm-guide.ts')
    const checked = parseDMPack(raw),
      rejected = []
    for (const mutation of [
      'at',
      'followup',
      'duplicate',
      'choice',
      'dossier',
    ]) {
      const b = structuredClone(raw)
      if (mutation === 'at') b.quests[0].events[0].at = 'no-such-scene'
      if (mutation === 'followup')
        b.quests[0].events[0].followup.sceneId = 'missing'
      if (mutation === 'duplicate')
        b.quests[1].events[0].id = b.quests[0].events[0].id
      if (mutation === 'choice')
        b.quests[0].events[0].choices.push(b.quests[0].events[0].choices[0])
      if (mutation === 'dossier')
        b.quests[0].dossiers.push(b.quests[0].dossiers[0])
      try {
        parseDMPack(b)
      } catch {
        rejected.push(mutation)
      }
    }
    const e = checked.quests[0].events![0],
      id = checked.quests[0].dossiers![0].id
    const good = parseProgress(
      {
        eventChoices: { [e.id]: e.choices[0].id, unknown: 'private' },
        eventNotes: { [e.id]: 'LOCAL NOTE', unknown: 'NO' },
        pinnedPeople: [id, id, 'not-known'],
      },
      checked.quests,
    )
    const bad = parseProgress(
      {
        eventChoices: { [e.id]: 'not-choice' },
        eventNotes: { [e.id]: 'x'.repeat(10001) },
      },
      checked.quests,
    )
    return {
      rejected,
      good,
      bad,
      event: e.id,
      person: id,
      choice: e.choices[0].id,
    }
  }, pack)
  expect(result.rejected).toEqual([
    'at',
    'followup',
    'duplicate',
    'choice',
    'dossier',
  ])
  expect(result.good.eventChoices).toEqual({ [result.event]: result.choice })
  expect(result.good.eventNotes).toEqual({ [result.event]: 'LOCAL NOTE' })
  expect(result.good.pinnedPeople).toEqual([result.person])
  expect(result.bad.eventChoices).toEqual({})
  expect(result.bad.eventNotes).toEqual({})
})

async function story(page: any) {
  await bootStudio(page)
  await expect(page.getByTestId('studio-dm-reader')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Giriş manzarasını hazırla', exact: true })).toBeEnabled()
}
async function openEvent(page: any, qi = 0) {
  const q = pack.quests[qi],
    e = q.events[0]
  await page
    .getByRole('navigation', { name: 'Görev yol haritası' })
    .getByRole('button')
    .nth(qi)
    .click()
  await page
    .locator('.dm-step-tabs')
    .getByRole('button')
    .nth(q.steps.findIndex((s: any) => s.id === e.at) + 1)
    .click()
  const panel = page.getByTestId('journey-event')
  await panel.locator(':scope > summary').click()
  await expect(panel.locator('.journey-event-speech')).toHaveText(e.readAloud)
  return { q, e, panel }
}

test('event decisions and notes persist without changing the broadcast; echoes appear only after the recorded decision', async ({
  page,
}) => {
  await story(page)
  const { e, panel } = await openEvent(page)
  const before = await publicFrame(page)
  await panel
    .getByRole('button', { name: e.choices[0].label, exact: true })
    .click()
  await panel.getByText('Bu olaya özel not ekle', { exact: true }).click()
  await panel
    .getByRole('textbox', { name: e.title + ' DM notu' })
    .fill('ÖZEL: Halatı Orsa’ya verecekler.')
  expect((await publicFrame(page)).studio.takenAt).toBe(before.studio.takenAt)
  await page.reload()
  await expect(page.getByTestId('studio-dm-reader')).toBeVisible()
  const reloaded = page.getByTestId('journey-event')
  await reloaded.locator(':scope > summary').click()
  await expect(
    reloaded.getByRole('button', { name: e.choices[0].label, exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await reloaded.locator('.journey-event-note > summary').click()
  await expect(reloaded.getByRole('textbox')).toHaveValue(
    'ÖZEL: Halatı Orsa’ya verecekler.',
  )
  await page
    .getByRole('navigation', { name: 'Görev yol haritası' })
    .getByRole('button')
    .nth(pack.quests.findIndex((q: any) => q.id === e.followup.questId))
    .click()
  const target = pack.quests.find((q: any) => q.id === e.followup.questId)
  await page
    .locator('.dm-step-tabs')
    .getByRole('button')
    .nth(target.steps.findIndex((s: any) => s.id === e.followup.sceneId) + 1)
    .click()
  const memory = page.getByTestId('journey-memory')
  await expect(memory).toHaveCount(1)
  await memory.locator('summary').click()
  await expect(memory).toContainText(e.choices[0].echo)
  await expect(memory).not.toContainText(e.choices[1].echo)
  expect(JSON.stringify(await publicFrame(page))).not.toContain('ÖZEL:')
})

test('a named dossier can stay at hand across chapters; summary download includes only local decisions and notes', async ({
  page,
}) => {
  await story(page)
  const { e, panel } = await openEvent(page)
  await panel
    .getByRole('button', { name: e.choices[1].label, exact: true })
    .click()
  const peoplePanel = page.getByTestId('journey-people')
  const person =
    pack.quests[0].dossiers.find((p: any) =>
      e.castIds.includes(p.portraitId || p.id),
    ) || pack.quests[0].dossiers[0]
  const button = peoplePanel.getByRole('button', {
    name: person.name + ' ' + person.role,
    exact: true,
  })
  if (!(await button.isVisible()))
    await peoplePanel.locator('.journey-other-people > summary').click()
  await button.click()
  await expect(page.getByTestId('journey-person-dossier')).toContainText(
    person.knows,
  )
  await peoplePanel
    .getByRole('button', {
      name: 'Diğer bölümlerde de el altında tut',
      exact: true,
    })
    .click()
  await page
    .getByRole('navigation', { name: 'Görev yol haritası' })
    .getByRole('button')
    .nth(1)
    .click()
  await expect(page.getByTestId('journey-people')).toContainText(person.name)
  const pending = page.waitForEvent('download')
  await page
    .getByRole('button', { name: 'Özel oturum özetini indir', exact: true })
    .click()
  const file = await pending
  expect(file.suggestedFilename()).toBe('Aruzahr-Ozel-DM-Oturum-Ozeti.md')
  const text = await readFile((await file.path())!, 'utf8')
  expect(text).toContain(e.choices[1].label)
  expect(text).toContain(e.choices[1].echo)
  expect(text).toContain(person.name)
  expect(text).not.toContain(e.choices[0].result)
})

test('only the event illustration and its named portraits are shown; private dossier and choices remain off the audience frame', async ({
  page,
  browser,
}) => {
  await story(page)
  const { e, panel } = await openEvent(page)
  const audience = await browser.newContext(),
    live = await audience.newPage()
  await live.goto('/#/broadcast/live')
  await panel
    .getByRole('button', { name: e.choices[2].label, exact: true })
    .click()
  await panel
    .getByRole('button', { name: 'Olayın görselini göster', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).scene?.id)
    .toBe(e.backgroundId)
  const state = await publicFrame(page),
    wire = JSON.stringify(state)
  expect(state.title).toBe(artworkFor(e.backgroundId)?.title)
  expect(state.actors).toHaveLength(e.castIds.length)
  for (const text of [
    e.hook,
    e.readAloud,
    e.choices[2].result,
    e.choices[2].echo,
    pack.quests[0].dossiers[0].knows,
  ])
    expect(wire).not.toContain(text)
  await expect(
    live.locator('.studio-output > .broadcast-stage .broadcast-stage-heading'),
  ).toContainText(state.title)
  await page.setViewportSize({ width: 390, height: 844 })
  await panel.scrollIntoViewIfNeeded()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  )
  await audience.close()
})

test('existing expanded saves gain the new guide while custom prose, portraits, scene order and personal notes remain', async ({
  page,
}) => {
  await page.goto('/#/wiki')
  const result = await page.evaluate(
    async ({ old, fresh }) => {
      const { upgradeBuiltinCampaign, remapCampaignProgress } = await import(
        '/src/builtin-campaign.ts'
      )
      const { parseDMPack, parseProgress } = await import('/src/dm-guide.ts')
      const source = structuredClone(old)
      source.quests[0].steps[1].readAloud = 'MY OWN SCENE'
      source.quests[0].steps[1].backgroundId = 'user-photo'
      source.quests[0].steps.reverse()
      const order = source.quests[0].steps.map((s: any) => s.id)
      const expanded = await upgradeBuiltinCampaign(
        parseDMPack(source),
        parseDMPack(fresh),
      )
      parseDMPack(expanded)
      const progress = remapCampaignProgress(
        parseProgress(
          {
            quest: 'son-ilac',
            steps: { 'son-ilac': 2 },
            decisions: { 'son-ilac': 'MY DECISION' },
          },
          source.quests,
        ),
        parseDMPack(source),
        expanded,
      )
      return { expanded, progress, order, oldId: source.quests[0].steps[2].id }
    },
    { old: previous, fresh: pack },
  )
  const q = result.expanded.quests[0]
  expect(q.steps.map((s: any) => s.id)).toEqual(result.order)
  expect(q.events).toHaveLength(1)
  expect(q.dossiers.length).toBeGreaterThan(1)
  expect(q.steps.find((s: any) => s.id === 'son-ilac-1')).toMatchObject({
    readAloud: 'MY OWN SCENE',
    backgroundId: 'user-photo',
  })
  expect(q.steps.find((s: any) => s.id === 'son-ilac-2').portraitIds).toEqual([
    'ekin-sar',
  ])
  expect(q.steps[result.progress.steps['son-ilac']].id).toBe(result.oldId)
  expect(result.progress.decisions['son-ilac']).toBe('MY DECISION')
})

test('all twelve new paintings are independent native-size files and download books include events and dossiers', async ({
  request,
}) => {
  const ids = [
    ...people,
    ...['isci-sofrasi', 'gecit-siginagi', 'frostbay-pazar', 'ternhaven-savak'],
  ]
  const hashes = new Set<string>()
  const { createHash } = await import('node:crypto')
  for (const [i, id] of ids.entries()) {
    const r = await request.get('/illustrations/living-' + id + '.webp')
    expect(r.ok(), id).toBe(true)
    const data = await r.body(),
      m = await sharp(data).metadata()
    hashes.add(createHash('sha256').update(data).digest('hex'))
    expect(m.width, id).toBeGreaterThanOrEqual(i < 8 ? 1000 : 1600)
    expect(m.height, id).toBeGreaterThanOrEqual(i < 8 ? 1400 : 900)
  }
  expect(hashes.size).toBe(12)
  const book = await (
    await request.get('/dm/On-Kis-Karari-Oynatim-Kitabi.html')
  ).text()
  expect(book).toContain(pack.quests[0].events[0].title)
  expect(book).toContain(pack.quests[0].dossiers[0].knows)
  const guide = await (await request.get('/dm/ILK-OTURUM.md')).text()
  expect(guide).toContain(pack.quests[0].events[0].title)
})
