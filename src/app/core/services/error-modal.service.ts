import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorModalService {
  isOpen = signal(false);
  title = signal('Error');
  message = signal('');

  show(message: string, title = 'Error'): void {
    this.title.set(title);
    this.message.set(message);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
