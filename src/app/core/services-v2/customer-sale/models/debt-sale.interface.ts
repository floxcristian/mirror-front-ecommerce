export interface IDebtSales {
  dueCustomerSales: ICustomerSale[];
  overdueCustomerSales: ICustomerSale[];
  totalDueAmount: number;
  totalOverdueAmount: number;
}

export interface ICustomerSale{
  invoiceId: string
  code: string
  internalCode: string
  type: string
  canDownload: boolean
  salesId: string
  invoiceNumber: string
  observation: string
  invoiceDate: string
  year: number
  month: number
  day: number
  salesOrigin: string
  paymentMethod: string
  customer: ICustomer
  purchaseOrder: string
  lineAmount: number
  iva: number
  ivaAmount: number
  total: number
  duePaidAmount: number
  dueBalanceAmount: number
  dueDate: string
  related: any[] // no viene por ahora.
  seller: ISeller
  branch: string
  branchZone: string
  details: IDetail[]
  createdAt: string
  updatedAt: string
  check?:boolean // se agrega para obtener el check de la tabla
  status?:'VENCIDA' | 'PENDIENTE' // se agrega estado
  days?:number // se agrega para obtener dias vencidos
}

export interface ICustomer {
  documentId: string
  name: string
}

export interface ISeller {
  documentId: string
  name: string
}

export interface IDetail {
  detailId: string
  sku: string
  name: string
  line: string
  category: string
  sbu: string
  brand: string
  quantity: number
  netPrice: number
  price: number
  lineAmount: number
  iva: number
  ivaAmount: number
  total: number
  preview: string
  images: IImage
}

export interface IImage {
  "150": string[]
  "250": string[]
  "450": string[]
  "600": string[]
  "1000": string[]
  "2000": string[]
}
