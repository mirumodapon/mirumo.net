import { AcIcon, AcLinkTile, acLinkTileColors as colors } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const links = ['GitHub', 'Gmail', 'YouTube', 'Calendar', 'Claude']

const meta = {
  title: 'Arcade/AcLinkTile',
  component: AcLinkTile,
  args: { children: 'GitHub', color: 'info', href: '#' },
  argTypes: {
    color: { control: 'inline-radio', options: colors },
    badge: { control: 'text' },
    shortcut: { control: 'text' },
    children: { control: 'text' },
    href: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 14,
          background: 'var(--ac-color-surface)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcLinkTile>

export default meta
type Story = StoryObj<typeof meta>

export const Color: Story = {
  argTypes: { color: { control: false }, children: { control: false } },
  render: (args) => (
    <>
      {colors.map((color, i) => (
        <AcLinkTile key={color} {...args} color={color}>
          {links[i]}
        </AcLinkTile>
      ))}
    </>
  ),
}

export const Badge: Story = {
  argTypes: { badge: { control: false } },
  render: (args) => (
    <>
      <AcLinkTile {...args} />
      <AcLinkTile {...args} badge="★" />
      <AcLinkTile {...args} badge={<AcIcon name="brand-github" />} />
    </>
  ),
}

export const Shortcut: Story = {
  argTypes: { shortcut: { control: false }, children: { control: false } },
  render: (args) => (
    <>
      {links.map((name, i) => (
        <AcLinkTile key={name} {...args} color={colors[i % colors.length]} shortcut={String(i + 1)}>
          {name}
        </AcLinkTile>
      ))}
    </>
  ),
}

export const LongName: Story = {
  args: { children: 'A Very Long Website Name That Overflows', shortcut: '1' },
}
