import { AcMarquee, AcPanel, AcScreen } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Arcade/AcScreen',
  component: AcScreen,
  parameters: { layout: 'fullscreen' },
  args: { scanlines: true },
  render: (args) => (
    <AcScreen {...args}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gap: 24 }}>
        <AcMarquee
          title="MIRUMO.NET"
          start={{ label: '1UP', value: 'HELLO' }}
          end={{ label: 'STAGE', value: '001' }}
        />
        <AcPanel title="TIME" pellets={['tl', 'br']}>
          <p style={{ margin: 0 }}>INSERT COIN</p>
        </AcPanel>
      </div>
    </AcScreen>
  ),
} satisfies Meta<typeof AcScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Scanlines: Story = {}

export const NoScanlines: Story = { args: { scanlines: false } }
