import { ICustomerAddress } from '@core/models-v2/customer/customer.interface';

export interface ICustomerPreference {
  deliveryAddress: ICustomerAddress | null;
  //centroCosto?: string | null;
  //numeroSolicitud?: string | null;
}
