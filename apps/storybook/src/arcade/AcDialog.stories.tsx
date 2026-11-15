import { AcButton, AcDialog, AcInput, type AcDialogProps } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

type Args = Pick<AcDialogProps, 'title'>

function Demo({ title, long = false }: Args & { long?: boolean }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <>
      <AcButton variant="ghost" prefix="settings" onClick={() => setOpen(true)}>
        OPEN
      </AcButton>
      <AcDialog
        open={open}
        onClose={close}
        title={title}
        aria-label={title == null ? 'SETTINGS' : undefined}
        actions={
          <>
            <AcButton variant="ghost" onClick={close}>
              取消
            </AcButton>
            <AcButton onClick={close}>儲存</AcButton>
          </>
        }
      >
        <AcInput placeholder="輸入城市，例如 Taipei" aria-label="城市" />
        {long &&
          Array.from({ length: 30 }, (_, i) => (
            <p key={i} style={{ fontSize: 12, margin: '12px 0 0' }}>
              STAGE {String(i + 1).padStart(2, '0')}
            </p>
          ))}
      </AcDialog>
    </>
  )
}

const meta = {
  title: 'Arcade/AcDialog',
  args: { title: 'SETTINGS' },
  argTypes: { title: { control: 'text' } },
  render: (args) => <Demo {...args} />,
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--ac-color-surface)', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<Args>

export default meta
type Story = StoryObj<typeof meta>

export const Title: Story = {}

export const NoTitle: Story = { args: { title: undefined } }

export const Scroll: Story = { render: (args) => <Demo {...args} long /> }
