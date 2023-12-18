export interface IPreference {
  iva: boolean;
  deliveryAddress?: IDeliveryAddress;
  costCenter?: string;
}

export interface IDeliveryAddress {
  city: string;
}
