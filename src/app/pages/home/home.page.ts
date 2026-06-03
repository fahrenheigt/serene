import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonContent, RouterLink],
  template: `
    <header class="page-head">
      <span class="eyebrow">Serene</span>
      <h1 class="page-title">Aujourd'hui</h1>
    </header>

    <ion-content>
      <p class="greeting">Bonjour, <em>Axel</em>.</p>
      <p class="sub">Trois minutes suffisent pour revenir à soi.</p>

      <button class="hero-start" [routerLink]="['/timer']">
        <span class="hero-label">Commencer</span>
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        <span class="hero-big">Méditer</span>
      </button>

      <div class="stat-row">
        <div class="stat-card">
          <div class="stat-num">7</div>
          <div class="stat-cap">Jours de suite</div>
        </div>
        <div class="stat-card">
          <div class="stat-num">142</div>
          <div class="stat-cap">Min ce mois</div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./home.page.scss'],
})
export class HomePage {}
