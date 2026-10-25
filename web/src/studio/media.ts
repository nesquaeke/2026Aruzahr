import type { StudioProject, Cover } from './types'
import { publicRelayState } from '../useBroadcastRelay'
import { digest } from './connection'
import { redactImage } from './redaction'
import { safeAudioSource } from './model'
const toData = async (src: string) => {
  if (src.startsWith('data:')) return src
  const response = await fetch(src)
  if (!response.ok) throw new Error('Görsel yüklenemedi.')
  return new Promise<string>((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(String(r.result))
    r.onerror = () => rej(r.error)
    response
      .blob()
      .then((b) => r.readAsDataURL(b))
      .catch(rej)
  })
}
/** Bake masks before any public transport; opaque media paths conceal source filenames. */
export async function prepareProgram(project: StudioProject) {
  const frame = publicRelayState(project.draft),
    vault = { ...project.mediaVault }
  frame.customAssets = []
  if (frame.studio)
    frame.studio.markers = project.mapMarkers
      .filter((m) => !m.hidden)
      .map(({ hidden, ...m }, i) =>
        m.kind === 'route' &&
        project.mapMarkers
          .filter((x) => x.kind === 'route')
          .findIndex((x) => x.id === m.id) < project.routeProgress
          ? { ...m, label: '✓ ' + m.label, color: '#8fbf9f' }
          : m,
      )
  frame.actors = frame.actors.filter((a) => !a.hidden)
  const opaque = async (src: string, covers: Cover[] = []) => {
    const cached = src.match(/\/asset\/([a-f0-9]{64})$/)
    let data = cached && vault[cached[1]] ? vault[cached[1]] : await toData(src)
    if (covers.length) data = await redactImage(data, covers)
    const hash = await digest(data)
    vault[hash] = data
    return '/__aruzahr-broadcast/asset/' + hash
  }
  frame.scene = { ...frame.scene, src: await opaque(frame.scene.src) }
  for (const actor of frame.actors) {
    actor.src = await opaque(actor.src, project.covers[actor.id] || [])
    delete actor.assetId
  }
  for (const token of frame.tokens) {
    if (token.src) token.src = await opaque(token.src)
    delete token.assetId
  }
  if (frame.studio?.reveal)
    frame.studio.reveal.src = await opaque(
      frame.studio.reveal.src,
      project.covers[frame.studio.reveal.id] ||
        project.draft.actors
          .filter((a) => a.src === frame.studio!.reveal!.src)
          .flatMap((a) => project.covers[a.id] || []),
    )
  if (frame.studio?.audio)
    for (const channel of ['music', 'ambience', 'effect'] as const) {
      const c = frame.studio.audio[channel]
      if (c && project.audioAssets.some((a) => a.id === c.id))
        frame.studio.audio[channel] = {
          ...c,
          label:
            channel === 'music'
              ? 'Müzik'
              : channel === 'ambience'
                ? 'Ortam'
                : 'Efekt',
        }
    }
  const references = new Set<string>()
  const visit = (value: unknown) => {
    if (typeof value === 'string') {
      const id = value.match(
        /^\/__aruzahr-broadcast\/asset\/([a-f0-9]{64})$/,
      )?.[1]
      if (id) references.add(id)
    } else if (Array.isArray(value)) value.forEach(visit)
    else if (value && typeof value === 'object')
      Object.values(value).forEach(visit)
  }
  visit([
    frame,
    project.program,
    project.previous,
    project.draft,
    project.scenes,
    project.trash,
    project.cast,
  ])
  const usedVault = Object.fromEntries(
    Object.entries(vault).filter(([id]) => references.has(id)),
  )
  if (Object.keys(usedVault).length > 400)
    throw new Error(
      'Kampanya görsel arşivi dolu. Kullanılmayan sahneleri ve çöp kutusunu temizle.',
    )
  return { frame, vault: usedVault }
}
export async function loadSound(
  file: File,
  type: 'music' | 'ambience' | 'effect',
) {
  if (!file.size || file.size > 16 * 1024 * 1024)
    throw new Error('Ses dosyası en çok 16 MB olmalı.')
  const src = await new Promise<string>((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(String(r.result))
    r.onerror = () => rej(r.error)
    r.readAsDataURL(file)
  })
  const checked = safeAudioSource(src)
  const audio = new Audio(checked)
  await new Promise<void>((res, rej) => {
    audio.onloadedmetadata = () => res()
    audio.onerror = () => rej(new Error('Ses biçimi tarayıcıda açılamadı.'))
  })
  return {
    id: await digest(checked),
    name: file.name.replace(/\.[^.]+$/, ''),
    src: checked,
    license: 'Kullanıcı yüklemesi · kullanım iznini belirt',
    type,
  }
}
