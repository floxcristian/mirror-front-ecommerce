export interface GetLogisticPromiseRequest {
  shoppingCartId?: string; //Specific cart, only open or pending, for OC payment
  user?: string;
  deliveryMode: string;
  destination: string;
  addressId: string;
  address: string;
}

export interface SetLogisticPromiseRequest {
  user: string;
  group: number;
  tripDate: number;
}
