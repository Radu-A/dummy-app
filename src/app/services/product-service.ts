import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ProductModel, ResponseModel } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = 'https://dummyjson.com/products';
  httpClient = inject(HttpClient);

  getProducts(): Observable<ProductModel[]> {
    return (
      this.httpClient
        .get<ResponseModel>(this.baseUrl)
        // Products array are inside { "products": [...] }
        .pipe(map((response) => response.products))
    );
  }

  getProductById(): Observable<ProductModel> {
    return this.httpClient.get<ProductModel>(`${this.baseUrl}/1`);
  }
}
