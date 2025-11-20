/**
 * Ключи для sessionStorage
 */
export const STORAGE_KEYS = {
  /** Префикс для shuffle каждого этапа: captcha-shuffle-stage-1, captcha-shuffle-stage-2, etc. */
  SHUFFLE_PREFIX: 'captcha-shuffle-stage-',
  
  /** Текущий индекс этапа */
  CURRENT_INDEX: 'captcha-current-index',
  
  /** История выбора пользователя для всех этапов */
  SELECTION_HISTORY: 'captcha-selection-history'
} as const;

/**
 * Конфигурация CAPTCHA
 */
export const CAPTCHA_CONFIG = {
  /** Общее количество этапов */
  TOTAL_STAGES: 3,
  
  /** Количество изображений на каждом этапе */
  IMAGES_PER_STAGE: 12,
  
  /** Количество правильных изображений на этапе */
  CORRECT_IMAGES_COUNT: 4
} as const;

/**
 * Сообщения для пользователя
 */
export const MESSAGES = {
  INCORRECT_SELECTION: 'Incorrect selection. Try again.',
  CONGRATULATIONS: 'Congratulations!',
  CHALLENGE_COMPLETE: 'You have successfully completed all CAPTCHA challenges!'
} as const;
