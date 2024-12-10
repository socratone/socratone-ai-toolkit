import classNames from 'classnames';
import ChevronIcon from './icons/ChevronIcon';

interface ScrollButtonProps {
  direction: 'up' | 'down';
  onClick: () => void;
  className?: string;
}

const ScrollButton = ({ direction, onClick, className }: ScrollButtonProps) => {
  return (
    <button
      className={classNames(
        'flex justify-center items-center size-10 transition-transform duration-300',
        {
          'transform rotate-180': direction === 'up',
          'transform rotate-0': direction === 'down',
        },
        className
      )}
      onClick={onClick}
    >
      <ChevronIcon />
    </button>
  );
};

export default ScrollButton;
