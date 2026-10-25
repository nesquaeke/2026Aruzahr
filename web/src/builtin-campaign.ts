import {
  parseDMPack,
  parseProgress,
  readPrivatePack,
  readSavedDMProgress,
  type DMPack,
  type DMProgress,
} from './dm-guide'

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
  const current = readPrivatePack()
  const pack = current ? enrichBuiltinCampaign(current, builtin) : builtin
  const rawProgress = localStorage.getItem('aruzahr-director-progress')
  const progress = localProgress(pack)
  const installed = !current
  const updated = !current || JSON.stringify(current) !== JSON.stringify(pack)
  if (updated) {
    localStorage.setItem('aruzahr-director-pack', JSON.stringify(pack))
    // Existing free notes and progress remain byte-for-byte unless absent.
    if (rawProgress === null)
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
