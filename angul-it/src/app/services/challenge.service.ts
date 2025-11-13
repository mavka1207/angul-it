import { Injectable } from '@angular/core';

export type Challenge = {
  id: number;
  type: 'text' | 'math';
  question: string;
  answer: string;
};

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  public challenges: Challenge[] = [/* ... */];
  private currentIndex = 0;

  getCurrentChallenge(): Challenge {
    return this.challenges[this.currentIndex];
  }

  nextChallenge(): boolean {
    if (this.currentIndex < this.challenges.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }
  prevChallenge(): boolean {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }
  get isLast(): boolean {
    return this.currentIndex === this.challenges.length - 1;
  }
  get isFirst(): boolean {
    return this.currentIndex === 0;
  }
}
