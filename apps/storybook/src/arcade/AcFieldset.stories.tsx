import { AcButton, AcFieldset, AcInput } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const content = (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <AcInput placeholder="輸入城市，例如 Taipei" aria-label="城市" className="ac:flex-1" />
    <AcButton>搜尋</AcButton>
    <AcButton variant="ghost" prefix="current-location">
      用目前位置
    </AcButton>
  </div>
)

const meta = {
  title: 'Arcade/AcFieldset',
  component: AcFieldset,
  args: { legend: '天氣地點', disabled: false, children: content },
  argTypes: {
    legend: { control: 'text' },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 640,
          background: 'var(--ac-color-surface)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcFieldset>

export default meta
type Story = StoryObj<typeof meta>

export const Legend: Story = {
  argTypes: { legend: { control: false } },
  render: (args) => (
    <>
      <AcFieldset {...args} legend="天氣地點" />
      <AcFieldset {...args} legend={undefined} aria-label="天氣地點" />
    </>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  argTypes: { disabled: { control: false } },
}
