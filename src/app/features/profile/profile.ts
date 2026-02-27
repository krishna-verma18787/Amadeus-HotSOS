import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { ThemeMode, ThemeService } from '../../core/services/theme.service';

interface ProfileMenuItem {
  id: string;
  icon: string;       // SVG path(s) key
  label: string;
  subtitle?: string;
  badge?: number;
  danger?: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile-overlay">

      <!-- Top bar -->
      <div class="profile__topbar">
        <button class="profile__close" aria-label="Close" (click)="close()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button> 
      </div>

      <!-- Avatar + Name -->
      <div class="profile__hero">
        <div class="profile__avatar">{{ userInitials() }}</div>
        <h2 class="profile__name">{{ userName() }}</h2>
        <button class="profile__status-pill">
          On Duty / Off Break
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Menu list -->
      <ul class="profile__menu" role="menu">

        <!-- Notifications -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('notifications')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor"
                      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="1.8"
                      stroke-linecap="round"/>
              </svg>
            </span>
            <span class="profile__label">Notifications</span>
          </span>
          <span class="profile__item-right">
            <span class="profile__badge">3</span>
            <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </li>

        <!-- Messages -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('messages')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
                      stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                <path d="M22 6l-10 7L2 6" stroke="currentColor" stroke-width="1.8"
                      stroke-linecap="round"/>
              </svg>
            </span>
            <span class="profile__label">Messages</span>
          </span>
          <span class="profile__item-right">
            <span class="profile__badge">1</span>
            <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </li>

        <!-- Change Unit -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('unit')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </span>
            <span class="profile__label-group">
              <span class="profile__label">Change Unit</span>
              <span class="profile__sublabel">Chrissanie Mountain Lodge</span>
            </span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Change Language -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('language')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M7 12h4M9 9v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <path d="M13 9h4l-2 6" stroke="currentColor" stroke-width="1.8"
                      stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13 15h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="profile__label-group">
              <span class="profile__label">Change Language</span>
              <span class="profile__sublabel">English</span>
            </span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Change Password -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('password')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
                      stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                      stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="profile__label">Change Password</span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Help -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('help')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 17v-1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
                <path d="M9.5 9.5a2.5 2.5 0 015 .5c0 1.5-2.5 2-2.5 3.5"
                      stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </span>
            <span class="profile__label">Help</span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Submit Feedback -->
        <li class="profile__item" role="menuitem" (click)="onMenuTap('feedback')">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 8v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" stroke-width="1"/>
              </svg>
            </span>
            <span class="profile__label">Submit Feedback</span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Settings -->
        <li class="profile__item" role="menuitem" (click)="openSettings()">
          <span class="profile__item-left">
            <span class="profile__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M19.4 13a7.7 7.7 0 000-2l2.1-1.6-2-3.4-2.6 1a7.9 7.9 0 00-1.7-1l-.4-2.8h-4l-.4 2.8a7.9 7.9 0 00-1.7 1l-2.6-1-2 3.4L4.6 11a7.7 7.7 0 000 2l-2.1 1.6 2 3.4 2.6-1a7.9 7.9 0 001.7 1l.4 2.8h4l.4-2.8a7.9 7.9 0 001.7-1l2.6 1 2-3.4L19.4 13Z"
                      stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </span>
            <span class="profile__label-group">
              <span class="profile__label">Settings</span>
              <span class="profile__sublabel">Theme: {{ selectedThemeLabel() }}</span>
            </span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

        <!-- Log Out -->
        <li class="profile__item profile__item--danger" role="menuitem" (click)="onLogOut()">
          <span class="profile__item-left">
            <span class="profile__icon profile__icon--danger">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor"
                      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="1.8"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <span class="profile__label profile__label--danger">Log Out</span>
          </span>
          <svg class="profile__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>

      </ul> 

      @if (settingsOpen()) {
        <div class="settings-backdrop" (click)="settingsOpen.set(false)"></div>
        <section class="settings-sheet" role="dialog" aria-modal="true" aria-label="Settings">
          <div class="settings-sheet__header">
            <h3 class="settings-sheet__title">Settings</h3>
            <button class="settings-sheet__close" type="button" (click)="settingsOpen.set(false)">
              Done
            </button>
          </div>

          <div class="settings-group">
            <h4 class="settings-group__title">Theme</h4>
            <p class="settings-group__subtitle">Choose how the app looks.</p>
            <div class="theme-options">
              @for (mode of themeModes; track mode.value) {
                <button
                  class="theme-option"
                  type="button"
                  [class.theme-option--active]="themeSvc.mode() === mode.value"
                  (click)="setTheme(mode.value)">
                  <span>{{ mode.label }}</span>
                </button>
              }
            </div>
          </div>
        </section>
      }

