import { describe, expect, it } from 'vitest'
import { describeWeather } from './codes'
import { createMockWeather } from './mock'

describe('describeWeather', () => {
  it('maps clear sky', () => expect(describeWeather(0)).toEqual({ icon: 'sun', text: 'CLEAR' }))
  it('maps rain', () => expect(describeWeather(63)).toEqual({ icon: 'cloud-rain', text: 'RAIN' }))
  it('maps thunderstorms', () => expect(describeWeather(96).text).toBe('THUNDER'))
  it('falls back for unknown codes', () =>
    expect(describeWeather(42)).toEqual({ icon: 'cloud-question', text: 'UNKNOWN' }))
})

describe('createMockWeather', () => {
  it('starts three days at the given date, crossing month boundaries', () => {
    const data = createMockWeather(new Date(2026, 10, 30))
    expect(data.daily.time).toEqual(['2026-11-30', '2026-12-01', '2026-12-02'])
  })
  it('has fixed current conditions', () =>
    expect(createMockWeather(new Date(2026, 10, 15)).current.temperature_2m).toBe(24))
})
