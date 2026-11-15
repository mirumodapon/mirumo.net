import { AcButton, AcCheckbox, AcField, AcFieldset, AcInput, AcSelect } from '@mirumo/arcade-ui'
import type { HomeLayout, HomeLinkGroup, WorkspaceConfig } from '../config'
import { moveItem, removeAt } from './draft'
import { ListEditor } from './ListEditor'

const layouts: HomeLayout[] = ['default', 'time-only', 'clock']

export type WorkspaceTabProps = {
  workspace: WorkspaceConfig
  onChange: (workspace: WorkspaceConfig) => void
}

export function WorkspaceTab({ workspace, onChange }: WorkspaceTabProps) {
  const set = (patch: Partial<WorkspaceConfig>) => onChange({ ...workspace, ...patch })
  const setGroups = (linkGroups: HomeLinkGroup[]) => set({ linkGroups })
  const { layout } = workspace
  const setGroup = (index: number, patch: Partial<HomeLinkGroup>) =>
    setGroups(
      workspace.linkGroups.map((group, i) => (i === index ? { ...group, ...patch } : group)),
    )

  return (
    <div className="ac:grid ac:gap-4">
      <AcFieldset legend="版面">
        <AcSelect
          aria-label="版面"
          value={workspace.layout}
          onChange={(event) => set({ layout: event.target.value as HomeLayout })}
        >
          {layouts.map((layout) => (
            <option key={layout} value={layout}>
              {layout}
            </option>
          ))}
        </AcSelect>
      </AcFieldset>

      <AcFieldset legend="時鐘" className="ac:flex ac:flex-wrap ac:gap-6">
        <AcCheckbox
          checked={workspace.clock.seconds}
          onChange={(event) =>
            set({ clock: { ...workspace.clock, seconds: event.target.checked } })
          }
        >
          顯示秒數
        </AcCheckbox>
        {layout !== 'clock' && (
          <AcCheckbox
            checked={workspace.clock.date}
            onChange={(event) => set({ clock: { ...workspace.clock, date: event.target.checked } })}
          >
            顯示日期
          </AcCheckbox>
        )}
      </AcFieldset>

      {layout === 'clock' && (
        <AcFieldset legend="標題列">
          <AcCheckbox
            checked={workspace.clockLayout.marquee}
            onChange={(event) => set({ clockLayout: { marquee: event.target.checked } })}
          >
            顯示標題列
          </AcCheckbox>
        </AcFieldset>
      )}

      {layout === 'default' && (
        <>
          <AcFieldset legend="天氣">
            <AcField label="地點">
              <AcInput
                value={workspace.weather.place}
                onChange={(event) =>
                  set({ weather: { ...workspace.weather, place: event.target.value } })
                }
              />
            </AcField>
          </AcFieldset>

          {workspace.linkGroups.map((group, index) => {
            const n = index + 1
            return (
              <AcFieldset key={index} legend={`連結群組 ${n}`} className="ac:grid ac:gap-3">
                <div className="ac:flex ac:items-center ac:gap-1.5">
                  <AcInput
                    aria-label={`群組 ${n} 標題`}
                    placeholder="群組標題"
                    value={group.title}
                    onChange={(event) => setGroup(index, { title: event.target.value })}
                    className="ac:flex-1"
                  />
                  <AcButton
                    size="sm"
                    variant="ghost"
                    prefix="arrow-up"
                    aria-label={`群組 ${n} 上移`}
                    disabled={index === 0}
                    onClick={() => setGroups(moveItem(workspace.linkGroups, index, -1))}
                  />
                  <AcButton
                    size="sm"
                    variant="ghost"
                    prefix="arrow-down"
                    aria-label={`群組 ${n} 下移`}
                    disabled={index === workspace.linkGroups.length - 1}
                    onClick={() => setGroups(moveItem(workspace.linkGroups, index, 1))}
                  />
                  <AcButton
                    size="sm"
                    variant="danger"
                    prefix="x"
                    aria-label={`刪除群組 ${n}`}
                    onClick={() => setGroups(removeAt(workspace.linkGroups, index))}
                  />
                </div>
                <ListEditor
                  kind="連結"
                  items={group.items}
                  onChange={(items) => setGroup(index, { items })}
                />
              </AcFieldset>
            )
          })}
          <div>
            <AcButton
              size="sm"
              variant="ghost"
              onClick={() => setGroups([...workspace.linkGroups, { title: '', items: [] }])}
            >
              ＋ 新增群組
            </AcButton>
          </div>

          <AcFieldset legend="社群">
            <ListEditor
              kind="社群"
              items={workspace.socials}
              onChange={(socials) => set({ socials })}
            />
          </AcFieldset>
        </>
      )}
    </div>
  )
}
