import { describe, expect, it, vi } from 'vitest'
import type { StorageLike } from '../settings/store'
import { coordKey } from './cache'
import { lookupPlaceName, PLACES_KEY, readPlaceName, reverseUrl, toPlaceName } from './reverse'

const osaka = { latitude: 34.6937, longitude: 135.5023 }

function memoryStorage(initial?: string) {
  const data = new Map<string, string>()
  if (initial !== undefined) data.set(PLACES_KEY, initial)
  const storage: StorageLike & { data: Map<string, string> } = {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
  return storage
}

const respond = (body: unknown, ok = true) =>
  vi.fn(async () => ({ ok, status: ok ? 200 : 500, json: async () => body }) as Response)

describe('reverseUrl', () => {
  it('asks Nominatim for a city-level English result', () => {
    const url = new URL(reverseUrl(34.6937, 135.5023))
    expect(url.origin + url.pathname).toBe('https://nominatim.openstreetmap.org/reverse')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      format: 'jsonv2',
      lat: '34.6937',
      lon: '135.5023',
      zoom: '10',
      'accept-language': 'en',
    })
  })
})

describe('toPlaceName', () => {
  it('prefers the city, uppercased', () => {
    expect(toPlaceName({ address: { city: 'Osaka', state: 'Osaka Prefecture' } })).toBe('OSAKA')
  })
  it('falls back through town, village, municipality, county and state', () => {
    expect(toPlaceName({ address: { town: 'Hualien City', county: 'Hualien' } })).toBe(
      'HUALIEN CITY',
    )
    expect(toPlaceName({ address: { state: 'Hokkaido' } })).toBe('HOKKAIDO')
  })
  it('gives no name for errors or missing addresses', () => {
    expect(toPlaceName({ error: 'Unable to geocode' })).toBeUndefined()
    expect(toPlaceName(null)).toBeUndefined()
  })
})

describe('lookupPlaceName', () => {
  it('uses a cached name without fetching', async () => {
    const storage = memoryStorage(JSON.stringify({ [coordKey(34.6937, 135.5023)]: 'OSAKA' }))
    const fetchImpl = respond({})
    await expect(lookupPlaceName(osaka, { storage, fetchImpl })).resolves.toBe('OSAKA')
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(readPlaceName(storage, osaka)).toBe('OSAKA')
  })
  it('fetches and caches a found name', async () => {
    const storage = memoryStorage()
    await expect(
      lookupPlaceName(osaka, { storage, fetchImpl: respond({ address: { city: 'Osaka' } }) }),
    ).resolves.toBe('OSAKA')
    expect(JSON.parse(storage.data.get(PLACES_KEY)!)).toEqual({ '34.69,135.50': 'OSAKA' })
  })
  it('caches nothing when the lookup fails', async () => {
    const storage = memoryStorage()
    await expect(
      lookupPlaceName(osaka, { storage, fetchImpl: respond({}, false) }),
    ).rejects.toThrow()
    expect(storage.data.has(PLACES_KEY)).toBe(false)
  })
  it('shares one request between overlapping lookups', async () => {
    const fetchImpl = respond({ address: { city: 'Osaka' } })
    const storage = memoryStorage()
    await Promise.all([
      lookupPlaceName(osaka, { storage, fetchImpl }),
      lookupPlaceName({ latitude: 34.6941, longitude: 135.5021 }, { storage, fetchImpl }),
    ])
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })
  it('treats a corrupt cache as empty', async () => {
    const fetchImpl = respond({ address: { city: 'Osaka' } })
    await lookupPlaceName(osaka, { storage: memoryStorage('{'), fetchImpl })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })
})
