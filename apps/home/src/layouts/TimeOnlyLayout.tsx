import { AcPanel } from '@mirumo/arcade-ui'
import { clsx } from 'clsx'
import { Clock } from '../clock/Clock'
import type { LayoutProps } from './LayoutProps'
import { PageMarquee } from './PageMarquee'

export function TimeOnlyLayout(props: LayoutProps) {
  const { global, workspace } = props
  const { clock } = workspace
  const showMarquee = global.marquee.visible
  return (
    <div
      className={clsx(
        'ac:grid ac:min-h-[calc(100dvh_-_3.5rem)]',
        showMarquee ? 'ac:grid-rows-[auto_1fr]' : 'ac:items-center',
      )}
    >
      {showMarquee && <PageMarquee {...props} />}
      <AcPanel title={clock.title} pellets={clock.pellets} className="ac:my-6 ac:self-center">
        <div className="ac:text-center">
          <Clock seconds={clock.seconds} date={clock.date} />
        </div>
      </AcPanel>
    </div>
  )
}
