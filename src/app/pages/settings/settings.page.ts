import { Component, inject } from '@angular/core';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../services/session.service';
import { Settings } from '../../models/session.model';

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
            <div class="option" (click)="cycleDuration()">
              <div class="option-text">
                <div class="option-title">Durée par défaut</div>
                <div class="option-val">{{ cfg.defaultDuration }} minutes</div>
              </div>
              <svg class="chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="option" (click)="cycleSound()">
              <div class="option-text">
                <div class="option-title">Ambiance par défaut</div>
                <div class="option-val">{{ soundLabel }}</div>
              </div>
              <svg class="chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="option" (click)="cyclePickerStyle()">
              <div class="option-text">
                <div class="option-title">Sélection du temps</div>
                <div class="option-val">{{ cfg.pickerStyle === 'buttons' ? 'Boutons' : 'Curseur' }}</div>
              </div>
              <svg class="chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="option" (click)="toggle('showDurationPicker')">
              <div class="option-text">
                <div class="option-title">Afficher sélection du temps</div>
              </div>
              <div class="toggle" [class.on]="cfg.showDurationPicker">
                <div class="toggle-knob"></div>
              </div>
            </div>
            <div class="option" (click)="toggle('showSoundPicker')">
              <div class="option-text">
                <div class="option-title">Afficher sélection d'ambiance</div>
              </div>
              <div class="toggle" [class.on]="cfg.showSoundPicker">
                <div class="toggle-knob"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="section anim" style="--i:3">
          <div class="section-label">Apparence</div>
          <div class="option-group">
            <div class="option" (click)="toggleTheme()">
              <div class="option-text">
                <div class="option-title">Mode sombre</div>
              </div>
              <div class="toggle" [class.on]="cfg.theme === 'dark'">
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
export class SettingsPage implements ViewWillEnter {
  private readonly settingsService = inject(SettingsService);

  readonly durations = [5, 10, 15, 20, 30];
  readonly sounds = [
    { id: 'silence', label: 'Silence' },
    { id: 'brown-noise', label: 'Bruit brun' },
    { id: 'white-noise', label: 'Bruit blanc' },
    { id: 'rain', label: 'Pluie' },
    { id: 'ocean', label: 'Océan' },
  ];

  cfg: Settings = this.settingsService.current;

  ionViewWillEnter(): void {
    this.cfg = this.settingsService.current;
  }

  get soundLabel(): string {
    return this.sounds.find(s => s.id === this.cfg.defaultSound)?.label ?? 'Silence';
  }

  toggleTheme(): void {
    const next = this.cfg.theme === 'light' ? 'dark' : 'light';
    this.settingsService.update({ theme: next });
    this.cfg = this.settingsService.current;
  }

  cycleDuration(): void {
    const idx = this.durations.indexOf(this.cfg.defaultDuration);
    const next = this.durations[(idx + 1) % this.durations.length];
    this.settingsService.update({ defaultDuration: next });
    this.cfg = this.settingsService.current;
  }

  cycleSound(): void {
    const idx = this.sounds.findIndex(s => s.id === this.cfg.defaultSound);
    const next = this.sounds[(idx + 1) % this.sounds.length].id;
    this.settingsService.update({ defaultSound: next });
    this.cfg = this.settingsService.current;
  }

  toggle(key: 'showDurationPicker' | 'showSoundPicker'): void {
    this.settingsService.update({ [key]: !this.cfg[key] });
    this.cfg = this.settingsService.current;
  }

  cyclePickerStyle(): void {
    const next = this.cfg.pickerStyle === 'buttons' ? 'slider' : 'buttons';
    this.settingsService.update({ pickerStyle: next });
    this.cfg = this.settingsService.current;
  }
}
