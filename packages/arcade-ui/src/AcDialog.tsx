import { clsx } from 'clsx'
import {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type ComponentProps,
  type ReactNode,
} from 'react'
import { mazeFrame, mazeHeading } from './maze'

export type AcDialogProps = Omit<ComponentProps<'dialog'>, 'open' | 'title'> & {
  open: boolean
  title?: ReactNode
  actions?: ReactNode
}

const dialog = clsx(
  mazeFrame,
  'ac:m-auto ac:w-[min(720px,calc(100vw_-_32px))] ac:max-h-[calc(100vh_-_48px)] ac:open:flex ac:open:flex-col',
  'ac:bg-surface ac:backdrop:bg-black/75',
)

const body = 'ac:flex ac:min-h-0 ac:flex-1 ac:flex-col ac:overflow-auto'

const footer = 'ac:mt-6 ac:flex ac:shrink-0 ac:flex-wrap ac:justify-end ac:gap-2.5'

export function AcDialog({
  open,
  title,
  actions,
  className,
  children,
  ref,
  ...props
}: AcDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const labelled = title != null && props['aria-label'] == null && props['aria-labelledby'] == null

  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement)

  useEffect(() => {
    const node = dialogRef.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelled ? titleId : undefined}
      className={clsx(dialog, className)}
      {...props}
    >
      {title != null && (
        <h2 id={titleId} className={clsx(mazeHeading, 'ac:shrink-0')}>
          {title}
        </h2>
      )}
      <div className={body}>{children}</div>
      {actions != null && <div className={footer}>{actions}</div>}
    </dialog>
  )
}
