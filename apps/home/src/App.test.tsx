import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { resolveConfig } from './config'

const render = (overrides: Parameters<typeof resolveConfig>[0]) =>
  renderToStaticMarkup(<App config={resolveConfig(overrides)} />)

const datePattern = /\d{4}\.\d{2}\.\d{2}/

describe('panel layout', () => {
  it('shows the MIRUMO title, the 1UP greeting and the TIME panel with the date', () => {
    const html = render({})
    expect(html).toContain('MIRUMO')
    expect(html).toContain('1UP')
    expect(html).toContain('HELLO')
    expect(html).toContain('TIME')
    expect(html).toMatch(datePattern)
  })
  it('spans the full screen width', () => {
    expect(render({})).not.toMatch(/ac:max-w-/)
  })
  it('centers the time and date inside the full-width card', () => {
    expect(render({})).toMatch(/<div class="ac:text-center"><time/)
  })
  it('centers the card vertically in the space below the marquee', () => {
    const html = render({})
    expect(html).toMatch(/ac:min-h-\[calc\(100dvh_-_3\.5rem\)\][^"]*ac:grid-rows-\[auto_1fr\]/)
    expect(html).toMatch(/<section[^>]*ac:self-center/)
  })
  it('spaces the card evenly above and below so the centering is symmetric', () => {
    const html = render({})
    expect(html).not.toMatch(/ac:grid-rows-\[auto_1fr\][^"]*ac:gap-/)
    expect(html).toMatch(/<section[^>]*ac:my-6/)
  })
  it('uses the configured greeting and title text', () => {
    const html = render({ title: 'ARCADE', player: { text: 'READY' } })
    expect(html).toContain('ARCADE')
    expect(html).toContain('READY')
    expect(html).not.toContain('HELLO')
  })
  it('hides the date and seconds when turned off', () => {
    const html = render({ clock: { date: false, seconds: false } })
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
    expect(html).not.toContain('TIME')
    expect(html).not.toMatch(datePattern)
  })
})

describe('time-only layout', () => {
  it('shows only the time inside a card sized to fit it', () => {
    const html = render({ layout: 'time-only' })
    expect(html).toMatch(/\d{2}:\d{2}/)
    expect(html).toContain('<section')
    expect(html).toMatch(/<section[^>]*ac:w-fit/)
    expect(html).not.toContain('MIRUMO')
    expect(html).not.toContain('1UP')
    expect(html).not.toContain('>TIME<')
    expect(html).not.toMatch(datePattern)
  })
  it('keeps the card labelled for screen readers', () => {
    expect(render({ layout: 'time-only' })).toMatch(/<section[^>]*aria-label="TIME"/)
  })
})
