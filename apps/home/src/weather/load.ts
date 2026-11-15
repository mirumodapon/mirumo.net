import type { StorageLike } from '../settings/store'
import { fetchForecast } from './api'
import { coordKey, isFresh, readCached, writeCached, type WeatherEntry } from './cache'

export type Coords = { latitude: number; longitude: number }

export type LoadDeps = { storage?: StorageLike; fetchImpl?: typeof fetch; now: number }

export async function loadWeather(
  { latitude, longitude }: Coords,
  { storage, fetchImpl, now }: LoadDeps,
): Promise<{ entry: WeatherEntry; stale: boolean }> {
  const key = coordKey(latitude, longitude)
  const cached = readCached(storage, key)
  if (cached && isFresh(cached, now)) return { entry: cached, stale: false }
  try {
    const entry = { data: await fetchForecast(latitude, longitude, fetchImpl), fetchedAt: now }
    writeCached(storage, key, entry)
    return { entry, stale: false }
  } catch (error) {
    if (cached) return { entry: cached, stale: true }
    throw error
  }
}
