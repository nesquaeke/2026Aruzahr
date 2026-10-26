import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const book = JSON.parse(
  await readFile('public/dm/On-Kis-Karari-DM.json', 'utf8'),
)

test('merging two living campaigns keeps twenty distinct optional events and independent decisions, notes and links', async ({
  page,
}) => {
  await page.goto('/#/atlas')
  const result = await page.evaluate(async (raw) => {
    const { newProject, mergeProjects, sceneCard, validateProject } =
      await import('/src/studio/model.ts')
    const { parseDMPack, parseProgress } = await import('/src/dm-guide.ts')
    const a = newProject(),
      b = newProject()
    const aBook = parseDMPack(structuredClone(raw)),
      bBook = parseDMPack(structuredClone(raw))
    aBook.title = 'Mevcut özel yolculuk'
    bBook.title = 'İçe alınan özel yolculuk'
    const progress = (prefix: string, second: boolean) =>
      parseProgress(
        {
          quest: raw.quests[second ? 3 : 2].id,
          steps: { [raw.quests[0].id]: second ? 4 : 3 },
          done: [raw.quests[second ? 0 : 1].id],
          decisions: { [raw.quests[0].id]: prefix + ' bölüm kararı' },
          skipped: [raw.quests[0].steps[2].id],
          eventChoices: Object.fromEntries(
            raw.quests.flatMap((q: any) =>
              q.events.map((e: any) => [e.id, e.choices[second ? 1 : 0].id]),
            ),
          ),
          eventNotes: Object.fromEntries(
            raw.quests.flatMap((q: any) =>
              q.events.map((e: any) => [e.id, prefix + ' notu: ' + e.id]),
            ),
          ),
          pinnedPeople: second
            ? [raw.quests[0].dossiers[0].id, raw.quests[1].dossiers[0].id]
            : raw.quests[0].dossiers.map((d: any) => d.id),
        },
        raw.quests,
      )
    const ap = progress('A', false),
      bp = progress('B', true)
    aBook.progress = ap
    bBook.progress = bp
    a.dmStorage = {
      'aruzahr-director-pack': JSON.stringify(aBook),
      'aruzahr-director-progress': JSON.stringify(ap),
      'aruzahr-director-notes': 'A serbest defter',
    }
    b.dmStorage = {
      'aruzahr-director-pack': JSON.stringify(bBook),
      'aruzahr-director-progress': JSON.stringify(bp),
      'aruzahr-director-notes': 'B serbest defter',
    }
    const firstQ = bBook.quests[0],
      firstEvent = firstQ.events![0]
    const sideSceneId = 'dm:' + firstQ.id + ':journey-event:' + firstEvent.id
    const sideScene = sceneCard(b.draft, 'Olay manzarası')
    sideScene.id = sideSceneId
    b.scenes = [sideScene]
    b.facts = [
      {
        id: 'incoming-fact',
        label: 'Taşınan karar',
        value: 'B notu',
        enabled: true,
        questIds: [firstQ.id],
        sceneIds: [sideSceneId],
      },
    ]
    b.journal = [
      {
        id: 'incoming-entry',
        at: 1,
        kind: 'event',
        text: 'B olay kaydı',
        publicText: '',
        sceneId: sideSceneId,
      },
    ]
    const merged = validateProject(mergeProjects(a, b))
    const pack = parseDMPack(
      JSON.parse(merged.dmStorage['aruzahr-director-pack']),
    )
    const saved = parseProgress(
      JSON.parse(merged.dmStorage['aruzahr-director-progress']),
      pack.quests,
    )
    return {
      pack,
      saved,
      ap,
      bp,
      notes: merged.dmStorage['aruzahr-director-notes'],
      scenes: merged.scenes.map((s) => s.id),
      fact: merged.facts[0],
      journal: merged.journal,
    }
  }, book)
  const { pack, saved, ap, bp } = result
  expect(pack.title).toBe('Mevcut özel yolculuk')
  expect(pack.quests).toHaveLength(20)
  const events = pack.quests.flatMap((q: any) => q.events)
  expect(events).toHaveLength(20)
  expect(new Set(events.map((e: any) => e.id)).size).toBe(20)
  expect(saved.quest).toBe(ap.quest)
  expect(pack.progress).toEqual(saved)
  expect(Object.keys(saved.eventChoices)).toHaveLength(20)
  expect(Object.keys(saved.eventNotes)).toHaveLength(20)
  expect(result.notes).toBe('A serbest defter')
  expect(
    result.journal.some((j: any) => j.text.includes('B serbest defter')),
  ).toBe(true)
  expect(saved.pinnedPeople.sort()).toEqual(
    [...new Set([...ap.pinnedPeople, ...bp.pinnedPeople])].sort(),
  )
  for (const [i, original] of book.quests.entries()) {
    const old = pack.quests[i],
      incoming = pack.quests[i + 10]
    expect(old.id).toBe(original.id)
    expect(incoming.id).not.toBe(original.id)
    expect(saved.steps[old.id]).toBe(ap.steps[old.id])
    expect(saved.steps[incoming.id]).toBe(bp.steps[original.id])
    expect(incoming.dossiers.map((d: any) => d.id)).toEqual(
      original.dossiers.map((d: any) => d.id),
    )
    for (const [ei, event] of original.events.entries()) {
      const aEvent = old.events[ei],
        bEvent = incoming.events[ei]
      expect(aEvent.id).toBe(event.id)
      expect(bEvent.id).toMatch(/^event-[a-zA-Z0-9_-]+$/)
      expect(saved.eventChoices[aEvent.id]).toBe(event.choices[0].id)
      expect(saved.eventChoices[bEvent.id]).toBe(event.choices[1].id)
      expect(saved.eventNotes[aEvent.id]).toBe('A notu: ' + event.id)
      expect(saved.eventNotes[bEvent.id]).toBe('B notu: ' + event.id)
      const at = original.steps.findIndex((s: any) => s.id === event.at)
      expect(bEvent.at).toBe(incoming.steps[at].id)
      const targetIndex = book.quests.findIndex(
        (q: any) => q.id === event.followup.questId,
      )
      const targetSceneIndex = book.quests[targetIndex].steps.findIndex(
        (s: any) => s.id === event.followup.sceneId,
      )
      expect(bEvent.followup.questId).toBe(pack.quests[targetIndex + 10].id)
      expect(bEvent.followup.sceneId).toBe(
        pack.quests[targetIndex + 10].steps[targetSceneIndex].id,
      )
    }
    for (const [si, step] of original.steps.entries()) {
      for (const [pi, path] of (step.play?.paths || []).entries()) {
        const target = original.steps.findIndex((s: any) => s.id === path.to)
        expect(incoming.steps[si].play.paths[pi].to).toBe(
          incoming.steps[target].id,
        )
      }
    }
  }
  expect(saved.decisions[pack.quests[0].id]).toBe('A bölüm kararı')
  expect(saved.decisions[pack.quests[10].id]).toBe('B bölüm kararı')
  expect(saved.done).toContain(pack.quests[1].id)
  expect(saved.done).toContain(pack.quests[10].id)
  expect(saved.skipped).toContain(pack.quests[0].steps[2].id)
  expect(saved.skipped).toContain(pack.quests[10].steps[2].id)
  const mappedSideScene =
    'dm:' +
    pack.quests[10].id +
    ':journey-event:' +
    pack.quests[10].events[0].id
  expect(result.scenes).toEqual([mappedSideScene])
  expect(result.fact.questIds).toEqual([pack.quests[10].id])
  expect(result.fact.sceneIds).toEqual([mappedSideScene])
  expect(
    result.journal.find((j: any) => j.text === 'B olay kaydı').sceneId,
  ).toBe(mappedSideScene)
})

