import { AcMarquee, AcPanel } from '@mirumo/arcade-ui'
import { Clock } from '../clock/Clock'
import { formatStage } from '../workspace/stage'
import type { LayoutProps } from './LayoutProps'

export function TimeOnlyLayout({ global, workspace, stage }: LayoutProps) {
  const { title, player } = global
  const { clock } = workspace
  return (
    <div className="ac:grid ac:min-h-[calc(100dvh_-_3.5rem)] ac:grid-rows-[auto_1fr]">
      <AcMarquee
        title={title}
        start={{ label: player.label, value: player.text }}
        end={{ label: global.stage.label, value: formatStage(stage) }}
      />
      <AcPanel title={clock.title} pellets={clock.pellets} className="ac:my-6 ac:self-center">
        <div className="ac:text-center">
          <Clock seconds={clock.seconds} date={clock.date} />
        </div>
      </AcPanel>
    </div>
  )
}
