import { describe, expect, it } from 'vitest'
import { defaultConfig } from './defaults'
import { resolveConfig } from './resolve'

describe('resolveConfig', () => {
  it('returns the defaults when nothing is overridden', () => {
    expect(resolveConfig({})).toEqual(defaultConfig)
  })
  it('overrides a top-level value', () => {
    expect(resolveConfig({ layout: 'clock' }).layout).toBe('clock')
  })
  it('overrides one nested value and keeps its siblings', () => {
    const config = resolveConfig({ player: { text: 'READY' } })
    expect(config.player).toEqual({ label: defaultConfig.player.label, text: 'READY' })
  })
  it('replaces arrays instead of merging them', () => {
    expect(resolveConfig({ clock: { pellets: ['tr'] } }).clock.pellets).toEqual(['tr'])
  })
  it('ignores keys set to undefined', () => {
    expect(resolveConfig({ title: undefined }).title).toBe(defaultConfig.title)
  })
  it('does not modify the defaults', () => {
    const before = structuredClone(defaultConfig)
    resolveConfig({ player: { text: 'READY' }, clock: { pellets: [] } })
    expect(defaultConfig).toEqual(before)
  })
})

describe('defaultConfig', () => {
  it('starts with the time-only layout, MIRUMO title and a 1UP greeting', () => {
    expect(defaultConfig).toMatchObject({
      title: 'MIRUMO',
      player: { label: '1UP', text: 'HELLO' },
      layout: 'time-only',
    })
  })
})
