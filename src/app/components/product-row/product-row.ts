import { Component, inject, input, InputSignal } from '@angular/core';
import { Router } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-product-row',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './product-row.html',
  styleUrl: './product-row.scss',
})
export class ProductRow {
  private readonly router = inject(Router);
  product: InputSignal<ProductModel> = input.required();
  pageSize = input.required();
  pageIndex = input.required();
  inputValue = input.required();

  goToDetails() {
    const params = {
      pageSize: this.pageSize(),
      pageIndex: this.pageIndex(),
      inputValue: this.inputValue(),
    };
    localStorage.setItem('dummyParams', JSON.stringify(params));
    this.router.navigate(['products/details', this.product().id]);
  }
}
