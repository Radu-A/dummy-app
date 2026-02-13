import { inject, Injectable, signal } from '@angular/core';

import { CartProduct, CartModel } from '../models/cart.model';
import { ProductModel } from '../models/product.model';

import { StorageService } from './storage-service';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  storageService = inject(StorageService);
  authService = inject(AuthService);

  cart = signal<CartModel | null>(null);

  sessionData$ = this.authService.sessionData$;

  addProduct(product: ProductModel) {
    const addedProduct: CartProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      total: 1,
      thumbnail: product.thumbnail,
    };
    const currentCart = this.cart();
    // CASE 0 - There is no session
    if (!this.sessionData$.value.data) return;
    // CASE 1 - Cart doesn't exists
    if (!currentCart) {
      this.cart.set({
        id: 1,
        // In real world, server takes id from JWT
        userId: this.sessionData$.value.data.id,
        products: [addedProduct],
        totalProducts: 1,
        totalQuantity: 1,
        total: product.price,
      });
    } else {
      // Search if product already exist in the cart
      const cartProduct: CartProduct | undefined = currentCart.products.find(
        (cartProduct) => cartProduct.id === product.id,
      );
      // CASE 2 - There isn't this product in the cart
      if (!cartProduct) {
        this.cart.set({
          ...currentCart,
          products: [...currentCart.products, addedProduct],
          totalProducts: currentCart.totalProducts + 1,
          totalQuantity: currentCart.totalQuantity + 1,
          total: currentCart.total + product.price,
        });
        // CASE 3 - There is already this product in the cart
      } else {
        const currentProducts = currentCart.products.map((cartProduct) => {
          if (cartProduct.id === product.id) cartProduct.quantity += 1;
          return cartProduct;
        });
        this.cart.set({
          ...currentCart,
          products: currentProducts,
          totalProducts: currentCart.totalProducts + 1,
          totalQuantity: currentCart.totalQuantity + 1,
          total: currentCart.total + product.price * 1,
        });
      }
    }
    this.storageService.setItem('dummyCart', this.cart());
  }

  removeProduct(product: CartProduct) {
    const currentCart = this.cart();
    if (!currentCart) return;
    // Check if product is in products array
    if (!currentCart.products[product.id]) return;

    // CASE 1 - It's the only product in cart
    // -> remove the entire cart
    if (currentCart.totalQuantity <= 1) {
      this.cart.set(null);
      this.storageService.removeItem('dummyCart');
    } else {
      // CASE 2 - There are more than one unit of this product
      // -> substract one unit
      if (product.quantity > 1) {
        const productsArray = currentCart.products.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            cartProduct.quantity -= 1;
          }
          return cartProduct;
        });
        this.cart.set({
          ...currentCart,
          products: productsArray,
          totalProducts: currentCart.totalProducts - 1,
          totalQuantity: currentCart.totalQuantity - 1,
          total: currentCart.total - product.price,
        });
        // CASE 3 - There is only one unit of this product
        // -> remove the product from cart
      } else {
        const productsArray = currentCart.products.filter((cartProduct) => {
          return cartProduct.id !== product.id;
        });
        this.cart.set({
          ...currentCart,
          products: productsArray,
          totalProducts: currentCart.totalProducts - 1,
          totalQuantity: currentCart.totalQuantity - 1,
          total: currentCart.total - product.price,
        });
      }
      this.storageService.setItem('dummyCart', this.cart());
    }
  }
}
