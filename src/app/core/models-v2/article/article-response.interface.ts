import { IArticle } from '../cms/special-reponse.interface';

export interface CategoryDetail {
  _id: string;
  id: number;
  slug: string;
  level: number;
  parentId: number | null;
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
  value: any; // number??
}

export interface Barcode {
  code: string;
}

export interface IMatrixItem {
  sku: string;
}

export interface ILineBoss {
  name: string;
  phone: string;
}

export type IArticleResponse = IArticle & {
  assortment: number; //*
  attributes: Attribute[]; // *
  barcodes: Barcode[]; //*
  barcodesSearch: Barcode[]; // *
  categories: CategoryDetail[]; // *
  category: string; // *
  customerCodes: CustomerCode[]; // *
  dropshipment: number; // *
  dropshipmentType: string; // *
  filters: Filter[]; // *
  line: string; // *
  lineBossId: string; // *
  manufacturer: string; // *
  matrix: IMatrixItem[]; // *
  metaTags: MetaTag[]; // *
  partNumber: string; // *
  popularity: number; // *
  price: number; // *
  promotionDetails: PromotionDetail[]; // *
  salesQuantity: number; // *
  sbu: string; // *
  score: number; // *
  status: string; //*
  synonyms: string[];
  tags: string[]; // *
  visible: number; // *
  lineBoss: ILineBoss; //*
};