test('embedded-only living progress merges without dropping event notes or overwriting the current selection', async ({
  page,
}) => {
  await page.goto('/#/atlas')
  const result = await page.evaluate(async (raw) => {
    const { newProject, mergeProjects } = await import('/src/studio/model.ts')
    const { parseDMPack, parseProgress } = await import('/src/dm-guide.ts')
    const a = newProject(),
      b = newProject(),
      first = raw.quests[0].events[0]
    const p = (prefix: string, index: number) =>
      parseProgress(
        {
          quest: raw.quests[index].id,
          eventChoices: { [first.id]: first.choices[index].id },
          eventNotes: { [first.id]: prefix + ' embedded not' },
          pinnedPeople: [raw.quests[0].dossiers[index].id],
        },
        raw.quests,
      )
    a.dmStorage = {
      'aruzahr-director-pack': JSON.stringify({ ...raw, progress: p('A', 0) }),
    }
    b.dmStorage = {
      'aruzahr-director-pack': JSON.stringify({ ...raw, progress: p('B', 1) }),
    }
    const merged = mergeProjects(a, b),
      pack = parseDMPack(JSON.parse(merged.dmStorage['aruzahr-director-pack']))
    return {
      pack,
      saved: JSON.parse(merged.dmStorage['aruzahr-director-progress']),
    }
  }, book)
  const oldEvent = result.pack.quests[0].events[0],
    newEvent = result.pack.quests[10].events[0]
  expect(result.saved.quest).toBe(book.quests[0].id)
  expect(result.saved.eventNotes[oldEvent.id]).toBe('A embedded not')
  expect(result.saved.eventNotes[newEvent.id]).toBe('B embedded not')
  expect(result.pack.progress).toEqual(result.saved)
  expect(result.saved.pinnedPeople).toHaveLength(2)
})
