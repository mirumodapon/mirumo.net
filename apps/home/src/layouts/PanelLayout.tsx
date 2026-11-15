import { AcMarquee, AcPanel } from '@mirumo/arcade-ui'
import { Clock } from '../clock/Clock'
import type { HomeConfig } from '../config'

export function PanelLayout({ config }: { config: HomeConfig }) {
  const { title, player, clock } = config
  return (
    <div className="ac:mx-auto ac:grid ac:max-w-xl ac:gap-6">
      <AcMarquee title={title} start={{ label: player.label, value: player.text }} />
      <AcPanel title={clock.title} pellets={clock.pellets}>
        <Clock seconds={clock.seconds} date={clock.date} />
      </AcPanel>
    </div>
  )
}
