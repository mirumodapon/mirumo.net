import { AcButton, AcDialog, AcTabs } from '@mirumo/arcade-ui'
import { useState } from 'react'
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

export function SettingsDialog({
  open,
  settings,
  stage,
  onSave,
  onCancel,
  onReset,
}: SettingsDialogProps) {
  const [draft, setDraft] = useState(settings)
  const [selected, setSelected] = useState(stage - 1)

  const index = Math.min(selected, draft.workspaces.length - 1)
  const workspace = draft.workspaces[index]!
  const setWorkspace = (next: WorkspaceConfig) =>
    setDraft({
      ...draft,
      workspaces: draft.workspaces.map((item, i) => (i === index ? next : item)),
    })

  return (
    <AcDialog
      open={open}
      title="SETTINGS"
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
      <AcTabs
        aria-label="SETTINGS"
        tabs={[
          {
            id: 'workspace',
            label: `STAGE ${formatStage(index + 1)}`,
            content: <WorkspaceTab workspace={workspace} onChange={setWorkspace} />,
          },
          {
            id: 'global',
            label: 'GLOBAL',
            content: (
              <GlobalTab
                settings={draft}
                selected={index}
                onSelect={setSelected}
                onChange={setDraft}
                onReset={onReset}
              />
            ),
          },
        ]}
      />
    </AcDialog>
  )
}
