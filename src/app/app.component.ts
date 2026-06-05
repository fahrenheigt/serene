import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { SessionService, SettingsService } from './services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private sessionService = inject(SessionService);
  private settingsService = inject(SettingsService);

  constructor() {
    if (Capacitor.isNativePlatform()) {
      StatusBar.hide();
      StatusBar.setOverlaysWebView({ overlay: true });
    }
  }

  async ngOnInit(): Promise<void> {
    await this.settingsService.load();
    await this.sessionService.load();
  }
}
