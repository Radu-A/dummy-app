import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product: InputSignal<ProductModel> = input.required();
}
