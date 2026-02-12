import { Routes } from '@angular/router';

import { ProductList } from './product-list/product-list';
import { ProductDetails } from './product-details/product-details';

export const productsRoutes: Routes = [
  {
    path: '',
    component: ProductList,
  },
  {
    path: 'details/:id',
    component: ProductDetails,
  },
];
