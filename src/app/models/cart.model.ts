export interface CartProduct {
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
  products: CartProduct[];
  totalProducts: number;
  totalQuantity: number;
  total: number;
}
