import type { Meta, StoryObj } from '@storybook/vue3'
import Searchbar from './Searchbar.vue'

const meta = {
  title: 'Searchbar',
  component: Searchbar,
  tags: ['autodocs'],
  argTypes: {},
  args: {}
} satisfies Meta<typeof Searchbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: 'Browser checks'
  }
}

export const Large: Story = {
  args: {
    modelValue: 'Browser checks',
    minWidth: 400,
    expandedWidth: 600
  }
}

export const Focusable: Story = {
  name: 'Global focus',
  args: {
    modelValue: 'Browser checks',
    isFocusableByKeys: true
  }
}
