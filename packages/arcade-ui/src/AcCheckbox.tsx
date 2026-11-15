import { clsx } from 'clsx'
import type { ComponentProps } from 'react'
import { AcIcon } from './AcIcon'

export const acCheckboxVariants = ['check', 'pellet', 'marker'] as const
export type AcCheckboxVariant = (typeof acCheckboxVariants)[number]

export type AcCheckboxProps = Omit<ComponentProps<'input'>, 'type' | 'size'> & {
  variant?: AcCheckboxVariant
}

const label = clsx(
  'ac:inline-flex ac:items-center ac:gap-2 ac:cursor-pointer',
  'ac:font-body ac:text-[13px] ac:text-ink',
  'ac:has-disabled:cursor-not-allowed ac:has-disabled:opacity-50',
)

const box = clsx(
  'ac:peer ac:absolute ac:inset-0 ac:m-0 ac:appearance-none ac:cursor-[inherit]',
  'ac:border-2 ac:border-wall ac:bg-field ac:transition-colors',
  'ac:enabled:hover:border-primary',
  'ac:focus-visible:outline-2 ac:focus-visible:outline-offset-2 ac:focus-visible:outline-info',
)

const mark = 'ac:pointer-events-none ac:invisible ac:peer-checked:visible'

const variants: Record<AcCheckboxVariant, { box: string; mark: string }> = {
  check: {
    box: 'ac:rounded-[3px] ac:checked:border-primary ac:checked:bg-primary',
    mark: 'ac:text-[14px] ac:text-surface',
  },
  pellet: {
    box: 'ac:rounded-full',
    mark: 'ac:size-2 ac:rounded-full ac:bg-pellet ac:shadow-pellet',
  },
  marker: {
    box: 'ac:rounded-[3px]',
    mark: 'ac:size-2.5 ac:rounded-[2px] ac:bg-primary ac:shadow-marker',
  },
}

export function AcCheckbox({ variant = 'check', className, children, ...props }: AcCheckboxProps) {
  const style = variants[variant]
  return (
    <label className={clsx(label, className)}>
      <span className="ac:relative ac:inline-grid ac:size-4.5 ac:shrink-0 ac:place-items-center">
        <input type="checkbox" className={clsx(box, style.box)} {...props} />
        {variant === 'check' ? (
          <AcIcon name="check" className={clsx(mark, style.mark)} />
        ) : (
          <span className={clsx(mark, style.mark)} aria-hidden />
        )}
      </span>
      {children}
    </label>
  )
}
