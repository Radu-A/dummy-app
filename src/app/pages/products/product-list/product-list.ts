import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ResponseModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product-service';
import { PageModel } from '../../../models/page.model';

import { ProductCard } from '../../../components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    ProductCard,
    MatPaginatorModule,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly service = inject(ProductService);
  // BehaviourSubject for pageSize
  private pageSize$ = new BehaviorSubject<number>(15);
  // BehaviourSubject for skip number
  private skip$ = new BehaviorSubject<number>(0);
  // LOGIC KEY:
  // Create an Observable as combination of BehaviourSubject
  listState$: Observable<ResponseModel> = combineLatest([this.pageSize$, this.skip$]).pipe(
    switchMap(([total, skip]) => {
      // Return an Observable with ResponseModel value:
      // {products: ProductModel[];total: number;}
      return this.service.getProducts(total, skip);
    }),
  );

  handlePageEvent(pageEvent: PageModel) {
    this.pageSize$.next(pageEvent.pageSize);
    this.skip$.next(pageEvent.pageIndex * pageEvent.pageSize);
  }
}
