import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ChallengeService } from '../../services/challenge.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [MatButtonModule, MatCardModule, RouterLink]
})
export class Home {
    constructor(
    public challengeService: ChallengeService,
    private router: Router
  ) {}

  startChallenge() {
    // Очищаем все данные перед началом нового челленджа
    this.challengeService.clearAllShuffleData();
    sessionStorage.clear(); // Очищаем весь sessionStorage
    this.router.navigate(['/captcha']);
  }
}
