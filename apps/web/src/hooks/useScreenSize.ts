import { useState, useEffect } from 'react';
import { BreakpointSize } from '@/constants';

/**
 * 화면 크기를 감지하는 커스텀 훅
 * @param breakpoint 기준이 되는 화면 크기 (Tailwind CSS 브레이크포인트)
 * @returns 화면이 기준 크기 이상인지 여부
 */
export const useScreenSize = (
  breakpoint: BreakpointSize = BreakpointSize.LG
): boolean => {
  // 화면이 breakpoint 이상인지 감지하는 상태
  const [isAboveBreakpoint, setIsAboveBreakpoint] = useState(false);

  useEffect(() => {
    // 초기 화면 크기 확인
    setIsAboveBreakpoint(window.innerWidth >= breakpoint);

    // 화면 크기 변경 감지
    const handleResize = () => {
      setIsAboveBreakpoint(window.innerWidth >= breakpoint);
    };

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isAboveBreakpoint;
};

export default useScreenSize;
