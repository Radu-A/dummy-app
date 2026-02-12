import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../environments/environment.development';

import { ProductModel, ResponseModel } from '../models/product.model';
import { Observable } from 'rxjs';
import { UserDataModel } from '../models/user.model';
import { RefreshResponseModel } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  // auth urls
  loginUrl = `${environment.apiUrl}/auth/login`;
  refreshUrl = `${environment.apiUrl}/auth/refresh`;
  // products urls
  productsUrl = `${environment.apiUrl}/auth/products/search?q=`;
  oneProductUrl = `${environment.apiUrl}/auth/products/`;

  http = inject(HttpClient);

  getProducts(total: number, skip: number, term: string | null): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(
      `${this.productsUrl}${term}&limit=${total}&skip=${skip.toString()}`,
    );
  }

  getProductById(id: number): Observable<ProductModel> {
    // Return an Observable with ProductModel value
    return this.http.get<ProductModel>(`${this.oneProductUrl}${id}`);
  }

  login(body: Record<string, any>) {
    return this.http.post<UserDataModel>(this.loginUrl, body);
  }

  refreshToken(body: Record<string, any>) {
    return this.http.post<RefreshResponseModel>(this.refreshUrl, body);
  }
}
