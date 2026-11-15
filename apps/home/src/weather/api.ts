import type { WeatherData } from './types'

export type Place = { name: string; label: string; latitude: number; longitude: number }

export function forecastUrl(latitude: number, longitude: number): string {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '1',
  })
  return `https://api.open-meteo.com/v1/forecast?${params}`
}

export function searchUrl(name: string): string {
  const params = new URLSearchParams({ name, count: '5', language: 'en', format: 'json' })
  return `https://geocoding-api.open-meteo.com/v1/search?${params}`
}

async function getJson(url: string, fetchImpl: typeof fetch): Promise<unknown> {
  const response = await fetchImpl(url)
  if (!response.ok) throw new Error(`Open-Meteo request failed: ${response.status}`)
  return response.json()
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  fetchImpl: typeof fetch = fetch,
): Promise<WeatherData> {
  return (await getJson(forecastUrl(latitude, longitude), fetchImpl)) as WeatherData
}

type GeocodingResult = {
  name?: unknown
  latitude?: unknown
  longitude?: unknown
  admin1?: unknown
  country?: unknown
}

export function toPlaces(json: unknown): Place[] {
  const results = (json as { results?: unknown } | null)?.results
  if (!Array.isArray(results)) return []
  return results.flatMap((result: GeocodingResult) => {
    const { name, latitude, longitude, admin1, country } = result
    if (typeof name !== 'string' || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return []
    }
    const label = [name, admin1, country]
      .filter((part) => typeof part === 'string' && part)
      .join(' · ')
    return [{ name, label, latitude, longitude }]
  })
}

export async function searchPlaces(
  name: string,
  fetchImpl: typeof fetch = fetch,
): Promise<Place[]> {
  const query = name.trim()
  if (!query) return []
  return toPlaces(await getJson(searchUrl(query), fetchImpl))
}
