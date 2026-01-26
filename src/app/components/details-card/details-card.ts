import { Component, input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-details-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './details-card.html',
  styleUrl: './details-card.scss',
})
export class DetailsCard {
  product = input.required<ProductModel>();
}
