import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ChallengeService } from '../../services/challenge.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.scss'], 
  imports: [MatButtonModule, MatCardModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [style({ opacity: 0 }), animate('0.4s', style({ opacity: 1 }))])
    ])
  ]
  
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
