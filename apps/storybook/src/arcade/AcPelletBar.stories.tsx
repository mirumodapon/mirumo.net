import { AcPelletBar } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'

const values = [0, 25, 50, 75, 100]

const coin = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#ffd23f" stroke="#a3401b" stroke-width="2"/><rect x="7" y="4" width="2" height="8" fill="#a3401b"/></svg>',
)}`

const meta = {
  title: 'Arcade/AcPelletBar',
  component: AcPelletBar,
  args: { value: 42, max: 100, 'aria-label': '今天的進度' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    max: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          maxWidth: 480,
          background: 'var(--ac-color-surface)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcPelletBar>

export default meta
type Story = StoryObj<typeof meta>

export const Value: Story = {
  argTypes: { value: { control: false } },
  render: (args) => (
    <>
      {values.map((value) => (
        <AcPelletBar key={value} {...args} value={value} aria-valuetext={`${value}%`} />
      ))}
    </>
  ),
}

export const Playground: Story = {}

export const Pellet: Story = {
  render: (args) => (
    <>
      <AcPelletBar {...args} />
      <AcPelletBar {...args} pellet={{ icon: 'star' }} />
      <AcPelletBar {...args} pellet={{ icon: 'heart' }} />
      <AcPelletBar {...args} pellet={{ src: coin }} />
    </>
  ),
}

export const Marker: Story = {
  render: (args) => (
    <>
      <AcPelletBar {...args} />
      <AcPelletBar {...args} marker={{ icon: 'ghost-2' }} />
      <AcPelletBar {...args} marker={{ icon: 'rocket' }} />
      <AcPelletBar {...args} marker={{ src: coin }} />
    </>
  ),
}

function Live(args: Story['args']) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 5)), 600)
    return () => clearInterval(id)
  }, [])
  return <AcPelletBar {...args} value={value} />
}

export const Animated: Story = {
  argTypes: { value: { control: false } },
  render: (args) => <Live {...args} />,
}
