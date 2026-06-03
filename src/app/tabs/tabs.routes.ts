import { Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('../pages/home/home.routes').then((m) => m.routes),
      },
      {
        path: 'timer',
        loadChildren: () =>
          import('../pages/timer/timer.routes').then((m) => m.routes),
      },
      {
        path: 'history',
        loadChildren: () =>
          import('../pages/history/history.routes').then((m) => m.routes),
      },
      {
        path: 'stats',
        loadChildren: () =>
          import('../pages/stats/stats.routes').then((m) => m.routes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../pages/settings/settings.routes').then((m) => m.routes),
      },
    ],
  },
];
