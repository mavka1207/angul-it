import { Injectable } from '@angular/core';
import { Challenge, ImageItem } from '../models/challenge.model';
import { STORAGE_KEYS } from '../constants/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
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
      ],
      requiredCorrectAnswers: 4
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
      ],
      requiredCorrectAnswers: 4
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
      ],
      requiredCorrectAnswers: 4
    }
  ];

  public shuffledChallenges: Challenge[] = [];
  private _currentIndex = 0;

  get currentIndex(): number {
    return this._currentIndex;
  }

  set currentIndex(value: number) {
    this._currentIndex = value;
    sessionStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, value.toString());
  }

  constructor() {
    const storedIndex = sessionStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);
    if (storedIndex) {
      this._currentIndex = parseInt(storedIndex, 10);
    }
    
    this.initializeAllChallenges();
  }

  private initializeAllChallenges(): void {
       // Check if a saved challenge order exists
    const savedOrder = sessionStorage.getItem(STORAGE_KEYS.CHALLENGE_ORDER);
    
    let orderedChallenges: Challenge[];
    
    if (savedOrder) {
      // Restore previously saved order
      const orderIndices = JSON.parse(savedOrder);
      orderedChallenges = orderIndices.map((idx: number) => this.baseChallenges[idx]);
      console.log('Loaded saved challenge order');
    } else {
      // Create a new random challenge order
      orderedChallenges = this.shuffle([...this.baseChallenges]);
      
      // Persist order using indices of base challenges
      const orderIndices = orderedChallenges.map(challenge => 
        this.baseChallenges.findIndex(c => c.id === challenge.id)
      );
      sessionStorage.setItem(STORAGE_KEYS.CHALLENGE_ORDER, JSON.stringify(orderIndices));
      console.log('Created new random challenge order:', orderIndices);
    }

    this.shuffledChallenges = this.baseChallenges.map(challenge => {
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

  private loadShuffleForStage(stageId: number): ImageItem[] | null {
    const key = STORAGE_KEYS.SHUFFLE_PREFIX + stageId;
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

  saveCurrentStageShuffle(): void {
    const currentChallenge = this.getCurrentChallenge();
    const key = STORAGE_KEYS.SHUFFLE_PREFIX + currentChallenge.id;
    sessionStorage.setItem(key, JSON.stringify(currentChallenge.grid));
    console.log(`Saved shuffle for stage ${currentChallenge.id}`);
  }

  clearCurrentStageShuffle(): void {
    const currentChallenge = this.getCurrentChallenge();
    const key = STORAGE_KEYS.SHUFFLE_PREFIX + currentChallenge.id;
    sessionStorage.removeItem(key);
    
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

  nextChallenge(): void {
    if (!this.isLast) {
      this.currentIndex++;
    }
  }

  prevChallenge(): void {
    if (!this.isFirst) {
      this.currentIndex--;
    }
  }

 clearAllShuffleData(): void {
  this.baseChallenges.forEach(challenge => {
    const key = STORAGE_KEYS.SHUFFLE_PREFIX + challenge.id;
    sessionStorage.removeItem(key);
  });
  sessionStorage.removeItem(STORAGE_KEYS.CURRENT_INDEX);
  sessionStorage.removeItem('STORAGE_KEYS.COMPLETED_STAGES'); // добавить!
  this._currentIndex = 0;
}

 

getFirstIncompleteStage(): number {
  const completedStages = JSON.parse(sessionStorage.getItem('STORAGE_KEYS.COMPLETED_STAGES') || '[]');
  for (let i = 0; i < this.baseChallenges.length; i++) {
    if (!completedStages.includes(i)) {
      return i; // index of the first incomplete stage
    }
  }
  return -1; // all stages are completed
}

getIncompleteStages(): number[] {
  const completedStages = JSON.parse(sessionStorage.getItem('STORAGE_KEYS.COMPLETED_STAGES') || '[]');
  const incomplete: number[] = [];
  for (let i = 0; i < this.baseChallenges.length; i++) {
    if (!completedStages.includes(i)) {
      incomplete.push(i + 1); // human-readable stage numbers (1, 2, 3)
    }
  }
  return incomplete;
}
}
