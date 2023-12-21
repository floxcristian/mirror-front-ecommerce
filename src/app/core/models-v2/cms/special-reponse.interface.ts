import { IShoppingCartProductOrigin } from '../cart/shopping-cart.interface';

export interface ISpecialResponse {
  banners: IBanner[];
  specials: ISpecial[];
  data: IData[];
  total: number;
}

export interface ISpecial {
  _id: string;
  active: boolean;
  title: string;
  slug: string;
  order: number;
  expirationDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface IBanner {
  _id: string;
  active: boolean;
  position: string;
  order: number;
  url: string;
  title: string;
  alt: string;
  target: string;
  imageFull: string;
  imageTablet: string;
  imageMobile: string;
  expirationDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface IData {
  title: string;
  order: number;
  articles: IArticle[];
  total: number;
}

export interface IArticle {
  sku: string; // +
  name: string; // +
  brand: string; // +
  minimumPrice: number; // +
  images: IImage; // +
  priceInfo: IPriceInfo; // +
  deliverySupply: IDeliverySupply; // ?
  stockSummary: IStockSummary; // +
  origin: IShoppingCartProductOrigin; // +
  cyber: number; // +
  // No se usa..
  description: string; // +
}

export interface IImage {
  '150': string[];
  '250': string[];
  '450': string[];
  '600': string[];
  '1000': string[];
  '2000': string[];
}

export interface IPriceInfo {
  sku: string; //
  minimumPrice: number; //
  sellerMinimumPrice: number; //
  hasScalePrice: boolean; //
  scalePrice: IScalePrice[]; //
  discount: number;
  comments: string[];
  documentId: string;

  price: number;
  netPrice: number;
  customerPrice: number;
  commonPrice: number;
  commonNetPrice: number;
}

export interface IScalePrice {
  fromQuantity: number;
  toQuantity: number;
  price: number;
}

export interface IDeliverySupply {
  sku: string;
  deliveryLocation: string | null;
  deliveryBusinessDays: number | null;
  deliveryWarehouse: string | null;
  deliveryDate: string | null;
  deliveryIsToday: boolean | null;
  pickupLocation: string | null;
  pickupBusinessDays: number | null;
  pickupWarehouse: string | null;
  pickupDate: string | null;
  pickupIsToday: boolean | null;
}

export interface IStockSummary {
  sku: string;
  companyStock: number;
  branchStock: number;
  stocks: IStock[];
}

export interface IStock {
  branchCode: string;
  quantity: number;
}
