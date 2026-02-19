import { Component, inject, input, InputSignal } from '@angular/core';
import { CartModel } from '../../models/cart.model';

import { MatButtonModule } from '@angular/material/button';
import { BreakpointService } from '../../services/breakpoint-service';

@Component({
  selector: 'app-order-summary',
  imports: [MatButtonModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  breakpointService = inject(BreakpointService);
  cart: InputSignal<CartModel> = input.required();

  screenSize = this.breakpointService.screenSize;
}
