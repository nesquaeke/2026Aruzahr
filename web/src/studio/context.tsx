import { createContext, useContext } from 'react'
import type { BroadcastState } from '../broadcast-state'
import type { BroadcastAsset } from '../BroadcastLibrary'
import type {
  StudioProject,
  StudioPublic,
  SceneCard,
  StudioPerson,
} from './types'
export type StudioActions = {
  p: StudioProject
  change: (fn: (p: StudioProject) => StudioProject) => void
  draft: (patch: Partial<BroadcastState>) => void
  extras: (patch: Partial<StudioPublic>) => void
  live: (patch: Partial<BroadcastState>) => void
  notify: (s: string) => void
  take: () => Promise<void>
  saveScene: () => void
  loadScene: (id: string) => void
  addAsset: (
    a: BroadcastAsset,
    kind: 'portrait' | 'image' | 'background' | 'reveal',
  ) => void
  addPerson: (a: BroadcastAsset, kind?: StudioPerson['kind']) => StudioPerson
  upload: (files: File[]) => Promise<void>
  request: (route: string, data: unknown) => Promise<any>
  setPanel: (tab: string) => void
  perform: (id: string) => void
  undo: () => void
  redo: () => void
  exportProject: () => Promise<void>
  importFile: (file: File) => Promise<void>
  obs: {
    connected: boolean
    status: string
    scenes: string[]
    connect: (url: string, password: string) => Promise<void>
    disconnect: () => void
  }
  connection: {
    owner: boolean
    online: boolean
    error: string
    ack: number
    audio: boolean
  }
  release: () => Promise<void>
}
export const StudioContext = createContext<StudioActions | null>(null)
export function useStudio() {
  const value = useContext(StudioContext)
  if (!value) throw new Error('Studio context missing')
  return value
}
