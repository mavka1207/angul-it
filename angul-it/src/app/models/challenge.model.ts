export type ChallengeType = 'selectImages';

export interface ImageItem {
  url: string;
  isCat?: boolean;
  isPotion?: boolean;
  isClock?: boolean;
}

export interface Challenge {
  id: number;
  type: ChallengeType;
  question: string;
  grid: ImageItem[];
  requiredCorrectAnswers?: number;
}

// Тип для истории выбора
export type SelectionHistory = number[][];

// Утилитарный тип для проверки правильности ответа
export interface ValidationResult {
  isCorrect: boolean;
  selectedCount: number;
  requiredCount: number;
}
