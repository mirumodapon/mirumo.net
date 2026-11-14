import {
  AcButton,
  acButtonSizes as sizes,
  acButtonVariants as variants,
  type AcButtonProps,
} from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'

type Args = Partial<Pick<AcButtonProps, 'variant' | 'size' | 'prefix' | 'suffix' | 'disabled'>> & {
  children?: ReactNode
}

const meta = {
  title: 'Arcade/AcButton',
  render: ({ children = 'GO', ...args }) => <AcButton {...args}>{children}</AcButton>,
  args: { children: 'GO', variant: 'primary', size: 'md', disabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
    // Any Tabler icon name: https://tabler.io/icons
    prefix: { control: 'text' },
    suffix: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          background: 'var(--ac-color-surface)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<Args>

export default meta
type Story = StoryObj<typeof meta>

export const Variant: Story = {
  argTypes: { variant: { control: false } },
  render: (args) => (
    <>
      {variants.map((variant) => (
        <AcButton key={variant} {...args} variant={variant}>
          {variant.toUpperCase()}
        </AcButton>
      ))}
    </>
  ),
}

export const Size: Story = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <>
      {sizes.map((size) => (
        <AcButton key={size} {...args} size={size}>
          {size.toUpperCase()}
        </AcButton>
      ))}
    </>
  ),
}

// With a label, and icon-only (which needs an aria-label).
export const Prefix: Story = {
  args: { prefix: 'settings', children: 'SETTINGS' },
  render: ({ children = 'SETTINGS', ...args }) => (
    <>
      <AcButton {...args}>{children}</AcButton>
      <AcButton
        {...args}
        prefix={args.prefix || 'settings'}
        suffix={undefined}
        aria-label="SETTINGS"
        title="SETTINGS"
      />
    </>
  ),
}

export const Suffix: Story = {
  args: { suffix: 'arrow-right', children: 'START' },
}

export const Disabled: Story = {
  args: { disabled: true },
  argTypes: { disabled: { control: false }, variant: { control: false } },
  render: (args) => (
    <>
      {variants.map((variant) => (
        <AcButton key={variant} {...args} variant={variant}>
          {variant.toUpperCase()}
        </AcButton>
      ))}
    </>
  ),
}
