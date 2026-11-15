import { describe, expect, it } from 'vitest'
import { fitShift, tooltipReducer, type TooltipEvent, type TooltipState } from './tooltipState'

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

describe('fitShift', () => {
  it('leaves a bubble that fits alone', () => expect(fitShift(20, 300, 390)).toBe(0))
  it('pushes a bubble past the left edge back in', () => expect(fitShift(-25, 235, 390)).toBe(33))
  it('pulls a bubble past the right edge back in', () => expect(fitShift(200, 420, 390)).toBe(-38))
  it('favours the left edge when the bubble is wider than the screen', () => {
    expect(fitShift(-50, 500, 390)).toBe(58)
  })
})
