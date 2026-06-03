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
  styles: [`
    .greeting {
      font-family: var(--font-serif);
      font-size: 28px;
      font-weight: 400;
      line-height: 1.15;
      margin-bottom: var(--space-2);
    }

    .greeting em {
      font-style: italic;
    }

    .sub {
      color: var(--color-text-secondary);
      font-size: 15px;
      line-height: 1.5;
      margin-bottom: var(--space-8);
    }

    .hero-start {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      margin: var(--space-4) 0 var(--space-9);
      transition: transform var(--motion-standard) var(--motion-ease),
                  box-shadow var(--motion-standard) var(--motion-ease),
                  border-color var(--motion-standard) var(--motion-ease);
      position: relative;
    }

    .hero-start::after {
      content: "";
      position: absolute;
      inset: 18px;
      border-radius: 50%;
      border: 1px solid var(--color-border);
      opacity: 0.5;
    }

    .hero-start:active {
      transform: scale(0.99);
    }

    .hero-label {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--color-text-muted);
    }

    .hero-big {
      font-family: var(--font-serif);
      font-size: 30px;
    }

    .hero-start svg {
      width: 34px;
      height: 34px;
      stroke: var(--color-text);
      fill: var(--color-text);
    }

    .stat-row {
      display: flex;
      gap: var(--space-3);
    }

    .stat-card {
      flex: 1;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 18px;
      padding: var(--space-5);
      transition: background var(--motion-standard) var(--motion-ease),
                  border-color var(--motion-standard) var(--motion-ease);
    }

    .stat-num {
      font-family: var(--font-mono);
      font-size: 26px;
      font-weight: 500;
      letter-spacing: -0.02em;
    }

    .stat-cap {
      font-size: 11px;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: var(--space-1);
    }
  `],
})
export class HomePage {}
