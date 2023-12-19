export interface IPaymentPurchaseOrder {
  _id: string;
  shoppingCartId: string;
  shoppingCartNumber: number;
  number: string;
  amount: number;
  cartAmount: number;
  costCenter: string;
  fileId: string;
  originalName: string;
  contentType: string;
  username: string;
  createdAt: Date;
}
