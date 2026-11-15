import { describe, expect, it } from 'vitest'
import { isDoubleTap } from './doubleTap'

const tap = (time: number, x = 0, y = 0) => ({ time, x, y })

describe('isDoubleTap', () => {
  it('needs a previous tap', () => expect(isDoubleTap(undefined, tap(0))).toBe(false))
  it('accepts a second tap close in time and place', () => {
    expect(isDoubleTap(tap(0), tap(200, 3, 4))).toBe(true)
    expect(isDoubleTap(tap(0), tap(300))).toBe(true)
  })
  it('rejects a second tap that comes too late', () =>
    expect(isDoubleTap(tap(0), tap(301))).toBe(false))
  it('rejects a second tap too far away', () =>
    expect(isDoubleTap(tap(0), tap(100, 30, 0))).toBe(false))
})
