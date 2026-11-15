import { useState } from 'react'
import { App } from './App'
import { SettingsButton } from './settings/SettingsButton'
import { SettingsDialog } from './settings/SettingsDialog'
import { useSettings, type SettingsStore } from './settings/store'
import { parseStage } from './workspace/stage'
import { useHash } from './workspace/useHash'

export function Root({ store }: { store: SettingsStore }) {
  const settings = useSettings(store)
  const stage = parseStage(useHash(), settings.workspaces.length)
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(0)
  const close = () => setOpen(false)
  const openSettings = () => {
    setSession((value) => value + 1)
    setOpen(true)
  }
  return (
    <>
      <App global={settings.global} workspace={settings.workspaces[stage - 1]!} stage={stage} />
      {!open && <SettingsButton onOpen={openSettings} />}
      <SettingsDialog
        key={session}
        open={open}
        settings={settings}
        stage={stage}
        onSave={(next) => {
          store.save(next)
          close()
        }}
        onCancel={close}
        onReset={() => {
          if (!window.confirm('重設為設定檔？')) return
          store.reset()
          close()
        }}
      />
    </>
  )
}
