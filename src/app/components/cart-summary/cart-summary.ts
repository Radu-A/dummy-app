import { Component, input, InputSignal, WritableSignal } from '@angular/core';
import { CartModel } from '../../models/cart.model';

@Component({
  selector: 'app-cart-summary',
  imports: [],
  templateUrl: './cart-summary.html',
  styleUrl: './cart-summary.scss',
})
export class CartSummary {
  cart: InputSignal<CartModel | null> = input.required();
}
