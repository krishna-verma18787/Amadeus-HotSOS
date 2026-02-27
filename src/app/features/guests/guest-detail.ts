import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuestsService } from '../../core/services/guests.service';
import { Guest } from './guests';

@Component({
  selector: 'app-guest-detail',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="detail">
      <div class="hero">
        <button class="back" type="button" (click)="goBack()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Back
        </button>
        <h1 class="title">Guest Detail</h1>
      </div>

      @if (guest(); as item) {
        <article class="card">
          <h2 class="card__title">{{ item.name }}</h2>
          <p class="card__subtitle">{{ item.room }}</p>
          <div class="chips">
            <span class="chip">{{ item.status }}</span>
            @if (item.vipLevel) { <span class="chip">VIP {{ item.vipLevel }}</span> }
            <span class="chip">{{ item.dateRange }}</span>
          </div>
        </article>

        <article class="panel">
          <h3>Guest Information</h3>
          @if (item.group) { <p><strong>Group:</strong> {{ item.group }}</p> }
          @if (item.adults) { <p><strong>Adults:</strong> {{ item.adults }}</p> }
          @if (item.children) { <p><strong>Children:</strong> {{ item.children }}</p> }
          @if (item.transfers) { <p><strong>Transfers:</strong> {{ item.transfers }}</p> }
        </article>
      } @else {
        <div class="empty">Guest not found.</div>
      }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .detail {
      min-height: 100%;
      background: var(--app-bg);
      padding-top: calc(12px + env(safe-area-inset-top, 0px));
      padding-right: max(14px, env(safe-area-inset-right, 0px));
      padding-left: max(14px, env(safe-area-inset-left, 0px));
      padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
    }
    .hero {
      background: linear-gradient(145deg, color-mix(in srgb, var(--app-primary) 22%, transparent), transparent);
      border: 1px solid var(--app-border); border-radius: 16px; padding: 12px; margin-bottom: 10px;
    }
    .back {
      display: inline-flex; align-items: center; gap: 4px; background: none; border: none;
      color: var(--app-primary); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
      cursor: pointer; font-family: inherit; padding: 0;
    }
    .title { margin: 8px 0 0; color: var(--app-text); font-size: 24px; }
    .card, .panel {
      background: var(--app-surface); border: 1px solid var(--app-border);
      border-radius: 14px; padding: 14px; margin-bottom: 10px;
    }
    .card__title { margin: 0; color: var(--app-text); font-size: 22px; }
    .card__subtitle { margin: 4px 0 10px; color: var(--app-text-muted); font-size: var(--font-size-md); }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
      border: 1px solid var(--app-border); border-radius: 999px; padding: 6px 10px;
      font-size: var(--font-size-sm); color: var(--app-text);
      background: color-mix(in srgb, var(--app-primary) 8%, transparent);
    }
    .panel h3 { margin: 0 0 8px; color: var(--app-text); }
    .panel p { margin: 6px 0; color: var(--app-text-muted); }
    .empty { padding: 24px; text-align: center; color: var(--app-text-muted); }
  `],
})
export class GuestDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private guestsService = inject(GuestsService);
  guest = signal<Guest | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.guestsService.getGuests().subscribe({
      next: (guests) => this.guest.set(guests.find((g) => g.id === id) ?? null),
      error: () => this.guest.set(null),
    });
  }

  goBack(): void {
    this.router.navigate(['/shell/guests']);
  }
}
