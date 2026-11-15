import {
  AcButton,
  AcInput,
  acInputSizes as sizes,
  acInputVariants as variants,
} from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Arcade/AcInput',
  component: AcInput,
  args: {
    variant: 'box',
    size: 'md',
    placeholder: 'INSERT QUERY',
    disabled: false,
    'aria-label': 'Query',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: sizes },
    prefix: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 480,
          background: 'var(--ac-color-surface)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcInput>

export default meta
type Story = StoryObj<typeof meta>

export const Variant: Story = {
  argTypes: { variant: { control: false } },
  render: (args) => (
    <>
      {variants.map((variant) => (
        <AcInput key={variant} {...args} variant={variant} placeholder={variant.toUpperCase()} />
      ))}
    </>
  ),
}

export const Size: Story = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <>
      {sizes.map((size) => (
        <div key={size} style={{ display: 'flex', gap: 8 }}>
          <AcInput {...args} size={size} placeholder={size.toUpperCase()} className="ac:flex-1" />
          <AcButton size={size}>GO</AcButton>
        </div>
      ))}
    </>
  ),
}

export const Prefix: Story = {
  args: { variant: 'underline', prefix: 'chevron-right', placeholder: 'INSERT QUERY  ( / )' },
}

export const Disabled: Story = {
  args: { disabled: true, value: 'Taipei' },
  argTypes: { disabled: { control: false } },
}

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'not a url' },
}
