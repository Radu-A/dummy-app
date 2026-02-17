import { Component, computed, inject, WritableSignal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { CartModel } from '../../../models/cart.model';

import { CartService } from '../../../services/cart-service';

import { CartRow } from '../../../components/cart-row/cart-row';
import { OrderSummary } from '../../../components/order-summary/order-summary';
import { OrderInfo } from '../../../components/order-info/order-info';

@Component({
  selector: 'app-cart',
  imports: [CartRow, OrderSummary, OrderInfo],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);
  cart: WritableSignal<CartModel | null> = this.cartService.cart;
  private breakpointObserver = inject(BreakpointObserver);

  // 1. Definimos los breakpoints que nos interesan
  private readonly breakpointConfig = {
    [Breakpoints.XSmall]: 'XSmall',
    [Breakpoints.Small]: 'Small',
    [Breakpoints.Medium]: 'Medium',
    [Breakpoints.Large]: 'Large',
    [Breakpoints.XLarge]: 'XLarge',
  };

  // 2. Convertimos el observable directamente en una Signal
  // No necesitas desuscribirte, Angular lo hace por ti al destruir el componente.
  private breakpointState = toSignal(
    this.breakpointObserver.observe(Object.keys(this.breakpointConfig)),
  );

  // 3. Usamos una signal computada para obtener el nombre legible
  public screenSize = computed(() => {
    const state = this.breakpointState();
    if (!state) return 'Unknown';

    // Buscamos cuál de los breakpoints es verdadero
    const activeBreakpoint = Object.keys(state.breakpoints).find((key) => state.breakpoints[key]);

    return activeBreakpoint ? this.breakpointConfig[activeBreakpoint] : 'Unknown';
  });
}
