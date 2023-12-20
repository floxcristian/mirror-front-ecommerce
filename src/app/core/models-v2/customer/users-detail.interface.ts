import { IEcommerceUser } from '../auth/user.interface';
import { ICustomer } from './customer.interface';

export interface IUsersDetail {
  found: boolean;
  users: IEcommerceUser[];
  customer?: ICustomer;
}
