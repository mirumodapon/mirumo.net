import { App } from './App'
import { useSettings, type SettingsStore } from './settings/store'
import { parseStage } from './workspace/stage'
import { useHash } from './workspace/useHash'

export function Root({ store }: { store: SettingsStore }) {
  const settings = useSettings(store)
  const stage = parseStage(useHash(), settings.workspaces.length)
  return <App global={settings.global} workspace={settings.workspaces[stage - 1]!} stage={stage} />
}
