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
  
  // Сохраняем выбор для каждого этапа по id
  private selectionHistory: Map<number, number[]> = new Map();
  
  errorMessage = '';

  constructor(
    public challengeService: ChallengeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Загружаем сохранённый выбор из sessionStorage
    this.loadSelectionFromStorage();
    
    // Если есть сохранённый выбор, загружаем и сохранённый shuffle
    // Иначе shuffle уже был создан в конструкторе сервиса (новый случайный)
    if (this.selectionHistory.size > 0) {
      const loaded = this.challengeService.loadShuffledFromStorage();
      if (!loaded) {
        // Если не удалось загрузить, очищаем выбор (данные несогласованы)
        this.clearSelectionHistory();
      }
    }
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
    
    // Сохраняем изменённый выбор
    this.selectionHistory.set(this.challenge.id, currentSelected);
    this.saveSelectionToStorage();
    
    // При первом выборе сохраняем shuffle
    this.challengeService.saveShuffledToStorage();
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
      // Очищаем историю после успешного завершения
      this.clearSelectionHistory();
      this.challengeService.clearShuffledData();
      this.router.navigate(['/result']);
    }
  }

  prev() {
    if (!this.challengeService.isFirst) {
      this.challengeService.prevChallenge();
      this.errorMessage = '';
    }
  }

  // Сохраняем выбор в sessionStorage
  private saveSelectionToStorage() {
    const data = Array.from(this.selectionHistory.entries());
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Загружаем выбор из sessionStorage
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

  // Очищаем историю выбора
  private clearSelectionHistory() {
    this.selectionHistory.clear();
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}
