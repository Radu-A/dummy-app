import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';

import { ProductModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product-service';

import { ProductCard } from '../../../components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, MatFormFieldModule, MatInputModule, MatGridListModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  service = inject(ProductService);

  listState$: Observable<ProductModel[]> = this.service.getProducts();
}
