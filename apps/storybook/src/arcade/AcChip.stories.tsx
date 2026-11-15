import { AcChip, acChipColors as colors } from '@mirumo/arcade-ui'
import type { Meta, StoryObj } from '@storybook/react-vite'

const socials = [
  { name: 'GitHub', icon: 'brand-github' },
  { name: 'X', icon: 'brand-x' },
  { name: 'Instagram', icon: 'brand-instagram' },
  { name: 'LinkedIn', icon: 'brand-linkedin' },
]

const meta = {
  title: 'Arcade/AcChip',
  component: AcChip,
  args: { children: 'GitHub', href: '#', color: 'pellet' },
  argTypes: {
    color: { control: 'inline-radio', options: colors },
    prefix: { control: 'text' },
    href: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 10,
          background: 'var(--ac-color-surface)',
          padding: 24,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AcChip>

export default meta
type Story = StoryObj<typeof meta>

export const Children: Story = {
  argTypes: { children: { control: false } },
  render: (args) => (
    <>
      {socials.map(({ name }) => (
        <AcChip key={name} {...args}>
          {name}
        </AcChip>
      ))}
    </>
  ),
}

export const Color: Story = {
  argTypes: { color: { control: false }, children: { control: false } },
  render: (args) => (
    <>
      {colors.map((color) => (
        <AcChip key={color} {...args} color={color}>
          {color.toUpperCase()}
        </AcChip>
      ))}
    </>
  ),
}

export const Prefix: Story = {
  argTypes: { prefix: { control: false }, children: { control: false } },
  render: (args) => (
    <>
      {socials.map(({ name, icon }) => (
        <AcChip key={name} {...args} prefix={icon}>
          {name}
        </AcChip>
      ))}
    </>
  ),
}
