import { clsx } from 'clsx'
import { Children, type ComponentProps, type ReactNode } from 'react'
import { AcIcon } from './AcIcon'

export const acButtonVariants = ['primary', 'ghost', 'danger'] as const
export type AcButtonVariant = (typeof acButtonVariants)[number]

export const acButtonSizes = ['sm', 'md', 'lg'] as const
export type AcButtonSize = (typeof acButtonSizes)[number]

type AcButtonBaseProps = Omit<ComponentProps<'button'>, 'prefix' | 'children'> & {
  variant?: AcButtonVariant
  size?: AcButtonSize
  prefix?: string
  suffix?: string
}

type AcButtonSingleIcon =
  | { prefix: string; suffix?: undefined }
  | { prefix?: undefined; suffix: string }

type AcButtonAccessibleName = { 'aria-label': string } | { 'aria-labelledby': string }

type AcButtonContentProps =
  | { children: ReactNode }
  | ({ children?: undefined } & AcButtonSingleIcon & AcButtonAccessibleName)

export type AcButtonProps = AcButtonBaseProps & AcButtonContentProps

const base = clsx(
  'ac:inline-flex ac:items-center ac:justify-center',
  'ac:rounded-button ac:border-2',
  'ac:font-pixel ac:leading-[1.6] ac:whitespace-nowrap',
  'ac:cursor-pointer ac:transition-[color,border-color,filter]',
  'ac:focus-visible:outline-2 ac:focus-visible:outline-offset-2 ac:focus-visible:outline-info',
  'ac:disabled:cursor-not-allowed ac:disabled:opacity-50',
)

const variants: Record<AcButtonVariant, string> = {
  primary: 'ac:border-primary ac:bg-primary ac:text-surface ac:enabled:hover:brightness-110',
  ghost:
    'ac:border-wall ac:bg-transparent ac:text-ink ac:enabled:hover:border-primary ac:enabled:hover:text-primary',
  danger: 'ac:border-danger ac:bg-transparent ac:text-danger ac:enabled:hover:brightness-125',
}

const sizes: Record<AcButtonSize, { button: string; label: string; icon: string }> = {
  sm: { button: 'ac:h-7 ac:gap-1.5 ac:text-[8px]', label: 'ac:px-2.5', icon: 'ac:text-[12px]' },
  md: { button: 'ac:h-10 ac:gap-2 ac:text-[10px]', label: 'ac:px-3.5', icon: 'ac:text-[14px]' },
  lg: { button: 'ac:h-13 ac:gap-2.5 ac:text-[12px]', label: 'ac:px-5', icon: 'ac:text-[18px]' },
}

const square = 'ac:aspect-square ac:px-0'

function hasLabel(children: ReactNode) {
  return Children.toArray(children).some((child) => child !== '')
}

export function AcButton({
  variant = 'primary',
  size = 'md',
  type = 'button',
  prefix,
  suffix,
  className,
  children,
  ...props
}: AcButtonProps) {
  const scale = sizes[size]
  return (
    <button
      type={type}
      className={clsx(
        base,
        scale.button,
        hasLabel(children) ? scale.label : square,
        variants[variant],
        className,
      )}
      {...props}
    >
      {prefix && <AcIcon name={prefix} className={scale.icon} />}
      {children}
      {suffix && <AcIcon name={suffix} className={scale.icon} />}
    </button>
  )
}
