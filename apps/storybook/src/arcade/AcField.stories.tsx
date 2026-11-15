import { AcField, AcInput } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Arcade/AcField',
  component: AcField,
  args: { label: '搜尋引擎網址（用 %s 代表關鍵字）' },
  argTypes: { label: { control: 'text' }, children: { control: false } },
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
} satisfies Meta<typeof AcField>

export default meta
type Story = StoryObj<typeof meta>

export const Label: Story = {
  render: (args) => (
    <AcField {...args}>
      <AcInput defaultValue="https://www.google.com/search?q=%s" />
    </AcField>
  ),
}

export const Underline: Story = {
  args: { label: '城市' },
  render: (args) => (
    <AcField {...args}>
      <AcInput variant="underline" prefix="map-pin" placeholder="Taipei" />
    </AcField>
  ),
}
