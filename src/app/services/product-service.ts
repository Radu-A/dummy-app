import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductModel, ResponseModel } from '../models/product.model';

import { RestService } from './rest-service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  httpClient = inject(HttpClient);
  restService = inject(RestService);

  getProducts(total: number, index: number, term: string | null): Observable<ResponseModel> {
    const skip = total * index;
    return this.restService.getProducts(total, skip, term);
  }

  getProductById(id: number): Observable<ProductModel> {
    return this.restService.getProductById(id);
  }
}
