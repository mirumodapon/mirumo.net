import type { GlobalConfig, WorkspaceConfig } from '../config'

export type LayoutProps = {
  global: GlobalConfig
  workspace: WorkspaceConfig
  stage: number
  onNextStage?: () => void
}
