import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.development';

import { ProductModel, ResponseModel } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productsUrl = `${environment.apiUrl}/auth/products/search?q=`;
  oneProductUrl = `${environment.apiUrl}/auth/products/`;
  httpClient = inject(HttpClient);

  getProducts(total: number, index: number, term: string | null): Observable<ResponseModel> {
    const skip = total * index;
    // Return an Observable with ResponseModel value:
    // {products: ProductModel[];total: number;}
    return this.httpClient.get<ResponseModel>(
      `${this.productsUrl}${term}&limit=${total}&skip=${skip.toString()}`,
    );
  }

  getProductById(id: number): Observable<ProductModel> {
    // Return an Observable with ProductModel value
    return this.httpClient.get<ProductModel>(`${this.oneProductUrl}${id}`);
  }
}
