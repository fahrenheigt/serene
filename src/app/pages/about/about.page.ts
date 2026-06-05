import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [IonContent],
  template: `
    <header class="page-head">
      <span class="eyebrow anim" style="--i:0">Application</span>
      <h1 class="page-title anim" style="--i:1">À propos</h1>
    </header>

    <ion-content>
      <div class="about-wrap">
        <div class="logo anim" style="--i:2">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="74" />
          </svg>
          <div class="logo-name">Serene</div>
          <div class="logo-ver">Version 0.0.1</div>
        </div>

        <p class="desc anim" style="--i:3">
          Une application de méditation qui va à l'essentiel.
          Pas de compte, pas de serveur, pas d'abonnement.
          Juste un cercle, un minuteur et du son.
        </p>

        <div class="info-group anim" style="--i:4">
          <div class="info-row">
            <span class="info-label">Développé par</span>
            <span class="info-val">Axel Le Meur</span>
          </div>
          <div class="info-row">
            <span class="info-label">Polices</span>
            <span class="info-val">Inter, Playfair Display, JetBrains Mono</span>
          </div>
          <div class="info-row">
            <span class="info-label">Audio</span>
            <span class="info-val">Génération procédurale (Web Audio API)</span>
          </div>
          <div class="info-row">
            <span class="info-label">Données</span>
            <span class="info-val">Stockées localement sur l'appareil</span>
          </div>
        </div>

        <p class="footer anim" style="--i:5">
          Aucune donnée ne quitte votre appareil.<br>
          Conforme RGPD par conception.
        </p>
      </div>
    </ion-content>
  `,
  styleUrls: ['./about.page.scss'],
})
export class AboutPage {}
