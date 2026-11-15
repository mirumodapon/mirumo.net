import { AcMarquee, AcPanel } from '@mirumo/arcade-ui'
import { Clock } from '../clock/Clock'
import type { LayoutProps } from './LayoutProps'
import { stageScore } from './stageScore'

export function TimeOnlyLayout(props: LayoutProps) {
  const { global, workspace } = props
  const { title, player } = global
  const { clock } = workspace
  return (
    <div className="ac:grid ac:min-h-[calc(100dvh_-_3.5rem)] ac:grid-rows-[auto_1fr]">
      <AcMarquee
        title={title}
        start={{ label: player.label, value: player.text }}
        end={stageScore(props)}
      />
      <AcPanel title={clock.title} pellets={clock.pellets} className="ac:my-6 ac:self-center">
        <div className="ac:text-center">
          <Clock seconds={clock.seconds} date={clock.date} />
        </div>
      </AcPanel>
    </div>
  )
}
