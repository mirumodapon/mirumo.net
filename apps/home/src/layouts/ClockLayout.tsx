import { Clock } from '../clock/Clock'
import type { HomeConfig } from '../config'

export function ClockLayout({ config }: { config: HomeConfig }) {
  return (
    <div className="ac:grid ac:min-h-[calc(100dvh_-_3.5rem)] ac:place-items-center">
      <Clock size="hero" seconds={config.clock.seconds} date={false} />
    </div>
  )
}
