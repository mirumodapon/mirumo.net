import { describe, expect, it } from 'vitest'
import { formatStage, nextStage, parseStage } from './stage'

describe('parseStage', () => {
  it('defaults to 1 without a hash', () => expect(parseStage('', 3)).toBe(1))
  it('reads a decimal hash', () => expect(parseStage('#2', 3)).toBe(2))
  it('reads a hex hash', () => expect(parseStage('#0x02', 3)).toBe(2))
  it('reads an uppercase hex prefix', () => expect(parseStage('#0X03', 3)).toBe(3))
  it('falls back to 1 for non-numbers', () => {
    expect(parseStage('#abc', 3)).toBe(1)
    expect(parseStage('#2abc', 3)).toBe(1)
  })
  it('falls back to 1 when out of range', () => {
    expect(parseStage('#0', 2)).toBe(1)
    expect(parseStage('#9', 2)).toBe(1)
    expect(parseStage('#99999999999999999999', 2)).toBe(1)
  })
})

describe('formatStage', () => {
  it('pads to two uppercase hex digits', () => {
    expect([1, 10, 255].map(formatStage)).toEqual(['0x01', '0x0A', '0xFF'])
  })
  it('grows past two digits', () => expect(formatStage(256)).toBe('0x100'))
})

describe('nextStage', () => {
  it('moves to the next workspace', () => expect(nextStage(1, 3)).toBe(2))
  it('wraps from the last workspace to the first', () => expect(nextStage(3, 3)).toBe(1))
  it('stays put with a single workspace', () => expect(nextStage(1, 1)).toBe(1))
})
