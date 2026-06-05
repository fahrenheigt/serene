import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Session, Settings, DEFAULT_SETTINGS } from '../models/session.model';

const SESSIONS_KEY = 'serene-sessions';
const SETTINGS_KEY = 'serene-settings';

// --- SessionService ---

interface DayGroup {
  label: string;
  dateKey: string;
  sessions: Session[];
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly storage = inject(StorageService);
  private readonly sessions$ = new BehaviorSubject<Session[]>([]);
  readonly sessions: Observable<Session[]> = this.sessions$.asObservable();

  async load(): Promise<void> {
    const data = await this.storage.get<Session[]>(SESSIONS_KEY);
    this.sessions$.next(data ?? []);
  }

  async add(session: Omit<Session, 'id'>): Promise<Session> {
    const s: Session = { ...session, id: crypto.randomUUID() };
    const updated = [s, ...this.sessions$.value];
    this.sessions$.next(updated);
    await this.storage.set(SESSIONS_KEY, updated);
    return s;
  }

  async delete(id: string): Promise<void> {
    const updated = this.sessions$.value.filter(s => s.id !== id);
    this.sessions$.next(updated);
    await this.storage.set(SESSIONS_KEY, updated);
  }

  private get list(): Session[] { return this.sessions$.value; }

  // --- Grouping ---

  getGroups(): DayGroup[] {
    const map = new Map<string, Session[]>();
    for (const s of this.list) {
      const dateKey = s.endTime.slice(0, 10);
      const list = map.get(dateKey) ?? [];
      list.push(s);
      map.set(dateKey, list);
    }
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    return Array.from(map.entries()).map(([dateKey, sessions]) => ({
      dateKey,
      label: dateKey === today ? "Aujourd'hui"
           : dateKey === yesterday ? 'Hier'
           : this.formatDate(dateKey),
      sessions,
    }));
  }

  // --- Stats ---

  get totalSessions(): number { return this.list.length; }

  get totalSeconds(): number {
    return this.list.reduce((sum, s) => sum + s.duration, 0);
  }

  get totalFormatted(): string {
    const h = Math.floor(this.totalSeconds / 3600);
    const m = Math.floor((this.totalSeconds % 3600) / 60);
    return h > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${m}min`;
  }

  get currentStreak(): number {
    const days = this.uniqueDaysSorted();
    if (days.length === 0) return 0;
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (days[0] !== today && days[0] !== yesterday) return 0;
    let streak = 1;
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1]);
      const curr = new Date(days[i]);
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  }

  get bestStreak(): number {
    const days = this.uniqueDaysSorted();
    if (days.length === 0) return 0;
    let best = 1, run = 1;
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1]);
      const curr = new Date(days[i]);
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (diff === 1) { run++; best = Math.max(best, run); }
      else run = 1;
    }
    return best;
  }

  weekChart(): { label: string; pct: number }[] {
    const labels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);

    const dailyMin: number[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const mins = this.list
        .filter(s => s.endTime.startsWith(key))
        .reduce((sum, s) => sum + s.duration, 0) / 60;
      dailyMin.push(mins);
    }
    const max = Math.max(...dailyMin, 1);
    return labels.map((label, i) => ({ label, pct: Math.round((dailyMin[i] / max) * 100) }));
  }

  avgDuration(year: number, month: number): string {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const matching = this.list.filter(s => s.endTime.startsWith(prefix));
    if (matching.length === 0) return '--:--';
    const avg = matching.reduce((sum, s) => sum + s.duration, 0) / matching.length;
    const m = Math.floor(avg / 60);
    const sec = Math.round(avg % 60);
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  minutesThisMonth(): number {
    const prefix = new Date().toISOString().slice(0, 7);
    return Math.round(this.list
      .filter(s => s.endTime.startsWith(prefix))
      .reduce((sum, s) => sum + s.duration, 0) / 60);
  }

  // --- Private ---

  private uniqueDaysSorted(): string[] {
    const set = new Set(this.list.map(s => s.endTime.slice(0, 10)));
    return Array.from(set).sort().reverse();
  }

  private formatDate(iso: string): string {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  }
}

// --- SettingsService ---

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly storage = inject(StorageService);
  private readonly settings$ = new BehaviorSubject<Settings>(DEFAULT_SETTINGS);
  readonly settings: Observable<Settings> = this.settings$.asObservable();

  get current(): Settings { return this.settings$.value; }

  async load(): Promise<void> {
    const data = await this.storage.get<Settings>(SETTINGS_KEY);
    const merged = { ...DEFAULT_SETTINGS, ...data };
    this.settings$.next(merged);
    this.applyTheme(merged.theme);
  }

  async update(partial: Partial<Settings>): Promise<Settings> {
    const updated = { ...this.settings$.value, ...partial };
    this.settings$.next(updated);
    await this.storage.set(SETTINGS_KEY, updated);
    if (partial.theme) this.applyTheme(partial.theme);
    return updated;
  }

  private readonly themeClasses = ['dark', 'midnight', 'warm', 'forest', 'dusk', 'mist'];

  private applyTheme(theme: string): void {
    for (const cls of this.themeClasses) {
      document.body.classList.remove(cls);
    }
    if (theme !== 'light') {
      document.body.classList.add(theme);
    }
  }
}
