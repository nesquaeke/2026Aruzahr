import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import {
  parseNightEncounters,
  chooseNightEncounter,
} from '../src/night-encounters'
import { parseNightProgress } from '../src/dm-guide'
import { mergeNightProgress } from '../src/studio/night-progress'
import { artworkFor } from '../src/media'
import { bootStudio, publicFrame } from './studio-fixtures'

const source = JSON.parse(
  await readFile('public/dm/Night-Road-Encounters.json', 'utf8'),
)

test('night book covers every die face with playable, illustrated cards and bounded combat plans', async () => {
  const cards = parseNightEncounters(source)
  expect(cards).toHaveLength(12)
  expect(cards.filter((c) => c.combat).length).toBeGreaterThanOrEqual(4)
  for (let face = 1; face <= 12; face++) {
    const card = chooseNightEncounter(cards, face, 'all')!
    expect(card, String(face)).toBeDefined()
    expect(card.readAloud.length).toBeGreaterThan(100)
    expect(card.dmTruth.length).toBeGreaterThan(100)
    expect(card.clues.some((c) => c.dc === 0)).toBe(true)
    expect(card.choices.length).toBeGreaterThanOrEqual(2)
    expect(card.obstacle.rounds.length).toBeGreaterThanOrEqual(3)
    expect(artworkFor(card.portraitId)).toBeDefined()
    await expect(
      readFile('public' + artworkFor(card.portraitId)!.src),
    ).resolves.toBeDefined()
    for (const trigger of ['camp', 'travel', 'trespass'] as const)
      expect(chooseNightEncounter(cards, face, trigger)?.id).toBe(
        card.triggers.includes(trigger) ? card.id : undefined,
      )
    if (card.combat) {
      expect(card.combat.telegraph.length).toBeGreaterThan(50)
      expect(card.combat.escape.length).toBeGreaterThan(40)
      expect(card.combat.morale.length).toBeGreaterThan(30)
      expect(
        card.combat.combatants.reduce((n, c) => n + c.count, 0),
      ).toBeLessThanOrEqual(2)
      for (const enemy of card.combat.combatants) {
        if (!enemy.portraitId) continue
        const art = artworkFor(enemy.portraitId)
        expect(art, enemy.name).toBeDefined()
        await expect(readFile('public' + art!.src)).resolves.toBeDefined()
      }
    }
  }
})

test('night book rejects overlapping rolls, missing cards and invalid combat values', () => {
  for (const modify of [
    (s: any) => {
      s.cards.pop()
    },
    (s: any) => {
      s.cards[1].die = { ...s.cards[0].die }
    },
    (s: any) => {
      s.cards[1].id = s.cards[0].id
    },
    (s: any) => {
      s.cards[0].triggers = ['unknown']
    },
    (s: any) => {
      s.cards.find((c: any) => c.combat).combat.combatants[0].hp = Infinity
    },
    (s: any) => {
      s.cards.find((c: any) => c.combat).combat.combatants[0].count = 100
    },
  ]) {
    const changed = structuredClone(source)
    modify(changed)
    expect(() => parseNightEncounters(changed)).toThrow()
  }
})

