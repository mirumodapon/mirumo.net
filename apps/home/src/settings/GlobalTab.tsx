import { AcButton, AcCheckbox, AcField, AcFieldset, AcInput } from '@mirumo/arcade-ui'
import type { GlobalConfig, HomeSettings } from '../config'
import { formatStage } from '../workspace/stage'
import { addWorkspace, deleteWorkspace, selectionAfterDelete } from './draft'

export type GlobalTabProps = {
  settings: HomeSettings
  selected: number
  onSelect: (index: number) => void
  onChange: (settings: HomeSettings) => void
  onReset: () => void
}

export function GlobalTab({ settings, selected, onSelect, onChange, onReset }: GlobalTabProps) {
  const { global, workspaces } = settings
  const set = (patch: Partial<GlobalConfig>) =>
    onChange({ ...settings, global: { ...global, ...patch } })

  return (
    <div className="ac:grid ac:gap-4">
      <AcFieldset legend="文字" className="ac:grid ac:gap-3">
        <AcField label="標題">
          <AcInput value={global.title} onChange={(event) => set({ title: event.target.value })} />
        </AcField>
        <AcField label="1UP 標籤">
          <AcInput
            value={global.player.label}
            onChange={(event) => set({ player: { ...global.player, label: event.target.value } })}
          />
        </AcField>
        <AcField label="1UP 文字">
          <AcInput
            value={global.player.text}
            onChange={(event) => set({ player: { ...global.player, text: event.target.value } })}
          />
        </AcField>
        <AcField label="STAGE 標籤">
          <AcInput
            value={global.stage.label}
            onChange={(event) => set({ stage: { label: event.target.value } })}
          />
        </AcField>
      </AcFieldset>

      <AcFieldset legend="畫面">
        <AcCheckbox
          checked={global.screen.scanlines}
          onChange={(event) => set({ screen: { scanlines: event.target.checked } })}
        >
          掃描線
        </AcCheckbox>
      </AcFieldset>

      <AcFieldset legend="Workspace" className="ac:grid ac:gap-2">
        {workspaces.map((workspace, index) => {
          const stage = formatStage(index + 1)
          return (
            <div key={index} className="ac:flex ac:items-center ac:gap-1.5">
              <AcButton
                size="sm"
                variant={index === selected ? 'primary' : 'ghost'}
                aria-pressed={index === selected}
                onClick={() => onSelect(index)}
                className="ac:flex-1 ac:justify-start"
              >
                {stage} · {workspace.layout}
              </AcButton>
              <AcButton
                size="sm"
                variant="danger"
                prefix="x"
                aria-label={`刪除 ${stage}`}
                disabled={workspaces.length <= 1}
                onClick={() => {
                  onChange(deleteWorkspace(settings, index))
                  onSelect(selectionAfterDelete(selected, index))
                }}
              />
            </div>
          )
        })}
        <div>
          <AcButton size="sm" variant="ghost" onClick={() => onChange(addWorkspace(settings))}>
            ＋ 新增 workspace
          </AcButton>
        </div>
      </AcFieldset>

      <div>
        <AcButton variant="danger" onClick={onReset}>
          重設為設定檔
        </AcButton>
      </div>
    </div>
  )
}
