import { Component, inject } from '@angular/core';
import { IonContent, ViewWillEnter } from '@ionic/angular/standalone';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [IonContent],
  template: `
    <header class="page-head">
      <span class="eyebrow anim" style="--i:0">Progression</span>
      <h1 class="page-title anim" style="--i:1">Statistiques</h1>
    </header>

    <ion-content>
      <div class="stats-wrap">
        <div class="highlight-row anim" style="--i:2">
          <div class="highlight">
            <div class="highlight-num">{{ s.totalSessions }}</div>
            <div class="highlight-cap">Sessions</div>
          </div>
          <div class="highlight">
            <div class="highlight-num">{{ s.totalFormatted }}</div>
            <div class="highlight-cap">Temps total</div>
          </div>
          <div class="highlight">
            <div class="highlight-num">{{ s.currentStreak }}</div>
            <div class="highlight-cap">Série actuelle</div>
          </div>
        </div>

        <div class="section anim" style="--i:3">
          <div class="section-label">Cette semaine</div>
          <div class="bar-chart">
            @for (day of weekDays; track day.label) {
              <div class="bar-col">
                <div class="bar" [style.height.%]="day.pct"></div>
                <div class="bar-label">{{ day.label }}</div>
              </div>
            }
          </div>
        </div>

        <div class="section anim" style="--i:4">
          <div class="section-label">Durée moyenne</div>
          <div class="metric-row">
            <div class="metric">
              <div class="metric-num">{{ avgThisMonth }}</div>
              <div class="metric-cap">Ce mois</div>
            </div>
            <div class="metric">
              <div class="metric-num">{{ avgLastMonth }}</div>
              <div class="metric-cap">Mois dernier</div>
            </div>
          </div>
        </div>

        <div class="section anim" style="--i:5">
          <div class="section-label">Meilleure série</div>
          <div class="best-streak">
            <span class="best-num">{{ s.bestStreak }}</span>
            <span class="best-cap">jours consécutifs</span>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements ViewWillEnter {
  readonly s = inject(SessionService);
  weekDays: { label: string; pct: number }[] = [];
  avgThisMonth = '--:--';
  avgLastMonth = '--:--';

  ionViewWillEnter(): void {
    this.weekDays = this.s.weekChart();
    const now = new Date();
    this.avgThisMonth = this.s.avgDuration(now.getFullYear(), now.getMonth() + 1);
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    this.avgLastMonth = this.s.avgDuration(prev.getFullYear(), prev.getMonth() + 1);
  }
}
