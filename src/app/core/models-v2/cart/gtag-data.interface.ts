import { IShoppingCart } from './shopping-cart.interface';

export interface IGtagDataResponse {
  data: IGtagData[];
  shoppingCart: IShoppingCart;
  shoppingCarts: IShoppingCart[];
  total: number;
  totals: number;
}

export interface IGtagData {
  purchase: {
    actionField: {
      id: string;
      affiliation: string;
      revenue: number;
      tax: number;
      shipping: number;
    };
    products: IGtagProduct[];
  };
}

export interface IGtagProduct {
  name: string;
  id: string;
  price: number;
  brand: string;
  category: string;
  quantity: number;
}
