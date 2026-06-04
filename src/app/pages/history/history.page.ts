import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [IonContent],
  template: `
    <header class="page-head">
      <span class="eyebrow">Sessions passées</span>
      <h1 class="page-title">Historique</h1>
    </header>

    <ion-content>
      @for (group of groups; track group.label) {
        <div class="day-label">{{ group.label }}</div>
        @for (session of group.sessions; track session.time) {
          <div class="session">
            <div class="left">
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
