import { Component, inject } from '@angular/core';

import { CartService } from '../../../services/cart-service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  FAKE_IMG = 'https://cdn.dummyjson.com/product-images/groceries/lemon/thumbnail.webp';

  cartService = inject(CartService);

  cart = this.cartService.cart;
}
