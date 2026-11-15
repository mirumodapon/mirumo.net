import { describe, expect, it, vi } from 'vitest'
import type { StorageLike } from '../settings/store'
import { CACHE_KEY, coordKey, isFresh, type WeatherEntry } from './cache'
import { loadWeather } from './load'
import { createMockWeather } from './mock'

const hour = 3_600_000
const taipei = { latitude: 25.033, longitude: 121.5654 }
const tokyo = { latitude: 35.6895, longitude: 139.69171 }
const oldData = createMockWeather(new Date(2026, 10, 14))
const newData = { ...oldData, current: { ...oldData.current, temperature_2m: 30 } }

function memoryStorage(initial?: string) {
  const data = new Map<string, string>()
  if (initial !== undefined) data.set(CACHE_KEY, initial)
  const storage: StorageLike & { data: Map<string, string> } = {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
  return storage
}

const seeded = (entry: WeatherEntry, coords = taipei) =>
  memoryStorage(JSON.stringify({ [coordKey(coords.latitude, coords.longitude)]: entry }))

const okFetch = () =>
  vi.fn(async () => ({ ok: true, status: 200, json: async () => newData }) as Response)
const failingFetch = () =>
  vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) }) as Response)

describe('coordKey and isFresh', () => {
  it('rounds coordinates to two decimals', () =>
    expect(coordKey(25.033, 121.5654)).toBe('25.03,121.57'))
  it('is fresh for just under an hour', () => {
    expect(isFresh({ data: oldData, fetchedAt: 0 }, hour - 1)).toBe(true)
    expect(isFresh({ data: oldData, fetchedAt: 0 }, hour)).toBe(false)
  })
})

describe('loadWeather', () => {
  it('uses a fresh cached entry without fetching', async () => {
    const fetchImpl = okFetch()
    const result = await loadWeather(taipei, {
      storage: seeded({ data: oldData, fetchedAt: 1_000 }),
      fetchImpl,
      now: 1_000 + hour - 1,
    })
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(result).toEqual({ entry: { data: oldData, fetchedAt: 1_000 }, stale: false })
  })
  it('refetches a stale entry and stores the result', async () => {
    const storage = seeded({ data: oldData, fetchedAt: 0 })
    const fetchImpl = okFetch()
    const result = await loadWeather(taipei, { storage, fetchImpl, now: hour })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ entry: { data: newData, fetchedAt: hour }, stale: false })
    const stored = JSON.parse(storage.data.get(CACHE_KEY)!)
    expect(stored[coordKey(taipei.latitude, taipei.longitude)].fetchedAt).toBe(hour)
  })
  it('falls back to the stale entry when the fetch fails', async () => {
    const result = await loadWeather(taipei, {
      storage: seeded({ data: oldData, fetchedAt: 0 }),
      fetchImpl: failingFetch(),
      now: 2 * hour,
    })
    expect(result).toEqual({ entry: { data: oldData, fetchedAt: 0 }, stale: true })
  })
  it('rejects when the fetch fails and nothing is cached', async () => {
    await expect(
      loadWeather(taipei, { storage: memoryStorage(), fetchImpl: failingFetch(), now: 0 }),
    ).rejects.toThrow()
  })
  it('treats a corrupt cache as empty', async () => {
    for (const raw of ['{', JSON.stringify({ [coordKey(25.033, 121.5654)]: {} })]) {
      const fetchImpl = okFetch()
      await loadWeather(taipei, { storage: memoryStorage(raw), fetchImpl, now: 0 })
      expect(fetchImpl).toHaveBeenCalledTimes(1)
    }
  })
  it('keeps entries for different places side by side', async () => {
    const storage = seeded({ data: oldData, fetchedAt: 0 }, tokyo)
    await loadWeather(taipei, { storage, fetchImpl: okFetch(), now: 10 })
    const stored = JSON.parse(storage.data.get(CACHE_KEY)!)
    expect(Object.keys(stored).sort()).toEqual(['25.03,121.57', '35.69,139.69'])
  })
  it('works without storage', async () => {
    const result = await loadWeather(taipei, { fetchImpl: okFetch(), now: 5 })
    expect(result.entry.fetchedAt).toBe(5)
  })
})
