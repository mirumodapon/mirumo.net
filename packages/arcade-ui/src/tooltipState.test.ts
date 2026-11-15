import { describe, expect, it } from 'vitest'
import { tooltipReducer, type TooltipEvent, type TooltipState } from './tooltipState'

const closed: TooltipState = { open: false, pinned: false }
const run = (...events: TooltipEvent[]) => events.reduce(tooltipReducer, closed)

describe('tooltipReducer', () => {
  it('opens on hover and closes when the pointer leaves', () => {
    expect(run('hover-in')).toEqual({ open: true, pinned: false })
    expect(run('hover-in', 'hover-out')).toEqual(closed)
  })
  it('opens on focus and closes on blur', () => {
    expect(run('focus')).toEqual({ open: true, pinned: false })
    expect(run('focus', 'blur')).toEqual(closed)
  })
  it('toggles and pins on tap', () => {
    expect(run('tap')).toEqual({ open: true, pinned: true })
    expect(run('tap', 'tap')).toEqual(closed)
  })
  it('stays open after a tap when hover or focus ends', () => {
    expect(run('tap', 'hover-out')).toEqual({ open: true, pinned: true })
    expect(run('tap', 'blur')).toEqual({ open: true, pinned: true })
  })
  it('closes on Escape or an outside press, even when pinned', () => {
    expect(run('focus', 'escape')).toEqual(closed)
    expect(run('tap', 'outside')).toEqual(closed)
  })
})
