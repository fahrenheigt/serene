import { Component, OnDestroy } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

type TimerState = 'idle' | 'running' | 'paused' | 'completed';
type TimerMode = 'timer' | 'chrono';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [IonContent],
  template: `
    <header class="page-head">
      <span class="eyebrow">Session</span>
      <h1 class="page-title">{{ mode === 'timer' ? 'Minuteur' : 'Chrono' }}</h1>
    </header>

    <ion-content>
      <div class="timer-wrap">
        <div class="mode-toggle" [class.disabled]="state !== 'idle'">
          <button [class.active]="mode === 'timer'" (click)="setMode('timer')">Minuteur</button>
          <button [class.active]="mode === 'chrono'" (click)="setMode('chrono')">Chrono</button>
        </div>

        <svg class="timer-svg" viewBox="0 0 200 200">
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

        @if (mode === 'timer') {
          <div class="duration-picker" [class.disabled]="state !== 'idle'">
            @for (d of durations; track d) {
              <button
                [class.sel]="d === selectedMinutes"
                (click)="selectDuration(d)">{{ d }}</button>
            }
          </div>
        } @else {
          <div class="milestone-picker" [class.disabled]="state !== 'idle'">
            @for (s of milestoneSteps; track s) {
              <button
                [class.sel]="s === selectedStep"
                (click)="selectStep(s)">{{ s }}</button>
            }
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
      </div>
    </ion-content>
  `,
  styleUrls: ['./timer.page.scss'],
})
export class TimerPage implements OnDestroy {
  readonly circumference = 2 * Math.PI * 90;
  readonly durations = [5, 10, 15, 20, 30];

  readonly milestoneSteps = [1, 2, 5, 10];
  selectedStep = 5;

  mode: TimerMode = 'timer';
  selectedMinutes = 5;
  total = 5 * 60;
  remaining = 5 * 60;
  elapsed = 0;
  state: TimerState = 'idle';

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

  selectStep(step: number): void {
    if (this.state !== 'idle') return;
    this.selectedStep = step;
  }

  selectDuration(minutes: number): void {
    if (this.state !== 'idle') return;
    this.selectedMinutes = minutes;
    this.total = minutes * 60;
    this.remaining = this.total;
  }

  start(): void {
    if (this.mode === 'timer') {
      this.remaining = this.total;
    } else {
      this.elapsed = 0;
    }
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
    this.state = 'idle';
    if (this.mode === 'timer') {
      this.remaining = this.total;
    } else {
      this.elapsed = 0;
    }
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }

  private tick(): void {
    this.intervalId = setInterval(() => {
      if (this.mode === 'timer') {
        this.remaining--;
        if (this.remaining <= 0) {
          this.remaining = 0;
          this.state = 'completed';
          this.clearInterval();
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
