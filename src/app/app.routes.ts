import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'shell',
    loadComponent: () =>
      import('./features/shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'housekeeping',
        pathMatch: 'full',
      },
      {
        path: 'housekeeping',
        loadComponent: () =>
          import('./features/housekeeping/housekeeping').then(
            (m) => m.Housekeeping
          ),
      },
      {
        path: 'housekeeping/:id',
        loadComponent: () =>
          import('./features/housekeeping/housekeeping-detail').then(
            (m) => m.HousekeepingDetail
          ),
      },
      {
        path: 'service-orders',
        loadComponent: () =>
          import('./features/service-orders/service-orders').then(
            (m) => m.ServiceOrders
          ),
      },
      {
        path: 'service-orders/:id',
        loadComponent: () =>
          import('./features/service-orders/service-order-detail').then(
            (m) => m.ServiceOrderDetail
          ),
      },
      {
        path: 'guests',
        loadComponent: () =>
          import('./features/guests/guests').then((m) => m.Guests),
      },
      {
        path: 'guests/:id',
        loadComponent: () =>
          import('./features/guests/guest-detail').then(
            (m) => m.GuestDetail
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
