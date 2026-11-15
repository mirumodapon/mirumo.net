import { describe, expect, it } from 'vitest'
import { defaultWorkspace, resolveSettings } from '../config'
import {
  addWorkspace,
  deleteWorkspace,
  moveItem,
  normalizeSettings,
  removeAt,
  selectionAfterDelete,
} from './draft'

describe('moveItem', () => {
  it('moves an item by one step', () =>
    expect(moveItem(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']))
  it('leaves the list alone when the move goes out of bounds', () =>
    expect(moveItem(['a', 'b'], 0, -1)).toEqual(['a', 'b']))
  it('does not mutate the input', () => {
    const list = ['a', 'b']
    moveItem(list, 0, 1)
    expect(list).toEqual(['a', 'b'])
  })
})

describe('removeAt', () => {
  it('removes the item at the index', () =>
    expect(removeAt(['a', 'b', 'c'], 1)).toEqual(['a', 'c']))
})

describe('workspaces', () => {
  it('appends a fresh default workspace', () => {
    const settings = resolveSettings({})
    const next = addWorkspace(settings)
    expect(next.workspaces).toHaveLength(2)
    expect(next.workspaces[1]).toEqual(defaultWorkspace)
    expect(next.workspaces[1]).not.toBe(defaultWorkspace)
  })
  it('deletes a workspace', () => {
    const settings = resolveSettings({ workspaces: [{}, { layout: 'clock' }, {}] })
    expect(deleteWorkspace(settings, 1).workspaces.map((w) => w.layout)).toEqual([
      'default',
      'default',
    ])
  })
  it('never deletes the last workspace', () => {
    const settings = resolveSettings({})
    expect(deleteWorkspace(settings, 0)).toBe(settings)
  })
  it('moves the selection after a delete', () => {
    expect(selectionAfterDelete(1, 1)).toBe(0)
    expect(selectionAfterDelete(2, 1)).toBe(1)
    expect(selectionAfterDelete(0, 1)).toBe(0)
  })
})

describe('normalizeSettings', () => {
  const rows = [
    { name: ' A ', url: ' https://a.test/ ', icon: ' ' },
    { name: '', url: 'https://b.test/' },
    { name: 'C', url: '' },
    { name: 'D', url: 'javascript:alert(1)' },
  ]
  const expected = [
    { name: 'A', url: 'https://a.test/' },
    { name: 'https://b.test/', url: 'https://b.test/' },
  ]

  it('cleans link rows in every group and keeps empty groups', () => {
    const settings = resolveSettings({
      workspaces: [
        {
          linkGroups: [
            { title: ' WORK ', items: rows },
            { title: 'EMPTY', items: [] },
          ],
        },
      ],
    })
    const groups = normalizeSettings(settings).workspaces[0]!.linkGroups
    expect(groups).toEqual([
      { title: 'WORK', items: expected },
      { title: 'EMPTY', items: [] },
    ])
    expect(groups[0]!.items[0]).not.toHaveProperty('icon')
  })
  it('cleans social rows the same way', () => {
    const settings = resolveSettings({ workspaces: [{ socials: rows }] })
    expect(normalizeSettings(settings).workspaces[0]!.socials).toEqual(expected)
  })
  it('keeps a non-empty icon, trimmed', () => {
    const settings = resolveSettings({
      workspaces: [{ socials: [{ name: 'X', url: 'https://x.com/', icon: ' brand-x ' }] }],
    })
    expect(normalizeSettings(settings).workspaces[0]!.socials[0]!.icon).toBe('brand-x')
  })
  it('trims global and workspace text', () => {
    const settings = resolveSettings({
      global: { title: ' MIRUMO ', player: { text: ' HI ' } },
      workspaces: [{ weather: { place: ' TOKYO ' } }],
    })
    const next = normalizeSettings(settings)
    expect(next.global.title).toBe('MIRUMO')
    expect(next.global.player.text).toBe('HI')
    expect(next.workspaces[0]!.weather.place).toBe('TOKYO')
  })
})
