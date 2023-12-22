export interface IWishlistResponse {
  documentId: string;
  articleList: IWishlist[];
}

export interface IWishlist {
  id: string;
  name: string;
  default: boolean;
  articles: IProductWishlist[];
}

export interface IProductWishlist {
  name: string;
  preview: string;
  sku: string;
  customerCodes?: ICustomerCode[];
}

export interface ICustomerCode {
  code: string;
  documentId: string;
}
