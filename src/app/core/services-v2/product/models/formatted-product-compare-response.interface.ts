import { IProductCompare } from './product-compare-response.interface';

export type IComparedProduct = IProductCompare & { quantity: number };

export interface IFormmatedProductCompareResponse {
  products: IComparedProduct[];
  differences: IComparedAttribute[];
}

export interface IComparedAttribute {
  name: string;
  values: string[];
}
