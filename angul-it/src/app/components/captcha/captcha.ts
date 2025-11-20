import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ChallengeService } from '../../services/challenge.service';
import { Challenge } from '../../models/challenge.model';
import { STORAGE_KEYS, MESSAGES } from '../../constants/storage-keys';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './captcha.html',
  styleUrls: ['./captcha.scss'],
  animations: [
    trigger('challengeAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('0.4s cubic-bezier(.53,.7,.42,.96)', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.3s', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class Captcha implements OnInit {
  challenge!: Challenge;
  selected: number[] = [];
  error = '';

  constructor(
    public challengeService: ChallengeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.challenge = this.challengeService.getCurrentChallenge();
    
    const history = this.getSelectionHistory();
    this.selected = history[this.challengeService.currentIndex] || [];
  }

  selectImage(index: number): void {
    const idx = this.selected.indexOf(index);
    if (idx > -1) {
      this.selected.splice(idx, 1);
    } else {
      this.selected.push(index);
    }

    this.updateStorage();
    this.error = '';
  }

  checkAnswer(): void {
    const correctIndices = this.getCorrectIndices();
    const isCorrect = 
      this.selected.length === correctIndices.length &&
      this.selected.every(i => correctIndices.includes(i));

    if (isCorrect) {
      this.saveState();
      
      if (this.challengeService.isLast) {
        this.challengeService.clearAllShuffleData();
        sessionStorage.removeItem(STORAGE_KEYS.SELECTION_HISTORY);
        this.router.navigate(['/result']);
      } else {
        this.challengeService.nextChallenge();
        this.challenge = this.challengeService.getCurrentChallenge();
        
        const history = this.getSelectionHistory();
        this.selected = history[this.challengeService.currentIndex] || [];
      }
    } else {
      this.error = MESSAGES.INCORRECT_SELECTION;
    }
  }

  prev(): void {
    this.saveState();
    this.challengeService.prevChallenge();
    this.challenge = this.challengeService.getCurrentChallenge();
    
    const history = this.getSelectionHistory();
    this.selected = history[this.challengeService.currentIndex] || [];
  }

  trackByUrl(index: number, item: any): string {
    return item.url;
  }

  private getCorrectIndices(): number[] {
    const keyMap: { [key: number]: string } = {
      1: 'isCat',
      2: 'isPotion',
      3: 'isClock'
    };
    
    const key = keyMap[this.challenge.id];
    return this.challenge.grid
      .map((img, i) => (img as any)[key] ? i : -1)
      .filter(i => i !== -1);
  }

  private saveState(): void {
    const history = this.getSelectionHistory();
    history[this.challengeService.currentIndex] = [...this.selected];
    sessionStorage.setItem(STORAGE_KEYS.SELECTION_HISTORY, JSON.stringify(history));
    this.challengeService.saveCurrentStageShuffle();
  }

  private updateStorage(): void {
    const history = this.getSelectionHistory();
    history[this.challengeService.currentIndex] = [...this.selected];
    sessionStorage.setItem(STORAGE_KEYS.SELECTION_HISTORY, JSON.stringify(history));

    if (this.selected.length > 0) {
      this.challengeService.saveCurrentStageShuffle();
    } else {
      const hasOtherSelections = history.some((sel, i) => 
        i !== this.challengeService.currentIndex && sel.length > 0
      );

      if (!hasOtherSelections) {
        this.challengeService.clearAllShuffleData();
        sessionStorage.removeItem(STORAGE_KEYS.SELECTION_HISTORY);
      } else {
        this.challengeService.clearCurrentStageShuffle();
      }
    }
  }

  private getSelectionHistory(): number[][] {
    const stored = sessionStorage.getItem(STORAGE_KEYS.SELECTION_HISTORY);
    return stored ? JSON.parse(stored) : [];
  }
}
