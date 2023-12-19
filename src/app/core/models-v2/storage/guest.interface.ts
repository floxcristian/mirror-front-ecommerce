export interface IGuest {
  _id?: string;
  documentId: string;
  cartId?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryType?: 'DES' | 'RC';
  street: string;
  commune: string;
  completeComune?: string;
  number: string;
  department?: string;
}
