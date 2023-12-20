import { IShoppingCart } from './shopping-cart.interface';

export interface IThanksForYourPurchase {
  isFirstVisit: boolean;
  shoppingCart: IShoppingCart;
}
