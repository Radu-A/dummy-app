import { Component, inject, WritableSignal } from '@angular/core';

import { CartModel } from '../../../models/cart.model';

import { CartService } from '../../../services/cart-service';
import { BreakpointService } from '../../../services/breakpoint-service';

import { OrderSummary } from '../../../components/order-summary/order-summary';
import { CartSummary } from '../../../components/cart-summary/cart-summary';

@Component({
  selector: 'app-checkout',
  imports: [OrderSummary, CartSummary],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  cartService = inject(CartService);
  breakpointService = inject(BreakpointService);

  cart: WritableSignal<CartModel | null> = this.cartService.cart;

  screenSize: WritableSignal<string> = this.breakpointService.screenSize;
}
