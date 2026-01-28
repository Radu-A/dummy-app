import { Component, input, InputSignal } from '@angular/core';

import { ProductModel } from '../../models/product.model';

import { ProductRow } from '../product-row/product-row';

@Component({
  selector: 'app-product-listing',
  imports: [ProductRow],
  templateUrl: './product-listing.html',
  styleUrl: './product-listing.scss',
})
export class ProductListing {
  productList: InputSignal<ProductModel[]> = input.required();
  pageSize = input.required();
  pageIndex = input.required();
  inputValue = input.required();
}
