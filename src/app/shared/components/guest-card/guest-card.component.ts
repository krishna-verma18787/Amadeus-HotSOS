import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Guest } from '../../../features/guests/guests';

@Component({
  selector: 'app-guest-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="guest-card"
         role="button"
         tabindex="0"
         (click)="onCardClick()"
         (keydown.enter)="onCardClick()"
         (keydown.space)="onCardClick()">

      <!-- Name row -->
      <div class="guest-card__name-row">
        <span class="guest-card__name">{{ guest.name }}</span>
        @if (guest.vipLevel) {
          <span class="guest-card__vip">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M3 17l3-8 6 5 6-5 3 8H3z"/>
            </svg>
            {{ guest.vipLevel }}
          </span>
        }
      </div>

      <!-- Room -->
      <div class="guest-card__room">{{ guest.room }}</div>

      <!-- Date + status row -->
      <div class="guest-card__meta-row">
        <span class="guest-card__dates">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="#374151" stroke-width="1.8" stroke-linecap="round">
            <path d="M17 2v2M7 2v2"/>
            <rect x="3" y="4" width="18" height="18" rx="2" stroke-linejoin="round"/>
            <path d="M3 10h18"/>
            <path d="M8 14h.01M12 14h.01M16 14h.01"/>
          </svg>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="#374151" stroke-width="1.8" stroke-linecap="round"
               stroke-linejoin="round">
            <path d="M1 4v6h6M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/>
          </svg>
          {{ guest.dateRange }}
        </span>

        <!-- Status badge -->
        <span class="status-badge"
              [class.status-badge--inhouse]="guest.status === 'in-house'"
              [class.status-badge--arriving]="guest.status === 'arriving'"
              [class.status-badge--departing]="guest.status === 'departing'">
          @if (guest.status === 'in-house') {
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            In House
          }
          @if (guest.status === 'arriving') {
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9.5"/>
              <path d="M12 8l4 4-4 4M8 12h8"/>
            </svg>
            Arriving
          }
          @if (guest.status === 'departing') {
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9.5"/>
              <path d="M12 8l-4 4 4 4M16 12H8"/>
            </svg>
            Departing
          }
        </span>
      </div>

      <!-- Group / pax row -->
      <div class="guest-card__pax-row">
        @if (guest.group) {
          <span class="pax-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="#374151" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            {{ guest.group }}
          </span>
        }
        @if (guest.adults) {
          <span class="pax-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="#374151" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <path d="M16 11l2 2 4-4"/>
            </svg>
            {{ guest.adults }}
          </span>
        }
        @if (guest.children) {
          <span class="pax-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="#374151" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            {{ guest.children }}
          </span>
        }
        @if (guest.transfers) {
          <span class="pax-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="#374151" stroke-width="1.8"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3"/>
              <path d="M8 12h8M12 8l4 4-4 4"/>
            </svg>
            {{ guest.transfers }}
          </span>
        }
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .guest-card {
      background: #fff;
      border-radius: 12px;
      padding: 16px 16px 14px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
      display: flex;
      flex-direction: column;
      gap: 4px;
      cursor: pointer;
      transition: transform 120ms ease, box-shadow 120ms ease;
    }
    .guest-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(0,0,0,0.12);
    }
    .guest-card:active {
      transform: scale(0.995);
    }

    .guest-card__name-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .guest-card__name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: #111827;
    }

    .guest-card__vip {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: #374151;
    }

    .guest-card__room {
      font-size: var(--font-size-md);
      color: #374151;
      font-weight: var(--font-weight-regular);
      margin-top: 1px;
    }

    .guest-card__meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-top: 6px;
      flex-wrap: wrap;
    }

    .guest-card__dates {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: var(--font-size-sm);
      color: #374151;
      font-weight: var(--font-weight-regular);
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      border-radius: 4px;
      white-space: nowrap;
    }
    .status-badge--inhouse   { color: #374151; }
    .status-badge--arriving  { color: #374151; }
    .status-badge--departing { color: #374151; }

    .guest-card__pax-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 4px;
      flex-wrap: wrap;
    }

    .pax-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: var(--font-size-sm);
      color: #374151;
      font-weight: var(--font-weight-medium);
    }
  `],
})
export class GuestCardComponent {
  @Input({ required: true }) guest!: Guest;
  @Output() cardClicked = new EventEmitter<number>();

  onCardClick(): void {
    this.cardClicked.emit(this.guest.id);
  }
}
