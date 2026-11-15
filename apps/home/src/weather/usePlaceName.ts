import { useEffect, useState } from 'react'
import { browserStorage } from '../settings/store'
import { coordKey } from './cache'
import type { Coords } from './load'
import { lookupPlaceName, readPlaceName } from './reverse'

type Lookup = { key: string; name?: string; failed: boolean }

export function usePlaceName(coords: Coords | undefined): { name?: string; failed: boolean } {
  const latitude = coords?.latitude
  const longitude = coords?.longitude
  const key = coords ? coordKey(coords.latitude, coords.longitude) : undefined
  const [result, setResult] = useState<Lookup>()

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return
    const key = coordKey(latitude, longitude)
    let cancelled = false
    lookupPlaceName({ latitude, longitude }, { storage: browserStorage() })
      .then((name) => {
        if (!cancelled) setResult({ key, name, failed: !name })
      })
      .catch(() => {
        if (!cancelled) setResult({ key, failed: true })
      })
    return () => {
      cancelled = true
    }
  }, [latitude, longitude])

  if (!coords || !key) return { failed: false }
  if (result?.key === key) return { name: result.name, failed: result.failed }
  const cached = readPlaceName(browserStorage(), coords)
  return cached ? { name: cached, failed: false } : { failed: false }
}
