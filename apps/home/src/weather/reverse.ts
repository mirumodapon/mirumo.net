import type { StorageLike } from '../settings/store'
import { coordKey } from './cache'
import type { Coords } from './load'

export const PLACES_KEY = 'mirumo.home.places.v1'

const nameFields = ['city', 'town', 'village', 'municipality', 'county', 'state'] as const

export function reverseUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
    zoom: '10',
    'accept-language': 'en',
  })
  return `https://nominatim.openstreetmap.org/reverse?${params}`
}

export function toPlaceName(json: unknown): string | undefined {
  const address = (json as { address?: Record<string, unknown> } | null)?.address
  if (!address) return undefined
  for (const field of nameFields) {
    const value = address[field]
    if (typeof value === 'string' && value) return value.toUpperCase()
  }
  return undefined
}

function readAll(storage: StorageLike | undefined): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(PLACES_KEY) ?? '{}')
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, string>) : {}
  } catch {
    return {}
  }
}

export function readPlaceName(storage: StorageLike | undefined, { latitude, longitude }: Coords) {
  const name = readAll(storage)[coordKey(latitude, longitude)]
  return typeof name === 'string' ? name : undefined
}

function remember(storage: StorageLike | undefined, key: string, name: string) {
  try {
    storage?.setItem(PLACES_KEY, JSON.stringify({ ...readAll(storage), [key]: name }))
  } catch {
    return
  }
}

const inflight = new Map<string, Promise<string | undefined>>()

async function lookup(
  key: string,
  { latitude, longitude }: Coords,
  { storage, fetchImpl = fetch }: { storage?: StorageLike; fetchImpl?: typeof fetch },
): Promise<string | undefined> {
  const cached = readPlaceName(storage, { latitude, longitude })
  if (cached) return cached
  const response = await fetchImpl(reverseUrl(latitude, longitude))
  if (!response.ok) throw new Error(`Nominatim request failed: ${response.status}`)
  const name = toPlaceName(await response.json())
  if (name) remember(storage, key, name)
  return name
}

export function lookupPlaceName(
  coords: Coords,
  deps: { storage?: StorageLike; fetchImpl?: typeof fetch },
): Promise<string | undefined> {
  const key = coordKey(coords.latitude, coords.longitude)
  const pending = inflight.get(key)
  if (pending) return pending
  const request = lookup(key, coords, deps).finally(() => inflight.delete(key))
  inflight.set(key, request)
  return request
}
