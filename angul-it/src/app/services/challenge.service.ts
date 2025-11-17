import { Injectable } from '@angular/core';

export type Challenge = {
  id: number;
  type: 'selectImages';
  question: string;
  grid: { url: string; isCat?: boolean; isPotion?: boolean; isClock?: boolean }[];
};

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private readonly SHUFFLE_STORAGE_KEY = 'captcha-shuffled-challenges';
  private readonly INDEX_STORAGE_KEY = 'captcha-current-index';

  // Функция для перемешивания массива
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Базовые данные (без shuffle)
  private baseChallenges: Challenge[] = [
    {
      id: 1,
      type: 'selectImages',
      question: 'Select all images that show a cat in space.',
      grid: [
        { url: 'captcha/cat1.png', isCat: true },
        { url: 'captcha/cat2.png', isCat: true },
        { url: 'captcha/cat3.png', isCat: true },
        { url: 'captcha/cat4.png', isCat: true },
        { url: 'captcha/dog1.png', isCat: false },
        { url: 'captcha/dog2.png', isCat: false },
        { url: 'captcha/rabbit1.png', isCat: false },
        { url: 'captcha/rabbit2.png', isCat: false },
        { url: 'captcha/panda1.png', isCat: false },
        { url: 'captcha/panda2.png', isCat: false },
        { url: 'captcha/owl1.png', isCat: false },
        { url: 'captcha/owl2.png', isCat: false }
      ]
    },
    {
      id: 2,
      type: 'selectImages',
      question: 'Select all images that show a magic potion with blue liquid and a moon symbol.',
      grid: [
        { url: 'captcha/potion1.png', isPotion: true },
        { url: 'captcha/potion2.png', isPotion: true },
        { url: 'captcha/potion3.png', isPotion: true },
        { url: 'captcha/potion4.png', isPotion: true },
        { url: 'captcha/potion5.png', isPotion: false },
        { url: 'captcha/potion6.png', isPotion: false },
        { url: 'captcha/potion7.png', isPotion: false },
        { url: 'captcha/potion8.png', isPotion: false },
        { url: 'captcha/potion9.png', isPotion: false },
        { url: 'captcha/potion10.png', isPotion: false },
        { url: 'captcha/potion11.png', isPotion: false },
        { url: 'captcha/potion12.png', isPotion: false }
      ]
    },
    {
      id: 3,
      type: 'selectImages',
      question: 'Select all images where the clock shows 3:15.',
      grid: [
        { url: 'captcha/clock1.png', isClock: true },
        { url: 'captcha/clock2.png', isClock: true },
        { url: 'captcha/clock3.png', isClock: true },
        { url: 'captcha/clock4.png', isClock: true },
        { url: 'captcha/clock5.png', isClock: false },
        { url: 'captcha/clock6.png', isClock: false },
        { url: 'captcha/clock7.png', isClock: false },
        { url: 'captcha/clock8.png', isClock: false },
        { url: 'captcha/clock9.png', isClock: false },
        { url: 'captcha/clock10.png', isClock: false },
        { url: 'captcha/clock11.png', isClock: false },
        { url: 'captcha/clock12.png', isClock: false }
      ]
    }
  ];

  private shuffledChallenges: Challenge[] = [];
  private _currentIndex = 0;

  get currentIndex(): number {
    return this._currentIndex;
  }

  set currentIndex(value: number) {
    this._currentIndex = value;
    sessionStorage.setItem(this.INDEX_STORAGE_KEY, value.toString());
  }

  constructor() {
    // Загружаем текущий индекс
    const storedIndex = sessionStorage.getItem(this.INDEX_STORAGE_KEY);
    if (storedIndex) {
      this._currentIndex = parseInt(storedIndex, 10);
    }
    
    // Инициализируем shuffle
    this.initializeShuffledChallenges();
  }

  private initializeShuffledChallenges() {
    this.shuffledChallenges = this.baseChallenges.map(challenge => ({
      ...challenge,
      grid: this.shuffle(challenge.grid)
    }));
  }

  // Загружаем сохранённый shuffle (вызывается из компонента при наличии выбора)
  loadShuffledFromStorage(): boolean {
    const stored = sessionStorage.getItem(this.SHUFFLE_STORAGE_KEY);
    if (stored) {
      try {
        this.shuffledChallenges = JSON.parse(stored);
        return true;
      } catch (e) {
        console.error('Failed to load shuffled challenges', e);
        return false;
      }
    }
    return false;
  }

  // Сохраняем shuffle (вызывается из компонента при первом выборе)
  saveShuffledToStorage() {
    sessionStorage.setItem(this.SHUFFLE_STORAGE_KEY, JSON.stringify(this.shuffledChallenges));
  }

  getCurrentChallenge(): Challenge {
    return this.shuffledChallenges[this.currentIndex];
  }

  get isFirst(): boolean {
    return this.currentIndex === 0;
  }

  get isLast(): boolean {
    return this.currentIndex === this.shuffledChallenges.length - 1;
  }

  nextChallenge() {
    if (!this.isLast) {
      this.currentIndex++;
    }
  }

  prevChallenge() {
    if (!this.isFirst) {
      this.currentIndex--;
    }
  }

  clearShuffledData() {
    sessionStorage.removeItem(this.SHUFFLE_STORAGE_KEY);
    sessionStorage.removeItem(this.INDEX_STORAGE_KEY);
    this._currentIndex = 0;
  }
}
