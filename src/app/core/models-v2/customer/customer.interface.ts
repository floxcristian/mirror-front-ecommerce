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
  street: string;
  id: string;
  number: string;
  city: string;
  address: string;
  type: string;
  typeCode: number;
  location: string;
  lat: string;
  lng: string;
  departmentHouse: string;
  reference: string;
  country: string;
  region: string;
  regionCode: string;
  province: string;
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

export interface ICustomerCredit{
  assigned:number;
  used:number;
  balance:number;
}
