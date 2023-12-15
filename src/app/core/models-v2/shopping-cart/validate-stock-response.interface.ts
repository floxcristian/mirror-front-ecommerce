export interface IValidateShoppingCartStockResponse {
  stockProblem: boolean;
  stockProblemLines: IValidateShoppingCartStockLineResponse[];
}

export interface IValidateShoppingCartStockLineResponse {
  num: number;
  detailId: number;
  sku: string;
  name: string;
  brand?: string;
  quantity: number;
  price: number;
  commonPrice: number;
  origin: {
    origin: string;
    subOrigin: string;
    section: string;
    recommended: string;
    sheet: boolean;
    cyber: number;
  };
  images: {
    '150': string[];
    '250': string[];
    '450': string[];
    '600': string[];
    '1000': string[];
    '2000': string[];
  };
  addedAt: Date;
  deliveryConflict?: boolean;
  pickupConflict?: boolean;
  delivery: {
    homeDelivery: boolean;
    pickup: boolean;
  };
  weight: number;
  lading: boolean;
}
