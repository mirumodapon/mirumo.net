import { describe, expect, it } from 'vitest'
import { defaultGlobal, defaultWorkspace } from './defaults'
import { resolveSettings } from './resolve'

describe('resolveSettings', () => {
  it('gives the defaults and one workspace for an empty file', () => {
    expect(resolveSettings({})).toEqual({ global: defaultGlobal, workspaces: [defaultWorkspace] })
    expect(resolveSettings({ workspaces: [] }).workspaces).toHaveLength(1)
  })
  it('overrides one nested global value and keeps its siblings', () => {
    expect(resolveSettings({ global: { player: { text: 'READY' } } }).global.player).toEqual({
      label: '1UP',
      text: 'READY',
    })
  })
  it('resolves each workspace on its own', () => {
    const [a, b] = resolveSettings({ workspaces: [{ linkGroups: [] }, {}] }).workspaces
    expect(a!.linkGroups).toEqual([])
    expect(b!.linkGroups).toEqual(defaultWorkspace.linkGroups)
  })
  it('replaces arrays instead of merging them', () => {
    const settings = resolveSettings({ workspaces: [{ clock: { pellets: ['tr'] } }] })
    expect(settings.workspaces[0]!.clock.pellets).toEqual(['tr'])
  })
  it('ignores keys the parts do not define, including the old shapes', () => {
    const [workspace] = resolveSettings({
      workspaces: [{ title: 'X', links: { items: [] } }],
    }).workspaces
    expect(workspace).not.toHaveProperty('title')
    expect(workspace).not.toHaveProperty('links')
    expect(workspace!.linkGroups).toEqual(defaultWorkspace.linkGroups)
  })
  it('falls back to the default when a value has the wrong type', () => {
    expect(
      resolveSettings({ workspaces: [{ linkGroups: 'x' }] }).workspaces[0]!.linkGroups,
    ).toEqual(defaultWorkspace.linkGroups)
    expect(
      resolveSettings({ global: { screen: { scanlines: 'yes' } } }).global.screen.scanlines,
    ).toBe(true)
    expect(resolveSettings({ workspaces: {} }).workspaces).toHaveLength(1)
  })
  it('treats a non-object file as empty', () => {
    const empty = { global: defaultGlobal, workspaces: [defaultWorkspace] }
    expect(resolveSettings(null)).toEqual(empty)
    expect(resolveSettings('x')).toEqual(empty)
  })
  it('does not modify the defaults', () => {
    const before = structuredClone({ defaultGlobal, defaultWorkspace })
    resolveSettings({
      global: { player: { text: 'READY' } },
      workspaces: [{ clock: { pellets: [] } }],
    })
    expect({ defaultGlobal, defaultWorkspace }).toEqual(before)
  })
})

describe('defaults', () => {
  it('has the MIRUMO globals', () => {
    expect(defaultGlobal).toEqual({
      title: 'MIRUMO',
      player: { label: '1UP', text: '' },
      stage: { label: 'STAGE' },
      screen: { scanlines: true },
      marquee: { visible: true },
    })
  })
  it('starts each workspace with the default layout, no links and the owner socials', () => {
    expect(defaultWorkspace).toMatchObject({
      layout: 'default',
      clockLayout: { marquee: false },
      weather: {
        title: 'WEATHER',
        place: 'TAIPEI',
        source: 'current',
        latitude: 25.033,
        longitude: 121.5654,
      },
    })
    expect(defaultWorkspace.linkGroups).toEqual([{ title: 'LINKS', items: [] }])
    expect(defaultWorkspace.socials).toEqual([
      { name: 'GitHub', url: 'https://github.com/mirumodapon', icon: 'brand-github' },
      { name: 'Instagram', url: 'https://www.instagram.com/mirumo_0915', icon: 'brand-instagram' },
    ])
  })
})
