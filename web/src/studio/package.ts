import type { StudioProject } from './types'
import { validateProject, privateDMStorage, downloadFile } from './model'
import { digest } from './connection'
export async function exportCampaign(project: StudioProject) {
  const assets: Record<string, string> = {},
    memo = new Map<string, string>()
  const encode = async (v: any): Promise<any> => {
    if (typeof v === 'string' && /^data:(image|audio)\//.test(v)) {
      let hash = memo.get(v)
      if (!hash) {
        hash = await digest(v)
        memo.set(v, hash)
        assets[hash] = v
      }
      return 'bundle:' + hash
    }
    if (Array.isArray(v)) return Promise.all(v.map(encode))
    if (v && typeof v === 'object') {
      const rows = await Promise.all(
        Object.entries(v).map(async ([k, x]) => [k, await encode(x)]),
      )
      return Object.fromEntries(rows)
    }
    return v
  }
  const snapshot = { ...project, dmStorage: privateDMStorage() }
  const payload = await encode(snapshot)
  const text = JSON.stringify({
    format: 'aruzahr-campaign',
    version: 3,
    project: payload,
    assets,
  })
  if (new Blob([text]).size > 180 * 1024 * 1024)
    throw new Error(
      'Paket 180 MB sınırını aşıyor; kullanılmayan ses ve görselleri kaldır.',
    )
  downloadFile('Aruzahr-Ozel-Kampanya.aruzahr.json', text)
}
export async function parseCampaign(raw: unknown) {
  if (!raw || typeof raw !== 'object')
    throw new Error('Kampanya dosyası geçersiz.')
  const v = raw as Record<string, any>
  const checked = async (raw: unknown) => {
    const p = validateProject(raw)
    for (const [id, src] of Object.entries(p.mediaVault))
      if ((await digest(src)) !== id)
        throw new Error('Sahne görseli bütünlüğü doğrulanamadı.')
    for (const audio of p.audioAssets)
      if ((await digest(audio.src)) !== audio.id)
        throw new Error('Ses dosyası bütünlüğü doğrulanamadı.')
    return p
  }
  if (v.format !== 'aruzahr-campaign') return checked(v)
  if (
    v.version !== 3 ||
    !v.assets ||
    typeof v.assets !== 'object' ||
    Array.isArray(v.assets)
  )
    throw new Error('Paket sürümü veya varlık tablosu geçersiz.')
  const keys = Object.keys(v.assets)
  if (keys.length > 400)
    throw new Error('Paket en fazla 400 benzersiz yerel varlık içerebilir.')
  for (const key of keys)
    if (
      !/^[a-f0-9]{64}$/.test(key) ||
      typeof v.assets[key] !== 'string' ||
      (await digest(v.assets[key])) !== key
    )
      throw new Error('Kampanya varlığı eksik veya değiştirilmiş.')
  const expand = (x: any): any => {
    if (typeof x === 'string' && x.startsWith('bundle:')) {
      const id = x.slice(7)
      if (!Object.hasOwn(v.assets, id))
        throw new Error('Paketin bir varlığı eksik.')
      return v.assets[id]
    }
    if (Array.isArray(x)) return x.map(expand)
    if (x && typeof x === 'object')
      return Object.fromEntries(
        Object.entries(x).map(([k, y]) => [k, expand(y)]),
      )
    return x
  }
  return checked(expand(v.project))
}
