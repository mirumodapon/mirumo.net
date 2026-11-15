import { clsx } from 'clsx'
import { Clock } from '../clock/Clock'
import type { LayoutProps } from './LayoutProps'
import { PageMarquee } from './PageMarquee'

export function ClockLayout(props: LayoutProps) {
  const { workspace } = props
  const showMarquee = workspace.clockLayout.marquee
  return (
    <div
      className={clsx(
        'ac:grid ac:min-h-[calc(100dvh_-_3.5rem)]',
        showMarquee ? 'ac:grid-rows-[auto_1fr]' : 'ac:place-items-center',
      )}
    >
      {showMarquee && <PageMarquee {...props} />}
      <div className="ac:grid ac:place-items-center">
        <Clock size="hero" seconds={workspace.clock.seconds} date={false} />
      </div>
    </div>
  )
}
