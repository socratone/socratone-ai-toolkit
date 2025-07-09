export const MESSAGES_STORAGE_KEY = 'messagesByDateTime';
export const MODEL_STORAGE_KEY = 'model';
/** Automatic Speech Recognition Model Storage Key */
export const ASR_MODEL_STORAGE_KEY = 'asrModel';
export const FONT_SIZE_STORAGE_KEY = 'fontSize';
export const DEV_CHECKED_STORAGE_KEY = 'devChecked';
export const ASIDE_WIDTH_STORAGE_KEY = 'asideWidth';

/**
 * 화면 크기 브레이크포인트 enum (Tailwind CSS 기준)
 */
export enum BreakpointSize {
  /** sm: 640px */
  SM = 640,
  /** md: 768px */
  MD = 768,
  /** lg: 1024px */
  LG = 1024,
  /** xl: 1280px */
  XL = 1280,
  /** 2xl: 1536px */
  XXL = 1536,
}

export const FLASK_API_URL = 'http://localhost:5001';
