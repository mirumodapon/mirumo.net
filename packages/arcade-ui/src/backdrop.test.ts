import { describe, expect, it } from 'vitest'
import { isOutsideRect } from './backdrop'

const rect = { left: 100, top: 50, right: 500, bottom: 450 }

describe('isOutsideRect', () => {
  it('is false for a point inside the frame, including its padding', () => {
    expect(isOutsideRect(rect, 300, 250)).toBe(false)
    expect(isOutsideRect(rect, 101, 51)).toBe(false)
  })
  it('is false on the edge', () => {
    expect(isOutsideRect(rect, 100, 50)).toBe(false)
    expect(isOutsideRect(rect, 500, 450)).toBe(false)
  })
  it('is true for a point on the backdrop', () => {
    expect(isOutsideRect(rect, 50, 250)).toBe(true)
    expect(isOutsideRect(rect, 300, 460)).toBe(true)
  })
})
