import { useEffect, useState } from 'react'
import { browserStorage } from '../settings/store'
import type { Coords } from './load'

export const POSITION_KEY = 'mirumo.home.position.v1'

function readLastKnown(): Coords | undefined {
  try {
    const parsed = JSON.parse(
      browserStorage()?.getItem(POSITION_KEY) ?? 'null',
    ) as Partial<Coords> | null
    if (typeof parsed?.latitude === 'number' && typeof parsed.longitude === 'number') {
      return { latitude: parsed.latitude, longitude: parsed.longitude }
    }
  } catch {
    return undefined
  }
  return undefined
}

function remember(position: Coords) {
  try {
    browserStorage()?.setItem(POSITION_KEY, JSON.stringify(position))
  } catch {
    return
  }
}

export function usePosition(enabled: boolean): { coords?: Coords; pending: boolean } {
  const [coords, setCoords] = useState(readLastKnown)
  const [pending, setPending] = useState(enabled)

  useEffect(() => {
    if (!enabled) return
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      queueMicrotask(() => setPending(false))
      return
    }
    let cancelled = false
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        if (cancelled) return
        const next = { latitude, longitude }
        remember(next)
        setCoords(next)
        setPending(false)
      },
      () => {
        if (!cancelled) setPending(false)
      },
      { timeout: 10_000 },
    )
    return () => {
      cancelled = true
    }
  }, [enabled])

  return { coords, pending: enabled && pending && !coords }
}
