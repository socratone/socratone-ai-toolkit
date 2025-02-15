import classNames from 'classnames';

import styles from './AnimatedButton.module.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import { throttle } from 'es-toolkit';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

const AnimatedButton = ({
  children,
  onClick,
  disabled,
  size = 'medium',
}: AnimatedButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [backgroundSize, setBackgroundSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const updateBackgroundSize = () => {
      if (buttonRef.current?.offsetWidth) {
        setBackgroundSize(buttonRef.current.offsetWidth * 1.5);
      }
    };

    const throttledUpdateBackgroundSize = throttle(updateBackgroundSize, 100);

    updateBackgroundSize();
    window.addEventListener('resize', throttledUpdateBackgroundSize);

    return () => {
      window.removeEventListener('resize', throttledUpdateBackgroundSize);
      throttledUpdateBackgroundSize.cancel(); // Cancel any pending throttled calls
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      className={classNames(styles.button, 'rounded-md', {
        'bg-gray-200 cursor-not-allowed': disabled,
        'px-6 py-4': size === 'medium',
        'px-3 py-2': size === 'small',
      })}
      onClick={onClick}
    >
      <div
        className={styles.background}
        style={{
          width: backgroundSize ?? '150%',
          height: backgroundSize ?? '1000%',
        }}
      />
      <span
        className={styles.text}
        style={{ fontSize: size === 'small' ? '16px' : '20px' }}
      >
        {children}
      </span>
    </button>
  );
};

export default AnimatedButton;
