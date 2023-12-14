export interface IPaymentMethod {
  name: string;
  iconImage: string;
  code: string;
  active: boolean;
  order: number;
  paymentUrl: string;
}
