import type { Meta, StoryObj } from '@storybook/react';
import Textarea from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: '내용을 입력하세요',
    rows: 4,
    cols: 40,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: '비활성화됨',
    disabled: true,
    rows: 4,
    cols: 40,
  },
};

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: '400px' }}>
      <Textarea {...args} />
    </div>
  ),
  args: {
    placeholder: '전체 너비',
    fullWidth: true,
    rows: 4,
  },
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: '기본 텍스트가 입력되어 있습니다.',
    rows: 4,
    cols: 40,
  },
};
