import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private theme = inject(ThemeService);

  constructor() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.hide();
      StatusBar.setOverlaysWebView({ overlay: true });
    }
  }
}
