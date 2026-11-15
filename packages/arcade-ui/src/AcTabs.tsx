import { clsx } from 'clsx'
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useDragScroll } from './dragScroll'
import { nextTabIndex } from './tabsKeys'

export type AcTab = { id: string; label: ReactNode; content: ReactNode }

export type AcTabsProps = {
  tabs: AcTab[]
  value?: string
  onValueChange?: (id: string) => void
  defaultValue?: string
  'aria-label'?: string
  className?: string
}

const tabClass = clsx(
  'ac:shrink-0 ac:cursor-pointer ac:whitespace-nowrap ac:border-b-2 ac:px-3 ac:py-2 ac:font-pixel ac:text-[10px] ac:transition-colors',
  'ac:focus-visible:outline-2 ac:focus-visible:outline-offset-2 ac:focus-visible:outline-info',
)

const tablist = clsx(
  'ac:flex ac:shrink-0 ac:gap-2 ac:overflow-x-auto ac:[scrollbar-width:none]',
  'ac:shadow-[inset_0_-2px_0_var(--ac-color-wall)]',
)

export function AcTabs({
  tabs,
  value,
  onValueChange,
  defaultValue,
  'aria-label': ariaLabel,
  className,
}: AcTabsProps) {
  const baseId = useId()
  const [inner, setInner] = useState(defaultValue ?? tabs[0]?.id)
  const selected = value ?? inner
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const dragScroll = useDragScroll<HTMLDivElement>()

  const select = (id: string) => {
    if (value === undefined) setInner(id)
    onValueChange?.(id)
  }

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const next = nextTabIndex(event.key, index, tabs.length)
    if (next === undefined) return
    event.preventDefault()
    const tab = tabs[next]
    if (!tab) return
    select(tab.id)
    refs.current[next]?.focus()
  }

  return (
    <div className={clsx('ac:flex ac:min-h-0 ac:flex-col', className)}>
      <div role="tablist" aria-label={ariaLabel} className={tablist} {...dragScroll}>
        {tabs.map((tab, index) => {
          const active = tab.id === selected
          return (
            <button
              key={tab.id}
              ref={(node) => {
                refs.current[index] = node
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-controls={`${baseId}-panel-${tab.id}`}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              className={clsx(
                tabClass,
                active
                  ? 'ac:border-primary ac:text-primary'
                  : 'ac:border-transparent ac:text-muted ac:hover:text-ink',
              )}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== selected}
          className="ac:min-h-0 ac:flex-1 ac:overflow-auto ac:pt-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
