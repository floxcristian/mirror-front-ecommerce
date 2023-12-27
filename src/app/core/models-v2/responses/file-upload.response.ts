import { IImage } from "../cms/special-reponse.interface";


export interface IDeliveryOptions {
  homeDelivery: boolean;
  pickup: boolean;
}

export interface IArticleUpload{
  num: number;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  commonPrice: number;
  iva: number;
  weight: number;
  brand: string;
  detailId: string;
  origin: string | null;
  images: IImage;
  delivery: IDeliveryOptions;
  addedAt: string;
  lading: boolean;
}

export interface IData {
  products: IArticleUpload[];
}

export interface ISavedCart {
  saved: boolean;
  quantity: number;
}

export interface IUploadResponse {
  savedCart: ISavedCart;
  productsNotFound: any[];
  data: IData;
}
