import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface QuickActionItem {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-quick-actions-sheet',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="qa-backdrop" (click)="closed.emit()"></div>
    <section class="qa-sheet"
             role="dialog"
             aria-modal="true"
             aria-label="Quick actions"
             [class.qa-sheet--dragging]="dragging()"
             [style.transform]="'translateY(' + dragOffset() + 'px)'">
      <div class="qa-sheet__handle"
           (pointerdown)="onHandlePointerDown($event)"></div>
      <h3 class="qa-sheet__title">{{ title }}</h3>
      <p class="qa-sheet__subtitle">{{ subtitle }}</p>

      <div class="qa-sheet__list">
        @for (item of items; track item.title) {
          <button class="qa-sheet__item" type="button">
            <span class="qa-sheet__item-title">{{ item.title }}</span>
            <span class="qa-sheet__item-subtitle">{{ item.subtitle }}</span>
          </button>
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: 420;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .qa-backdrop {
      position: absolute;
      inset: 0;
      background: var(--app-backdrop);
      animation: qaFade 160ms ease;
    }

    .qa-sheet {
      position: relative;
      z-index: 1;
      border-radius: 20px 20px 0 0;
      padding: 12px 16px calc(16px + env(safe-area-inset-bottom, 0px));
      background: var(--app-surface);
      border-top: 1px solid var(--app-border);
      transition: transform 180ms cubic-bezier(0.32, 0.72, 0, 1);
      will-change: transform;
    }

    .qa-sheet--dragging {
      transition: none;
    }

    .qa-sheet__handle {
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background: var(--app-border);
      margin: 0 auto 10px;
      touch-action: none;
      cursor: grab;
    }

    .qa-sheet__title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: var(--app-text);
    }

    .qa-sheet__subtitle {
      margin: 4px 0 14px;
      font-size: 13px;
      color: var(--app-text-muted);
    }

    .qa-sheet__list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .qa-sheet__item {
      border: 1px solid var(--app-border);
      border-radius: 12px;
      background: var(--app-surface-2);
      color: var(--app-text);
      text-align: left;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      cursor: pointer;
      font-family: inherit;
      transition: transform 120ms ease, border-color 120ms ease;
    }

    .qa-sheet__item:active {
      transform: scale(0.99);
      border-color: var(--app-primary);
    }

    .qa-sheet__item-title {
      font-size: 15px;
      font-weight: 600;
    }

    .qa-sheet__item-subtitle {
      font-size: 12px;
      color: var(--app-text-muted);
    }

    @keyframes qaFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }

  `],
})
export class QuickActionsSheetComponent {
  @Input() title = 'Quick Actions';
  @Input() subtitle = 'Choose what you want to do next.';
  @Input() items: QuickActionItem[] = [];
  @Output() closed = new EventEmitter<void>();
  dragOffset = signal(0);
  dragging = signal(false);
  private startY = 0;

  onHandlePointerDown(event: PointerEvent): void {
    this.dragging.set(true);
    this.startY = event.clientY;
  }

  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if (!this.dragging()) return;
    const delta = event.clientY - this.startY;
    this.dragOffset.set(Math.max(0, delta));
    if (delta > 0) {
      event.preventDefault();
    }
  }

  @HostListener('document:pointerup')
  @HostListener('document:pointercancel')
  onPointerEnd(): void {
    if (!this.dragging()) return;
    const shouldClose = this.dragOffset() > 72;
    this.dragging.set(false);
    this.dragOffset.set(0);
    if (shouldClose) {
      this.closed.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }
}
