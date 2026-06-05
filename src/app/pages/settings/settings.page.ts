import { Component, inject } from '@angular/core';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../services/session.service';
import { Settings } from '../../models/session.model';

interface PickerOption { value: string | number; label: string; }

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
            <div class="option" (click)="openPicker('defaultDuration', 'Durée par défaut', durationOptions)">
              <div class="option-text">
                <div class="option-title">Durée par défaut</div>
                <div class="option-val">{{ cfg.defaultDuration }} minutes</div>
              </div>
              <svg class="chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="option" (click)="openPicker('defaultSound', 'Ambiance par défaut', soundOptions)">
              <div class="option-text">
                <div class="option-title">Ambiance par défaut</div>
                <div class="option-val">{{ soundLabel }}</div>
              </div>
              <svg class="chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="option" (click)="openPicker('pickerStyle', 'Sélection du temps', pickerStyleOptions)">
              <div class="option-text">
                <div class="option-title">Sélection du temps</div>
                <div class="option-val">{{ cfg.pickerStyle === 'buttons' ? 'Boutons' : 'Curseur' }}</div>
              </div>
              <svg class="chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            <div class="option" (click)="openPicker('breathCycle', 'Rythme de respiration', breathOptions)">
              <div class="option-text">
                <div class="option-title">Rythme de respiration</div>
                <div class="option-val">{{ breathLabel }}</div>
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

    @if (picker) {
      <div class="modal-backdrop" (click)="closePicker()"></div>
      <div class="modal-sheet">
        <div class="modal-title">{{ picker.title }}</div>
        @for (opt of picker.options; track opt.value) {
          <button class="modal-option" [class.selected]="opt.value === picker.current"
            (click)="selectOption(opt.value)">
            <span>{{ opt.label }}</span>
            @if (opt.value === picker.current) {
              <svg class="check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
            }
          </button>
        }
      </div>
    }
  `,
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements ViewWillEnter {
  private readonly settingsService = inject(SettingsService);
  cfg: Settings = this.settingsService.current;

  picker: { key: string; title: string; options: PickerOption[]; current: string | number } | null = null;

  readonly durationOptions: PickerOption[] = [5, 10, 15, 20, 30].map(d => ({ value: d, label: `${d} minutes` }));
  readonly soundOptions: PickerOption[] = [
    { value: 'silence', label: 'Silence' },
    { value: 'brown-noise', label: 'Bruit brun' },
    { value: 'white-noise', label: 'Bruit blanc' },
    { value: 'rain', label: 'Pluie' },
    { value: 'ocean', label: 'Océan' },
  ];
  readonly pickerStyleOptions: PickerOption[] = [
    { value: 'buttons', label: 'Boutons' },
    { value: 'slider', label: 'Curseur' },
  ];
  readonly breathOptions: PickerOption[] = [
    { value: 4, label: '4s — Rapide (2s / 2s)' },
    { value: 6, label: '6s — Cohérence (3s / 3s)' },
    { value: 8, label: '8s — Calme (4s / 4s)' },
    { value: 10, label: '10s — Profond (5s / 5s)' },
    { value: 14, label: '14s — 4-7-8 relaxation' },
  ];

  ionViewWillEnter(): void {
    this.cfg = this.settingsService.current;
  }

  get soundLabel(): string {
    return this.soundOptions.find(s => s.value === this.cfg.defaultSound)?.label ?? 'Silence';
  }

  get breathLabel(): string {
    return this.breathOptions.find(b => b.value === this.cfg.breathCycle)?.label ?? `${this.cfg.breathCycle}s`;
  }

  toggleTheme(): void {
    this.settingsService.update({ theme: this.cfg.theme === 'light' ? 'dark' : 'light' });
    this.cfg = this.settingsService.current;
  }

  toggle(key: 'showDurationPicker' | 'showSoundPicker'): void {
    this.settingsService.update({ [key]: !this.cfg[key] });
    this.cfg = this.settingsService.current;
  }

  openPicker(key: string, title: string, options: PickerOption[]): void {
    this.picker = { key, title, options, current: (this.cfg as any)[key] };
  }

  selectOption(value: string | number): void {
    if (!this.picker) return;
    this.settingsService.update({ [this.picker.key]: value });
    this.cfg = this.settingsService.current;
    this.closePicker();
  }

  closePicker(): void {
    this.picker = null;
  }
}
