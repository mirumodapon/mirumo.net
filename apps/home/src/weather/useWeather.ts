import { useEffect, useState } from 'react'
import { browserStorage } from '../settings/store'
import { coordKey, FRESH_FOR, type WeatherEntry } from './cache'
import { loadWeather, type Coords } from './load'

export type WeatherStatus = 'loading' | 'ready' | 'unavailable' | 'no-location'

export type WeatherState = { status: WeatherStatus; entry?: WeatherEntry }

type Request = { attempt: number; force: boolean }

type Result = { key: string; status: 'ready' | 'unavailable'; entry?: WeatherEntry }

export function useWeather(coords: Coords | undefined): WeatherState & { refresh: () => void } {
  const latitude = coords?.latitude
  const longitude = coords?.longitude
  const key = coords ? coordKey(coords.latitude, coords.longitude) : undefined
  const [result, setResult] = useState<Result>()
  const [request, setRequest] = useState<Request>({ attempt: 0, force: false })
  const refresh = () => setRequest((value) => ({ attempt: value.attempt + 1, force: true }))

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return
    const key = coordKey(latitude, longitude)
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const retryIn = (delay: number) => {
      timer = setTimeout(
        () => setRequest((value) => ({ attempt: value.attempt + 1, force: false })),
        Math.max(0, delay),
      )
    }
    loadWeather(
      { latitude, longitude },
      { storage: browserStorage(), now: Date.now(), force: request.force },
    )
      .then(({ entry, stale }) => {
        if (cancelled) return
        setResult({ key, status: 'ready', entry })
        retryIn(stale ? FRESH_FOR : entry.fetchedAt + FRESH_FOR - Date.now())
      })
      .catch(() => {
        if (cancelled) return
        setResult({ key, status: 'unavailable' })
        retryIn(FRESH_FOR)
      })
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [latitude, longitude, request])

  if (!key) return { status: 'no-location', refresh }
  if (result?.key !== key) return { status: 'loading', refresh }
  return result.entry
    ? { status: result.status, entry: result.entry, refresh }
    : { status: result.status, refresh }
}
