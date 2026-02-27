import {
  Component,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface BottomSheetItem {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Backdrop -->
    <div class="backdrop" (click)="close()"></div>

    <!-- Sheet panel -->
    <div class="sheet"
         role="dialog"
         aria-modal="true"
         aria-label="More options"
         [class.sheet--dragging]="dragging()"
         [style.transform]="'translateY(' + dragOffset() + 'px)'">
      <div class="sheet__handle"
           (pointerdown)="onHandlePointerDown($event)"></div>
      <ul class="sheet__list" role="menu">
        @for (item of items; track item.label) {
          <li class="sheet__item" role="menuitem" (click)="onItemClick(item)">
            {{ item.label }}
          </li>
        }
      </ul>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      animation: fadeIn 200ms ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .sheet {
      position: relative;
      z-index: 1;
      background: #ffffff;
      border-radius: 16px 16px 0 0;
      padding: 8px 0 24px;
      transition: transform 180ms cubic-bezier(0.32, 0.72, 0, 1);
      will-change: transform;
    }

    .sheet--dragging {
      transition: none;
    }

    .sheet__handle {
      width: 36px;
      height: 4px;
      background: #d1d5db;
      border-radius: 2px;
      margin: 0 auto 12px;
      touch-action: none;
      cursor: grab;
    }

    .sheet__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .sheet__item {
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 400;
      color: #111827;
      cursor: pointer;
      transition: background 150ms ease;
      font-family: inherit;
    }

    .sheet__item:hover,
    .sheet__item:active {
      background: #f3f4f6;
    }
  `],
})
export class BottomSheetComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() itemSelected = new EventEmitter<BottomSheetItem>();

  private router = inject(Router);
  dragOffset = signal(0);
  dragging = signal(false);
  private startY = 0;

  items: BottomSheetItem[] = [
    { label: 'Amenities' },
    { label: 'Meters' },
    { label: 'Personnel' },
  ];

  close() {
    this.closed.emit();
  }

  onItemClick(item: BottomSheetItem) {
    this.itemSelected.emit(item);
    this.close();
  }

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
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close();
  }
}
