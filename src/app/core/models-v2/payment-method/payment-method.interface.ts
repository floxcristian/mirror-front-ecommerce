export interface PaymentMethod {
  name: string;
  iconImage: string;
  code: string;
  active: boolean;
  order: number;
  paymentUrl: string;
}
