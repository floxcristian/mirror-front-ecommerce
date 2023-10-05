import { Product } from './product'

export interface ProductCart {
  _id?: string
  sku?: string
  marca?: string
  sucursalOrigen?: string
  cantidad?: number
  precio?: number
  peso?: string
  codDetalle?: number
  comboVenta?: number
  nombre: string
  image?: string
  conflictoEntrega?: boolean
  conflictoRetiro?: boolean
  entregas?: {
    despacho: boolean
    retiroTienda: boolean
  }
}

export interface CartData {
  correlativo?: number
  productos?: ProductCart[]
  despacho?: Shipping
  cliente?: ClientCart
  texto4?: String
  texto5?: String
  estado?: string
  tipo?: number
  numero?: number
  recid?: number
  estadoAX?: number
  formaPago?: string
  OrdenCompra?: string
  codigoBodega?: string
  _id?: string
  creacion?: string
  modificacion?: string
  usuario?: string
  invitado?: any
  codigoSucursal?: string
  observacion?: string
  options?: {
    name: string
    value: string
  }[]
  quantity: number
  subtotal?: number
  totals?: CartTotal[]
  total?: number
  grupos?: any
  sucursalPrecio?: string
}

export interface Shipping {
  tipo?: string
  codTipo?: string
  origen?: string
  recidDireccion?: number
  codProveedor?: string
  nombreProveedor?: string
  precio?: number
  descuento?: number
  observacion?: string
  diasNecesarios?: number
  fechaPicking?: string
  fechaEntrega?: string
  fechaDespacho?: string
}

export interface ClientCart {
  rutCliente?: string
  recidCliente?: number
  recidFacturacion?: number
}

export interface CartTotal {
  title?: string
  price?: number
  type?: 'shipping' | 'fee' | 'tax' | 'other' | 'discount'
}
