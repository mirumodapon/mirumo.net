import { AcIcon } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const names = ['settings', 'search', 'check', 'x', 'arrow-right', 'refresh', 'brand-github']
const fontSizes = [12, 14, 18, 24, 32]
const colors = ['ink', 'primary', 'secondary', 'info', 'warning', 'danger']

const meta = {
  title: 'Arcade/AcIcon',
  component: AcIcon,
  args: { name: 'settings' },
  argTypes: {
    name: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 16,
          background: 'var(--ac-color-surface)',
          color: 'var(--ac-color-ink)',
          fontSize: 24,
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Name: Story = {
  argTypes: { name: { control: false } },
  render: (args) => (
    <>
      {names.map((name) => (
        <AcIcon key={name} {...args} name={name} title={name} />
      ))}
    </>
  ),
}

export const Playground: Story = {}

export const Size: Story = {
  render: (args) => (
    <>
      {fontSizes.map((fontSize) => (
        <span key={fontSize} style={{ fontSize }}>
          <AcIcon {...args} />
        </span>
      ))}
    </>
  ),
}

export const Color: Story = {
  render: (args) => (
    <>
      {colors.map((color) => (
        <span key={color} style={{ color: `var(--ac-color-${color})` }}>
          <AcIcon {...args} />
        </span>
      ))}
    </>
  ),
}
