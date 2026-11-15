import { Clock } from '../clock/Clock'
import type { LayoutProps } from './LayoutProps'

export function ClockLayout({ workspace }: LayoutProps) {
  return (
    <div className="ac:grid ac:min-h-[calc(100dvh_-_3.5rem)] ac:place-items-center">
      <Clock size="hero" seconds={workspace.clock.seconds} date={false} />
    </div>
  )
}
