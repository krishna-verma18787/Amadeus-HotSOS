import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorModalService } from '../../../core/services/error-modal.service';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (errorModal.isOpen()) {
      <div class="error-modal__backdrop" (click)="errorModal.close()"></div>
      <section class="error-modal" role="alertdialog" aria-modal="true" [attr.aria-label]="errorModal.title()">
        <header class="error-modal__header">
          <h2 class="error-modal__title">{{ errorModal.title() }}</h2>
        </header>
        <p class="error-modal__message">{{ errorModal.message() }}</p>
        <button class="error-modal__button" type="button" (click)="errorModal.close()">OK</button>
      </section>
    }
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
      pointer-events: none;
    }

    .error-modal__backdrop {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.5);
      pointer-events: auto;
    }

    .error-modal {
      position: fixed;
      left: 26px;
      right: 26px;
      top: 50%;
      transform: translateY(-50%);
      background: #ffffff;
      border-radius: 14px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.24);
      padding: 18px 16px 14px;
      pointer-events: auto;
      max-width: 420px;
      margin-left: 30px;
      margin-right: 30px;
      padding-top: 30px;
      padding-bottom: 20px;
    }

    .error-modal__header {
      margin-bottom: 10px;
    }

    .error-modal__title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }

    .error-modal__message {
      margin: 0 0 16px;
      font-size: 14px;
      color: #374151;
      line-height: 1.45;
    }

    .error-modal__button {
      width: 100%;
      border: none;
      border-radius: 10px;
      padding: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      background: #1d4ed8;
      cursor: pointer;
      font-family: inherit;
    }
  `],
})
export class ErrorModalComponent {
  errorModal = inject(ErrorModalService);
}
