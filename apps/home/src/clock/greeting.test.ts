import { describe, expect, it } from 'vitest'
import { greetingFor } from './greeting'

describe('greetingFor', () => {
  it('greets late at night before 5', () => {
    expect(greetingFor(0)).toBe('LATE NIGHT')
    expect(greetingFor(4)).toBe('LATE NIGHT')
  })
  it('says good morning from 5 to 11', () => {
    expect(greetingFor(5)).toBe('GOOD MORNING')
    expect(greetingFor(11)).toBe('GOOD MORNING')
  })
  it('says good afternoon from 12 to 17', () => {
    expect(greetingFor(12)).toBe('GOOD AFTERNOON')
    expect(greetingFor(17)).toBe('GOOD AFTERNOON')
  })
  it('says good evening from 18', () => {
    expect(greetingFor(18)).toBe('GOOD EVENING')
    expect(greetingFor(23)).toBe('GOOD EVENING')
  })
})
