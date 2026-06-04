import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  mode: ThemeMode = 'light';

  constructor() {
    const saved = localStorage.getItem('serene-theme') as ThemeMode | null;
    this.apply(saved ?? 'light');
  }

  toggle(): void {
    this.apply(this.mode === 'light' ? 'dark' : 'light');
  }

  private apply(mode: ThemeMode): void {
    this.mode = mode;
    document.body.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('serene-theme', mode);
  }
}
