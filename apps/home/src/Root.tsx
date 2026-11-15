import { App } from './App'
import type { HomeSettings } from './config'
import { parseStage } from './workspace/stage'
import { useHash } from './workspace/useHash'

export function Root({ settings }: { settings: HomeSettings }) {
  const stage = parseStage(useHash(), settings.workspaces.length)
  return <App global={settings.global} workspace={settings.workspaces[stage - 1]!} stage={stage} />
}
