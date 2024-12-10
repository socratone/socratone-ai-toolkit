import classNames from 'classnames';

import styles from './AnimatedButton.module.scss';
import { useLayoutEffect, useRef, useState } from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const AnimatedButton = ({
  children,
  onClick,
  disabled,
}: AnimatedButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [backgroundSize, setBackgroundSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (buttonRef.current?.offsetWidth) {
      setBackgroundSize(buttonRef.current.offsetWidth * 1.5);
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      className={classNames(styles.button, 'rounded-md px-3 py-2', {
        'bg-gray-200 cursor-not-allowed': disabled,
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
      <span className={styles.text}>{children}</span>
    </button>
  );
};

export default AnimatedButton;
