export interface ProductPrice {
  price: number;
  branch?: string;
  commonPrice?: number;
  scalePrice: boolean;
  documentId?: string;
  fromQuantity?: string;
  toQuantity?: string;
}
