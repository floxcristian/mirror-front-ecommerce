export interface ImageArticle {
  '150': string[];
  '250': string[];
  '450': string[];
  '600': string[];
  '1000': string[];
  '2000': string[];
}

export interface CategoryDetail {
  id: number;
  slug: string;
  level: number;
  parentId: number;
  url: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attribute {
  name: string;
  value: string;
}

export interface Filter {
  name: string;
  order: number;
  value: string;
}

export interface PromotionDetail {
  name: string;
  promotionId: string;
  skus: string[];
  type: string;
  validTo: string;
}

export interface CustomerCode {
  code: string;
  documentId: string;
}

export interface MetaTag {
  code: string;
  value: any;
}

export interface PriceInfo {
  comments: string[];
  commonPrice: number;
  customerPrice: number;
  discount: number;
  documentId: string;
  hasScalePrice: boolean;
  minimumPrice: number;
  netPrice: number;
  price: number;
  scalePrice: any[];
  sellerMinimumPrice: number;
  sku: string;
}

export interface DeliverySupply {
  sku: string;
  deliveryLocation: string;
  deliveryBusinessDays: number;
  deliveryWarehouse: string;
  deliveryDate: string;
  deliveryIsToday: boolean;
  pickupLocation: string;
  pickupBusinessDays: number;
  pickupWarehouse: string;
  pickupDate: string;
  pickupIsToday: boolean;
}

export interface StockSummary {
  sku: string;
  companyStock: number;
  branchStock: number;
  stocks: {
    branchCode: string;
    quantity: number;
  }[];
}

export interface Barcode {
  code: string;
}

export interface IArticleResponse {
  assortment: number;
  attributes: Attribute[];
  barcodes: Barcode[];
  barcodesSearch: Barcode[];
  brand: string;
  categories: CategoryDetail[];
  category: string;
  customerCodes: CustomerCode[];
  deliverySupply: DeliverySupply;
  description: string;
  dropshipment: number;
  dropshipmentType: string;
  filters: Filter[];
  images: ImageArticle[];
  line: string;
  lineBossId: string;
  manufacturer: string;
  matrix: string[];
  metaTags: MetaTag[];
  minimumPrice: number;
  name: string;
  partNumber: string;
  popularity: number;
  price: number;
  priceInfo: PriceInfo;
  promotionDetails: PromotionDetail[];
  salesQuantity: number;
  sbu: string;
  score: number;
  sku: string;
  status: string;
  stockSummary: StockSummary;
  synonyms: string[];
  tags: string[];
  visible: number;
}
