import { formatClock } from './format'
import { useNow } from './useNow'

export function Clock() {
  const now = useNow()
  const { time, seconds, date } = formatClock(now)
  return (
    <>
      <time
        dateTime={now.toISOString()}
        className="ac:block ac:font-pixel ac:text-[length:clamp(34px,7vw,64px)] ac:leading-[1.1] ac:text-primary ac:tabular-nums ac:text-shadow-glow"
      >
        {time}
        <span className="ac:ml-[0.4em] ac:text-[0.4em] ac:text-warning">{seconds}</span>
      </time>
      <p className="ac:m-0 ac:mt-3.5 ac:text-ink">{date}</p>
    </>
  )
}
