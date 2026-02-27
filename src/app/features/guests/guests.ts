import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { GuestsService } from '../../core/services/guests.service';
import { ProfileService } from '../../core/services/profile.service';
import { GuestCardComponent } from '../../shared/components/guest-card/guest-card.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageToolbarComponent } from '../../shared/components/page-toolbar/page-toolbar.component';
import { QuickActionsSheetComponent } from '../../shared/components/quick-actions-sheet/quick-actions-sheet.component';

export type GuestStatus = 'in-house' | 'arriving' | 'departing';

export interface Guest {    
  id: number;
  name: string;
  vipLevel?: string;           // e.g. 'X1'
  room: string;
  dateRange: string;
  status: GuestStatus;
  group?: string;              // e.g. 'AMA', 'Tincidunt', 'Blandit'
  adults?: number;
  children?: number;
  transfers?: number;
}

@Component({
  selector: 'app-guests',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, PageToolbarComponent, GuestCardComponent, QuickActionsSheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="g"
         (touchstart)="onTouchStart($event)"
         (touchmove)="onTouchMove($event)"
         (touchend)="onTouchEnd()"
         (touchcancel)="onTouchEnd()">

      <!-- ── Header (sticky) ── -->
      <app-page-header
        title="All Guests"
        [showRolePill]="false"
        [showHelpIcon]="false"
        [showTitleChevron]="true"
        [avatarInitials]="authService.userInitials()"
        (avatarClicked)="profileSvc.open()">
      </app-page-header>

      <!-- ── Toolbar (scrolls with content) ── -->
      <app-page-toolbar
        sortLabel="Sort by Guest Name"
        (filterClicked)="null"
        (sortClicked)="null">
      </app-page-toolbar>

      <div class="pull-refresh"
           [class.pull-refresh--ready]="pullDistance() >= pullThreshold || refreshing()"
           [style.height.px]="refreshing() ? pullThreshold : pullDistance()">
        {{ refreshing() ? 'Refreshing guests…' : (pullDistance() >= pullThreshold ? 'Release to refresh' : 'Pull to refresh') }}
      </div>

      <!-- ── Count ── -->
      <div class="g__count">{{ guests().length }} guests</div>

      <!-- ── Guest Cards ── -->
      @if (loading() || refreshing()) {
        <div class="g__loading">Loading guests…</div>
        <div class="g__skeleton-list">
          @for (_ of skeletonRows; track $index) {
            <div class="g__skeleton-card">
              <div class="sk sk--title"></div>
              <div class="sk sk--line"></div>
              <div class="sk sk--line short"></div>
            </div>
          }
        </div>
      }
      @if (!loading() && !refreshing()) {
      <div class="g__list">
        @for (guest of guests(); track guest.id) {
          <app-guest-card [guest]="guest" (cardClicked)="openDetail($event)"/>
        }
      </div>
      }

      <!-- ── FAB ── -->
      <button class="fab" aria-label="Open quick actions" (click)="fabSheetOpen.set(true)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      </button>

      @if (fabSheetOpen()) {
        <app-quick-actions-sheet
          title="Guest Actions"
          subtitle="Access frequent guest workflows."
          [items]="fabActions"
          (closed)="fabSheetOpen.set(false)" />
      }

    </div>
  `,
  styles: [`
    .g {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      background: var(--app-bg);
      font-family: inherit;
      padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
      position: relative;
    }
    .pull-refresh {
      height: 0;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--app-text-muted);
      transition: height 160ms ease;
      background: color-mix(in srgb, var(--app-primary) 8%, var(--app-bg));
    }
    .pull-refresh--ready {
      color: var(--app-primary);
    }

    /* ── Count ── */
    .g__count {
      padding: 10px 16px 6px;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--app-text-muted);
    }

    .g__loading {
      padding: 32px 16px;
      text-align: center;
      font-size: var(--font-size-md);
      color: #9ca3af;
    }
    .g__skeleton-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 4px 12px 12px;
    }
    .g__skeleton-card {
      background: var(--app-surface);
      border-radius: 12px;
      padding: 14px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .sk {
      border-radius: 8px;
      background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 37%, #e5e7eb 63%);
      background-size: 400% 100%;
      animation: shimmer 1.2s linear infinite;
      height: 14px;
    }
    .sk--title { height: 22px; width: 56%; }
    .sk--line { width: 100%; }
    .sk--line.short { width: 74%; }
    @keyframes shimmer {
      0% { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }

    /* ── List ── */
    .g__list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 4px 12px 12px;
    }

    /* ── FAB ── */
    .fab {
      position: fixed;
      bottom: calc(76px + env(safe-area-inset-bottom, 0px));
      right: 20px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(145deg, #2563eb, #1d4ed8);
      border: 1px solid rgba(255, 255, 255, 0.35);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
      transition: transform 140ms ease, box-shadow 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }

    .fab:hover {
      transform: translateY(-1px);
      box-shadow: 0 12px 30px rgba(37, 99, 235, 0.42);
    }

    .fab:active {
      transform: scale(0.96);
    }
  `],
})
export class Guests implements OnInit {
  authService = inject(AuthService);
  private guestsService = inject(GuestsService);
  private router = inject(Router);
  profileSvc = inject(ProfileService);
  fabSheetOpen = signal(false);
  fabActions = [
    { title: 'Add Guest Note', subtitle: 'Capture requests and preferences.' },
    { title: 'Request Transfer', subtitle: 'Move guest to another room.' },
    { title: 'Send Welcome Message', subtitle: 'Share arrival instructions quickly.' },
  ];

  guests = signal<Guest[]>([]);
  loading = signal(true);
  refreshing = signal(false);
  pullDistance = signal(0);
  pullThreshold = 64;
  skeletonRows = [1, 2, 3];
  private pullStartY = 0;

  ngOnInit(): void {
    this.fetchGuests(true);
  }

  private fetchGuests(initial = false): void {
    if (initial) {
      this.loading.set(true);
    }

    this.guestsService.getGuests().subscribe({
      next: data => {
        this.guests.set(data);
        if (initial) {
          this.loading.set(false);
        }
        if (this.refreshing()) {
          setTimeout(() => this.refreshing.set(false), 350);
        }
      },
      error: () => {
        this.loading.set(false);
        this.refreshing.set(false);
      },
    });
  }

  onTouchStart(event: TouchEvent): void {
    if (this.isOverlayGesture(event)) {
      this.pullStartY = 0;
      return;
    }

    const scroller = this.getScroller();
    if (!scroller || scroller.scrollTop > 0 || this.loading() || this.refreshing()) {
      this.pullStartY = 0;
      return;
    }
    this.pullStartY = event.touches[0]?.clientY ?? 0;
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.pullStartY) return;
    if (this.isOverlayGesture(event)) return;
    const scroller = this.getScroller();
    if (!scroller || scroller.scrollTop > 0) return;
    const currentY = event.touches[0]?.clientY ?? this.pullStartY;
    const delta = currentY - this.pullStartY;
    if (delta <= 0) return;
    this.pullDistance.set(Math.min(90, delta * 0.45));
    event.preventDefault();
  }

  onTouchEnd(): void {
    if (this.pullDistance() >= this.pullThreshold && !this.refreshing()) {
      this.refreshing.set(true);
      this.fetchGuests(false);
    }
    this.pullDistance.set(0);
    this.pullStartY = 0;
  }

  private getScroller(): HTMLElement | null {
    return document.querySelector('.shell__content');
  }

  private isOverlayGesture(event: TouchEvent): boolean {
    const target = event.target as HTMLElement | null;
    if (!target) return false;
    return !!target.closest('.qa-sheet, .sheet, .qa-backdrop, .backdrop, app-page-header, app-page-toolbar');
  }

  openDetail(id: number): void {
    this.router.navigate(['/shell/guests', id]);
  }
}
