import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, map, startWith, of, tap } from 'rxjs';
import { AsyncPipe, Location } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { ProductStateModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product-service';
import { LoadingService } from '../../../services/loading-service';

import { DetailsCard } from '../../../components/details-card/details-card';
import { MessageModal } from '../../../components/message-modal/message-modal';
import { ErrorService } from '../../../services/error-service';

@Component({
  selector: 'app-product-details',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, DetailsCard],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails {
  private service = inject(ProductService);
  private loadingService = inject(LoadingService);
  private errorService = inject(ErrorService);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  // Dialog
  readonly dialog = inject(MatDialog);

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

  constructor() {
    // Listen the state of isLoading signal at loadingService
    effect(() => {
      const isLoading = this.loadingService.isLoading();
      if (isLoading) {
        this.dialog.open(LoadingModal);
      } else {
        this.dialog.closeAll();
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
