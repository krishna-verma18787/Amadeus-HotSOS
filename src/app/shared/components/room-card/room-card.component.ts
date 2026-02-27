import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomAssignment } from '../../../features/housekeeping/housekeeping';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="room-card"
         role="button"
         tabindex="0"
         (click)="onCardClick()"
         (keydown.enter)="onCardClick()"
         (keydown.space)="onCardClick()">

      <!-- Top: room name + action button -->
      <div class="room-card__top">
        <span class="room-card__name">{{ room.roomName }}</span>
        <button class="action-btn"
                [class.action-btn--start]="room.actionState === 'start'"
                [class.action-btn--progress]="room.actionState === 'in-progress'"
                [class.action-btn--done]="room.actionState === 'done'"
                [attr.aria-label]="room.actionState">
          @if (room.actionState === 'start') {
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M8 5l11 7-11 7V5z"/>
            </svg>
          }
          @if (room.actionState === 'in-progress') {
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white"
                 stroke-width="1.8" stroke-linecap="round">
              <path d="M3 22l7-7"/>
              <path d="M10 15l6-9 2 2-7 8"/>
              <path d="M16 6l2-3 3 3-3 1-2-1z"/>
            </svg>
          }
          @if (room.actionState === 'done') {
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white"
                 stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          }
        </button>
      </div>

      <!-- Guest name -->
      <div class="room-card__guest">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="#1d4ed8" stroke-width="1.8"/>
          <path d="M8 12h8M12 8v8" stroke="#1d4ed8" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <span class="room-card__guest-name">{{ room.guestName }}</span>
      </div>

      <!-- Badge row 1: status + task + started -->
      <div class="room-card__badges">
        <span class="badge badge--status">
          <span class="dot"
                [class.dot--red]="room.status === 'Dirty'"
                [class.dot--green]="room.status === 'Clean'"
                [class.dot--blue]="room.status === 'Inspected'">
          </span>
          {{ room.status }}
        </span>
        <span class="badge badge--task">
          @if (room.taskIcon === 'rush') {
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626"
                 stroke-width="1.8" stroke-linecap="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <span style="color:#dc2626">{{ room.taskType }}</span>
          }
          @if (room.taskIcon === 'departure') {
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151"
                 stroke-width="1.8" stroke-linecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            <span>{{ room.taskType }}</span>
          }
          @if (room.taskIcon === 'stayover') {
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151"
                 stroke-width="1.8">
              <path d="M3 9l9-7 9 7v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ room.taskType }}</span>
          }
        </span>
        @if (room.startedAt) {
          <span class="badge badge--started">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#16a34a">
              <path d="M8 5l11 7-11 7V5z"/>
            </svg>
            Started at {{ room.startedAt }}
          </span>
        }
      </div>

      <!-- Badge row 2: linen + points + time + copy -->
      <div class="room-card__badges">
        @if (room.linen) {
          <span class="badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.8">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke-linejoin="round"/>
              <path d="M3 10h18" stroke-linecap="round"/>
            </svg>
            {{ room.linen }}
          </span>
        }
        <span class="badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {{ room.points }} points
        </span>
        <span class="badge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.8">
            <path d="M12 8v4l3 3" stroke-linecap="round"/>
            <path d="M3.05 12a9 9 0 1017.9 0A9 9 0 003.05 12z"/>
          </svg>
          {{ room.minutes }} min
        </span>
        @if (room.hasCopy) {
          <span class="badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#374151"
                 stroke-width="1.8" stroke-linejoin="round">
              <rect x="9" y="9" width="11" height="11" rx="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                    stroke-linecap="round"/>
            </svg>
          </span>
        }
      </div>

      <!-- Divider -->
      <hr class="room-card__divider"/>

      <!-- Assignee row -->
      <div class="room-card__assignee">
        @if (room.assigneeIcon === 'blocked') {
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9.5" stroke="#dc2626" stroke-width="1.8"/>
            <path d="M6 6l12 12" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
          </svg>
        }
        @if (room.assigneeIcon === 'check') {
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9.5" stroke="#16a34a" stroke-width="1.8"/>
            <path d="M7 13l3 3 7-7" stroke="#16a34a" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        }
        <div class="room-card__assignee-info">
          <span class="room-card__assignee-name">
            {{ room.assignee }}
            @if (room.assigneeExtra) {
              <span class="room-card__crown">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M3 17l3-8 6 5 6-5 3 8H3z"/>
                </svg>
                {{ room.assigneeExtra }}
              </span>
            }
          </span>
          <span class="room-card__date">{{ room.dateRange }}</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .room-card {
      background: #fff;
      border-radius: 12px;
      padding: 14px 14px 10px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
      cursor: pointer;
      transition: transform 120ms ease, box-shadow 120ms ease;
    }
    .room-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(0,0,0,0.12);
    }
    .room-card:active {
      transform: scale(0.995);
    }

    .room-card__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .room-card__name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: #111827;
    }

    .action-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .action-btn--start    { background: #16a34a; }
    .action-btn--progress { background: #1e3a5f; }
    .action-btn--done     { background: #6b7280; }

    .room-card__guest {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 8px;
    }
    .room-card__guest-name {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: #1d4ed8;
    }

    .room-card__badges {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: var(--font-size-sm);
      color: #374151;
      font-weight: var(--font-weight-medium);
    }
    .badge--started { color: #16a34a; }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      flex-shrink: 0;
    }
    .dot--red   { background: #dc2626; }
    .dot--green { background: #16a34a; }
    .dot--blue  { background: #2563eb; }

    .room-card__divider {
      border: none;
      border-top: 1px solid #f3f4f6;
      margin: 10px 0 8px;
    }

    .room-card__assignee {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .room-card__assignee-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .room-card__assignee-name {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: #111827;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .room-card__crown {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: #374151;
    }
    .room-card__date {
      font-size: var(--font-size-sm);
      color: #6b7280;
    }
  `],
})
export class RoomCardComponent {
  @Input({ required: true }) room!: RoomAssignment;
  @Output() cardClicked = new EventEmitter<number>();

  onCardClick(): void {
    this.cardClicked.emit(this.room.id);
  }
}