test('private night progress roundtrips and merge preserves conflicting notes, decisions and discovered clues', () => {
  const first = parseNightProgress({
    selected: 'ulvenin-evi',
    trigger: 'travel',
    roll: 1,
    notes: { 'ulvenin-evi': 'LOCAL SECRET' },
    choices: { 'ulvenin-evi': 'listen' },
    revealed: { 'ulvenin-evi': [0, 1, 1, 99, 'bad'] },
  })
  expect(first.revealed['ulvenin-evi']).toEqual([0, 1])
  const merged = mergeNightProgress(
    first,
    parseNightProgress({
      selected: 'yuzsuz-rehber',
      trigger: 'camp',
      notes: { 'ulvenin-evi': 'OTHER SECRET' },
      choices: { 'ulvenin-evi': 'leave' },
      revealed: { 'ulvenin-evi': [2] },
    }),
  )!
  expect(merged.selected).toBe('ulvenin-evi')
  expect(merged.notes['ulvenin-evi']).toContain('LOCAL SECRET')
  expect(merged.notes['ulvenin-evi']).toContain('OTHER SECRET')
  expect(merged.notes['ulvenin-evi']).toContain('leave')
  expect(merged.revealed['ulvenin-evi']).toEqual([0, 1, 2])
  expect(parseNightProgress(JSON.parse(JSON.stringify(merged)))).toEqual(merged)
  expect(
    parseNightProgress({
      selected: '<script>',
      trigger: 'unknown',
      roll: 13,
      notes: { safe: 'x'.repeat(10001) },
      revealed: { bad: [-1, 99] },
    }),
  ).toEqual({
    selected: '',
    trigger: 'all',
    notes: {},
    choices: {},
    revealed: { bad: [] },
  })
})

test('operator can find an encounter by person or place, reveal clues and retain private notes without changing the live frame', async ({
  page,
}) => {
  await bootStudio(page)
  const portraits = await page.evaluate(async () => {
    const path = '/src/BroadcastLibrary.tsx'
    const { broadcastAssets } = await import(path)
    return broadcastAssets
      .filter((a: any) => a.kind === 'portrait')
      .map((a: any) => a.id)
  })
  for (const c of source.cards) expect(portraits).toContain(c.portraitId)
  const deck = page.getByTestId('night-deck')
  await deck.locator(':scope > summary').click()
  const search = deck.getByRole('searchbox', {
    name: 'Karşılaşma kişisi, yaratık veya yer ara',
  })
  await search.fill('Ulven')
  await expect(deck.locator('[data-night-id]')).toHaveCount(1)
  await deck.locator('[data-night-id="ulvenin-evi"]').click()
  const card = source.cards.find((c: any) => c.id === 'ulvenin-evi')
  const before = await publicFrame(page)
  await expect(deck.locator('.night-read blockquote')).toHaveText(
    card.readAloud,
  )
  const clueIndex = card.clues.findIndex((c: any) => c.dc > 0)
  const clue = deck.getByTestId('night-clue').nth(clueIndex)
  await clue
    .getByRole('spinbutton', {
      name: card.clues[clueIndex].skill + ' toplamı ' + clueIndex,
    })
    .fill('30')
  await clue.getByRole('button', { name: 'Sonucu uygula' }).click()
  await expect(clue).toContainText('BİLGİ AÇIK')
  await deck
    .getByRole('textbox', { name: card.title + ' özel notu' })
    .fill('NIGHT LOCAL SECRET: kapıyı işaretlediler.')
  await deck.locator('.night-choices > summary').click()
  await deck
    .getByRole('button', { name: card.choices[0].label, exact: true })
    .click()
  await expect
    .poll(async () =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem('aruzahr-director-progress') || '{}')
            .night?.notes['ulvenin-evi'],
      ),
    )
    .toContain('NIGHT LOCAL SECRET')
  const frame = await publicFrame(page)
  expect(frame.studio.takenAt).toBe(before.studio.takenAt)
  expect(JSON.stringify(frame)).not.toContain('NIGHT LOCAL SECRET')
  expect(JSON.stringify(frame)).not.toContain(card.dmTruth)
  await page.reload()
  await expect(page.getByTestId('studio-take')).toBeEnabled()
  await page.getByTestId('night-deck').locator(':scope > summary').click()
  await expect(
    page
      .getByTestId('night-deck')
      .getByRole('textbox', { name: card.title + ' özel notu' }),
  ).toHaveValue('NIGHT LOCAL SECRET: kapıyı işaretlediler.')
  await expect(page.getByTestId('night-clue').nth(clueIndex)).toContainText(
    'BİLGİ AÇIK',
  )
  await page
    .getByTestId('night-deck')
    .getByRole('button', { name: 'Yalnız pusu ve canavar', exact: true })
    .click()
  await expect(
    page.getByTestId('night-deck').locator('[data-night-id]'),
  ).toHaveCount(source.cards.filter((c: any) => c.combat).length)
  await page
    .getByTestId('night-deck')
    .getByRole('button', { name: 'Portreyi göster', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).actors?.[0]?.name)
    .toBe(card.visibleName)
  const shown = await publicFrame(page)
  expect(shown.scene.id).toBe(before.scene.id)
  expect(JSON.stringify(shown)).not.toContain(card.dmTruth)
  expect(JSON.stringify(shown)).not.toContain(card.readAloud)
  expect(JSON.stringify(shown)).not.toContain('NIGHT LOCAL SECRET')
  await page
    .getByTestId('night-deck')
    .getByRole('button', { name: 'Mekânı göster', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).scene?.id)
    .toBe('night-house')
  await page
    .getByTestId('night-deck')
    .getByRole('searchbox', {
      name: 'Karşılaşma kişisi, yaratık veya yer ara',
    })
    .fill('Vek Ardan')
  await expect(
    page.getByTestId('night-deck').locator('[data-night-id]'),
  ).toHaveCount(1)
  await page
    .getByTestId('night-deck')
    .locator('[data-night-id="dorduncu-nefes"]')
    .click()
  await page
    .getByTestId('night-deck')
    .getByRole('button', { name: 'Vek Ardan portresini göster', exact: true })
    .click()
  await expect
    .poll(async () => (await publicFrame(page)).actors?.[0]?.name)
    .toContain('Vek Ardan')
  expect(JSON.stringify(await publicFrame(page))).not.toContain(
    source.cards.find((c: any) => c.id === 'dorduncu-nefes').dmTruth,
  )
})

