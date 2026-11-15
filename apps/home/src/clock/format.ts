export type ClockParts = { time: string; seconds: string; date: string }

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const pad = (n: number) => String(n).padStart(2, '0')

export function formatClock(now: Date): ClockParts {
  return {
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    seconds: pad(now.getSeconds()),
    date: `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}  星期${weekdays[now.getDay()]}`,
  }
}

export function msUntilNextSecond(nowMs: number): number {
  return 1000 - (nowMs % 1000)
}
