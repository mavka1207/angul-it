import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChallengeService } from '../../services/challenge.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { STORAGE_KEYS } from '../../constants/storage-keys';

@Component({
  selector: 'app-result',
  standalone: true,
  templateUrl: './result.html',
  styleUrl: './result.scss',
  imports: [CommonModule, MatButtonModule, MatCardModule],
  animations: [
    trigger('resultFade', [
      transition(':enter', [style({ opacity: 0 }), animate('0.4s', style({ opacity: 1 }))])
    ])
  ]
})
export class Result implements OnInit {
  isCompleted = false;
  showHomeButton = false;
  incompleteMessage = '';

  constructor(
    private router: Router,
    private challengeService: ChallengeService
  ) {}

 


ngOnInit(): void {
    // Проверяем, существует ли история вообще
    const historyStr = sessionStorage.getItem(STORAGE_KEYS.SELECTION_HISTORY);
    const history = historyStr ? JSON.parse(historyStr) : null;

    // Если истории нет вообще — значит пользователь не начинал капчу
    if (!history || history.length === 0) {
      this.isCompleted = false;
      this.showHomeButton = true;
      this.incompleteMessage = 'You must complete Stages to view the result.';
      return;
    }

    const incompleteStages = this.challengeService.getIncompleteStages();
    const firstIncompleteIdx = this.challengeService.getFirstIncompleteStage();

    if (incompleteStages.length === 0) {
      // Все этапы пройдены
      this.isCompleted = true;
      this.showHomeButton = false;
    } else if (firstIncompleteIdx === 0) {
      // Stage 1 не пройден
      this.isCompleted = false;
      this.showHomeButton = true;
      this.incompleteMessage = 'You must complete Stages to view the result.';
    } else {
      // Stage 2 или 3 не пройдены
      this.isCompleted = false;
      this.showHomeButton = false;
      
      // Формируем сообщение
      const stagesList = incompleteStages.join(', ');
      this.incompleteMessage = `You must complete Stage${incompleteStages.length > 1 ? 's' : ''} ${stagesList} to view the result.`;
      
      // Редиректим на первый незавершённый этап
      this.challengeService.currentIndex = firstIncompleteIdx;
      this.router.navigate(['/captcha']);
    }
  }



  goHome(): void {
    this.router.navigate(['/']);
  }
}