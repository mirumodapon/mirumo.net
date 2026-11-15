import { AcPanel, acPanelCorners, type AcPanelCorner } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const pelletSets: AcPanelCorner[][] = [[], ['tl', 'br'], ['tr', 'bl'], [...acPanelCorners]]

const body = <p style={{ margin: 0, fontSize: 12 }}>INSERT COIN</p>

const meta = {
  title: 'Arcade/AcPanel',
  component: AcPanel,
  args: { title: 'TIME', pellets: ['tl', 'br'], children: body },
  argTypes: {
    title: { control: 'text' },
    pellets: { control: 'inline-check', options: acPanelCorners },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 20,
          background: 'var(--ac-color-surface)',
          fontFamily: 'var(--ac-font-pixel)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Title: Story = {
  argTypes: { title: { control: false } },
  render: (args) => (
    <>
      <AcPanel {...args} title="TIME" />
      <AcPanel
        {...args}
        title={
          <>
            WEATHER <span style={{ color: 'var(--ac-color-muted)', fontSize: 10 }}>TAIPEI</span>
          </>
        }
      />
      <AcPanel {...args} title={undefined} aria-label="NO TITLE" />
    </>
  ),
}

export const Pellets: Story = {
  argTypes: { pellets: { control: false } },
  render: (args) => (
    <>
      {pelletSets.map((pellets) => (
        <AcPanel key={pellets.join('-') || 'none'} {...args} pellets={pellets}>
          <p style={{ margin: 0, fontSize: 12 }}>{pellets.join(' + ') || 'NONE'}</p>
        </AcPanel>
      ))}
    </>
  ),
}
