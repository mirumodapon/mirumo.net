import { AcMarquee } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

const title = (
  <>
    MIRUMO<span style={{ color: 'var(--ac-color-secondary)' }}>.</span>NET
  </>
)

const meta = {
  title: 'Arcade/AcMarquee',
  component: AcMarquee,
  parameters: { layout: 'fullscreen' },
  args: {
    title,
    start: { label: '1UP', value: 'GOOD MORNING' },
    end: { label: 'STAGE', value: '001' },
  },
  argTypes: {
    title: { control: false },
    start: { control: 'object' },
    end: { control: 'object' },
  },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--ac-color-surface)', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcMarquee>

export default meta
type Story = StoryObj<typeof meta>

export const Scores: Story = {}

export const TitleOnly: Story = { args: { start: undefined, end: undefined } }

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1' } },
}

function DoubleClickDemo() {
  const [stage, setStage] = useState(1)
  return (
    <AcMarquee
      title={title}
      start={{ label: '1UP', value: 'GOOD MORNING' }}
      end={{
        label: 'STAGE',
        value: `0x${String(stage).padStart(2, '0')}`,
        hint: 'Double-tap to advance',
        onDoubleTap: () => setStage((value) => (value >= 3 ? 1 : value + 1)),
      }}
    />
  )
}

export const DoubleTap: Story = { render: () => <DoubleClickDemo /> }
