import { Component } from '@angular/core';
import { ChallengeService } from '../../services/challenge.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-captcha',
  standalone: true,
  templateUrl: './captcha.html',
  styleUrl: './captcha.scss',
  imports: [FormsModule, MatButtonModule]
})
export class Captcha {
  currentAnswer: string = '';
  error: string = '';
  constructor(public challengeService: ChallengeService, private router: Router) {}

  get challenge() {
    return this.challengeService.getCurrentChallenge();
  }

  checkAnswer() {
    if (this.currentAnswer.trim().toLowerCase() !== this.challenge.answer.toLowerCase()) {
      this.error = 'Incorrect answer!';
    } else {
      this.error = '';
      this.next();
    }
  }

  next() {
    if (!this.challengeService.isLast) {
      this.challengeService.nextChallenge();
      this.currentAnswer = '';
      this.error = '';
    } else {
      this.router.navigate(['/result']);
    }
  }

  prev() {
    if (!this.challengeService.isFirst) {
      this.challengeService.prevChallenge();
      this.currentAnswer = '';
      this.error = '';
    }
  }
}
