import { Component, inject } from '@angular/core';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SessionService, SettingsService } from '../../services/session.service';

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
          <p class="greeting anim" style="--i:2">Bonjour{{ userName ? ', ' : '' }}<em>{{ userName }}</em>{{ userName ? '.' : '.' }}</p>
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

    @if (showWelcome) {
      <div class="modal-backdrop"></div>
      <div class="welcome-sheet">
        <div class="welcome-icon">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="74" />
          </svg>
        </div>
        <div class="welcome-title">Bienvenue sur Serene</div>
        <p class="welcome-sub">Comment souhaitez-vous être appelé ?</p>
        <input class="welcome-input" type="text"
          [value]="nameDraft"
          (input)="nameDraft = $any($event.target).value"
          (keydown.enter)="saveWelcome()"
          placeholder="Votre prénom"
          autofocus />
        <button class="welcome-btn" (click)="saveWelcome()">Continuer</button>
        <button class="welcome-skip" (click)="skipWelcome()">Passer</button>
      </div>
    }
  `,
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements ViewWillEnter {
  private router = inject(Router);
  readonly sessions = inject(SessionService);
  private readonly settingsService = inject(SettingsService);
  leaving = false;
  showWelcome = false;
  nameDraft = '';
  private welcomeDismissed = false;

  get userName(): string { return this.settingsService.current.userName; }

  ionViewWillEnter(): void {
    this.leaving = false;
    if (!this.settingsService.current.userName && !this.welcomeDismissed) {
      this.showWelcome = true;
    }
  }

  saveWelcome(): void {
    const name = this.nameDraft.trim();
    if (name) {
      this.settingsService.update({ userName: name });
    }
    this.welcomeDismissed = true;
    this.showWelcome = false;
  }

  skipWelcome(): void {
    this.welcomeDismissed = true;
    this.showWelcome = false;
  }

  goToTimer(): void {
    this.leaving = true;
    setTimeout(() => this.router.navigate(['/timer']), 400);
  }
}
