import { Component, computed, inject, WritableSignal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { CartModel } from '../../../models/cart.model';

import { CartService } from '../../../services/cart-service';

import { CartRow } from '../../../components/cart-row/cart-row';
import { OrderSummary } from '../../../components/order-summary/order-summary';
import { OrderInfo } from '../../../components/order-info/order-info';
import { BreakpointService } from '../../../services/breakpoint-service';

@Component({
  selector: 'app-cart',
  imports: [CartRow, OrderSummary, OrderInfo],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);
  breakpointService = inject(BreakpointService);
  cart: WritableSignal<CartModel | null> = this.cartService.cart;
  screenSize = this.breakpointService.screenSize;
}
