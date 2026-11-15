import { AcButton, AcTooltip } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Arcade/AcTooltip',
  component: AcTooltip,
  args: {
    content: 'Hover, focus or tap the icon.',
    align: 'start',
    children: <AcButton size="sm" variant="ghost" prefix="info-circle" aria-label="Info" />,
  },
  argTypes: {
    content: { control: 'text' },
    align: { control: 'inline-radio', options: ['start', 'end'] },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          gap: 24,
          justifyContent: 'space-between',
          minHeight: 160,
          background: 'var(--ac-color-surface)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Align: Story = {
  argTypes: { align: { control: false } },
  render: (args) => (
    <>
      <AcTooltip {...args} align="start" content="Opens to the right of its left edge." />
      <AcTooltip {...args} align="end" content="Opens to the left of its right edge." />
    </>
  ),
}

export const Links: Story = {
  args: {
    content: (
      <>
        <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
        <br />
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
          © OpenStreetMap contributors
        </a>
      </>
    ),
  },
}
