// Angular
import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
// Third part
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
// Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
// Own dependencies
import { ResponseModel } from '../../../models/product.model';
import { ProductService } from '../../../services/product-service';
import { PageModel } from '../../../models/page.model';
// Own components
import { ProductCard } from '../../../components/product-card/product-card';
import { SearchInput } from '../../../components/search-input/search-input';

@Component({
  selector: 'app-product-list',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ProductCard,
    SearchInput,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly service = inject(ProductService);

  inputValue$ = new BehaviorSubject<string | null>('');
  pageSize$ = new BehaviorSubject<number>(15);
  pageIndex$ = new BehaviorSubject<number>(0);

  // LOGIC KEY:
  // Create an Observable as combination of BehaviourSubject
  response$: Observable<ResponseModel> = combineLatest([
    this.pageSize$,
    this.pageIndex$,
    this.inputValue$,
  ]).pipe(
    switchMap(([total, index, term]) => {
      // Return an Observable with ResponseModel value:
      // {products: ProductModel[];total: number;}
      return this.service.getProducts(total, index, term);
    }),
  );

  handleSearch(term: string | null) {
    // Reset pageIndex and pageSize
    this.pageSize$.next(15);
    this.pageIndex$.next(0);
    // Catch the output value from form-field
    this.inputValue$.next(term);
  }

  handlePageEvent(pageEvent: PageModel) {
    this.pageSize$.next(pageEvent.pageSize);
    this.pageIndex$.next(pageEvent.pageIndex);
  }
}