test('a quiet die face clears the previous card without rerolling or publishing the private roll', async ({
  page,
}) => {
  await bootStudio(page)
  const deck = page.getByTestId('night-deck')
  await deck.locator(':scope > summary').click()
  await deck
    .getByRole('combobox', { name: 'Gece kartı koşulu' })
    .selectOption('camp')
  await deck.locator('[data-night-id="bos-yatagin-konugu"]').click()
  await expect(deck.getByTestId('night-card')).toBeVisible()
  const first = source.cards.find((c: any) => c.die.min === 1)
  expect(first.triggers).not.toContain('camp')
  await page.evaluate(() => {
    const original = crypto.getRandomValues.bind(crypto)
    ;(window as any).__nightRandomCalls = 0
    crypto.getRandomValues = ((array: any) => {
      if (array instanceof Uint32Array && array.length === 1) {
        ;(window as any).__nightRandomCalls++
        array[0] = 0
        return array
      }
      return original(array)
    }) as Crypto['getRandomValues']
  })
  const before = await publicFrame(page)
  await deck.getByTestId('night-draw').click()
  await expect(deck.getByRole('status')).toContainText('Sakin geçiş')
  await expect(deck.getByTestId('night-card')).toHaveCount(0)
  expect(await page.evaluate(() => (window as any).__nightRandomCalls)).toBe(1)
  const frame = await publicFrame(page)
  expect(frame.studio.takenAt).toBe(before.studio.takenAt)
  expect(frame.studio.roll?.label).not.toBe('Yol karşılaşması')
})

test('live and phone pages do not fetch the private night book', async ({
  page,
}) => {
  const books: string[] = []
  page.on('request', (r) => {
    if (r.url().includes('Night-Road-Encounters.json')) books.push(r.url())
  })
  await page.goto('/#/broadcast/live')
  await expect(page.getByTestId('broadcast-live')).toBeVisible()
  await page.goto('/#/broadcast/remote')
  await expect(
    page.getByRole('heading', { name: 'Hikâyeyi yönet' }),
  ).toBeVisible()
  expect(books).toEqual([])
})
