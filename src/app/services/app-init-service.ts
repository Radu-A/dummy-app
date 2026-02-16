import { inject, Injectable } from '@angular/core';

import { AuthService } from './auth-service';
import { CartService } from './cart-service';

@Injectable({
  providedIn: 'root',
})
export class AppInitService {
  authService = inject(AuthService);
  cartService = inject(CartService);
  public init() {
    // Get user data from localStorage
    this.authService.loadUserState();
    // Get cart data from localStorage
    this.cartService.getCart();
  }
}
