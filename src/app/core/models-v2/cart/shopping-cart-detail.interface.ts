import { IShoppingCart } from './shopping-cart.interface';
import { ITotals } from './totals.interface';

export interface IShoppingCartDetail {
  shoppingCart: IShoppingCart;
  total: number;
  totals: ITotals;
}
