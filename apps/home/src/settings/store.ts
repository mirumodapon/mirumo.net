import { useSyncExternalStore } from 'react'
import { resolveSettings, type HomeSettings } from '../config'

export const STORAGE_KEY = 'mirumo.home.settings.v1'

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export type SettingsStore = {
  getSnapshot(): HomeSettings
  subscribe(onChange: () => void): () => void
  save(settings: HomeSettings): void
  reset(): void
}

function attempt<T>(run: () => T): T | undefined {
  try {
    return run()
  } catch {
    return undefined
  }
}

function readStored(file: HomeSettings, storage: StorageLike | undefined): HomeSettings {
  const raw = storage && attempt(() => storage.getItem(STORAGE_KEY))
  if (raw == null) return file
  const parsed = attempt(() => JSON.parse(raw) as unknown)
  return parsed === undefined ? file : resolveSettings(parsed)
}

export function createSettingsStore(
  file: HomeSettings,
  storage: StorageLike | undefined,
): SettingsStore {
  let snapshot = readStored(file, storage)
  const listeners = new Set<() => void>()
  const notify = () => listeners.forEach((listener) => listener())

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return
    snapshot = readStored(file, storage)
    notify()
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(onChange) {
      listeners.add(onChange)
      if (listeners.size === 1 && typeof window !== 'undefined') {
        window.addEventListener('storage', onStorage)
      }
      return () => {
        listeners.delete(onChange)
        if (listeners.size === 0 && typeof window !== 'undefined') {
          window.removeEventListener('storage', onStorage)
        }
      }
    },
    save(settings) {
      snapshot = settings
      attempt(() => storage?.setItem(STORAGE_KEY, JSON.stringify(settings)))
      notify()
    },
    reset() {
      snapshot = file
      attempt(() => storage?.removeItem(STORAGE_KEY))
      notify()
    },
  }
}

export function useSettings(store: SettingsStore): HomeSettings {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
}

export function browserStorage(): StorageLike | undefined {
  return attempt(() => window.localStorage)
}
