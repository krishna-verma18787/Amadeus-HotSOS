import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';
import { BottomSheetComponent } from '../../shared/components/bottom-sheet/bottom-sheet.component';
import { ProfileComponent } from '../profile/profile';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, BottomSheetComponent, ProfileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell">
      <!-- Page content -->
      <main class="shell__content">
        <router-outlet />
      </main>

      <!-- Bottom Tab Bar -->
      <nav class="tab-bar" role="tablist" aria-label="Main navigation">

        <!-- Housekeeping -->
        <a class="tab-bar__tab"
           routerLink="/shell/housekeeping"
           routerLinkActive="tab-bar__tab--active"
           role="tab"
           aria-label="Housekeeping">
          <span class="tab-bar__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 11l8-7 8 7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6.5 10.5V19a1 1 0 001 1h9a1 1 0 001-1v-8.5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 13h4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="tab-bar__label">Housekeeping</span>
        </a>

        <!-- Service Orders -->
        <a class="tab-bar__tab"
           routerLink="/shell/service-orders"
           routerLinkActive="tab-bar__tab--active"
           role="tab"
           aria-label="Service Orders">
          <span class="tab-bar__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="4" width="14" height="16" rx="2.2" stroke="currentColor" stroke-width="1.9"/>
              <path d="M8.5 9H15.5M8.5 13H15.5M8.5 17H13" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="tab-bar__label">Service Orders</span>
        </a>

        <!-- Guests -->
        <a class="tab-bar__tab"
           routerLink="/shell/guests"
           routerLinkActive="tab-bar__tab--active"
           role="tab"
           aria-label="Guests">
          <span class="tab-bar__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="3" stroke="currentColor" stroke-width="1.9"/>
              <circle cx="16" cy="10" r="2.5" stroke="currentColor" stroke-width="1.9"/>
              <path d="M3.5 18c0-3 2.7-5.2 6-5.2s6 2.2 6 5.2" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
              <path d="M13.5 18c.2-2 1.7-3.5 4.1-3.5 1.8 0 3.1.9 3.9 2.3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="tab-bar__label">Guests</span>
        </a>

        <!-- More (opens bottom sheet) -->
        <button class="tab-bar__tab tab-bar__tab--button"
                [class.tab-bar__tab--active]="moreSheetOpen()"
                (click)="openMoreSheet()"
                role="tab"
                aria-label="More"
                [attr.aria-expanded]="moreSheetOpen()">
          <span class="tab-bar__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5"  cy="12" r="1.9" fill="currentColor"/>
              <circle cx="12" cy="12" r="1.9" fill="currentColor"/>
              <circle cx="19" cy="12" r="1.9" fill="currentColor"/>
            </svg>
          </span>
          <span class="tab-bar__label">More</span>
        </button>
      </nav>

      <!-- Bottom Sheet (rendered inside shell so it sits above the tab bar) -->
      @if (moreSheetOpen()) {
        <app-bottom-sheet (closed)="closeMoreSheet()" />
      }

      <!-- Profile overlay -->
      @if (profileOpen()) {
        <app-profile (closed)="closeProfile()" />
      }
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .shell {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
    }

    /* ── Main content area ── */
    .shell__content {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    /* ── Tab Bar ── */
    .tab-bar {
      display: flex;
      align-items: stretch;
      background: var(--app-surface);
      border-top: 1px solid var(--app-border);
      padding-bottom: env(safe-area-inset-bottom, 0px);
      flex-shrink: 0;
      box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.06);
    }

    .tab-bar__tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 10px 4px 8px;
      text-decoration: none;
      color: var(--app-text-muted);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      letter-spacing: 0.2px;
      transition: color 150ms ease, background-color 150ms ease, transform 150ms ease;
      cursor: pointer;
      background: none;
      border: none;
      font-family: inherit;
      min-height: 56px;
      -webkit-tap-highlight-color: transparent;
    }

    .tab-bar__tab:hover {
      color: var(--app-primary);
      background: color-mix(in srgb, var(--app-primary) 8%, transparent);
    }

    .tab-bar__tab:active {
      transform: scale(0.97);
    }

    .tab-bar__tab--active {
      color: var(--app-primary);
      background: color-mix(in srgb, var(--app-primary) 14%, transparent);
    }

    .tab-bar__tab:focus-visible {
      outline: 2px solid var(--app-primary);
      outline-offset: -2px;
      border-radius: 4px;
    }

    .tab-bar__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }

    .tab-bar__label {
      line-height: 1;
      font-weight: var(--font-weight-bold);
    }
  `],
})
export class Shell {
  moreSheetOpen = signal(false);
  private profileSvc = inject(ProfileService);
  profileOpen = this.profileSvc.isOpen;

  openMoreSheet() { this.moreSheetOpen.set(true); }
  closeMoreSheet() { this.moreSheetOpen.set(false); }

  openProfile()  { this.profileSvc.open(); }
  closeProfile() { this.profileSvc.close(); }
}
