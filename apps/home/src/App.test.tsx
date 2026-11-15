import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { resolveConfig } from './config'

const render = (overrides: Parameters<typeof resolveConfig>[0], stage = 1) =>
  renderToStaticMarkup(<App config={resolveConfig(overrides)} stage={stage} />)

const renderTimeOnly = (overrides: Parameters<typeof resolveConfig>[0], stage = 1) =>
  render({ layout: 'time-only', ...overrides }, stage)

const datePattern = /\d{4}\.\d{2}\.\d{2}/

describe('time-only layout', () => {
  it('shows the MIRUMO title, the 1UP greeting and the TIME panel with the date', () => {
    const html = renderTimeOnly({})
    expect(html).toContain('MIRUMO')
    expect(html).toContain('1UP')
    expect(html).toContain('HELLO')
    expect(html).toContain('TIME')
    expect(html).toMatch(datePattern)
  })
  it('spans the full screen width', () => {
    expect(renderTimeOnly({})).not.toMatch(/ac:max-w-/)
  })
  it('centers the time and date inside the full-width card', () => {
    expect(renderTimeOnly({})).toMatch(/<div class="ac:text-center"><time/)
  })
  it('centers the card vertically in the space below the marquee', () => {
    const html = renderTimeOnly({})
    expect(html).toMatch(/ac:min-h-\[calc\(100dvh_-_3\.5rem\)\][^"]*ac:grid-rows-\[auto_1fr\]/)
    expect(html).toMatch(/<section[^>]*ac:self-center/)
  })
  it('spaces the card evenly above and below so the centering is symmetric', () => {
    const html = renderTimeOnly({})
    expect(html).not.toMatch(/ac:grid-rows-\[auto_1fr\][^"]*ac:gap-/)
    expect(html).toMatch(/<section[^>]*ac:my-6/)
  })
  it('shows the STAGE label and the hex stage number', () => {
    const html = renderTimeOnly({}, 2)
    expect(html).toContain('STAGE')
    expect(html).toContain('0x02')
  })
  it('uses the configured stage label', () => {
    expect(renderTimeOnly({ stage: { label: 'WORLD' } }, 1)).toContain('WORLD')
  })
  it('uses the configured greeting and title text', () => {
    const html = renderTimeOnly({ title: 'ARCADE', player: { text: 'READY' } })
    expect(html).toContain('ARCADE')
    expect(html).toContain('READY')
    expect(html).not.toContain('HELLO')
  })
  it('hides the date and seconds when turned off', () => {
    const html = renderTimeOnly({ clock: { date: false, seconds: false } })
    expect(html).not.toMatch(datePattern)
    expect(html).not.toMatch(/<time[^>]*>\d{2}:\d{2}<span/)
  })
})

describe('clock layout', () => {
  it('shows only the time', () => {
    const html = render({ layout: 'clock' })
    expect(html).toMatch(/\d{2}:\d{2}/)
    expect(html).not.toContain('MIRUMO')
    expect(html).not.toContain('1UP')
    expect(html).not.toContain('STAGE')
    expect(html).not.toContain('TIME')
    expect(html).not.toMatch(datePattern)
  })
})

describe('default layout', () => {
  it('shows the marquee, time, weather, links and social footer', () => {
    const html = render({})
    for (const text of [
      'STAGE',
      'TIME',
      'WEATHER',
      'TAIPEI',
      '24°C',
      'CLEAR',
      'FEELS 25°',
      'HUM 70%',
      'WIND 12km/h',
      'HI 26°',
      'LO 19°',
      'RAIN 10%',
      'LINKS',
      'Gmail',
      'href="https://mail.google.com/"',
      '<footer',
      'href="https://x.com/"',
      'target="_blank"',
    ]) {
      expect(html).toContain(text)
    }
    expect(html).toMatch(/\d{2}:\d{2}/)
    expect(html).toMatch(datePattern)
  })
  it("shows only today's weather, without the next days", () => {
    const html = render({})
    expect(html).not.toContain('TODAY')
    expect(html).not.toMatch(/>\d{2}\/\d{2}</)
  })
  it('hides the links panel when there are no links', () => {
    expect(render({ links: { items: [] } })).not.toContain('LINKS')
  })
  it('hides the footer when there are no socials', () => {
    expect(render({ socials: [] })).not.toContain('<footer')
  })
  it('shows the configured weather place', () => {
    expect(render({ weather: { place: 'TOKYO' } })).toContain('TOKYO')
  })
})
