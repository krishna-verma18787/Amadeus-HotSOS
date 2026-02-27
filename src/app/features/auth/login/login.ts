import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorModalService } from '../../../core/services/error-modal.service';

/** Two-step login: first PIN, then password. */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  /** 'pin' → step 1 | 'password' → step 2 */
  step = signal<'pin' | 'password'>('pin');

  pinForm: FormGroup;
  passwordForm: FormGroup;

  /** Populated after successful PIN verification */
  verifiedUser = signal<string>('');
  /** Token held temporarily until password is confirmed */
  private pendingToken = '';

  isLoading = signal(false);
  showPin = signal(false);
  showPassword = signal(false);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private errorModal = inject(ErrorModalService);
  private router = inject(Router);

  constructor() {
    this.pinForm = this.fb.group({
      pin: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[0-9]*$')]]
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  /** Step 1: verify PIN against mock JSON */
  onPinSubmit(): void {
    if (this.pinForm.invalid) {
      this.pinForm.markAllAsTouched();
      this.errorModal.show(this.getPinValidationMessage());
      return;
    }
    this.isLoading.set(true);

    this.authService.loginWithPin(this.pinForm.value.pin).subscribe({
      next: (response: { token: string; user: string }) => {
        this.pendingToken = response.token;
        this.verifiedUser.set(response.user);
        this.isLoading.set(false);
        this.step.set('password');
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.errorModal.show(err.message || 'An error occurred. Please try again.');
        this.pinForm.get('pin')?.reset();
      }
    });
  }

  /** Step 2: accept any non-empty password (mock), save token, navigate */
  async onPasswordSubmit(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.errorModal.show('Please enter your password.');
      return;
    }
    this.isLoading.set(true);
    await this.authService.saveSession(this.pendingToken, this.verifiedUser());
    this.router.navigate(['/shell/housekeeping']);
  }

  /** Go back to PIN step */
  goBack(): void {
    this.step.set('pin');
    this.verifiedUser.set('');
    this.pendingToken = '';
    this.passwordForm.reset();
  }

  private getPinValidationMessage(): string {
    const pinCtrl = this.pinForm.get('pin');
    if (!pinCtrl) {
      return 'Please enter PIN.';
    }

    if (pinCtrl.hasError('required')) {
      return 'Please enter PIN.';
    }
    if (pinCtrl.hasError('pattern')) {
      return 'PIN must contain only numbers.';
    }
    if (pinCtrl.hasError('minlength')) {
      return 'PIN must be at least 4 digits.';
    }
    return 'Please enter a valid PIN.';
  }

  /** Derive initials from user name, e.g. 'John Watson' → 'JW' */
  get initials(): string {
    return this.verifiedUser()
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
