import { ICustomer } from '../customer/customer.interface';
import { IEcommerceUser } from './user.interface';

export interface IUserInfo {
  user: IEcommerceUser;
  customer: ICustomer;
}
