import type { Meta, StoryObj } from '@storybook/vue3'
import Icon from './Icon.vue'

const meta = {
  title: 'Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'ruby'
  }
}

export const Large: Story = {
  args: {
    name: 'ruby',
    width: 32
  }
}

export const Small: Story = {
  args: {
    name: 'ruby',
    width: 12
  }
}
