import { clsx } from 'clsx'
import { formatClock } from './format'
import { useNow } from './useNow'

export type ClockSize = 'panel' | 'hero'

export type ClockProps = {
  seconds?: boolean
  date?: boolean
  size?: ClockSize
}

const sizes: Record<ClockSize, string> = {
  panel: 'ac:text-[length:clamp(34px,7vw,64px)]',
  hero: 'ac:text-[length:clamp(48px,14vw,160px)]',
}

export function Clock({ seconds = true, date = true, size = 'panel' }: ClockProps) {
  const now = useNow()
  const parts = formatClock(now)
  return (
    <>
      <time
        dateTime={now.toISOString()}
        className={clsx(
          'ac:block ac:font-pixel ac:leading-[1.1] ac:whitespace-nowrap ac:text-primary ac:tabular-nums ac:text-shadow-glow',
          sizes[size],
        )}
      >
        {parts.time}
        {seconds && (
          <span className="ac:ml-[0.4em] ac:text-[0.4em] ac:text-warning">{parts.seconds}</span>
        )}
      </time>
      {date && <p className="ac:m-0 ac:mt-3.5 ac:text-ink">{parts.date}</p>}
    </>
  )
}
