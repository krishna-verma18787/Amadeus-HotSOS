import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceOrder } from '../../../features/service-orders/service-orders';

@Component({
  selector: 'app-service-order-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="order-card"
         role="button"
         tabindex="0"
         (click)="onCardClick()"
         (keydown.enter)="onCardClick()"
         (keydown.space)="onCardClick()">

      <!-- Top: location + task title + action button -->
      <div class="order-card__top">
        <div class="order-card__titles">
          <span class="order-card__location">{{ order.location }}</span>
          <span class="order-card__task">{{ order.taskTitle }}</span>
        </div>
        <button class="action-btn"
                [class.action-btn--play]="order.actionState === 'play'"
                [class.action-btn--bell]="order.actionState === 'bell'"
                [class.action-btn--minus]="order.actionState === 'minus'"
                [attr.aria-label]="order.actionState">
          @if (order.actionState === 'play') {
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M8 5l11 7-11 7V5z"/>
            </svg>
          }
          @if (order.actionState === 'bell') {
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"
                    stroke="white" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"
                    stroke="white" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          }
          @if (order.actionState === 'minus') {
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14" stroke="white" stroke-width="2.4" stroke-linecap="round"/>
            </svg>
          }
        </button>
      </div>

      <!-- Assignee row -->
      <div class="order-card__assignee-row">
        @if (order.assigneeName) {
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3"
                  stroke="#1d4ed8" stroke-width="1.8"/>
            <path d="M8 12h8M12 8v8" stroke="#1d4ed8" stroke-width="1.8"
                  stroke-linecap="round"/>
          </svg>
          <span class="order-card__assignee-name">{{ order.assigneeName }}</span>
        } @else {
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#1d4ed8" stroke-width="1.8"/>
            <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#1d4ed8" stroke-width="1.8"
                  stroke-linecap="round"/>
            <path d="M18 11v6M15 14h6" stroke="#1d4ed8" stroke-width="1.8"
                  stroke-linecap="round"/>
          </svg>
          <span class="order-card__assign-link">Assign</span>
        }
      </div>

      <!-- Badge row -->
      <div class="order-card__badges">
        <!-- Priority dot -->
        <span class="badge"
              [class.badge--red]="order.priorityColor === 'red'"
              [class.badge--orange]="order.priorityColor === 'orange'"
              [class.badge--green]="order.priorityColor === 'green'">
          <span class="dot"
                [class.dot--red]="order.priorityColor === 'red'"
                [class.dot--orange]="order.priorityColor === 'orange'"
                [class.dot--green]="order.priorityColor === 'green'">
          </span>
          {{ order.priority }}
        </span>

        <!-- Tag: Escalated -->
        @if (order.tagVariant === 'escalated') {
          <span class="badge badge--escalated">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#dc2626">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            {{ order.tag }}
          </span>
        }

        <!-- Tag: neutral -->
        @if (order.tagVariant === 'neutral') {
          <span class="badge badge--neutral">
            @if (order.tag === 'Inspection') {
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="#374151" stroke-width="1.8" stroke-linecap="round">
                <circle cx="11" cy="11" r="7"/>
                <path d="M20 20l-3-3"/>
                <path d="M8 11h6M11 8v6"/>
              </svg>
            }
            @if (order.tag === 'Delivery Order') {
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="#374151" stroke-width="1.8" stroke-linecap="round">
                <path d="M5 8h14M5 8a2 2 0 00-2 2v6a2 2 0 002 2h14a2 2 0 002-2v-6a2 2 0 00-2-2M5 8V6a2 2 0 012-2h10a2 2 0 012 2v2"/>
              </svg>
            }
            {{ order.tag }}
          </span>
        }

        <!-- Time / started -->
        @if (order.actionState === 'play') {
          <span class="badge badge--started">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#16a34a">
              <path d="M8 5l11 7-11 7V5z"/>
            </svg>
            Started at {{ order.timeAgo }}
          </span>
        } @else {
          <span class="badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="#374151" stroke-width="1.8">
              <path d="M12 8v4l3 3" stroke-linecap="round"/>
              <path d="M3.05 12a9 9 0 1017.9 0A9 9 0 003.05 12z"/>
            </svg>
            {{ order.timeAgo }}
          </span>
        }

        <!-- Order type -->
        <span class="badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="#374151" stroke-width="1.8" stroke-linecap="round">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          {{ order.orderType }}
        </span>

        <!-- Attachments -->
        @if (order.attachments > 0) {
          <span class="badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="#374151" stroke-width="1.8" stroke-linecap="round"
                 stroke-linejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
            </svg>
            {{ order.attachments }}
          </span>
        }

        <!-- Copy -->
        @if (order.hasCopy) {
          <span class="badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="#374151" stroke-width="1.8" stroke-linejoin="round">
              <rect x="9" y="9" width="11" height="11" rx="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                    stroke-linecap="round"/>
            </svg>
          </span>
        }
      </div>

      <!-- Footer: assignee + crown (when present) -->
      @if (order.assigneeName && order.assigneeExtra) {
        <hr class="order-card__divider"/>
        <div class="order-card__footer">
          <span class="order-card__footer-name">
            {{ order.assigneeName }}
            <span class="order-card__crown">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M3 17l3-8 6 5 6-5 3 8H3z"/>
              </svg>
              {{ order.assigneeExtra }}
            </span>
          </span>
        </div>
      }

    </div>
  `,
  styles: [`
    :host { display: block; }

    .order-card {
      background: #fff;
      border-radius: 12px;
      padding: 14px 14px 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
      cursor: pointer;
      transition: transform 120ms ease, box-shadow 120ms ease;
    }
    .order-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(0,0,0,0.12);
    }
    .order-card:active {
      transform: scale(0.995);
    }

    .order-card__top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 6px;
    }

    .order-card__titles {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 0;
    }

    .order-card__location {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: #111827;
      line-height: 1.2;
    }

    .order-card__task {
      font-size: var(--font-size-md);
      color: #374151;
      font-weight: var(--font-weight-regular);
      line-height: 1.3;
    }

    .action-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .action-btn--play  { background: #16a34a; border: 3px solid #bbf7d0; }
    .action-btn--bell  { background: #1e3a5f; }
    .action-btn--minus { background: #7c3aed; }

    .order-card__assignee-row {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 8px;
    }
    .order-card__assignee-name,
    .order-card__assign-link {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: #1d4ed8;
    }

    .order-card__badges {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: var(--font-size-sm);
      color: #374151;
      font-weight: var(--font-weight-medium);
    }
    .badge--red      { color: #dc2626; }
    .badge--orange   { color: #d97706; }
    .badge--green    { color: #16a34a; }
    .badge--escalated { color: #dc2626; }
    .badge--started  { color: #16a34a; }
    .badge--neutral  { color: #374151; }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      display: inline-block;
    }
    .dot--red    { background: #dc2626; }
    .dot--orange { background: #f59e0b; }
    .dot--green  { background: #16a34a; }

    .order-card__divider {
      border: none;
      border-top: 1px solid #f3f4f6;
      margin: 10px 0 8px;
    }

    .order-card__footer {
      display: flex;
      align-items: center;
    }

    .order-card__footer-name {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: #111827;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .order-card__crown {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: #374151;
    }
  `],
})
export class ServiceOrderCardComponent {
  @Input({ required: true }) order!: ServiceOrder;
  @Output() cardClicked = new EventEmitter<number>();

  onCardClick(): void {
    this.cardClicked.emit(this.order.id);
  }
}
