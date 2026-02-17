import { Component, inject, input, InputSignal } from '@angular/core';

import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CartProductModel } from '../../models/cart.model';
import { ProductModel } from '../../models/product.model';

import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart-row',
  imports: [MatIcon, MatButtonModule],
  templateUrl: './cart-row.html',
  styleUrl: './cart-row.scss',
})
export class CartRow {
  product: InputSignal<CartProductModel> = input.required();
}
