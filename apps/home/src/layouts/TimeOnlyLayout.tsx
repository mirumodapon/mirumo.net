import { AcMarquee, AcPanel } from '@mirumo/arcade-ui'
import { Clock } from '../clock/Clock'
import type { HomeConfig } from '../config'

export function TimeOnlyLayout({ config }: { config: HomeConfig }) {
  const { title, player, clock } = config
  return (
    <div className="ac:grid ac:min-h-[calc(100dvh_-_3.5rem)] ac:grid-rows-[auto_1fr]">
      <AcMarquee title={title} start={{ label: player.label, value: player.text }} />
      <AcPanel title={clock.title} pellets={clock.pellets} className="ac:my-6 ac:self-center">
        <div className="ac:text-center">
          <Clock seconds={clock.seconds} date={clock.date} />
        </div>
      </AcPanel>
    </div>
  )
}
