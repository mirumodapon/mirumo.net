import { AcPanel } from '@mirumo/arcade-ui'
import { Clock } from '../clock/Clock'
import type { HomeConfig } from '../config'

export function TimeOnlyLayout({ config }: { config: HomeConfig }) {
  const { clock } = config
  return (
    <div className="ac:grid ac:min-h-[calc(100dvh_-_3.5rem)] ac:place-items-center">
      <AcPanel aria-label={clock.title} pellets={clock.pellets} className="ac:w-fit ac:max-w-full">
        <Clock size="card" seconds={clock.seconds} date={false} />
      </AcPanel>
    </div>
  )
}
