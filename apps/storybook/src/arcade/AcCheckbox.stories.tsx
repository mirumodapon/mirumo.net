import { AcCheckbox, acCheckboxVariants as variants } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Fragment } from 'react'

const meta = {
  title: 'Arcade/AcCheckbox',
  component: AcCheckbox,
  args: { variant: 'check', children: '24 小時制', disabled: false },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    children: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, max-content)',
          gap: '12px 32px',
          background: 'var(--ac-color-surface)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Variant: Story = {
  argTypes: { variant: { control: false }, children: { control: false } },
  render: (args) => (
    <>
      {variants.map((variant) => (
        <Fragment key={variant}>
          <AcCheckbox {...args} variant={variant}>
            {variant.toUpperCase()}
          </AcCheckbox>
          <AcCheckbox {...args} variant={variant} defaultChecked>
            {variant.toUpperCase()}
          </AcCheckbox>
        </Fragment>
      ))}
    </>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  argTypes: { disabled: { control: false } },
  render: (args) => (
    <>
      <AcCheckbox {...args} />
      <AcCheckbox {...args} defaultChecked />
    </>
  ),
}
