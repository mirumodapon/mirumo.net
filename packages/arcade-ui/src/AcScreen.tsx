import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

export type AcScreenProps = ComponentProps<'div'> & {
  scanlines?: boolean
}

const screen = clsx(
  'ac:min-h-dvh ac:overflow-x-hidden ac:bg-surface ac:bg-board ac:bg-no-repeat',
  'ac:px-4 ac:pt-6 ac:pb-8 ac:font-pixel ac:text-[12px] ac:leading-[1.6] ac:text-ink',
)

const overlay = 'ac:pointer-events-none ac:fixed ac:inset-0 ac:z-100 ac:bg-scanlines'

export function AcScreen({ scanlines = true, className, children, ...props }: AcScreenProps) {
  return (
    <div className={clsx(screen, className)} {...props}>
      {scanlines && <div className={overlay} aria-hidden />}
      {children}
    </div>
  )
}
