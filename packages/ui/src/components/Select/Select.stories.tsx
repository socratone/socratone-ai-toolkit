import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Select from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'orange', label: '오렌지' },
  { value: 'grape', label: '포도', disabled: true },
];

const SelectWithState = (args: React.ComponentProps<typeof Select>) => {
  const [value, setValue] = useState<string>(args.value as string);
  return <Select {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <SelectWithState {...args} />,
  args: {
    value: '',
    options,
  },
};

export const WithSelection: Story = {
  render: (args) => <SelectWithState {...args} />,
  args: {
    value: 'apple',
    options,
  },
};

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: '400px' }}>
      <SelectWithState {...args} />
    </div>
  ),
  args: {
    value: '',
    options,
    fullWidth: true,
  },
};

export const WithDisabledOption: Story = {
  render: (args) => <SelectWithState {...args} />,
  args: {
    value: '',
    options,
  },
};