    </div>
  `,
  styles: [`
    /* ── Full-screen overlay ── */
    .profile-overlay {
      position: fixed;
      inset: 0;
      z-index: 500;
      background: var(--app-surface);
      display: flex;
      padding-top: 20px;
      flex-direction: column;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      animation: slideInRight 240ms cubic-bezier(0.32, 0.72, 0, 1);
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0.6; }
      to   { transform: translateX(0);    opacity: 1;   }
    }

    /* ── Top bar ── */
    .profile__topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px 8px;
    }

    .profile__close,
    .profile__help {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--app-text-muted);
      padding: 6px;
      display: flex;
      align-items: center;
      border-radius: 50%;
      -webkit-tap-highlight-color: transparent;
    }
    .profile__close:active,
    .profile__help:active {
      background: var(--app-surface-2);
    }

    /* ── Hero ── */
    .profile__hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 28px;
    }

    .profile__avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #6d28d9;
      color: #fff;
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: 0.5px;
    }

    .profile__name {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
      color: var(--app-text);
      letter-spacing: -0.3px;
    }

    .profile__status-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #dcfce7;
      color: #166534;
      border: none;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
    }

    /* ── Menu list ── */
    .profile__menu {
      list-style: none;
      margin: 0;
      padding: 0;
      flex: 1;
    }

    .profile__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      cursor: pointer;
      border-bottom: 1px solid var(--app-border);
      -webkit-tap-highlight-color: transparent;
      transition: background 120ms ease;
    }
    .profile__item:active {
      background: var(--app-surface-2);
    }

    .profile__item-left {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
    }

    .profile__item-right {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .profile__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--app-text);
      flex-shrink: 0;
      width: 24px;
    }
    .profile__icon--danger {
      color: #dc2626;
    }

    .profile__label-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .profile__label {
      font-size: 16px;
      font-weight: 400;
      color: var(--app-text);
      line-height: 1.3;
    }
    .profile__label--danger {
      color: #dc2626;
      font-weight: 500;
    }

    .profile__sublabel {
      font-size: 13px;
      color: var(--app-text-muted);
    }

    .profile__badge {
      min-width: 22px;
      height: 22px;
      border-radius: 11px;
      background: #dc2626;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    }

    .profile__chevron {
      color: var(--app-text-muted);
      flex-shrink: 0;
    }

    .profile__item--danger .profile__chevron {
      color: #d1d5db;
    }

    .settings-backdrop {
      position: absolute;
      inset: 0;
      z-index: 2;
      background: var(--app-backdrop);
    }

    .settings-sheet {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 3;
      background: var(--app-surface);
      border-top: 1px solid var(--app-border);
      border-radius: 18px 18px 0 0;
      padding: 14px 16px calc(16px + env(safe-area-inset-bottom, 0px));
    }

    .settings-sheet__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .settings-sheet__title {
      margin: 0;
      font-size: 18px;
      color: var(--app-text);
    }

    .settings-sheet__close {
      border: none;
      background: none;
      color: var(--app-primary);
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
    }

    .settings-group__title {
      margin: 0;
      color: var(--app-text);
      font-size: 15px;
      font-weight: 700;
    }

    .settings-group__subtitle {
      margin: 4px 0 10px;
      color: var(--app-text-muted);
      font-size: 13px;
    }

    .theme-options {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }

    .theme-option {
      border: 1px solid var(--app-border);
      background: var(--app-surface-2);
      color: var(--app-text);
      border-radius: 10px;
      padding: 10px 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }

    .theme-option--active {
      border-color: var(--app-primary);
      color: var(--app-primary);
      background: color-mix(in srgb, var(--app-primary) 12%, transparent);
    }
  `],
})
export class ProfileComponent {
  @Output() closed = new EventEmitter<void>();

  private router     = inject(Router);
  private profileSvc = inject(ProfileService);
  private authService = inject(AuthService);
  themeSvc = inject(ThemeService);
  settingsOpen = signal(false);
  userName = computed(() => this.authService.currentUser() || 'John Watson');
  userInitials = computed(() => this.authService.userInitials());
  themeModes: { label: string; value: ThemeMode }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  close() {
    this.profileSvc.close();
    this.closed.emit();
  }

  onMenuTap(item: string) {
    // placeholder for future navigation
  }

  openSettings(): void {
    this.settingsOpen.set(true);
  }

  selectedThemeLabel(): string {
    switch (this.themeSvc.mode()) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      default: return 'System';
    }
  }

  setTheme(mode: ThemeMode): void {
    void this.themeSvc.setMode(mode);
  }

  async onLogOut() {
    await this.authService.clearToken();
    this.profileSvc.close();
    this.router.navigate(['/login']);
  }
}
