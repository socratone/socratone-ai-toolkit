import styles from './AnimatedButton.module.scss';
import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

/**
 * 애니메이션 효과가 있는 버튼 컴포넌트
 * @param children - 버튼 내부에 표시될 컨텐츠
 * @param onClick - 클릭 이벤트 핸들러
 * @param disabled - 버튼 비활성화 여부
 * @param size - 버튼 크기 ('small' | 'medium')
 */
const AnimatedButton = ({
  children,
  onClick,
  disabled,
  size = 'medium',
}: AnimatedButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const [backgroundSize, setBackgroundSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const updateBackgroundSize = () => {
      if (buttonRef.current?.offsetWidth) {
        setBackgroundSize(buttonRef.current.offsetWidth * 1.5);
      }
    };

    observerRef.current = new ResizeObserver(updateBackgroundSize);

    if (buttonRef.current) {
      observerRef.current.observe(buttonRef.current);
    }

    updateBackgroundSize();

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      className={cn(styles.button, 'rounded-md', {
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
