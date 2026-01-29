import { Component, inject, input, InputSignal } from '@angular/core';
import { Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  private readonly router = inject(Router);
  product: InputSignal<ProductModel> = input.required();
  parameters = input.required();

  goToDetails() {
    localStorage.setItem('dummyParams', JSON.stringify(this.parameters()));
    this.router.navigate(['products/details', this.product().id]);
  }
}
