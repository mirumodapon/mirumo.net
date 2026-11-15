import { describe, expect, it, vi } from 'vitest'
import { fetchForecast, forecastUrl, searchPlaces, searchUrl, toPlaces } from './api'
import { createMockWeather } from './mock'

const mock = createMockWeather(new Date(2026, 10, 15))
const respond = (body: unknown, ok = true, status = 200) =>
  vi.fn(async () => ({ ok, status, json: async () => body }) as Response)

describe('forecastUrl', () => {
  it('asks for current and daily data at the location, in its own time zone', () => {
    const url = new URL(forecastUrl(25.033, 121.5654))
    expect(url.origin + url.pathname).toBe('https://api.open-meteo.com/v1/forecast')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      latitude: '25.033',
      longitude: '121.5654',
      current:
        'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: '1',
    })
  })
})

describe('searchUrl', () => {
  it('searches five English results', () => {
    const url = new URL(searchUrl('Tokyo'))
    expect(url.origin + url.pathname).toBe('https://geocoding-api.open-meteo.com/v1/search')
    expect(Object.fromEntries(url.searchParams)).toEqual({
      name: 'Tokyo',
      count: '5',
      language: 'en',
      format: 'json',
    })
  })
})

describe('toPlaces', () => {
  it('labels each result with its region and country', () => {
    expect(
      toPlaces({
        results: [
          {
            name: 'Tokyo',
            latitude: 35.6895,
            longitude: 139.69171,
            country: 'Japan',
            admin1: 'Tokyo',
          },
        ],
      }),
    ).toEqual([
      { name: 'Tokyo', label: 'Tokyo · Tokyo · Japan', latitude: 35.6895, longitude: 139.69171 },
    ])
  })
  it('skips missing parts of the label', () => {
    expect(toPlaces({ results: [{ name: 'X', latitude: 1, longitude: 2 }] })[0]!.label).toBe('X')
  })
  it('gives no places when there are no results', () => {
    expect(toPlaces({})).toEqual([])
    expect(toPlaces(null)).toEqual([])
  })
})

describe('fetchForecast', () => {
  it('returns the response data', async () => {
    await expect(fetchForecast(1, 2, respond(mock))).resolves.toEqual(mock)
  })
  it('rejects a non-OK response', async () => {
    await expect(fetchForecast(1, 2, respond({}, false, 429))).rejects.toThrow('429')
  })
})

describe('searchPlaces', () => {
  it('does not search for a blank name', async () => {
    const fetchImpl = respond({})
    await expect(searchPlaces('  ', fetchImpl)).resolves.toEqual([])
    expect(fetchImpl).not.toHaveBeenCalled()
  })
  it('returns the mapped places', async () => {
    const fetchImpl = respond({
      results: [{ name: 'Tokyo', latitude: 1, longitude: 2, country: 'Japan' }],
    })
    await expect(searchPlaces('Tokyo', fetchImpl)).resolves.toEqual([
      { name: 'Tokyo', label: 'Tokyo · Japan', latitude: 1, longitude: 2 },
    ])
  })
})
