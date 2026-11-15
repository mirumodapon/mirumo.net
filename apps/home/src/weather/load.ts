import type { StorageLike } from '../settings/store'
import { fetchForecast } from './api'
import { coordKey, isFresh, readCached, writeCached, type WeatherEntry } from './cache'

export type Coords = { latitude: number; longitude: number }

export type LoadDeps = {
  storage?: StorageLike
  fetchImpl?: typeof fetch
  now: number
  force?: boolean
}

export type LoadResult = { entry: WeatherEntry; stale: boolean }

const inflight = new Map<string, Promise<LoadResult>>()

async function load(
  key: string,
  { latitude, longitude }: Coords,
  deps: LoadDeps,
): Promise<LoadResult> {
  const { storage, fetchImpl, now, force = false } = deps
  const cached = readCached(storage, key)
  if (cached && !force && isFresh(cached, now)) return { entry: cached, stale: false }
  try {
    const entry = { data: await fetchForecast(latitude, longitude, fetchImpl), fetchedAt: now }
    writeCached(storage, key, entry)
    return { entry, stale: false }
  } catch (error) {
    if (cached) return { entry: cached, stale: true }
    throw error
  }
}

export function loadWeather(coords: Coords, deps: LoadDeps): Promise<LoadResult> {
  const key = coordKey(coords.latitude, coords.longitude)
  const pending = inflight.get(key)
  if (pending) return pending
  const request = load(key, coords, deps).finally(() => inflight.delete(key))
  inflight.set(key, request)
  return request
}
