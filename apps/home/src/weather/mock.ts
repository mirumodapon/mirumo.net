import type { WeatherData } from './types'

const pad = (n: number) => String(n).padStart(2, '0')

const isoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export function createMockWeather(today: Date): WeatherData {
  const days = [0, 1, 2].map(
    (offset) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset),
  )
  return {
    current: {
      temperature_2m: 24,
      apparent_temperature: 25,
      relative_humidity_2m: 70,
      weather_code: 0,
      wind_speed_10m: 12,
    },
    daily: {
      time: days.map(isoDate),
      weather_code: [0, 2, 61],
      temperature_2m_max: [26, 25, 22],
      temperature_2m_min: [19, 19, 18],
      precipitation_probability_max: [10, 30, 80],
    },
  }
}
