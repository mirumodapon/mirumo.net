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
    for (const text of ['WEATHER', 'TAIPEI', '24°C', 'CLEAR', 'HI 26°', 'RAIN 10%']) {
      expect(html).toContain(text)
    }
    expect(html).toMatch(/UPDATED <time[^>]*>14:05<\/time>/)
  })
})

describe('refreshing from the update time', () => {
  const ready = {
    status: 'ready' as const,
    entry: {
      data: createMockWeather(new Date(2026, 10, 15)),
      fetchedAt: new Date(2026, 10, 15, 14, 5).getTime(),
    },
  }
  it('marks the update time as a double-click refresh when it can refresh', () => {
    const html = renderToStaticMarkup(
      <WeatherPanel title="WEATHER" place="TAIPEI" state={ready} onRefresh={() => {}} />,
    )
    expect(html).toMatch(
      /<time(?=[^>]*title="雙擊重新取得天氣")(?=[^>]*ac:select-none)(?=[^>]*dateTime="2026-11-15T)[^>]*>14:05<\/time>/i,
    )
  })
  it('lets a touch double tap refresh without zooming', () => {
    const html = renderToStaticMarkup(
      <WeatherPanel title="WEATHER" place="TAIPEI" state={ready} onRefresh={() => {}} />,
    )
    expect(html).toMatch(/<time[^>]*style="touch-action:manipulation"/)
  })
  it('shows a plain time without a refresh handler', () => {
    expect(render(ready)).not.toContain('雙擊重新取得天氣')
  })
})

describe('data source credits', () => {
  const states = [
    { status: 'loading' as const },
    { status: 'unavailable' as const },
    { status: 'no-location' as const },
    {
      status: 'ready' as const,
      entry: { data: createMockWeather(new Date(2026, 10, 15)), fetchedAt: Date.now() },
    },
  ]
  it('offers an info button with the weather and place-name credits in every state', () => {
    for (const state of states) {
      const html = render(state)
      expect(html).toContain('aria-label="資料來源"')
      expect(html).toContain('ti-info-circle')
      expect(html).toContain('天氣資料：')
      expect(html).toContain('href="https://open-meteo.com/"')
      expect(html).toContain('© OpenStreetMap contributors')
      expect(html).toContain('href="https://www.openstreetmap.org/copyright"')
    }
  })
  it('links the info button to its tooltip', () => {
    const html = render({ status: 'loading' })
    const describedBy = html.match(
      /aria-label="資料來源"[^>]*aria-describedby="([^"]+)"|aria-describedby="([^"]+)"[^>]*aria-label="資料來源"/,
    )
    const id = describedBy?.[1] ?? describedBy?.[2]
    expect(id).toBeTruthy()
    expect(html).toContain(`role="tooltip" id="${id}"`)
  })
})
