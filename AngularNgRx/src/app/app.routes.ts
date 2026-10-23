import { Routes } from '@angular/router';
import { roleGuard } from './core/gurds/role.guards';

export const routes: Routes = [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['admin'])],
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
  },
  // {
  //   path: 'captain',
  //   canActivate: [roleGuard(['captain'])],
  //   loadComponent: () =>
  //     import('./pages/captain-orders/captain-orders.component').then((m) => m.CaptainOrdersComponent),
  // },
  // {
  //   path: 'customer',
  //   canActivate: [roleGuard(['customer'])],
  //   loadComponent: () =>
  //     import('./pages/customer-orders/customer-orders.component').then((m) => m.CustomerOrdersComponent),
  // },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized').then((m) => m.Unauthorized),
  },
  {
    path: '**',
    redirectTo: 'login',
  },];
