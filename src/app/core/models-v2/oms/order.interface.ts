export interface IOrdersResponse{
    total: number
    found: number
    limit: number
    page: number
    firstPage: number
    lastPage: number
    data: Iorder[]
}

export interface Iorder{
    trackingNumber: string
    cartNumber: string
    salesId: string
    warehouses: IWarehouse[]
    pickupBranch: IPickupBranch
    salesBranch: ISalesBranch
    seller: ISeller
    customer: ICustomer
    payment: IPayment
    shipping: IShipping
    products: IProduct[]
    status: IStatus
    trackingSummary: ITrackingSummary[]
    tracking: ITracking[]
    documents: IDocument[]
    salesOrigin: ISalesOrigin
    timestamps: ITimestamps
    expanded?:boolean
}

export interface IWarehouse {
    code: string
    name: string
    zone: string
}

export interface IPickupBranch {
    code: string
    name: string
    zone: string
}

export interface ISalesBranch {
    code: string
    name: string
    zone: string
}

export interface ISeller {
    documentType: string
    documentId: string
    name: string
}
export interface ICustomer {
    documentType: string
    documentId: string
    name: string
    notificationEmail: string
    notificationPhone: string
}

export interface IPayment {
    isPaid: boolean
    paymentCode: string
    paymentName: string
    invoiceType: string
    amount: number
    salesAmount: number
}

export interface IShipping {
    shippingType: string
    shippingCode: string
    shippingName: string
    carrierCode: string
    carrierName: string
    serviceType: string
    fullAddress: string
    address: string
    city: string
    province: string
    region: string
    regionCode: string
    country: string
    pickingDate: string
    requestedDate: string
}

export interface IProduct {
    detailId: string
    sku: string
    name: string
    preview: string
    deliveryType: string
    deliveryCode: string
    deliveryName: string
    quantity: number
    preparedQuantity: number
    canceledQuantity: number
    deliveredQuantity: number
    receptionQuantity: number
    price: number
    discount: number
    lineAmount: number
    iva: number
    ivaAmount: number
    total: number
    warehouse: string,
    origin?:string
}

export interface IStatus {
    trackingId: string
    status: string
    statusName: string
    substatus: string
    substatusName: string
    trackingDate: string
    user: string
    source: string
}

export interface ITrackingSummary {
    enabled: boolean
    order: number
    status: string
    statusName: string
    substatus: string
    substatusName: string
    trackingDate: string
}

export interface ITracking {
    trackingId: string
    status: string
    statusName: string
    substatus: string
    substatusName: string
    trackingDate: string
    user: string
    source: string
}

export interface IDocument {
    code: string
    type: string
    number: string
    observation: string
    source: string
    lineAmount: number
    iva: number
    ivaAmount: number
    total: number
    createdAt: string
}

export interface ISalesOrigin {
    code: string
    name: string
    channel: string
}
  
export interface ITimestamps {
    creationDate: string
    pickingDate: string
    requestedDate: string
    confirmedDate: string
    deliveryDate: string
    pickupDate: string
    receivedDate: string
}