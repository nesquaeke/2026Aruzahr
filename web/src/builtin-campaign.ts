import {
  parseDMPack,
  parseProgress,
  readPrivatePack,
  readSavedDMProgress,
  type DMPack,
  type DMProgress,
} from './dm-guide'
import { legacyWinter } from './campaigns/legacy-winter'
import { bridgePrevious } from './campaigns/bridge-previous'
import {
  expandedWinter,
  expandedWinterEdition,
} from './campaigns/expanded-winter'

const questIds = [
  'son-ilac',
  'koprunun-iki-tarafi',
  'ac-cocuk',
  'masum-canavar',
  'bir-kisi-bir-mahalle',
  'hainin-kizi',
  'son-kayik',
  'iyi-kalpli-nekromant',
  'kralin-yalani',
  'sizi-kurtaran-dusman',
]
const oldBackgrounds: Record<string, string> = {
  'son-ilac-2': 'winter-ilac',
  'ac-cocuk-2': 'winter-ekmek',
  'masum-canavar-1': 'winter-varkul',
  'bir-kisi-bir-mahalle-2': 'winter-uyku',
  'son-kayik-2': 'winter-kayik',
  'iyi-kalpli-nekromant-2': 'winter-bahce',
  'kralin-yalani-2': 'winter-ambar',
}

function isBuiltin(pack: DMPack) {
  return (
    pack.quests.length === questIds.length &&
    questIds.every((id) => pack.quests.some((q) => q.id === id))
  )
}

/** Fetch only from the operator workspace; live/atlas never calls this. */
export async function loadBuiltinCampaign(): Promise<DMPack> {
  const response = await fetch(
    new URL('dm/On-Kis-Karari-DM.json', document.baseURI),
    { cache: 'no-cache' },
  )
  if (!response.ok)
    throw new Error('Hazır hikâye yüklenemedi. Sayfayı yeniden aç.')
  return parseDMPack(await response.json())
}

/** Add presentation fields, never overwrite a DM's prose or decisions. */
export function enrichBuiltinCampaign(saved: DMPack, builtin: DMPack): DMPack {
  if (!isBuiltin(saved)) return saved
  return {
    ...saved,
    quests: saved.quests.map((q) => {
      const fresh = builtin.quests.find((f) => f.id === q.id)!
      const oldIntro = q.briefing
      const intro =
        oldIntro &&
        fresh.briefing &&
        !q.quick &&
        oldIntro.backgroundId === 'winter-marhalden'
          ? { ...oldIntro, backgroundId: fresh.briefing.backgroundId }
          : oldIntro || fresh.briefing
      return {
        ...q,
        quick: q.quick || fresh.quick,
        briefing: intro,
        steps:
          q.steps?.map((step) => {
            const next = fresh.steps?.find((s) => s.id === step.id)
            if (!next) return step
            return {
              ...step,
              quick: step.quick || next.quick,
              runbook: step.runbook || next.runbook,
              backgroundId:
                !step.quick && step.backgroundId === oldBackgrounds[step.id]
                  ? next.backgroundId
                  : step.backgroundId,
            }
          }) || fresh.steps,
      }
    }),
  }
}

const stable = (value: unknown): string =>
  JSON.stringify(
    value && typeof value === 'object'
      ? Array.isArray(value)
        ? value.map((v) => JSON.parse(stable(v)))
        : Object.fromEntries(
            Object.keys(value)
              .sort()
              .map((k) => [
                k,
                JSON.parse(stable((value as Record<string, unknown>)[k])),
              ]),
          )
      : value,
  )
async function fingerprint(value: unknown) {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(stable(value)),
  )
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('')
}
async function updateFields<T extends object>(
  saved: T,
  fresh: T,
  fingerprints: Record<string, string>[],
): Promise<T> {
  const result = { ...fresh, ...saved } as Record<string, unknown>
  await Promise.all(
    Object.entries(fresh).map(async ([key, value]) => {
      if (key === 'steps') return
      const oldValue = (saved as Record<string, unknown>)[key]
      const digest =
        oldValue === undefined ? undefined : await fingerprint(oldValue)
      if (
        oldValue === undefined ||
        fingerprints.some((fields) => fields[key] === digest)
      )
        result[key] = value
    }),
  )
  return result as T
}

