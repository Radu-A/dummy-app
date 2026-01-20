import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { MainLayout } from './layout/main-layout/main-layout';
import { ProductList } from './pages/products/product-list/product-list';
import { ProductDetails } from './pages/products/product-details/product-details';

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
    component: MainLayout,
    children: [
      {
        path: 'products',
        children: [
          {
            path: '',
            component: ProductList,
          },
          {
            path: 'details',
            component: ProductDetails,
          },
        ],
      },
    ],
  },
];
