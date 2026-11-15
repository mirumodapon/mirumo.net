import { describe, expect, it } from 'vitest'
import { nextTabIndex } from './tabsKeys'

describe('nextTabIndex', () => {
  it('moves right and wraps', () => {
    expect(nextTabIndex('ArrowRight', 0, 3)).toBe(1)
    expect(nextTabIndex('ArrowRight', 2, 3)).toBe(0)
  })
  it('moves left and wraps', () => expect(nextTabIndex('ArrowLeft', 0, 3)).toBe(2))
  it('jumps to the ends', () => {
    expect(nextTabIndex('Home', 2, 3)).toBe(0)
    expect(nextTabIndex('End', 0, 3)).toBe(2)
  })
  it('ignores other keys', () => expect(nextTabIndex('a', 1, 3)).toBeUndefined())
})
