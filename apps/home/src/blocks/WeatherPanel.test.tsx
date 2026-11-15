import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { createMockWeather } from '../weather/mock'
import { WeatherPanel } from './WeatherPanel'

const render = (state: Parameters<typeof WeatherPanel>[0]['state']) =>
  renderToStaticMarkup(<WeatherPanel title="WEATHER" place="TAIPEI" state={state} />)

describe('WeatherPanel', () => {
  it('shows LOADING while the first data is on its way', () => {
    expect(render({ status: 'loading' })).toContain('LOADING')
  })
  it('shows WEATHER UNAVAILABLE when nothing could be loaded', () => {
    expect(render({ status: 'unavailable' })).toContain('WEATHER UNAVAILABLE')
  })
  it('shows NO LOCATION when the position is unknown', () => {
    expect(render({ status: 'no-location' })).toContain('NO LOCATION')
  })
  it('shows the data and when it was last updated', () => {
    const html = render({
      status: 'ready',
      entry: {
        data: createMockWeather(new Date(2026, 10, 15)),
        fetchedAt: new Date(2026, 10, 15, 14, 5).getTime(),
      },
    })
    for (const text of [
      'WEATHER',
      'TAIPEI',
      '24°C',
      'CLEAR',
      'HI 26°',
      'RAIN 10%',
      'UPDATED 14:05',
    ]) {
      expect(html).toContain(text)
    }
  })
})
