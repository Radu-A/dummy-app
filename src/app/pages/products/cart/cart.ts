import { Component, inject, Signal, WritableSignal } from '@angular/core';

import { CartModel } from '../../../models/cart.model';

import { CartService } from '../../../services/cart-service';

import { CartRow } from '../../../components/cart-row/cart-row';

@Component({
  selector: 'app-cart',
  imports: [CartRow],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);

  cart: WritableSignal<CartModel | null> = this.cartService.cart;
}