/** Replace only known supplied fields; custom prose, art and added scenes survive. */
export async function upgradeBuiltinCampaign(
  saved: DMPack,
  builtin: DMPack,
): Promise<DMPack> {
  if (
    !isBuiltin(saved) ||
    !builtin.edition ||
    saved.edition === builtin.edition
  )
    return enrichBuiltinCampaign(saved, builtin)
  const quests = await Promise.all(
    saved.quests.map(async (q) => {
      const fresh = builtin.quests.find((f) => f.id === q.id)!
      const older = legacyWinter[q.id as keyof typeof legacyWinter]
      const expanded = expandedWinter[q.id as keyof typeof expandedWinter]
      const bridge = q.id === 'koprunun-iki-tarafi' ? bridgePrevious : undefined
      if (!older || !expanded) return q
      // The newer order includes the four added opening/rescue scenes too.
      const base =
        saved.edition === expandedWinterEdition ||
        q.steps?.some(
          (step) =>
            (expanded.order as readonly string[]).includes(step.id) &&
            !(older.order as readonly string[]).includes(step.id),
        )
          ? expanded
          : older
      const merged = await updateFields(q, fresh, [
        expanded.fields,
        older.fields,
        ...(bridge ? [bridge.fields] : []),
      ])
      const updated = await Promise.all(
        (q.steps || []).map(async (step) => {
          const next = fresh.steps?.find((f) => f.id === step.id)
          const fingerprints = [expanded.steps, older.steps, ...(bridge ? [bridge.steps] : [])]
            .map(
              (steps) =>
                (steps as Record<string, Record<string, string>>)[step.id],
            )
            .filter(Boolean)
          return next && fingerprints.length
            ? updateFields(step, next, fingerprints)
            : step
        }),
      )
      const byId = new Map(updated.map((s) => [s.id, s]))
      const oldIds = (q.steps || []).map((s) => s.id)
      const originalOrder = base.order.filter((id) => oldIds.includes(id))
      const keptOrder = oldIds.filter((id) =>
        (base.order as readonly string[]).includes(id),
      )
      if (JSON.stringify(originalOrder) === JSON.stringify(keptOrder)) {
        const steps = (fresh.steps || []).map((s) => byId.get(s.id) || s)
        // Personal additions retain their predecessor rather than disappearing.
        let predecessor: string | undefined
        for (const s of updated) {
          if (steps.some((n) => n.id === s.id)) {
            predecessor = s.id
            continue
          }
          const at = predecessor
            ? steps.findIndex((n) => n.id === predecessor) + 1
            : 0
          steps.splice(at, 0, s)
          predecessor = s.id
        }
        merged.steps = steps
      } else {
        // Preserve an intentionally reordered custom route; append new optional scenes.
        merged.steps = [
          ...updated,
          ...(fresh.steps || []).filter((s) => !byId.has(s.id)),
        ]
      }
      return merged
    }),
  )
  return { ...saved, edition: builtin.edition, quests }
}

export function remapCampaignProgress(
  progress: DMProgress,
  previous: DMPack,
  next: DMPack,
): DMProgress {
  const steps = { ...progress.steps }
  for (const q of previous.quests) {
    const id = q.steps?.[progress.steps[q.id] || 0]?.id
    const at = next.quests
      .find((n) => n.id === q.id)
      ?.steps?.findIndex((s) => s.id === id)
    if (at !== undefined && at >= 0) steps[q.id] = at
  }
  return parseProgress({ ...progress, steps }, next.quests)
}

export type BuiltinCampaignResult = {
  pack: DMPack
  progress: DMProgress
  installed: boolean
  updated: boolean
}

function localProgress(pack: DMPack): DMProgress {
  return localStorage.getItem('aruzahr-director-progress') === null &&
    pack.progress
    ? parseProgress(pack.progress, pack.quests)
    : readSavedDMProgress(pack.quests)
}

/** Call after restoring IndexedDB dmStorage. This function has no import side effects. */
export async function ensureBuiltinCampaign(): Promise<BuiltinCampaignResult> {
  const initial = readPrivatePack()
  if (initial && !isBuiltin(initial)) {
    return {
      pack: initial,
      progress: localProgress(initial),
      installed: false,
      updated: false,
    }
  }
  let builtin: DMPack
  try {
    builtin = await loadBuiltinCampaign()
  } catch (error) {
    const current = readPrivatePack()
    if (!current) throw error
    return {
      pack: current,
      progress: localProgress(current),
      installed: false,
      updated: false,
    }
  }
  // A user import or a second StrictMode initialization may have won while fetching.
  let current = readPrivatePack()
  let pack = current ? await upgradeBuiltinCampaign(current, builtin) : builtin
  // Fingerprinting is asynchronous too. Do not overwrite a concurrent import/edit.
  for (let attempt = 0; attempt < 3; attempt++) {
    const latest = readPrivatePack()
    if (JSON.stringify(latest) === JSON.stringify(current)) break
    current = latest
    pack = current ? await upgradeBuiltinCampaign(current, builtin) : builtin
  }
  const finalRead = readPrivatePack()
  if (JSON.stringify(finalRead) !== JSON.stringify(current))
    return {
      pack: finalRead || pack,
      progress: localProgress(finalRead || pack),
      installed: false,
      updated: false,
    }
  const rawProgress = localStorage.getItem('aruzahr-director-progress')
  const previousProgress = localProgress(current || pack)
  const progress = current
    ? remapCampaignProgress(previousProgress, current, pack)
    : previousProgress
  if (pack.progress && current)
    pack = {
      ...pack,
      progress: remapCampaignProgress(pack.progress, current, pack),
    }
  const installed = !current
  const updated = !current || JSON.stringify(current) !== JSON.stringify(pack)
  if (updated) {
    localStorage.setItem('aruzahr-director-pack', JSON.stringify(pack))
    // Existing free notes and progress remain byte-for-byte unless absent.
    if (
      rawProgress === null ||
      JSON.stringify(previousProgress) !== JSON.stringify(progress)
    )
      localStorage.setItem(
        'aruzahr-director-progress',
        JSON.stringify(progress),
      )
    if (localStorage.getItem('aruzahr-director-notes') === null)
      localStorage.setItem(
        'aruzahr-director-notes',
        pack.quests.find((q) => q.id === progress.quest)?.body ||
          pack.quests[0]?.body ||
          '',
      )
    window.dispatchEvent(new Event('studio-dm-change'))
  }
  return { pack, progress, installed, updated }
}
