import { Component, input, InputSignal } from '@angular/core';

import { ProductModel } from '../../models/product.model';

import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCard],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.scss',
})
export class ProductGrid {
  productList: InputSignal<ProductModel[]> = input.required();
}
