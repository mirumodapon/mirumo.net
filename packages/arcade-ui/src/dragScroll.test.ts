import { describe, expect, it } from 'vitest'
import { isDrag } from './dragScroll'

describe('isDrag', () => {
  it('treats a small movement as a click', () => {
    expect(isDrag(0)).toBe(false)
    expect(isDrag(3)).toBe(false)
    expect(isDrag(-3)).toBe(false)
  })
  it('treats a longer movement in either direction as a drag', () => {
    expect(isDrag(5)).toBe(true)
    expect(isDrag(-5)).toBe(true)
  })
})
