import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-result',
  standalone: true,
  templateUrl: './result.html',
  styleUrl: './result.scss',
  imports: [MatButtonModule, MatCardModule],
  animations: [
    trigger('resultFade', [
      transition(':enter', [style({ opacity: 0 }), animate('0.4s', style({ opacity: 1 }))])
    ])
  ]
})
export class Result {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }
}