import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ProductModel } from '../../models/product.model';

import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-details-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './details-card.html',
  styleUrl: './details-card.scss',
})
export class DetailsCard {
  router = inject(Router);
  cartService = inject(CartService);

  product = input.required<ProductModel>();

  addAndNavigate(product: ProductModel) {
    this.cartService.addProduct(product);
    this.router.navigate(['/products/cart']);
  }
}
