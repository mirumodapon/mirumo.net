import { clsx } from 'clsx'
import {
  cloneElement,
  useEffect,
  useId,
  useLayoutEffect,
  useReducer,
  useRef,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { fitShift, tooltipReducer } from './tooltipState'

type TriggerProps = HTMLAttributes<HTMLElement>

export type AcTooltipProps = {
  content: ReactNode
  children: ReactElement<TriggerProps>
  align?: 'start' | 'end'
}

const leaveGrace = 150

const bubble = clsx(
  'ac:absolute ac:top-full ac:z-[120] ac:mt-2 ac:w-max ac:max-w-[min(320px,calc(100vw_-_32px))]',
  'ac:rounded-tile ac:border-2 ac:border-wall ac:bg-surface ac:p-3 ac:shadow-[0_0_12px_var(--ac-color-wall-glow)]',
  'ac:text-left ac:font-body ac:text-[12px] ac:leading-[1.6] ac:font-normal ac:text-ink ac:normal-case',
)

export function AcTooltip({ content, children, align = 'start' }: AcTooltipProps) {
  const id = useId()
  const [state, send] = useReducer(tooltipReducer, { open: false, pinned: false })
  const wrapper = useRef<HTMLSpanElement>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const bubbleRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const node = bubbleRef.current
    if (!node || !state.open) return
    node.style.translate = ''
    const { left, right } = node.getBoundingClientRect()
    const shift = fitShift(left, right, document.documentElement.clientWidth)
    if (shift) node.style.translate = `${shift}px 0`
  }, [state.open])

  useEffect(() => () => clearTimeout(leaveTimer.current), [])

  useEffect(() => {
    if (!state.open) return
    const onOutside = (event: globalThis.PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) send('outside')
    }
    document.addEventListener('pointerdown', onOutside)
    return () => document.removeEventListener('pointerdown', onOutside)
  }, [state.open])

  const trigger = children.props
  const triggerProps: TriggerProps = {
    'aria-describedby': id,
    onFocus(event: FocusEvent<HTMLElement>) {
      trigger.onFocus?.(event)
      send('focus')
    },
    onBlur(event: FocusEvent<HTMLElement>) {
      trigger.onBlur?.(event)
      if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null))
        send('blur')
    },
    onKeyDown(event: KeyboardEvent<HTMLElement>) {
      trigger.onKeyDown?.(event)
      if (event.key === 'Escape') send('escape')
    },
    onPointerUp(event: PointerEvent<HTMLElement>) {
      trigger.onPointerUp?.(event)
      if (event.pointerType === 'touch') send('tap')
    },
  }

  return (
    <span
      ref={wrapper}
      className="ac:relative ac:inline-flex"
      onPointerEnter={(event) => {
        if (event.pointerType === 'touch') return
        clearTimeout(leaveTimer.current)
        send('hover-in')
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'touch') return
        clearTimeout(leaveTimer.current)
        leaveTimer.current = setTimeout(() => send('hover-out'), leaveGrace)
      }}
    >
      {cloneElement(children, triggerProps)}
      <span
        ref={bubbleRef}
        role="tooltip"
        id={id}
        hidden={!state.open}
        className={clsx(bubble, align === 'end' ? 'ac:right-0' : 'ac:left-0')}
      >
        {content}
      </span>
    </span>
  )
}
