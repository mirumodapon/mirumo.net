import type { StorageLike } from '../settings/store'
import type { WeatherData } from './types'

export const CACHE_KEY = 'mirumo.home.weather.v1'

export const FRESH_FOR = 3_600_000

export type WeatherEntry = { data: WeatherData; fetchedAt: number }

type Cache = Record<string, WeatherEntry>

export function coordKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(2)},${longitude.toFixed(2)}`
}

export function isFresh(entry: WeatherEntry, now: number): boolean {
  return now - entry.fetchedAt < FRESH_FOR
}

function isEntry(value: unknown): value is WeatherEntry {
  const entry = value as Partial<WeatherEntry> | null
  return (
    typeof entry === 'object' &&
    entry !== null &&
    typeof entry.fetchedAt === 'number' &&
    typeof entry.data === 'object' &&
    entry.data !== null
  )
}

function readAll(storage: StorageLike | undefined): Cache {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(CACHE_KEY) ?? '{}')
    return typeof parsed === 'object' && parsed !== null ? (parsed as Cache) : {}
  } catch {
    return {}
  }
}

export function readCached(
  storage: StorageLike | undefined,
  key: string,
): WeatherEntry | undefined {
  const entry = readAll(storage)[key]
  return isEntry(entry) ? entry : undefined
}

export function writeCached(
  storage: StorageLike | undefined,
  key: string,
  entry: WeatherEntry,
): void {
  try {
    storage?.setItem(CACHE_KEY, JSON.stringify({ ...readAll(storage), [key]: entry }))
  } catch {
    return
  }
}
