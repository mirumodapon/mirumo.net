import { AcButton, AcInput } from '@mirumo/arcade-ui'
import type { HomeLink } from '../config'
import { moveItem, removeAt } from './draft'

export type ListEditorProps = {
  kind: '連結' | '社群'
  items: HomeLink[]
  onChange: (items: HomeLink[]) => void
}

const row =
  'ac:grid ac:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_auto_auto_auto] ac:items-center ac:gap-1.5'

export function ListEditor({ kind, items, onChange }: ListEditorProps) {
  const update = (index: number, patch: Partial<HomeLink>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  return (
    <div className="ac:grid ac:gap-2">
      {items.map((item, index) => {
        const n = index + 1
        return (
          <div key={index} className={row}>
            <AcInput
              size="sm"
              aria-label={`${kind} ${n} 名稱`}
              placeholder="名稱"
              value={item.name}
              onChange={(event) => update(index, { name: event.target.value })}
            />
            <AcInput
              size="sm"
              aria-label={`${kind} ${n} 網址`}
              placeholder="https://"
              value={item.url}
              onChange={(event) => update(index, { url: event.target.value })}
            />
            <AcInput
              size="sm"
              aria-label={`${kind} ${n} icon`}
              placeholder="icon"
              value={item.icon ?? ''}
              onChange={(event) => update(index, { icon: event.target.value })}
            />
            <AcButton
              size="sm"
              variant="ghost"
              prefix="arrow-up"
              aria-label={`${kind} ${n} 上移`}
              disabled={index === 0}
              onClick={() => onChange(moveItem(items, index, -1))}
            />
            <AcButton
              size="sm"
              variant="ghost"
              prefix="arrow-down"
              aria-label={`${kind} ${n} 下移`}
              disabled={index === items.length - 1}
              onClick={() => onChange(moveItem(items, index, 1))}
            />
            <AcButton
              size="sm"
              variant="danger"
              prefix="x"
              aria-label={`${kind} ${n} 刪除`}
              onClick={() => onChange(removeAt(items, index))}
            />
          </div>
        )
      })}
      <div>
        <AcButton
          size="sm"
          variant="ghost"
          onClick={() => onChange([...items, { name: '', url: '' }])}
        >
          ＋ 新增{kind}
        </AcButton>
      </div>
    </div>
  )
}
