import MinusIcon from './icons/MinusIcon';
import PlusIcon from './icons/PlusIcon';
import { FontSize } from './types';

interface ZoomButtonProps {
  value: FontSize;
  onChange: (value: FontSize) => void;
}

const fontSizeOptions: FontSize[] = [
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl',
  'text-5xl',
  'text-6xl',
  'text-7xl',
];

const ZoomButton = ({ value, onChange }: ZoomButtonProps) => {
  const minusDisabled =
    fontSizeOptions.findIndex((fontSize) => fontSize === value) === 0;

  const plusDisabled =
    fontSizeOptions.findIndex((fontSize) => fontSize === value) ===
    fontSizeOptions.length - 1;

  const handleMinus = () => {
    const preIndex =
      fontSizeOptions.findIndex((fontSize) => fontSize === value) - 1;
    onChange(fontSizeOptions[preIndex]);
  };

  const handlePlus = () => {
    const nextIndex =
      fontSizeOptions.findIndex((fontSize) => fontSize === value) + 1;
    onChange(fontSizeOptions[nextIndex]);
  };

  return (
    <div className="flex gap-1">
      <button
        className="size-8 flex justify-center items-center border border-gray-200 rounded-md text-gray-400 hover:border-black hover:text-black"
        disabled={minusDisabled}
        onClick={handleMinus}
      >
        <MinusIcon />
      </button>
      <button
        className="size-8 flex justify-center items-center border border-gray-200 rounded-md text-gray-400 hover:border-black hover:text-black"
        disabled={plusDisabled}
        onClick={handlePlus}
      >
        <PlusIcon />
      </button>
    </div>
  );
};

export default ZoomButton;
