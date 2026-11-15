import { describe, expect, it, vi } from 'vitest'
import { defaultWorkspace, resolveSettings } from '../config'
import { createSettingsStore, STORAGE_KEY, type StorageLike } from './store'

const file = resolveSettings({ global: { title: 'FILE' } })

function memoryStorage(initial?: string): StorageLike & { data: Map<string, string> } {
  const data = new Map<string, string>()
  if (initial !== undefined) data.set(STORAGE_KEY, initial)
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
}

const throwing: StorageLike = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
  removeItem: () => {
    throw new Error('blocked')
  },
}

describe('createSettingsStore', () => {
  it('uses the file settings when nothing is stored', () => {
    expect(createSettingsStore(file, memoryStorage()).getSnapshot()).toEqual(file)
  })
  it('prefers valid stored settings', () => {
    const store = createSettingsStore(
      file,
      memoryStorage(JSON.stringify({ global: { title: 'ARCADE' } })),
    )
    expect(store.getSnapshot().global.title).toBe('ARCADE')
  })
  it('falls back to the file when the stored value is corrupt', () => {
    expect(createSettingsStore(file, memoryStorage('{')).getSnapshot()).toEqual(file)
  })
  it('fills a partial stored value from the defaults', () => {
    const stored = JSON.stringify({ workspaces: [{ layout: 'clock' }] })
    const workspace = createSettingsStore(file, memoryStorage(stored)).getSnapshot().workspaces[0]!
    expect(workspace.layout).toBe('clock')
    expect(workspace.linkGroups).toEqual(defaultWorkspace.linkGroups)
    expect(workspace.socials).toEqual(defaultWorkspace.socials)
  })
  it('saves to storage, updates the snapshot and notifies once', () => {
    const storage = memoryStorage()
    const store = createSettingsStore(file, storage)
    const listener = vi.fn()
    store.subscribe(listener)
    const next = resolveSettings({ global: { title: 'SAVED' } })
    store.save(next)
    expect(storage.data.get(STORAGE_KEY)).toBe(JSON.stringify(next))
    expect(store.getSnapshot()).toEqual(next)
    expect(listener).toHaveBeenCalledTimes(1)
  })
  it('resets to the file settings and clears storage', () => {
    const storage = memoryStorage(JSON.stringify({ global: { title: 'ARCADE' } }))
    const store = createSettingsStore(file, storage)
    const listener = vi.fn()
    store.subscribe(listener)
    store.reset()
    expect(storage.data.has(STORAGE_KEY)).toBe(false)
    expect(store.getSnapshot()).toEqual(file)
    expect(listener).toHaveBeenCalledTimes(1)
  })
  it('returns the same snapshot object until something changes', () => {
    const store = createSettingsStore(file, memoryStorage(JSON.stringify({})))
    expect(Object.is(store.getSnapshot(), store.getSnapshot())).toBe(true)
  })
  it('keeps working when storage throws', () => {
    const store = createSettingsStore(file, throwing)
    expect(store.getSnapshot()).toEqual(file)
    const next = resolveSettings({ global: { title: 'SAVED' } })
    expect(() => store.save(next)).not.toThrow()
    expect(store.getSnapshot()).toEqual(next)
    expect(() => store.reset()).not.toThrow()
  })
  it('works without any storage', () => {
    const store = createSettingsStore(file, undefined)
    expect(store.getSnapshot()).toEqual(file)
    store.save(resolveSettings({}))
    expect(store.getSnapshot().global.title).toBe('MIRUMO')
  })
})
