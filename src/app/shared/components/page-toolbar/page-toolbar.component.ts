import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Scrollable toolbar — placed inside the page's scroll container,
 * NOT inside the sticky header.
 *
 * Inputs:
 *   showSearch   – show search icon / expanded search bar (default true)
 *   showFilter   – show Filters pill (default true)
 *   showSort     – show Sort pill (default true)
 *   filterCount  – badge count on Filters button
 *   sortActive   – highlight Sort button
 *   sortLabel    – label on Sort button
 *
 * Outputs:
 *   searchChanged  – emits query string on every keystroke
 *   filterClicked  – open parent filter panel
 *   sortClicked    – open parent sort panel
 */
@Component({
  selector: 'app-page-toolbar',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pt">
      <!-- Search icon OR expanded search bar -->
      @if (showSearch) {
        @if (!searchOpen()) {
          <button class="pt__btn pt__btn--icon"
                  aria-label="Search"
                  [class.pt__btn--active]="searchQuery().length > 0"
                  (click)="searchOpen.set(true)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
              <path d="M20 20l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        } @else {
          <div class="pt__search-bar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="pt__search-icon">
              <circle cx="11" cy="11" r="7" stroke="#9ca3af" stroke-width="1.8"/>
              <path d="M20 20l-3-3" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input class="pt__search-input"
                   type="text"
                   placeholder="Search…"
                   [(ngModel)]="_searchModel"
                   (ngModelChange)="onSearchChange($event)"
                   autofocus/>
            @if (searchQuery().length > 0) {
              <button class="pt__search-clear" (click)="clearSearch()" aria-label="Clear">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#6b7280" stroke-width="2"
                        stroke-linecap="round"/>
                </svg>
              </button>
            }
            <button class="pt__search-cancel" (click)="closeSearch()">Cancel</button>
          </div>
        }
      }

      <!-- Filter & Sort (hidden while search is expanded) -->
      @if (!searchOpen()) {
        @if (showFilter) {
          <button class="pt__btn"
                  [class.pt__btn--active]="filterCount > 0"
                  (click)="filterClicked.emit()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round"/>
            </svg>
            Filters @if (filterCount > 0) { ({{ filterCount }}) }
          </button>
        }
        @if (showSort) {
          <button class="pt__btn"
                  [class.pt__btn--active]="sortActive"
                  (click)="sortClicked.emit()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M6 12h12M9 18h6" stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round"/>
            </svg>
            {{ sortLabel }}
          </button>
        }
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .pt {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px 10px;
      background: var(--app-bg);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .pt::-webkit-scrollbar { display: none; }

    .pt__btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--app-surface);
      border: 1.5px solid var(--app-border);
      border-radius: 20px;
      padding: 7px 14px;
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--app-text);
      white-space: nowrap;
      cursor: pointer;
      font-family: inherit;
      flex-shrink: 0;
      transition: border-color 0.15s, color 0.15s, background 0.15s;
    }
    .pt__btn:active { background: var(--app-surface-2); }
    .pt__btn--active {
      border-color: #1d4ed8;
      color: #1d4ed8;
      background: #eff6ff;
    }
    .pt__btn--icon {
      padding: 7px 10px;
    }

    /* Search bar */
    .pt__search-bar {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--app-surface);
      border: 1.5px solid var(--app-border);
      border-radius: 10px;
      padding: 7px 12px;
    }

    .pt__search-icon { flex-shrink: 0; }

    .pt__search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: var(--font-size-md);
      color: var(--app-text);
      outline: none;
      font-family: inherit;
      min-width: 0;
    }
    .pt__search-input::placeholder { color: #9ca3af; }

    .pt__search-clear {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
    }

    .pt__search-cancel {
      background: none;
      border: none;
      font-size: var(--font-size-md);
      color: #1d4ed8;
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      font-family: inherit;
      padding: 0 0 0 4px;
      white-space: nowrap;
    }
  `],
})
export class PageToolbarComponent implements OnChanges {
  @Input() showSearch  = true;
  @Input() showFilter  = true;
  @Input() showSort    = true;
  @Input() filterCount = 0;
  @Input() sortActive  = false;
  @Input() sortLabel   = 'Sort by Priority';

  @Output() searchChanged = new EventEmitter<string>();
  @Output() filterClicked = new EventEmitter<void>();
  @Output() sortClicked   = new EventEmitter<void>();

  searchOpen   = signal(false);
  searchQuery  = signal('');
  _searchModel = '';

  ngOnChanges(changes: SimpleChanges): void {
    // If parent clears search externally, reset internal state
    if (changes['sortLabel']) { /* no-op, just triggers CD */ }
  }

  onSearchChange(val: string): void {
    this.searchQuery.set(val);
    this.searchChanged.emit(val);
  }

  clearSearch(): void {
    this._searchModel = '';
    this.searchQuery.set('');
    this.searchChanged.emit('');
  }

  closeSearch(): void {
    this.clearSearch();
    this.searchOpen.set(false);
  }
}
