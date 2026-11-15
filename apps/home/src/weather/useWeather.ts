import { useEffect, useState } from 'react'
import { browserStorage } from '../settings/store'
import { coordKey, FRESH_FOR, type WeatherEntry } from './cache'
import { loadWeather, type Coords } from './load'

export type WeatherStatus = 'loading' | 'ready' | 'unavailable' | 'no-location'

export type WeatherState = { status: WeatherStatus; entry?: WeatherEntry }

type Result = { key: string; status: 'ready' | 'unavailable'; entry?: WeatherEntry }

export function useWeather(coords: Coords | undefined): WeatherState {
  const latitude = coords?.latitude
  const longitude = coords?.longitude
  const key = coords ? coordKey(coords.latitude, coords.longitude) : undefined
  const [result, setResult] = useState<Result>()
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return
    const key = coordKey(latitude, longitude)
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const retryIn = (delay: number) => {
      timer = setTimeout(() => setAttempt((value) => value + 1), Math.max(0, delay))
    }
    loadWeather({ latitude, longitude }, { storage: browserStorage(), now: Date.now() })
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
  }, [latitude, longitude, attempt])

  if (!key) return { status: 'no-location' }
  if (result?.key !== key) return { status: 'loading' }
  return result.entry ? { status: result.status, entry: result.entry } : { status: result.status }
}
