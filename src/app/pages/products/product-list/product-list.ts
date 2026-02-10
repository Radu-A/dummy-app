// Angular
import { Component, effect, inject, model } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// Third part
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
// Material
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
// Own dependencies
import { ResponseModel, ParametersModel } from '../../../models/product.model';
import { PageModel } from '../../../models/page.model';
import { ProductService } from '../../../services/product-service';
import { StorageService } from '../../../services/storage-service';
import { LoadingService } from './../../../services/loading-service';
import { ErrorService } from '../../../services/error-service';
// Own components
import { SearchInput } from '../../../components/search-input/search-input';
import { ProductGrid } from '../../../components/product-grid/product-grid';
import { ProductListing } from '../../../components/product-listing/product-listing';
import { ToggleButton } from '../../../components/toggle-button/toggle-button';
import { MessageModal } from '../../../components/message-modal/message-modal';

@Component({
  selector: 'app-product-list',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    SearchInput,
    ProductGrid,
    ProductListing,
    ToggleButton,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly productService = inject(ProductService);
  private readonly storageService = inject(StorageService);
  loadingService = inject(LoadingService);
  errorService = inject(ErrorService);
  private dialog = inject(MatDialog);

  // Two-way binding with "isTrue" in toggle-button
  isGrid = model(true);

  // Search parameters
  pageSize$ = new BehaviorSubject<number>(15);
  pageIndex$ = new BehaviorSubject<number>(0);
  inputValue$ = new BehaviorSubject<string | null>('');

  // ===========
  // KEY LOGIC!!
  // ===========
  // Create an Observable as combination of BehaviourSubjects
  response$: Observable<ResponseModel> = combineLatest([
    this.pageSize$,
    this.pageIndex$,
    this.inputValue$,
  ]).pipe(
    switchMap(([total, index, term]) => {
      // Return an Observable with ResponseModel value:
      // {products: ProductModel[];total: number;}
      return this.productService.getProducts(total, index, term);
    }),
  );

  toggleView(outputValue: boolean) {
    // The change is effective inside toggle-button
    // (two-way binding)
    this.isGrid.set(outputValue);
  }

  handleSearch(term: string | null) {
    // Reset pageIndex and pageSize
    this.pageSize$.next(15);
    this.pageIndex$.next(0);
    // Catch the output value from form-field
    this.inputValue$.next(term);
    // Save parameters in local storage
    const parameters = {
      pageSize: this.pageSize$.value,
      pageIndex: this.pageIndex$.value,
      inputValue: this.inputValue$.value,
      isGrid: this.isGrid(),
    };
    this.storageService.setItem('dummyParams', parameters);
  }

  handlePageEvent(pageEvent: PageModel) {
    // Save pageIndex and pageSize
    this.pageSize$.next(pageEvent.pageSize);
    this.pageIndex$.next(pageEvent.pageIndex);
    // Save parameters in local storage
    const parameters = {
      pageSize: this.pageSize$.value,
      pageIndex: this.pageIndex$.value,
      inputValue: this.inputValue$.value,
      isGrid: this.isGrid(),
    };
    this.storageService.setItem('dummyParams', parameters);
  }

  // Check on localStorage if there is search parameters
  checkParameters() {
    const parameters: ParametersModel = this.storageService.getItem('dummyParams');
    if (parameters) {
      const { pageSize, pageIndex, inputValue, isGrid } = parameters;
      this.pageSize$.next(pageSize);
      this.pageIndex$.next(pageIndex);
      this.inputValue$.next(inputValue);
      this.isGrid.set(isGrid);
    }
  }

  constructor() {
    // "effect" react to signal changes and execute his snippet
    effect(() => {
      const isLoading = this.loadingService.isLoading();
      if (isLoading) {
        this.dialog.open(MessageModal, {
          data: { message: 'Loading content...' },
        });
      } else {
        this.dialog.closeAll();
      }
    });
    effect(() => {
      const isError = this.errorService.isError();
      const errorMessage = this.errorService.errorMessage();
      if (isError) {
        this.dialog.open(MessageModal, {
          data: { message: errorMessage },
        });
      } else {
        this.dialog.closeAll();
      }
    });
  }

  ngOnInit() {
    // checkParameters not working yet
    this.checkParameters();
  }
}
