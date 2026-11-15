import { App } from './App'
import type { HomeConfig } from './config'
import { parseStage } from './workspace/stage'
import { useHash } from './workspace/useHash'

export function Root({ workspaces }: { workspaces: HomeConfig[] }) {
  const stage = parseStage(useHash(), workspaces.length)
  return <App config={workspaces[stage - 1]!} stage={stage} />
}
