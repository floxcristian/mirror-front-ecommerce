export interface ICustomer {
  documentId: string;
  emails: ICustomerEmail[];
  name: string;
  phones: ICustomerPhone[];
  addresses: ICustomerAddress[];
  businessLines: ICustomerBusinessLine[];
  contacts: ICustomerContact[];
  costCenters: ICustomerCostCenter[];
  createdAt: Date;
  updatedAt: Date;
  useCredit: boolean;
}

export interface ICustomerEmail {
  email: string;
}

export interface ICustomerPhone {
  phone: string;
}

export interface ICustomerAddress {
  address: string;
  city: string;
  country: string;
  departmentHouse: string;
  id: string;
  lat: string;
  lng: string;
  location: string;
  number: string;
  province: string;
  reference: string;
  region: string;
  street: string;
  type: string;
  typeCode: number;
  regionCode?: string;
}

export interface ICustomerBusinessLine {
  code: string;
  name: string;
}

export interface ICustomerContact {
  documentId: string | null;
  name: string;
  lastName: string;
  contactType: string;
  id: string;
  phone: string;
  email: string;
  position: string | null;
}

export interface ICustomerCostCenter {
  code: string;
  name: string;
}

export interface ICustomerCredit {
  assigned: number;
  used: number;
  balance: number;
}

export interface ICustomerPriceListResponse {
  total: number;
  found: number;
  limit: number;
  page: number;
  firstPage: number;
  lastPage: number;
  data: IArticlePrice[];
}

export interface IArticlePrice {
  identifier: string;
  sku: string;
  name: string;
  brand: string;
  preview: string;
  price: number;
  commonPrice: number;
  discount: number;
  customerCode: string;
  priceBruto?:number;
  commonPriceBruto?:number
}
