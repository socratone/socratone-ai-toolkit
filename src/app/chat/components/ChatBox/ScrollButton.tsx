import ChevronIcon from './icons/ChevronIcon';
import { cn } from '@/utils/cn';

interface ScrollButtonProps {
  direction: 'up' | 'down';
  onClick: () => void;
  className?: string;
}

const ScrollButton = ({ direction, onClick, className }: ScrollButtonProps) => {
  return (
    <button
      className={cn(
        'flex justify-center items-center size-10 rounded-full border bg-white shadow',
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn('transition-transform duration-300 ', {
          'transform rotate-180': direction === 'up',
          'transform rotate-0': direction === 'down',
        })}
      >
        <ChevronIcon />
      </div>
    </button>
  );
};

export default ScrollButton;
