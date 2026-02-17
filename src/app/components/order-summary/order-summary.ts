import { Component, input, InputSignal } from '@angular/core';
import { CartModel } from '../../models/cart.model';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-summary',
  imports: [MatButtonModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.scss',
})
export class OrderSummary {
  cart: InputSignal<CartModel> = input.required();
}
