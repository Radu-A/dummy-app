import { Component, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Observable, catchError, map, startWith, of, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ProductStateModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product-service';

@Component({
  selector: 'app-product-details',
  imports: [AsyncPipe, MatButtonModule, RouterLink, MatCardModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  private service = inject(ProductService);
  private route = inject(ActivatedRoute);
  // Improvement:
  // paramsMap and pipe to direct connection with productState$
  private readonly id = signal<number>(Number(this.route.snapshot.params['id']));

  productState$: Observable<ProductStateModel> = this.service.getProductById(this.id()).pipe(
    tap((result) => console.log(result)),
    map((result) => ({
      loading: false,
      data: result,
      error: null,
    })),
    startWith({
      loading: true,
      data: null,
      error: null,
    }),
    catchError((error) =>
      of({
        loading: false,
        data: null,
        error: `Error loading product: ${error.message}`, // code 404?
      }),
    ),
  );
}
