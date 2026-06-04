import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

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
            <div class="highlight-num">23</div>
            <div class="highlight-cap">Sessions</div>
          </div>
          <div class="highlight">
            <div class="highlight-num">4h32</div>
            <div class="highlight-cap">Temps total</div>
          </div>
          <div class="highlight">
            <div class="highlight-num">7</div>
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
              <div class="metric-num">11:48</div>
              <div class="metric-cap">Ce mois</div>
            </div>
            <div class="metric">
              <div class="metric-num">09:30</div>
              <div class="metric-cap">Mois dernier</div>
            </div>
          </div>
        </div>

        <div class="section anim" style="--i:5">
          <div class="section-label">Meilleure série</div>
          <div class="best-streak">
            <span class="best-num">14</span>
            <span class="best-cap">jours consécutifs</span>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage {
  weekDays = [
    { label: 'L', pct: 60 },
    { label: 'M', pct: 80 },
    { label: 'M', pct: 40 },
    { label: 'J', pct: 100 },
    { label: 'V', pct: 70 },
    { label: 'S', pct: 20 },
    { label: 'D', pct: 0 },
  ];
}
