export interface ProductModel {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  thumbnail: string;
  images: [string];
}

export interface ProductStateModel {
  loading: boolean;
  data: ProductModel | null;
  error: string | null;
}

export interface ListStateModel {
  loading: boolean;
  data: ProductModel[] | null;
  error: string | null;
}

export interface ResponseModel {
  products: ProductModel[];
  total: number;
}
