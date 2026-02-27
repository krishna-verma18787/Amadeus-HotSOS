import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  mode = signal<ThemeMode>('system');

  async init(): Promise<void> {
    const saved = await Preferences.get({ key: 'theme_mode' });
    const parsed = this.parseMode(saved.value);
    this.mode.set(parsed);
    this.applyTheme(parsed);
  }

  async setMode(mode: ThemeMode): Promise<void> {
    this.mode.set(mode);
    await Preferences.set({ key: 'theme_mode', value: mode });
    this.applyTheme(mode);
  }

  private parseMode(value: string | null): ThemeMode {
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value;
    }
    return 'system';
  }

  private applyTheme(mode: ThemeMode): void {
    const root = document.documentElement;
    const darkPreferred =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDark = mode === 'dark' || (mode === 'system' && darkPreferred);
    root.classList.toggle('theme-dark', isDark);
    root.classList.toggle('theme-light', !isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
  }
}
