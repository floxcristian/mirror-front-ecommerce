import { IProductCompare } from './product-compare-response.interface';

export type IProductCompared = IProductCompare & { quantity: number };

export interface IFormmatedProductCompareResponse {
  products: IProductCompared[];
  differences: IAttributeCompared[];
}

export interface IAttributeCompared {
  name: string;
  values: string[];
}
