import { useEffect, useRef, useState } from 'react'
import type { StudioProject } from './types'
import { freshId } from '../broadcast-state'
import { publicRelayState } from '../useBroadcastRelay'
export const API = '/__aruzahr-broadcast/studio/'
export async function api(route: string, data: unknown, key?: string) {
  const abort = new AbortController(),
    timer = setTimeout(() => abort.abort(), 12000)
  try {
    const response = await fetch(API + route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(key ? { 'x-studio-owner': key } : {}),
      },
      body: JSON.stringify(data),
      signal: abort.signal,
    })
    const value = await response
      .json()
      .catch(() => ({ error: 'Yerel yayın sunucusu yanıt vermiyor.' }))
    if (!response.ok)
      throw Object.assign(new Error(value.error || 'İstek tamamlanamadı.'), {
        status: response.status,
      })
    return value
  } finally {
    clearTimeout(timer)
  }
}
export async function digest(src: string) {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(src),
  )
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('')
}
export function useStudioConnection(
  project: StudioProject | null,
  onRemote: (action: string, value: string) => void,
  onPoll: (poll: any) => void,
) {
  const [state, setState] = useState({
      owner: false,
      online: false,
      error: 'Bağlanıyor…',
      ack: 0,
      audio: false,
    }),
    [nonce, setNonce] = useState(0)
  const latest = useRef(project),
    remote = useRef(onRemote),
    poll = useRef(onPoll),
    key = useRef(''),
    epoch = useRef(''),
    id = useRef(freshId('window')),
    force = useRef(false),
    publish = useRef<() => void>(() => {})
  latest.current = project
  remote.current = onRemote
  poll.current = onPoll
  useEffect(() => {
    if (!project) return
    let closed = false,
      busy = false,
      pending = true,
      sequence = 0,
      heartbeatBusy = false,
      claimBusy = false,
      denied = false,
      uploaded = new Set<string>(),
      seenCommands = new Set<string>()
    const status = (patch: Partial<typeof state>) => {
      if (!closed) setState((s) => ({ ...s, ...patch }))
    }
    async function claim() {
      if (claimBusy || closed) return
      claimBusy = true
      try {
        const result = await api('claim', {
          id: id.current,
          force: force.current,
        })
        force.current = false
        if (closed) return
        key.current = result.key
        epoch.current = result.epoch
        sequence = Math.max(sequence, result.revision)
        uploaded.clear()
        pending = true
        try {
          localStorage.setItem(
            'aruzahr-studio-owner',
            JSON.stringify({ id: id.current, at: Date.now() }),
          )
        } catch {}
        status({ owner: true, online: true, error: '' })
        void drain()
      } catch (e) {
        denied = [403, 409].includes((e as any).status)
        status({ owner: false, online: false, error: (e as Error).message })
      } finally {
        claimBusy = false
      }
    }
    async function uploadAsset(hash: string, src: string) {
      if (uploaded.has(hash)) return
      await api('asset', { id: hash, src }, key.current)
      uploaded.add(hash)
    }
    async function drain() {
      if (closed || busy || !pending || !key.current) return
      busy = true
      pending = false
      try {
        const p = latest.current
        if (!p) return
        const frame = publicRelayState(p.program)
        frame.studio = {
          ...frame.studio!,
          epoch: epoch.current,
          revision: Math.max(++sequence, frame.studio?.revision || 0),
        }
        sequence = frame.studio.revision
        const refs = new Set<string>()
        const visit = (value: unknown) => {
          if (typeof value === 'string') {
            const match = value.match(
              /^\/__aruzahr-broadcast\/asset\/([a-f0-9]{64})$/,
            )
            if (match) refs.add(match[1])
          } else if (Array.isArray(value)) value.forEach(visit)
          else if (value && typeof value === 'object')
            Object.values(value).forEach(visit)
        }
        visit(frame)
        for (const hash of refs) {
          const src = p.mediaVault[hash]
          if (src) await uploadAsset(hash, src)
        }
        const sounds = new Set([
          ...(['music', 'ambience', 'effect'] as const).map(
            (name) => frame.studio?.audio?.[name]?.id,
          ),
          frame.studio?.break?.ambientId,
        ])
        for (const sound of sounds) {
          if (sound && !sound.startsWith('builtin-')) {
            const asset = p.audioAssets.find((a) => a.id === sound)
            if (!asset) throw new Error('Yayın sesi kampanyada bulunamadı.')
            await uploadAsset(asset.id, asset.src)
          }
        }
        await api('frame', { epoch: epoch.current, state: frame }, key.current)
        status({ owner: true, online: true, error: '', ack: Date.now() })
      } catch (e) {
        const code = (e as any).status
        status({
          error: (e as Error).message,
          online: false,
          ...(code === 409 ? { owner: false } : {}),
        })
        if (code === 409) {
          key.current = ''
        } else if (
          code === 422 ||
          !code ||
          code >= 500 ||
          code === 408 ||
          code === 429
        ) {
          uploaded.clear()
          pending = true
        }
      } finally {
        busy = false
      }
    }
    publish.current = () => {
      pending = true
      void drain()
    }
    async function heartbeat() {
      if (closed || heartbeatBusy) return
      if (!key.current) {
        if (!denied) void claim()
        return
      }
      heartbeatBusy = true
      try {
        const result = await api(
          'heartbeat',
          { ack: [...seenCommands].slice(-100) },
          key.current,
        )
        if (result.epoch !== epoch.current) {
          key.current = ''
          void claim()
          return
        }
        status({ online: true, audio: !!result.audioPlaying })
        for (const command of result.commands || [])
          if (!seenCommands.has(command.id)) {
            seenCommands.add(command.id)
            remote.current(command.action, command.value)
          }
        const currentPoll = latest.current?.program.studio?.poll
        if (currentPoll && (!result.poll || currentPoll.id !== result.poll.id))
          poll.current({ ...currentPoll, open: false })
        else if (result.poll) poll.current(result.poll)
        if (pending) void drain()
      } catch (e) {
        status({ online: false, error: (e as Error).message })
        if ((e as any).status === 409) {
          key.current = ''
          const result = await fetch(API + 'status')
            .then((r) => r.json())
            .catch(() => ({ online: true }))
          denied = !!result.online
          status({ owner: false })
        }
      } finally {
        heartbeatBusy = false
      }
    }
    void claim()
    const timer = setInterval(() => void heartbeat(), 1500),
      flush = setInterval(() => {
        if (pending) void drain()
      }, 250)
    const storage = (e: StorageEvent) => {
      if (e.key === 'aruzahr-studio-owner' && e.newValue) {
        try {
          if (JSON.parse(e.newValue).id !== id.current) {
            denied = true
            key.current = ''
            status({
              owner: false,
              online: false,
              error: 'Kontrol diğer yönetim penceresine geçti.',
            })
          }
        } catch {}
      }
    }
    window.addEventListener('storage', storage)
    const leave = () => {
      if (key.current)
        void fetch(API + 'release', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-studio-owner': key.current,
          },
          body: '{}',
          keepalive: true,
        }).catch(() => {})
    }
    window.addEventListener('pagehide', leave)
    return () => {
      closed = true
      clearInterval(timer)
      clearInterval(flush)
      window.removeEventListener('pagehide', leave)
      window.removeEventListener('storage', storage)
      publish.current =
        () => {} /* StrictMode remount keeps the same identity; expiry also covers crashes. */
    }
  }, [!!project, nonce])
  useEffect(() => {
    if (project) publish.current()
  }, [project?.program, project?.mediaVault, project?.audioAssets])
  return {
    state,
    key,
    epoch,
    id,
    takeover: () => {
      force.current = true
      setNonce((n) => n + 1)
    },
    release: async () => {
      if (key.current) await api('release', {}, key.current).catch(() => {})
      key.current = ''
      setState((s) => ({
        ...s,
        owner: false,
        online: false,
        error: 'Kontrol bırakıldı.',
      }))
    },
    request: (route: string, data: unknown) => api(route, data, key.current),
  }
}
