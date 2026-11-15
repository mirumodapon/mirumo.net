import { useEffect, useState } from 'react'
import { msUntilNextSecond } from './format'

export function useNow(): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const schedule = () => {
      timer = setTimeout(() => {
        setNow(new Date())
        schedule()
      }, msUntilNextSecond(Date.now()))
    }
    schedule()
    return () => clearTimeout(timer)
  }, [])
  return now
}
