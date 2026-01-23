// Angular
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
// Third part
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  switchMap,
  debounceTime,
  startWith,
  distinctUntilChanged,
} from 'rxjs';
// Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
// Own dependencies
import { ResponseModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product-service';
import { PageModel } from '../../../models/page.model';
// Own components
import { ProductCard } from '../../../components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatPaginatorModule,
    ProductCard,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly service = inject(ProductService);
  searchInput = new FormControl('');

  private inputValue$ = this.searchInput.valueChanges.pipe(
    startWith(''),
    debounceTime(1000),
    distinctUntilChanged(),
  );
  // BehaviourSubject for pageSize
  private pageSize$ = new BehaviorSubject<number>(15);
  // BehaviourSubject for skip number
  private skip$ = new BehaviorSubject<number>(0);

  // LOGIC KEY:
  // Create an Observable as combination of BehaviourSubject
  response$: Observable<ResponseModel> = combineLatest([
    this.pageSize$,
    this.skip$,
    this.inputValue$,
  ]).pipe(
    switchMap(([total, skip, term]) => {
      // Return an Observable with ResponseModel value:
      // {products: ProductModel[];total: number;}
      return this.service.getProducts(total, skip, term);
    }),
  );

  handlePageEvent(pageEvent: PageModel) {
    this.pageSize$.next(pageEvent.pageSize);
    this.skip$.next(pageEvent.pageIndex * pageEvent.pageSize);
  }
}
