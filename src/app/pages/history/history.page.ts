import { Component, inject } from '@angular/core';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { SessionService } from '../../services/session.service';
import { Session } from '../../models/session.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [IonContent],
  template: `
    <header class="page-head">
      <span class="eyebrow anim" style="--i:0">Sessions passées</span>
      <h1 class="page-title anim" style="--i:1">Historique</h1>
    </header>

    <ion-content>
      @if (groups.length === 0) {
        <div class="empty anim" style="--i:2">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>
          </div>
          <p class="empty-text">Aucune session pour l'instant.</p>
          <p class="empty-sub">Lancez votre première méditation depuis l'accueil.</p>
        </div>
      } @else {
        @for (group of groups; track group.dateKey; let gi = $index) {
          <div class="day-label anim" [style.--i]="gi * 3 + 2">{{ group.label }}</div>
          @for (session of group.sessions; track session.id; let si = $index) {
            <div class="session anim" [class.removing]="removing === session.id" [style.--i]="gi * 3 + si + 3">
              <div class="session-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>
              </div>
              <div class="session-info">
                <div class="name">{{ session.completed ? 'Session complète' : 'Session libre' }}</div>
                <div class="time">{{ formatTime(session.endTime) }}</div>
              </div>
              <div class="dur">{{ formatDuration(session.duration) }}</div>
              <button class="delete-btn" (click)="deleteSession(session.id); $event.stopPropagation()">
                <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          }
        }
      }
    </ion-content>
  `,
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements ViewWillEnter {
  private sessionService = inject(SessionService);
  groups: { label: string; dateKey: string; sessions: Session[] }[] = [];
  removing: string | null = null;

  ionViewWillEnter(): void {
    this.groups = this.sessionService.getGroups();
  }

  deleteSession(id: string): void {
    this.removing = id;
    setTimeout(() => {
      this.sessionService.delete(id);
      this.groups = this.sessionService.getGroups();
      this.removing = null;
    }, 300);
  }

  formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}
