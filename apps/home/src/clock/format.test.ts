import { describe, expect, it } from 'vitest'
import { formatClock, msUntilNextSecond } from './format'

describe('formatClock', () => {
  it('zero-pads hours, minutes and seconds', () => {
    expect(formatClock(new Date(2026, 10, 15, 9, 5, 3))).toEqual({
      time: '09:05',
      seconds: '03',
      date: '2026.11.15  星期日',
    })
  })
  it('uses 24-hour time', () => {
    expect(formatClock(new Date(2026, 10, 15, 23, 59, 59)).time).toBe('23:59')
  })
  it('rolls the date at midnight', () => {
    const next = formatClock(new Date(2026, 10, 16, 0, 0, 0))
    expect(next.time).toBe('00:00')
    expect(next.date).toBe('2026.11.16  星期一')
  })
  it('names every weekday', () => {
    const names = [15, 16, 17, 18, 19, 20, 21].map((d) =>
      formatClock(new Date(2026, 10, d)).date.slice(-1),
    )
    expect(names).toEqual(['日', '一', '二', '三', '四', '五', '六'])
  })
})

describe('msUntilNextSecond', () => {
  it('waits for the rest of the current second', () => {
    expect(msUntilNextSecond(1_700_000_000_250)).toBe(750)
  })
  it('waits a full second on an exact boundary', () => {
    expect(msUntilNextSecond(1_700_000_000_000)).toBe(1000)
  })
})
