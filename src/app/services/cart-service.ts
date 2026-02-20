import { inject, Injectable, signal } from '@angular/core';

import { CartProductModel, CartModel } from '../models/cart.model';

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

  getCart() {
    const dummyCart: CartModel = this.storageService.getItem('dummyCart');
    if (dummyCart && dummyCart.totalQuantity > 0 && dummyCart.products.length > 0) {
      this.cart.set(dummyCart);
    } else {
      this.storageService.removeItem('dummyCart');
    }
  }

  addProduct(product: CartProductModel) {
    const currentCart = this.cart();
    // CASE 0 - There is no session
    if (!this.sessionData$.value.data) return;
    // CASE 1 - Cart doesn't exists
    if (!currentCart) {
      this.cart.set({
        id: 1,
        // In real world, server takes id from JWT
        userId: this.sessionData$.value.data.id,
        products: [product],
        totalProducts: 1,
        totalQuantity: 1,
        // *** Fix
        total: product.price,
      });
    } else {
      // Search if product already exist in the cart
      const cartProduct: CartProductModel | undefined = currentCart.products.find(
        (cartProduct) => cartProduct.id === product.id,
      );
      // CASE 2 - There isn't this product in the cart
      if (!cartProduct) {
        this.cart.set({
          ...currentCart,
          products: [...currentCart.products, product],
          totalProducts: currentCart.totalProducts + 1,
          totalQuantity: currentCart.totalQuantity + 1,
          total: Number((currentCart.total + product.price).toFixed(2)),
        });
        // CASE 3 - There is already this product in the cart
      } else {
        const currentProducts = currentCart.products.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            // Update product quantity and product total
            cartProduct.quantity += 1;
            cartProduct.total = Number((cartProduct.total + cartProduct.price).toFixed(2));
          }
          return cartProduct;
        });
        this.cart.set({
          ...currentCart,
          products: currentProducts,
          totalQuantity: currentCart.totalQuantity + 1,
          total: Number((currentCart.total + product.price).toFixed(2)),
        });
      }
    }
    this.storageService.setItem('dummyCart', this.cart());
  }

  removeProduct(product: CartProductModel) {
    const currentCart = this.cart();
    // Check if cart doesn't exist
    if (!currentCart) return;
    // Check if product is in products array
    const isProduct = currentCart.products.find((cartProduct) => cartProduct.id === product.id);
    if (!isProduct) return;
    // CASE 1 - There is no products in cart or there is only this product
    if (currentCart.totalProducts <= 1 || currentCart.products.length === 0) {
      this.cart.set(null);
      this.storageService.removeItem('dummyCart');
      // CASE 2 - There is this product and anothers
    } else {
      const productsArray = currentCart.products.filter((cartProduct) => {
        return cartProduct.id !== product.id;
      });
      this.cart.set({
        ...currentCart,
        products: productsArray,
        totalProducts: currentCart.totalProducts - 1,
        totalQuantity: currentCart.totalQuantity - product.quantity,
        total: Number((currentCart.total - product.price).toFixed(2)),
      });
      this.storageService.setItem('dummyCart', this.cart());
    }
  }

  subtractProduct(product: CartProductModel) {
    const currentCart = this.cart();
    // Check if cart doesn't exist
    if (!currentCart) return;
    // Check if product is in products array
    const isProduct = currentCart.products.find((cartProduct) => cartProduct.id === product.id);
    if (!isProduct) return;
    // CASE 1 - It's the only product in cart
    // -> remove the entire cart
    if (currentCart.totalQuantity <= 1 || currentCart.products.length === 0) {
      this.cart.set(null);
      this.storageService.removeItem('dummyCart');
    } else {
      // CASE 2 - There are more than one unit of this product
      // -> substract one unit
      if (product.quantity > 1) {
        const productsArray = currentCart.products.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            // Update product quantity and product total
            cartProduct.quantity -= 1;
            cartProduct.total = cartProduct.total = Number(
              (cartProduct.total - cartProduct.price).toFixed(2),
            );
          }
          return cartProduct;
        });
        this.cart.set({
          ...currentCart,
          products: productsArray,
          totalQuantity: currentCart.totalQuantity - 1,
          total: Number((currentCart.total - product.price).toFixed(2)),
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
          total: Number((currentCart.total - product.price).toFixed(2)),
        });
      }
      this.storageService.setItem('dummyCart', this.cart());
    }
  }

  constructor() {
    this.getCart();
  }
}
