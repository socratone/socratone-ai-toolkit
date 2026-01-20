import styles from './AnimatedButton.module.scss';
import { cn } from '../../utils/cn';

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
  return (
    <button
      disabled={disabled}
      className={cn(styles.button, 'rounded-md', {
        'bg-gray-200 cursor-not-allowed': disabled,
        'px-6 py-4': size === 'medium',
        'px-3 py-2': size === 'small',
      })}
      onClick={onClick}
    >
      <div className={styles.background} />
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
