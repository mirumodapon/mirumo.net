import { describe, expect, it } from 'vitest'
import { placeLabel } from './placeLabel'

describe('placeLabel', () => {
  it('uses the configured place for a fixed location', () => {
    expect(placeLabel({ source: 'fixed', place: 'TOKYO' }, { name: 'OSAKA', failed: false })).toBe(
      'TOKYO',
    )
  })
  it('uses the looked-up city for the current location', () => {
    expect(
      placeLabel({ source: 'current', place: 'TAIPEI' }, { name: 'OSAKA', failed: false }),
    ).toBe('OSAKA')
  })
  it('falls back to HERE when the lookup failed', () => {
    expect(placeLabel({ source: 'current', place: 'TAIPEI' }, { failed: true })).toBe('HERE')
  })
  it('stays empty while the lookup is pending', () => {
    expect(placeLabel({ source: 'current', place: 'TAIPEI' }, { failed: false })).toBe('')
  })
})
