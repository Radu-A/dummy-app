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

  addProduct() {
    this.cartService.addProduct({
      id: this.product().id,
      title: this.product().title,
      price: this.product().price,
      quantity: 1,
      thumbnail: this.product().thumbnail,
      total: this.product().price,
    });
  }

  addAndNavigate() {
    this.addProduct();
    this.router.navigate(['/products/cart']);
  }
}
