import { AcButton, AcDialog, AcTabs, type AcTab } from '@mirumo/arcade-ui'
import { useEffect, useRef, useState } from 'react'
import type { HomeSettings, WorkspaceConfig } from '../config'
import { formatStage } from '../workspace/stage'
import { normalizeSettings } from './draft'
import { GlobalTab } from './GlobalTab'
import { WorkspaceTab } from './WorkspaceTab'

export type SettingsDialogProps = {
  open: boolean
  settings: HomeSettings
  stage: number
  onSave: (settings: HomeSettings) => void
  onCancel: () => void
  onReset: () => void
}

const stageTab = (index: number) => `stage-${index}`

export function SettingsDialog({
  open,
  settings,
  stage,
  onSave,
  onCancel,
  onReset,
}: SettingsDialogProps) {
  const [draft, setDraft] = useState(settings)
  const [tab, setTab] = useState(stageTab(stage - 1))
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    tabsRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus()
  }, [open])

  const setWorkspace = (index: number, next: WorkspaceConfig) =>
    setDraft({
      ...draft,
      workspaces: draft.workspaces.map((item, i) => (i === index ? next : item)),
    })

  const tabs: AcTab[] = [
    {
      id: 'global',
      label: 'GLOBAL',
      content: <GlobalTab settings={draft} onChange={setDraft} onReset={onReset} />,
    },
    ...draft.workspaces.map((workspace, index) => ({
      id: stageTab(index),
      label: `STAGE ${formatStage(index + 1)}`,
      content: (
        <WorkspaceTab workspace={workspace} onChange={(next) => setWorkspace(index, next)} />
      ),
    })),
  ]
  const value = tabs.some((item) => item.id === tab) ? tab : 'global'

  return (
    <AcDialog
      open={open}
      title="SETTINGS"
      closeOnBackdrop
      onClose={onCancel}
      actions={
        <>
          <AcButton variant="ghost" onClick={onCancel}>
            取消
          </AcButton>
          <AcButton onClick={() => onSave(normalizeSettings(draft))}>儲存</AcButton>
        </>
      }
    >
      <div ref={tabsRef} className="ac:flex ac:min-h-0 ac:flex-1 ac:flex-col">
        <AcTabs
          aria-label="SETTINGS"
          className="ac:flex-1"
          tabs={tabs}
          value={value}
          onValueChange={setTab}
        />
      </div>
    </AcDialog>
  )
}
