import { Component, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonContent, RouterLink],
  template: `
    <header class="page-head">
      <span class="eyebrow anim" style="--i:0">Préférences</span>
      <h1 class="page-title anim" style="--i:1">Réglages</h1>
    </header>

    <ion-content>
      <div class="settings-wrap">
        <div class="section anim" style="--i:2">
          <div class="section-label">Session</div>
          <div class="option-group">
            <div class="option">
              <div class="option-text">
                <div class="option-title">Durée par défaut</div>
                <div class="option-val">10 minutes</div>
              </div>
              <svg class="chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="option">
              <div class="option-text">
                <div class="option-title">Pré-timer</div>
                <div class="option-val">5 secondes</div>
              </div>
              <svg class="chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="option">
              <div class="option-text">
                <div class="option-title">Son de fin</div>
                <div class="option-val">Carillon</div>
              </div>
              <svg class="chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>
        </div>

        <div class="section anim" style="--i:3">
          <div class="section-label">Apparence</div>
          <div class="option-group">
            <div class="option" (click)="theme.toggle()">
              <div class="option-text">
                <div class="option-title">Mode sombre</div>
              </div>
              <div class="toggle" [class.on]="theme.mode === 'dark'">
                <div class="toggle-knob"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="section anim" style="--i:4">
          <div class="section-label">Application</div>
          <div class="option-group">
            <div class="option" routerLink="/about">
              <div class="option-text">
                <div class="option-title">À propos</div>
                <div class="option-val">Version 0.0.1</div>
              </div>
              <svg class="chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  readonly theme = inject(ThemeService);
}
