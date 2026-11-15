import { describe, expect, it } from 'vitest'
import { defaultConfig } from './defaults'
import { resolveConfig, resolveWorkspaces } from './resolve'

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
  it('starts with the default layout and the prototype content', () => {
    expect(defaultConfig).toMatchObject({
      title: 'MIRUMO',
      player: { label: '1UP', text: 'HELLO' },
      layout: 'default',
      stage: { label: 'STAGE' },
      weather: { title: 'WEATHER', place: 'TAIPEI' },
    })
    expect(defaultConfig.links.title).toBe('LINKS')
    expect(defaultConfig.links.items).toHaveLength(6)
    expect(defaultConfig.links.items[0]).toEqual({ name: 'Gmail', url: 'https://mail.google.com/' })
    expect(defaultConfig.socials).toHaveLength(4)
    expect(defaultConfig.socials[0]).toEqual({
      name: 'GitHub',
      url: 'https://github.com/',
      icon: 'brand-github',
    })
  })
  it('replaces the link list instead of merging it', () => {
    const items = [{ name: 'A', url: 'https://a.test/' }]
    const config = resolveConfig({ links: { items } })
    expect(config.links.items).toEqual(items)
    expect(config.links.title).toBe('LINKS')
  })
})

describe('resolveWorkspaces', () => {
  it('gives one default workspace when none are listed', () => {
    expect(resolveWorkspaces({})).toEqual([defaultConfig])
    expect(resolveWorkspaces({ workspaces: [] })).toEqual([defaultConfig])
  })
  it('resolves each workspace over the defaults on its own', () => {
    const [a, b] = resolveWorkspaces({
      workspaces: [{ player: { text: 'WORK' }, clock: { pellets: ['tr'] } }, { layout: 'clock' }],
    })
    expect(a!.player.text).toBe('WORK')
    expect(a!.layout).toBe(defaultConfig.layout)
    expect(b!.player.text).toBe(defaultConfig.player.text)
    expect(b!.clock.pellets).toEqual(defaultConfig.clock.pellets)
    expect(b!.layout).toBe('clock')
  })
})
