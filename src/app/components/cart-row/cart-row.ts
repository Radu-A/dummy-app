import { Component, input, InputSignal } from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { CartProductModel } from '../../models/cart.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cart-row',
  imports: [MatIcon, MatButtonModule],
  templateUrl: './cart-row.html',
  styleUrl: './cart-row.scss',
})
export class CartRow {
  product: InputSignal<CartProductModel> = input.required();
}
