import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protects routes that require an active session token.
 * Redirects unauthenticated users to /login.
 */
export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = await authService.getToken();
  if (token) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
