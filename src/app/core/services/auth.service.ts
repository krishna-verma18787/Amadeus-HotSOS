import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { map, switchMap, throwError, timer } from 'rxjs';
import { env } from '../../../environments/environment';

interface MockAuthData {
  pins: { pin: string; token: string; user: string }[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly userKey = 'session_user';
  readonly currentUser = signal('');
  readonly userInitials = computed(() => {
    const user = this.currentUser().trim();
    if (!user) {
      return 'JW';
    }
    return user
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2);
  });

  /**
   * In dev/qa: validates PIN against local JSON mock file.
   * In production: would call env.apiBaseUrl — currently falls back to mock.
   */
  loginWithPin(pin: string) {
    if (!navigator.onLine) {
      return throwError(() => new Error('Offline: Please check your connection.'));
    }

    const url = env.mockAuth
      ? '/assets/mock/auth.json'
      : `${env.apiBaseUrl}/api/auth/pin`;

    return this.http.get<MockAuthData>(url).pipe(
      // Simulate 500ms network delay in non-production environments
      switchMap((data) =>
        env.production ? [data] : timer(500).pipe(map(() => data))
      ),
      map((data) => {
        const match = data.pins.find((entry) => entry.pin === pin);
        if (!match) {
          throw new Error('Invalid PIN. Please try again.');
        }
        return { token: match.token, user: match.user };
      })
    );
  }

  async saveToken(token: string) {
    await Preferences.set({ key: 'session_token', value: token });
  }

  async saveSession(token: string, user: string) {
    await Promise.all([
      Preferences.set({ key: 'session_token', value: token }),
      Preferences.set({ key: this.userKey, value: user }),
    ]);
    this.currentUser.set(user);
  }

  async getToken() {
    const { value } = await Preferences.get({ key: 'session_token' });
    return value;
  }

  async initSessionUser() {
    const { value } = await Preferences.get({ key: this.userKey });
    this.currentUser.set(value ?? '');
  }

  async clearToken() {
    await Promise.all([
      Preferences.remove({ key: 'session_token' }),
      Preferences.remove({ key: this.userKey }),
    ]);
    this.currentUser.set('');
  }
}
