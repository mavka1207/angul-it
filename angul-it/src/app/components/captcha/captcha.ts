import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ChallengeService } from '../../services/challenge.service';

@Component({
  selector: 'app-captcha',
  standalone: true,
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss',
  imports: [FormsModule, MatButtonModule, CommonModule]
})
export class Captcha implements OnInit {
  private readonly STORAGE_KEY = 'captcha-selection-history';
  
  private selectionHistory: Map<number, number[]> = new Map();
  
  errorMessage = '';

  constructor(
    public challengeService: ChallengeService,
    private router: Router
  ) {}

trackByUrl(index: number, item: any): string {
  return item.url;
}

  ngOnInit() {
    this.loadSelectionFromStorage();
    console.log('Component initialized, selection loaded');
  }

  get challenge() {
    return this.challengeService.getCurrentChallenge();
  }

  get selected(): number[] {
    return this.selectionHistory.get(this.challenge.id) || [];
  }

  selectImage(i: number) {
    const currentSelected = this.selected;
    const idx = currentSelected.indexOf(i);
    
    if (idx === -1) {
      currentSelected.push(i);
    } else {
      currentSelected.splice(idx, 1);
    }
    
    this.selectionHistory.set(this.challenge.id, currentSelected);
    
    // Сохраняем или удаляем данные в зависимости от наличия выбора
    this.updateStorage();
  }

  private updateStorage() {
    // Проверяем, есть ли выбор на ТЕКУЩЕМ этапе
    const currentSelected = this.selected;
    const hasCurrentSelection = currentSelected.length > 0;
    
    if (hasCurrentSelection) {
      // Сохраняем выбор для всех этапов и shuffle для текущего
      this.saveSelectionToStorage();
      this.challengeService.saveCurrentStageShuffle();
    } else {
      // Проверяем, остались ли выборы на других этапах
      const hasAnySelection = Array.from(this.selectionHistory.values()).some(arr => arr.length > 0);
      
      if (hasAnySelection) {
        // Есть выбор на других этапах — просто обновляем storage
        this.saveSelectionToStorage();
        // Удаляем shuffle ТОЛЬКО для текущего этапа
        this.challengeService.clearCurrentStageShuffle();
      } else {
        // Нет выбора нигде — удаляем всё
        this.clearSelectionHistory();
        console.log('All selections cleared');
      }
    }
  }

  isValid(): boolean {
    const correctIndices = this.challenge.grid
      .map((img, i) => (img.isCat || img.isPotion || img.isClock) ? i : -1)
      .filter(x => x !== -1);
    
    const currentSelected = this.selected;
    return currentSelected.length === correctIndices.length &&
           currentSelected.every(idx => correctIndices.includes(idx));
  }

  checkAnswer() {
    if (!this.isValid()) {
      this.errorMessage = 'Incorrect selection. Try again.';
      return;
    }
    this.errorMessage = '';
    this.next();
  }

  next() {
    if (!this.challengeService.isLast) {
      this.challengeService.nextChallenge();
      this.errorMessage = '';
    } else {
      this.clearSelectionHistory();
      this.challengeService.clearAllShuffleData();
      this.router.navigate(['/result']);
    }
  }

  prev() {
    if (!this.challengeService.isFirst) {
      this.challengeService.prevChallenge();
      this.errorMessage = '';
    }
  }

  private saveSelectionToStorage() {
    const data = Array.from(this.selectionHistory.entries());
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private loadSelectionFromStorage() {
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.selectionHistory = new Map(data);
      } catch (e) {
        console.error('Failed to load selection history', e);
      }
    }
  }

  private clearSelectionHistory() {
    this.selectionHistory.clear();
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.challengeService.clearAllShuffleData();
  }
}
