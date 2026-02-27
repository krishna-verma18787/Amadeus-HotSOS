import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { ServiceOrdersService } from '../../core/services/service-orders.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageToolbarComponent } from '../../shared/components/page-toolbar/page-toolbar.component';
import { QuickActionsSheetComponent } from '../../shared/components/quick-actions-sheet/quick-actions-sheet.component';
import { ServiceOrderCardComponent } from '../../shared/components/service-order-card/service-order-card.component';

export type ActionState = 'play' | 'bell' | 'minus';
export type PriorityLevel = 'P1' | 'P2' | 'P3';
export type PriorityColor = 'red' | 'orange' | 'green';

export interface ServiceOrder {
  id: number;
  location: string;
  taskTitle: string;
  assigneeName?: string;         // blue link; undefined → show "Assign"
  priority: PriorityLevel;
  priorityColor: PriorityColor;
  tag: string;                   // e.g. "Escalated", "Inspection", "Delivery Order"
  tagVariant: 'escalated' | 'neutral';
  orderType: string;             // e.g. "Service Order", "Delivery Order"
  timeAgo: string;
  attachments: number;
  hasCopy: boolean;
  actionState: ActionState;
  assigneeExtra?: string;        // crown label like "X1"
}

@Component({
  selector: 'app-service-orders',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, PageToolbarComponent, ServiceOrderCardComponent, QuickActionsSheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="so"
         (touchstart)="onTouchStart($event)"
         (touchmove)="onTouchMove($event)"
         (touchend)="onTouchEnd()"
         (touchcancel)="onTouchEnd()">

      <!-- ── Top Header (sticky) ── -->
      <app-page-header
        title="All Work"
        rolePillLabel="List"
        [roleOptions]="[]"
        [showHelpIcon]="false"
        [avatarInitials]="authService.userInitials()"
        (avatarClicked)="profileSvc.open()">
      </app-page-header>

      <!-- ── Toolbar (scrolls with content) ── -->
      <app-page-toolbar
        sortLabel="Sort by Priority"
        (filterClicked)="null"
        (sortClicked)="null">
      </app-page-toolbar>

      <div class="pull-refresh"
           [class.pull-refresh--ready]="pullDistance() >= pullThreshold || refreshing()"
           [style.height.px]="refreshing() ? pullThreshold : pullDistance()">
        {{ refreshing() ? 'Refreshing orders…' : (pullDistance() >= pullThreshold ? 'Release to refresh' : 'Pull to refresh') }}
      </div>

      <!-- ── Order Count ── -->
      <div class="so__count">{{ orders().length }} orders</div>

      <!-- ── Order Cards ── -->
      @if (loading() || refreshing()) {
        <div class="so__loading">Loading orders…</div>
        <div class="so__skeleton-list">
          @for (_ of skeletonRows; track $index) {
            <div class="so__skeleton-card">
              <div class="sk sk--title"></div>
              <div class="sk sk--line"></div>
              <div class="sk sk--line short"></div>
            </div>
          }
        </div>
      }
      @if (!loading() && !refreshing()) {
      <div class="so__list">
        @for (order of orders(); track order.id) {
          <app-service-order-card [order]="order" (cardClicked)="openDetail($event)"/>
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
          title="Service Order Actions"
          subtitle="Take action without leaving this screen."
          [items]="fabActions"
          (closed)="fabSheetOpen.set(false)" />
      }

    </div>
  `,
  styles: [`
    .so {
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
    .so__count {
      padding: 10px 16px 6px;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--app-text-muted);
    }

    .so__loading {
      padding: 32px 16px;
      text-align: center;
      font-size: var(--font-size-md);
      color: #9ca3af;
    }
    .so__skeleton-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 4px 12px 12px;
    }
    .so__skeleton-card {
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
    .sk--title { height: 22px; width: 52%; }
    .sk--line { width: 100%; }
    .sk--line.short { width: 68%; }
    @keyframes shimmer {
      0% { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }

    /* ── List ── */
    .so__list {
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
export class ServiceOrders implements OnInit {
  authService = inject(AuthService);
  private soService = inject(ServiceOrdersService);
  private router = inject(Router);
  profileSvc = inject(ProfileService);
  fabSheetOpen = signal(false);
  fabActions = [
    { title: 'Create New Order', subtitle: 'Log a fresh service request.' },
    { title: 'Escalate Priority', subtitle: 'Mark selected order as urgent.' },
    { title: 'Assign Technician', subtitle: 'Route to available staff quickly.' },
  ];

  orders = signal<ServiceOrder[]>([]);
  loading = signal(true);
  refreshing = signal(false);
  pullDistance = signal(0);
  pullThreshold = 64;
  skeletonRows = [1, 2, 3];
  private pullStartY = 0;

  ngOnInit(): void {
    this.fetchOrders(true);
  }

  private fetchOrders(initial = false): void {
    if (initial) {
      this.loading.set(true);
    }

    this.soService.getOrders().subscribe({
      next: data => {
        this.orders.set(data);
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
      this.fetchOrders(false);
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
    this.router.navigate(['/shell/service-orders', id]);
  }
}
