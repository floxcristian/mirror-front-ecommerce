export interface GetLogisticPromiseRequest {
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
