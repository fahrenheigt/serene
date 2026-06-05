import { Component, OnDestroy, inject } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { AudioService, AmbientSound } from '../../services/audio.service';
import { SessionService, SettingsService } from '../../services/session.service';
import { PickerStyle } from '../../models/session.model';
import { SoundPickerComponent } from '../../components/sound-picker/sound-picker.component';

type TimerState = 'idle' | 'preparing' | 'running' | 'paused' | 'completed';
type TimerMode = 'timer' | 'chrono';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [IonContent, SoundPickerComponent],
  template: `
    <header class="page-head compact" [class.hidden]="state === 'running' || state === 'completed' || state === 'preparing'">
      <span class="eyebrow">Session</span>
      <div class="mode-toggle" [class.disabled]="state !== 'idle'">
        <button [class.active]="mode === 'timer'" (click)="setMode('timer')">Minuteur</button>
        <button [class.active]="mode === 'chrono'" (click)="setMode('chrono')">Chrono</button>
      </div>
    </header>

    <ion-content class="timer-content" [class.is-active]="state === 'running' || state === 'paused' || state === 'completed'">
      <div class="timer-wrap" [attr.data-state]="state">

        @if (state === 'preparing') {
          <div class="prep-overlay">
            <div class="prep-count">{{ prepRemaining }}</div>
            <div class="prep-label">Préparez-vous</div>
            <button class="prep-skip" (click)="skipPrep()">Passer</button>
          </div>
        } @else {

          <div class="hero" [class.focused]="state !== 'idle'">
            <svg class="timer-svg" [class.breathing]="state === 'running'" [class.completed]="state === 'completed'" viewBox="0 0 200 200">
              <circle class="glow" cx="100" cy="100" r="88" />
              <circle class="track" cx="100" cy="100" r="90" />
              @if (mode === 'chrono') {
                @for (m of milestones; track m.minutes) {
                  <line class="milestone"
                    [class.reached]="elapsed >= m.minutes * 60"
                    [attr.x1]="m.x1" [attr.y1]="m.y1"
                    [attr.x2]="m.x2" [attr.y2]="m.y2" />
                }
              }
              <circle class="progress" cx="100" cy="100" r="90"
                [attr.stroke-dasharray]="circumference"
                [attr.stroke-dashoffset]="dashOffset" />
              <text class="value" x="100" y="98" text-anchor="middle">{{ display }}</text>
              <text class="hint" x="100" y="120" text-anchor="middle">{{ hint }}</text>
            </svg>

            @if (settings.current.showDurationPicker) {
            <div class="picker-row" [class.hidden]="state !== 'idle'">
              @if (pickerStyle === 'buttons') {
                @if (mode === 'timer') {
                  <div class="duration-picker" [class.disabled]="state !== 'idle'">
                    @for (d of durations; track d) {
                      <button [class.sel]="d === selectedMinutes"
                        (click)="selectDuration(d)">{{ d }}</button>
                    }
                  </div>
                } @else {
                  <div class="milestone-picker" [class.disabled]="state !== 'idle'">
                    @for (s of milestoneSteps; track s) {
                      <button [class.sel]="s === selectedStep"
                        (click)="selectStep(s)">{{ s }}</button>
                    }
                  </div>
                }
              } @else {
                <div class="slider-picker" [class.disabled]="state !== 'idle'">
                  @if (mode === 'timer') {
                    <span class="slider-val">{{ selectedMinutes }} min</span>
                    <input type="range" class="picker-slider"
                      [value]="selectedMinutes" min="1" max="60" step="1"
                      (input)="onSliderDuration($event)" />
                  } @else {
                    <span class="slider-val">{{ selectedStep }} min</span>
                    <input type="range" class="picker-slider"
                      [value]="selectedStep" min="1" max="15" step="1"
                      (input)="onSliderStep($event)" />
                  }
                </div>
              }
            </div>
            }
          </div>

          @if (settings.current.showSoundPicker) {
          <div class="secondary sound" [class.hidden]="state === 'completed'">
            <div class="section-label">Ambiance</div>
            <app-sound-picker
              [active]="audio.currentSound"
              (select)="selectSound($event)" />
            <div class="volume-row">
              <span class="vol-label">Volume</span>
              <input type="range" class="vol-slider"
                [value]="audio.volume" min="0" max="1" step="0.05"
                (input)="audio.setVolume(+$any($event.target).value)" />
            </div>
          </div>
          }

          <div class="controls">
            @switch (state) {
              @case ('idle') {
                <button class="ctrl" (click)="start()">
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </button>
              }
              @case ('running') {
                <button class="ctrl outline" (click)="pause()">
                  <svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
                </button>
              }
              @case ('paused') {
                <button class="ctrl" (click)="resume()">
                  <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </button>
                <button class="ctrl outline" (click)="stop()">
                  <svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                </button>
              }
              @case ('completed') {
                <button class="ctrl done" (click)="stop()">Terminer</button>
              }
            }
          </div>
        }
      </div>
    </ion-content>
  `,
  styleUrls: ['./timer.page.scss'],
})
export class TimerPage implements OnDestroy {
  readonly audio = inject(AudioService);
  private readonly sessions = inject(SessionService);
  readonly settings = inject(SettingsService);
  readonly circumference = 2 * Math.PI * 90;
  readonly durations = [5, 10, 15, 20, 30];
  get pickerStyle(): PickerStyle { return this.settings.current.pickerStyle; }

