import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const CheckboxWithState = (args: React.ComponentProps<typeof Checkbox>) => {
  const [checked, setChecked] = useState(args.checked);
  return <Checkbox {...args} checked={checked} onCheckedChange={setChecked} />;
};

export const Default: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: {
    checked: false,
  },
};

export const WithLabel: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: {
    checked: false,
    label: '동의합니다',
  },
};

export const Checked: Story = {
  render: (args) => <CheckboxWithState {...args} />,
  args: {
    checked: true,
    label: '선택됨',
  },
};
