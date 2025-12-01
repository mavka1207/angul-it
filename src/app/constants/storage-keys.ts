/**
 * Keys used in sessionStorage
 */
export const STORAGE_KEYS = {
  /** Prefix for per-stage shuffle keys, e.g. captcha-shuffle-stage-1 */
  SHUFFLE_PREFIX: 'captcha-shuffle-stage-',
  
  /** Current stage index*/
  CURRENT_INDEX: 'captcha-current-index',
  
  /** User selection history across all stages */
  SELECTION_HISTORY: 'captcha-selection-history',
  CHALLENGE_ORDER: 'captcha-challenge-order', 
  COMPLETED_STAGES: 'captcha-completed-stages' 
} as const;

/**
 * CAPTCHA configuration
 */
export const CAPTCHA_CONFIG = {
  /** Total number of stages", etc. */
  TOTAL_STAGES: 3,
  
  
  IMAGES_PER_STAGE: 12,
  
  
  CORRECT_IMAGES_COUNT: 4
} as const;

/**
 * Message for client
 */
export const MESSAGES = {
  INCORRECT_SELECTION: 'Please select the correct images and try again.'
} as const;
