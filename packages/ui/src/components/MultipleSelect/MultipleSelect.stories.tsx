import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import MultipleSelect from './MultipleSelect';

const meta: Meta<typeof MultipleSelect> = {
  title: 'Components/MultipleSelect',
  component: MultipleSelect,
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
  { value: 'grape', label: '포도' },
];

const MultipleSelectWithState = (args: React.ComponentProps<typeof MultipleSelect>) => {
  const [values, setValues] = useState<string[]>(args.values);
  return <MultipleSelect {...args} values={values} onChange={setValues} />;
};

export const Default: Story = {
  render: (args) => <MultipleSelectWithState {...args} />,
  args: {
    values: [],
    options,
  },
};

export const WithSelection: Story = {
  render: (args) => <MultipleSelectWithState {...args} />,
  args: {
    values: ['apple', 'grape'],
    options,
  },
};

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: '400px' }}>
      <MultipleSelectWithState {...args} />
    </div>
  ),
  args: {
    values: [],
    options,
    fullWidth: true,
  },
};
