import { IShoppingCart } from './shopping-cart.interface';

export interface ITagMarkResponse {
  marked: boolean;
  shoppingCart: IShoppingCart;
}
