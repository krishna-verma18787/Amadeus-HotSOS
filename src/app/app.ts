import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorModalComponent } from './shared/components/error-modal/error-modal.component';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-capacitor-app');
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  constructor() {
    // Ensure persisted theme is applied as early as possible.
    void this.themeService.init();
    void this.authService.initSessionUser();
  }
}
