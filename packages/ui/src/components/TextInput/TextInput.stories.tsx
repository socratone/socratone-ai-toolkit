import type { Meta, StoryObj } from '@storybook/react';
import TextInput from './TextInput';

const meta: Meta<typeof TextInput> = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력하세요',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '비활성화됨',
    disabled: true,
  },
};

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: '400px' }}>
      <TextInput {...args} />
    </div>
  ),
  args: {
    placeholder: '전체 너비',
    fullWidth: true,
  },
};

export const WithMaxWidth: Story = {
  args: {
    placeholder: '최대 너비 200px',
    maxWidth: 200,
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: '기본값',
  },
};
