import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ProductModel } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = 'https://dummyjson.com/products';
  httpClient = inject(HttpClient);
  getProductById(): Observable<ProductModel> {
    return this.httpClient.get<ProductModel>(`${this.baseUrl}/1`);
  }
}
