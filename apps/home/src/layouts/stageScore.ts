import type { AcMarqueeScore } from '@mirumo/arcade-ui'
import { formatStage } from '../workspace/stage'
import type { LayoutProps } from './LayoutProps'

export function stageScore({ global, stage, onNextStage }: LayoutProps): AcMarqueeScore {
  return {
    label: global.stage.label,
    value: formatStage(stage),
    ...(onNextStage ? { hint: '雙擊切換 workspace', onDoubleClick: onNextStage } : {}),
  }
}
