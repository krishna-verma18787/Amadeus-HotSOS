import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable page header used across Housekeeping, Service Orders and Guests.
 *
 * Flags (all default true unless noted):
 *   showRolePill       – pill button with optional dropdown
 *   showHelpIcon       – question-mark circle icon
 *   showAvatar         – "JW" purple avatar that emits avatarClicked
 *   showTitleChevron   – down-chevron beside the title
 *   showSearch         – search icon → expands inline search bar
 *   showFilter         – "Filters" pill button
 *   showSort           – "Sort …" pill button
 *
 * Data inputs:
 *   title              – main heading text
 *   avatarInitials     – text shown inside the avatar (default "JW")
 *   rolePillLabel      – initial label of the role pill
 *   roleOptions        – array of strings; if empty no dropdown appears
 *   filterCount        – badge number shown after "Filters"
 *   sortActive         – whether sort pill is highlighted
 *   sortLabel          – label shown on sort button
 *
 * Outputs:
 *   roleChanged        – emits new role string
 *   searchChanged      – emits search query on every keystroke
 *   filterClicked      – parent opens its filter panel
 *   sortClicked        – parent opens its sort panel
 *   avatarClicked      – parent opens profile overlay
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="ph">

      <!-- ── Role row ── -->
      <div class="ph__role-row">

        @if (showRolePill) {
          <button class="ph__role-pill"
                  (click)="roleOptions.length ? roleDropdownOpen.set(!roleDropdownOpen()) : null">
            {{ selectedRole() }}
            @if (roleOptions.length) {
              <svg class="ph__role-chevron"
                   width="14" height="14" viewBox="0 0 24 24" fill="none"
                   [style.transform]="roleDropdownOpen() ? 'rotate(180deg)' : 'rotate(0deg)'"
                   style="transition: transform 0.2s">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2"
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            }
          </button>

          <!-- Dropdown panel -->
          @if (roleDropdownOpen() && roleOptions.length) {
            <div class="ph__role-backdrop"  (click)="roleDropdownOpen.set(false)"></div>
            <div class="ph__role-faded-bg"  (click)="roleDropdownOpen.set(false)"></div>
            <div class="ph__role-dropdown">
              @for (opt of roleOptions; track opt; let last = $last) {
                <button class="ph__role-dropdown-item"
                        [class.ph__role-dropdown-item--active]="opt === selectedRole()"
                        (click)="selectRole(opt)">
                  {{ opt }}
                </button>
                @if (!last) {
                  <hr class="ph__role-dropdown-divider"/>
                }
              }
            </div>
          }
        }

        <!-- Right-side icons -->
        <div class="ph__actions">
          @if (showHelpIcon) {
            <button class="ph__icon-btn" aria-label="Help">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 17v-1" stroke="currentColor" stroke-width="2.2"
                      stroke-linecap="round"/>
                <path d="M9.5 9.5a2.5 2.5 0 015 .5c0 1.5-2.5 2-2.5 3.5"
                      stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          }
          @if (showAvatar) {
            <div class="ph__avatar"
                 (click)="avatarClicked.emit()"
                 role="button" aria-label="Open profile" tabindex="0">
              {{ avatarInitials }}
            </div>
          }
        </div>
      </div>

      <!-- ── Title row ── -->
      <div class="ph__title-row">
        <h1 class="ph__title">
          {{ title }}
          @if (showTitleChevron) {
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          }
        </h1>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .ph {
      background: var(--app-surface);
      padding-top: calc(12px + env(safe-area-inset-top, 0px));
      padding-right: max(16px, env(safe-area-inset-right, 0px));
      padding-left: max(16px, env(safe-area-inset-left, 0px));
      padding-bottom: 0;
      border-bottom: 1px solid var(--app-border);
      overflow: visible;
      position: relative;
      z-index: 10;
    }

    /* ── Role row ── */
    .ph__role-row {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding-bottom: 10px;
      overflow: visible;
    }

    .ph__role-pill {
      display: flex;
      align-items: center;
      gap: 4px;
      border: 1.5px solid #1d4ed8;
      border-radius: 20px;
      background: transparent;
      color: #1d4ed8;
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      padding: 5px 14px;
      cursor: pointer;
      font-family: inherit;
      position: relative;
      z-index: 201;
    }
    .ph__role-chevron { flex-shrink: 0; }

    /* Transparent backdrop (captures outside clicks) */
    .ph__role-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
    }

    /* Faded overlay behind dropdown */
    .ph__role-faded-bg {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.35);
      z-index: 199;
    }

    /* Full-width dropdown panel */
    .ph__role-dropdown {
      position: absolute;
      top: 100%;
      left: 16px;
      right: 16px;
      background: var(--app-surface);
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      z-index: 201;
      overflow: hidden;
      padding: 0;
    }

    .ph__role-dropdown-item {
      display: block;
      width: 100%;
      padding: 20px 24px;
      text-align: left;
      background: none;
      border: none;
      font-size: var(--font-size-md);
      color: var(--app-text);
      font-family: inherit;
      cursor: pointer;
      font-weight: var(--font-weight-regular);
      transition: background 0.15s;
    }
    .ph__role-dropdown-item:active,
    .ph__role-dropdown-item:hover { background: var(--app-surface-2); }
    .ph__role-dropdown-item--active { font-weight: var(--font-weight-semibold); color: #1d4ed8; }

    .ph__role-dropdown-divider {
      margin: 0;
      border: none;
      border-top: 1px solid var(--app-border);
    }

    /* Right-side actions */
    .ph__actions {
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ph__icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--app-text-muted);
      display: flex;
      align-items: center;
    }

    .ph__avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #6d28d9;
      color: #fff;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      -webkit-tap-highlight-color: transparent;
    }
    .ph__avatar::after {
      content: '';
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 9px;
      height: 9px;
      background: #dc2626;
      border-radius: 50%;
      border: 1.5px solid #fff;
    }

    /* ── Title row ── */
    .ph__title-row { padding: 4px 0 12px; }

    .ph__title {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--app-text);
      display: flex;
      align-items: center;
      gap: 6px;
    }
  `],
})
export class PageHeaderComponent implements OnInit, OnChanges {
  // ── Visibility flags ──
  @Input() showRolePill     = true;
  @Input() showHelpIcon     = true;
  @Input() showAvatar       = true;
  @Input() showTitleChevron = true;

  // ── Data inputs ──
  @Input() title          = '';
  @Input() avatarInitials = 'JW';
  @Input() rolePillLabel  = 'Supervisor';
  @Input() roleOptions: string[] = [];

  // ── Outputs ──
  @Output() roleChanged   = new EventEmitter<string>();
  @Output() avatarClicked = new EventEmitter<void>();

  // ── Internal signals ──
  roleDropdownOpen = signal(false);
  selectedRole     = signal('');

  ngOnInit(): void {
    this.selectedRole.set(this.rolePillLabel);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rolePillLabel'] && !this.roleDropdownOpen()) {
      this.selectedRole.set(this.rolePillLabel);
    }
  }

  selectRole(role: string): void {
    this.selectedRole.set(role);
    this.roleDropdownOpen.set(false);
    this.roleChanged.emit(role);
  }
}