  readonly milestoneSteps = [1, 2, 5, 10];
  selectedStep = 5;

  readonly prepDuration = 5;
  prepRemaining = 5;

  mode: TimerMode = 'timer';
  selectedMinutes = this.settings.current.defaultDuration;
  total = this.settings.current.defaultDuration * 60;
  remaining = this.settings.current.defaultDuration * 60;
  elapsed = 0;
  state: TimerState = 'idle';
  private sessionElapsed = 0;
  private sessionStartTime = '';

  private intervalId: ReturnType<typeof setInterval> | null = null;

  get display(): string {
    const seconds = this.mode === 'timer' ? this.remaining : this.elapsed;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  get hint(): string {
    switch (this.state) {
      case 'running': return 'En cours';
      case 'paused': return 'En pause';
      case 'completed': return 'Session terminée';
      default: return this.mode === 'timer' ? 'Prêt à méditer' : 'Prêt';
    }
  }

  get milestones() {
    const maxMinutes = 30;
    const steps: { minutes: number; x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let m = this.selectedStep; m <= maxMinutes; m += this.selectedStep) {
      const angle = (m / maxMinutes) * 360 - 90;
      const rad = angle * Math.PI / 180;
      const cx = 100, cy = 100, r = 90;
      const inner = r - 6;
      const outer = r + 6;
      steps.push({
        minutes: m,
        x1: cx + inner * Math.cos(rad),
        y1: cy + inner * Math.sin(rad),
        x2: cx + outer * Math.cos(rad),
        y2: cy + outer * Math.sin(rad),
      });
    }
    return steps;
  }

  get dashOffset(): number {
    if (this.mode === 'chrono') {
      const maxDisplay = 30 * 60;
      const ratio = Math.min(this.elapsed / maxDisplay, 1);
      return this.circumference * (1 - ratio);
    }
    const ratio = this.total > 0 ? this.remaining / this.total : 0;
    return this.circumference * (1 - ratio);
  }

  setMode(mode: TimerMode): void {
    if (this.state !== 'idle') return;
    this.mode = mode;
    if (mode === 'chrono') {
      this.elapsed = 0;
    } else {
      this.remaining = this.total;
    }
  }

  selectSound(sound: AmbientSound): void {
    this.audio.play(sound);
  }

  selectStep(step: number): void {
    if (this.state !== 'idle') return;
    this.selectedStep = step;
  }

  onSliderDuration(event: Event): void {
    if (this.state !== 'idle') return;
    const val = +(event.target as HTMLInputElement).value;
    this.selectedMinutes = val;
    this.total = val * 60;
    this.remaining = this.total;
  }

  onSliderStep(event: Event): void {
    if (this.state !== 'idle') return;
    this.selectedStep = +(event.target as HTMLInputElement).value;
  }

  selectDuration(minutes: number): void {
    if (this.state !== 'idle') return;
    this.selectedMinutes = minutes;
    this.total = minutes * 60;
    this.remaining = this.total;
  }

  start(): void {
    this.prepRemaining = this.prepDuration;
    this.state = 'preparing';
    this.audio.playTick();
    this.intervalId = setInterval(() => {
      this.prepRemaining--;
      if (this.prepRemaining <= 0) {
        this.clearInterval();
        this.startSession();
      } else {
        this.audio.playTick();
      }
    }, 1000);
  }

  skipPrep(): void {
    this.clearInterval();
    this.startSession();
  }

  private startSession(): void {
    if (this.mode === 'timer') {
      this.remaining = this.total;
    } else {
      this.elapsed = 0;
    }
    this.sessionElapsed = 0;
    this.sessionStartTime = new Date().toISOString();
    this.audio.playChimeUp();
    this.audio.play(this.audio.currentSound);
    this.state = 'running';
    this.tick();
  }

  pause(): void {
    this.state = 'paused';
    this.clearInterval();
  }

  resume(): void {
    this.state = 'running';
    this.tick();
  }

  stop(): void {
    this.clearInterval();
    this.audio.stop();
    if (this.sessionElapsed >= 10) {
      this.saveSession(false);
    }
    this.sessionElapsed = 0;
    this.state = 'idle';
    if (this.mode === 'timer') {
      this.remaining = this.total;
    } else {
      this.elapsed = 0;
    }
  }

  private saveSession(completed: boolean): void {
    this.sessions.add({
      startTime: this.sessionStartTime,
      endTime: new Date().toISOString(),
      duration: this.sessionElapsed,
      completed,
      sound: this.audio.currentSound,
    });
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }

  private tick(): void {
    this.intervalId = setInterval(() => {
      this.sessionElapsed++;
      if (this.mode === 'timer') {
        this.remaining--;
        if (this.remaining <= 0) {
          this.remaining = 0;
          this.state = 'completed';
          this.clearInterval();
          this.audio.stop();
          this.audio.playChimeDown();
          this.saveSession(true);
        }
      } else {
        this.elapsed++;
      }
    }, 1000);
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
