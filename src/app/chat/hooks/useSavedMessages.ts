import { MESSAGES_STORAGE_KEY } from '@/constants';
import { Message, MessagesByDateTime } from '@/types';
import { useCallback, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { create } from 'zustand';

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const getNowKey = () => {
  return dayjs().format(DATE_FORMAT);
};

const getLatestKey = (obj: Record<string, Message[]>): string => {
  return Object.keys(obj).reduce((latest, current) => {
    return dayjs(current).isAfter(dayjs(latest)) ? current : latest;
  });
};

interface CurrentMessageKeyState {
  currentMessageKey: string | null;
  updateCurrentMessageKey: (currentMessageKey: string) => void;
  messagesByDateTime: MessagesByDateTime;
  updateMessagesByDateTime: (messagesByDateTime: MessagesByDateTime) => void;
}

const useMessageStore = create<CurrentMessageKeyState>((set) => ({
  currentMessageKey: null,
  updateCurrentMessageKey: (currentMessageKey) => set({ currentMessageKey }),
  messagesByDateTime: {},
  updateMessagesByDateTime: (messagesByDateTime) => set({ messagesByDateTime }),
}));

const useSavedMessages = () => {
  const currentMessageKey = useMessageStore((state) => state.currentMessageKey);
  const messagesByDateTime = useMessageStore(
    (state) => state.messagesByDateTime
  );
  const updateMessagesByDateTime = useMessageStore(
    (state) => state.updateMessagesByDateTime
  );
  const updateCurrentMessageKey = useMessageStore(
    (state) => state.updateCurrentMessageKey
  );

  const updateNewCurrentMessageKey = useCallback(() => {
    updateCurrentMessageKey(getNowKey());
  }, [updateCurrentMessageKey]);

  // messagesByDateTime의 최신 값을 참조하기 위한 ref
  const messagesByDateTimeRef = useRef(messagesByDateTime);

  // messagesByDateTime이 변경될 때마다 ref 업데이트
  useEffect(() => {
    messagesByDateTimeRef.current = messagesByDateTime;
  }, [messagesByDateTime]);

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

          // 저장된 값을 state에 저장
          updateMessagesByDateTime(messagesByDateTime);

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
  }, [
    currentMessageKey,
    updateCurrentMessageKey,
    updateMessagesByDateTime,
    updateNewCurrentMessageKey,
  ]);

  const saveMessages = useCallback(
    (messageKey: string, messages: Message[]) => {
      // ref를 통해 최신 messagesByDateTime 값 참조
      const currentMessagesByDateTime = messagesByDateTimeRef.current;

      // 처음 저장하는 경우
      if (Object.values(currentMessagesByDateTime).length === 0) {
        const value = { [messageKey]: messages };
        updateMessagesByDateTime(value);
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(value));
        return;
      }

      // 새로운 messages 업데이트
      const newMessagesByDateTime = {
        ...currentMessagesByDateTime,
        [messageKey]: messages,
      };
      updateMessagesByDateTime(newMessagesByDateTime);
      localStorage.setItem(
        MESSAGES_STORAGE_KEY,
        JSON.stringify(newMessagesByDateTime)
      );
    },
    [updateMessagesByDateTime]
  );

  const deleteMessages = (messageKey: string) => {
    const newMessagesByDateTime = {
      ...messagesByDateTime,
    };

    delete newMessagesByDateTime[messageKey];

    updateMessagesByDateTime(newMessagesByDateTime);
    localStorage.setItem(
      MESSAGES_STORAGE_KEY,
      JSON.stringify(newMessagesByDateTime)
    );
  };

  return {
    currentMessageKey,
    updateCurrentMessageKey,
    updateNewCurrentMessageKey,
    messagesByDateTime,
    saveMessages,
    deleteMessages,
  };
};

export default useSavedMessages;
