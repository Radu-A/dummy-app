export interface ProductModel {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
  images: [string];
}

export interface ProductStateModel {
  loading: boolean;
  data: ProductModel | null;
  error: string | null;
}
