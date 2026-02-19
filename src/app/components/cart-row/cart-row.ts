import { Component, inject, input, InputSignal, signal } from '@angular/core';

import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CartProductModel } from '../../models/cart.model';

import { CartService } from '../../services/cart-service';
import { BreakpointService } from '../../services/breakpoint-service';

@Component({
  selector: 'app-cart-row',
  imports: [MatIcon, MatButtonModule],
  templateUrl: './cart-row.html',
  styleUrl: './cart-row.scss',
})
export class CartRow {
  cartService = inject(CartService);
  breakPointService = inject(BreakpointService);
  screenSize = this.breakPointService.screenSize;

  product: InputSignal<CartProductModel> = input.required();

  addProduct() {
    this.cartService.addProduct({
      id: this.product().id,
      title: this.product().title,
      price: this.product().price,
      quantity: 1,
      thumbnail: this.product().thumbnail,
      total: this.product().price,
    });
  }

  subtractProduct() {
    this.cartService.subtractProduct({
      id: this.product().id,
      title: this.product().title,
      price: this.product().price,
      quantity: this.product().quantity,
      thumbnail: this.product().thumbnail,
      total: this.product().price,
    });
  }

  removeProduct() {
    this.cartService.removeProduct({
      id: this.product().id,
      title: this.product().title,
      price: this.product().price,
      quantity: this.product().quantity,
      thumbnail: this.product().thumbnail,
      total: this.product().price,
    });
  }
}
