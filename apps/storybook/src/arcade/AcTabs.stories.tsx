import { AcTabs, type AcTab } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const tabs: AcTab[] = [
  { id: 'stage', label: 'STAGE 0x01', content: <p style={{ margin: 0 }}>Workspace settings</p> },
  { id: 'global', label: 'GLOBAL', content: <p style={{ margin: 0 }}>Global settings</p> },
  { id: 'about', label: 'ABOUT', content: <p style={{ margin: 0 }}>MIRUMO.NET</p> },
]

const meta = {
  title: 'Arcade/AcTabs',
  component: AcTabs,
  args: { tabs, 'aria-label': 'Settings' },
  argTypes: {
    tabs: { control: false },
    defaultValue: { control: 'inline-radio', options: tabs.map((tab) => tab.id) },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 480,
          background: 'var(--ac-color-surface)',
          color: 'var(--ac-color-ink)',
          fontSize: 12,
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DefaultValue: Story = {
  args: { defaultValue: 'global' },
  argTypes: { defaultValue: { control: false } },
}
