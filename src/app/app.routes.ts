import { Routes } from '@angular/router';

import { authGuard } from './others/guards/auth-guard';

import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Checkout } from './pages/products/checkout/checkout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((mod) => mod.MainLayout),
    children: [
      {
        path: 'products',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./pages/products/products.routes').then((mod) => mod.productsRoutes),
      },
    ],
  },
  {
    path: 'notfound',
    component: NotFoundPage,
  },
  {
    path: '**',
    redirectTo: 'notfound',
    pathMatch: 'full',
  },
];
