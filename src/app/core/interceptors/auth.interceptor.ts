import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ErrorModalService } from '../services/error-modal.service';

/**
 * Attaches the stored session token as a Bearer Authorization header
 * to every outgoing HTTP request.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorModal = inject(ErrorModalService);

  return from(authService.getToken()).pipe(
    switchMap((token) => {
      if (token) {
        const authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next(authReq);
      }
      return next(req);
    }),
    catchError((err) => {
      if (!navigator.onLine) {
        errorModal.show('Offline: Please check your connection.');
      } else {
        errorModal.show('Something went wrong. Please try again.');
      }
      return throwError(() => err);
    })
  );
};
