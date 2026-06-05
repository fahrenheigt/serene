import { Component, inject } from '@angular/core';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonContent],
  template: `
    <header class="page-head">
      <span class="eyebrow anim" style="--i:0">Serene</span>
      <h1 class="page-title anim" style="--i:1">Aujourd'hui</h1>
    </header>

    <ion-content>
      <div class="home-wrap" [class.leaving]="leaving">
        <div class="intro">
          <p class="greeting anim" style="--i:2">Bonjour, <em>Axel</em>.</p>
          <p class="sub anim" style="--i:3">Trois minutes suffisent pour revenir à soi.</p>
        </div>

        <button class="hero-start anim" style="--i:4" (click)="goToTimer()">
          <span class="hero-label">Commencer</span>
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <span class="hero-big">Méditer</span>
        </button>

        <div class="stat-row anim" style="--i:5">
          <div class="stat-card">
            <div class="stat-num">{{ sessions.currentStreak }}</div>
            <div class="stat-cap">Jours de suite</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">{{ sessions.minutesThisMonth() }}</div>
            <div class="stat-cap">Min ce mois</div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewWillEnter {
  private router = inject(Router);
  readonly sessions = inject(SessionService);
  leaving = false;

  ionViewWillEnter(): void {
    this.leaving = false;
  }

  goToTimer(): void {
    this.leaving = true;
    setTimeout(() => this.router.navigate(['/timer']), 400);
  }
}
