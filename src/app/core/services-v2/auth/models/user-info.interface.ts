import { ICustomer } from '../../../models-v2/customer/customer.interface';
import { IEcommerceUser } from '../../../models-v2/auth/user.interface';

export interface IUserDetail {
  user: IEcommerceUser;
  customer: ICustomer;
}
