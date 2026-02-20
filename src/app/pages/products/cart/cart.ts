import { Component, inject, WritableSignal } from '@angular/core';

import { CartModel } from '../../../models/cart.model';

import { CartService } from '../../../services/cart-service';
import { BreakpointService } from '../../../services/breakpoint-service';

import { CartRow } from '../../../components/cart-row/cart-row';
import { OrderSummary } from '../../../components/order-summary/order-summary';
import { OrderInfo } from '../../../components/order-info/order-info';
import { EmptyCart } from '../../../components/empty-cart/empty-cart';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-cart',
  imports: [CartRow, OrderSummary, OrderInfo, EmptyCart, A11yModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);
  breakpointService = inject(BreakpointService);
  cart: WritableSignal<CartModel | null> = this.cartService.cart;
  screenSize = this.breakpointService.screenSize;
}
