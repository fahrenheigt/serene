import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

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
      @for (group of groups; track group.label; let gi = $index) {
        <div class="day-label anim" [style.--i]="gi * 3 + 2">{{ group.label }}</div>
        @for (session of group.sessions; track session.time; let si = $index) {
          <div class="session anim" [style.--i]="gi * 3 + si + 3">
            <div class="session-icon">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/></svg>
            </div>
            <div class="session-info">
              <div class="name">{{ session.name }}</div>
              <div class="time">{{ session.time }}</div>
            </div>
            <div class="dur">{{ session.duration }}</div>
          </div>
        }
      }
    </ion-content>
  `,
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage {
  groups = [
    {
      label: "Aujourd'hui",
      sessions: [
        { name: 'Session du matin', time: '08:12', duration: '10:00' },
        { name: 'Pause de midi', time: '12:45', duration: '05:00' },
      ],
    },
    {
      label: 'Hier',
      sessions: [
        { name: 'Avant le coucher', time: '22:30', duration: '15:00' },
        { name: 'Session du matin', time: '07:50', duration: '10:00' },
      ],
    },
    {
      label: '2 juin',
      sessions: [
        { name: 'Concentration', time: '14:20', duration: '20:00' },
      ],
    },
  ];
}
