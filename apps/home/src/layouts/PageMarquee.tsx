import { AcMarquee } from '@mirumo/arcade-ui'
import { PlayerText } from '../clock/PlayerText'
import type { LayoutProps } from './LayoutProps'
import { stageScore } from './stageScore'

export function PageMarquee(props: LayoutProps) {
  const { title, player } = props.global
  return (
    <AcMarquee
      title={title}
      start={{ label: player.label, value: <PlayerText text={player.text} /> }}
      end={stageScore(props)}
    />
  )
}
