import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductModel, ResponseModel } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = 'https://dummyjson.com/products/search?q=';
  httpClient = inject(HttpClient);

  getProducts(total: number, skip: number, term: string | null): Observable<ResponseModel> {
    console.log(term);
    console.log(`${this.baseUrl}${term}&?limit=${total}&skip=${skip.toString()}`);

    // Return an Observable with ResponseModel value:
    // {products: ProductModel[];total: number;}
    return this.httpClient.get<ResponseModel>(
      `${this.baseUrl}${term}&?limit=${total}&skip=${skip.toString()}`,
    );
  }

  getProductById(id: number): Observable<ProductModel> {
    // Return an Observable with ProductModel value
    return this.httpClient.get<ProductModel>(`${this.baseUrl}/${id}`);
  }
}
