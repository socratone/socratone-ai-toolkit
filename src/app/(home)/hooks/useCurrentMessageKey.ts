import { MESSAGES_STORAGE_KEY } from '@/constants';
import { MessagesByDateTime } from '@/types';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { create } from 'zustand';

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const getNowKey = () => {
  return dayjs().format(DATE_FORMAT);
};

const getLatestKey = (obj: Record<string, any>): string => {
  return Object.keys(obj).reduce((latest, current) => {
    return dayjs(current).isAfter(dayjs(latest)) ? current : latest;
  });
};

interface CurrentMessageKeyState {
  currentMessageKey: string | null;
  updateCurrentMessageKey: (currentMessageKey: string) => void;
}

const useCurrentMessageKeyStore = create<CurrentMessageKeyState>((set) => ({
  currentMessageKey: null,
  updateCurrentMessageKey: (currentMessageKey) => set({ currentMessageKey }),
}));

const useCurrentMessageKey = () => {
  const currentMessageKey = useCurrentMessageKeyStore(
    (state) => state.currentMessageKey
  );

  const updateCurrentMessageKey = useCurrentMessageKeyStore(
    (state) => state.updateCurrentMessageKey
  );

  const updateNewCurrentMessageKey = () => {
    updateCurrentMessageKey(getNowKey());
  };

  // 초기 currentMessageKey 설정
  useEffect(() => {
    if (!currentMessageKey) {
      const messagesByDateTimeString =
        localStorage.getItem(MESSAGES_STORAGE_KEY);
      try {
        // localStorage에 저장된 값이 있는 경우
        if (messagesByDateTimeString) {
          const messagesByDateTime: MessagesByDateTime = JSON.parse(
            messagesByDateTimeString
          );

          // 최근 키를 currentMessageKey로 설정
          const latestKey = getLatestKey(messagesByDateTime);
          updateCurrentMessageKey(latestKey);
        } else {
          // localStorage에 저장된 값이 없는 경우
          updateNewCurrentMessageKey();
        }
      } catch {
        console.warn('Invalid saved messages.');
      }
    }
  }, [currentMessageKey]);

  return {
    currentMessageKey,
    updateCurrentMessageKey,
    updateNewCurrentMessageKey,
  };
};

export default useCurrentMessageKey;
