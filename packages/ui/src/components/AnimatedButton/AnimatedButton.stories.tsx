import type { Meta, StoryObj } from '@storybook/react';
import AnimatedButton from './AnimatedButton';

const meta: Meta<typeof AnimatedButton> = {
  title: 'Components/AnimatedButton',
  component: AnimatedButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: {
    children: '버튼',
    size: 'medium',
    onClick: () => alert('클릭!'),
  },
};

export const Small: Story = {
  args: {
    children: '작은 버튼',
    size: 'small',
    onClick: () => alert('클릭!'),
  },
};

export const Disabled: Story = {
  args: {
    children: '비활성화',
    disabled: true,
    onClick: () => alert('클릭!'),
  },
};
