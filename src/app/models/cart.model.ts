export interface CartProductModel {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  thumbnail: string;
}

export interface CartModel {
  id: number;
  userId: number;
  products: CartProductModel[];
  totalProducts: number;
  totalQuantity: number;
  total: number;
}
