import { AcSelect, acInputSizes as sizes } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const options = (
  <>
    <option value="default">default</option>
    <option value="time-only">time-only</option>
    <option value="clock">clock</option>
  </>
)

const meta = {
  title: 'Arcade/AcSelect',
  component: AcSelect,
  args: { size: 'md', disabled: false, 'aria-label': 'Layout', children: options },
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 320,
          background: 'var(--ac-color-surface)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Size: Story = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <>
      {sizes.map((size) => (
        <AcSelect key={size} {...args} size={size} />
      ))}
    </>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  argTypes: { disabled: { control: false } },
}
