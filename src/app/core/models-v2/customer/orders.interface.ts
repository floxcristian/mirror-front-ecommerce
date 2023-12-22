export interface IOrders {
  invoiceId: string;
  code: string;
  internalCode: string;
  type: string;
  canDownload: boolean;
  salesId: string;
  invoiceNumber: string;
  observation: string;
  invoiceDate: string;
  year: number;
  month: number;
  day: number;
  salesOrigin: string;
  paymentMethod: string;
  customer: ICustomer;
  purchaseOrder: string;
  lineAmount: number;
  iva: number;
  ivaAmount: number;
  total: number;
  duePaidAmount: number;
  dueBalanceAmount: number;
  dueDate: string;
  related: IRelatedInvoice[];
  seller: IPerson;
  branch: string;
  branchZone: string;
  details: IDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface ICustomer {
  documentId: string;
  name: string;
}

export interface IRelatedInvoice {
  invoiceId: string;
  salesId: string;
  type: string;
  invoiceNumber: string;
}

export interface IPerson {
  documentId: string;
  name: string;
}

export interface IDetail {
  detailId: string;
  sku: string;
  name: string;
  line: string;
  category: string;
  sbu: string;
  brand: string;
  quantity: number;
  netPrice: number;
  price: number;
  lineAmount: number;
  iva: number;
  ivaAmount: number;
  total: number;
  preview: string;
  images: { [key: string]: string[] };
}
