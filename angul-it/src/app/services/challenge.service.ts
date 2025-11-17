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
  private readonly SHUFFLE_STORAGE_PREFIX = 'captcha-shuffle-stage-';
  private readonly INDEX_STORAGE_KEY = 'captcha-current-index';

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

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
        { url: 'captcha/potion8.png', isPotion: true },
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

  public shuffledChallenges: Challenge[] = [];
  private _currentIndex = 0;

  get currentIndex(): number {
    return this._currentIndex;
  }

  set currentIndex(value: number) {
    this._currentIndex = value;
    sessionStorage.setItem(this.INDEX_STORAGE_KEY, value.toString());
  }

  constructor() {
    const storedIndex = sessionStorage.getItem(this.INDEX_STORAGE_KEY);
    if (storedIndex) {
      this._currentIndex = parseInt(storedIndex, 10);
    }
    
    this.initializeAllChallenges();
  }

  private initializeAllChallenges() {
    this.shuffledChallenges = this.baseChallenges.map(challenge => {
      // Пытаемся загрузить сохранённый shuffle для этого этапа
      const savedGrid = this.loadShuffleForStage(challenge.id);
      
      if (savedGrid) {
        console.log(`Stage ${challenge.id}: loaded saved shuffle`);
        return { ...challenge, grid: savedGrid };
      } else {
        console.log(`Stage ${challenge.id}: creating new shuffle`);
        return { ...challenge, grid: this.shuffle(challenge.grid) };
      }
    });
  }

  // Загрузить shuffle для конкретного этапа
  private loadShuffleForStage(stageId: number): any[] | null {
    const key = this.SHUFFLE_STORAGE_PREFIX + stageId;
    const stored = sessionStorage.getItem(key);
    
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(`Failed to load shuffle for stage ${stageId}`, e);
      }
    }
    return null;
  }

  // Сохранить shuffle для текущего этапа
  saveCurrentStageShuffle() {
    const currentChallenge = this.getCurrentChallenge();
    const key = this.SHUFFLE_STORAGE_PREFIX + currentChallenge.id;
    sessionStorage.setItem(key, JSON.stringify(currentChallenge.grid));
    console.log(`Saved shuffle for stage ${currentChallenge.id}`);
  }

  // Удалить shuffle для текущего этапа
  clearCurrentStageShuffle() {
    const currentChallenge = this.getCurrentChallenge();
    const key = this.SHUFFLE_STORAGE_PREFIX + currentChallenge.id;
    sessionStorage.removeItem(key);
    
    // Пересоздать shuffle для этого этапа
    const baseChallenge = this.baseChallenges.find(c => c.id === currentChallenge.id);
    if (baseChallenge) {
      this.shuffledChallenges[this.currentIndex] = {
        ...baseChallenge,
        grid: this.shuffle(baseChallenge.grid)
      };
      console.log(`Cleared and reshuffled stage ${currentChallenge.id}`);
    }
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

  clearAllShuffleData() {
    // Удаляем shuffle для всех этапов
    this.baseChallenges.forEach(challenge => {
      const key = this.SHUFFLE_STORAGE_PREFIX + challenge.id;
      sessionStorage.removeItem(key);
    });
    sessionStorage.removeItem(this.INDEX_STORAGE_KEY);
    this._currentIndex = 0;
  }
}
