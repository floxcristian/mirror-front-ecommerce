export interface Cliente {
  vendedores: Vendedor[]
  vendedor_cliente: Vendedor[]
  documento_cobros: DocumentoCobro[]
  _id: string
  rut: string
  clasificacionFinanciera: string
  tipoCartera: string
  ciudad: string
  provincia: string
  clasificacion: string
  condicionPago: string
  credito: number
  creditoUtilizado: number
  formaPago: string
  giros: Giro[]
  nombre: string
  segmento?: string
  subSegmento?: string
  correos?: Correo[]
  telefonos?: any
  direcciones?: Direccion[]
  clasificacionCLPot: string
  estado: string
  contactos: Contacto[]
  createdAt: string
  updatedAt: string
  tipo_cliente: number
  recid: number
  CAT_FUGA: string
  recomendacionClienteObject: RecomendacionClienteObject[]
  transforma_recomendacion: boolean
  cod_region?: string
  creditoM?: number
  ventaM?: number
  latitud?: number
  longitud?: number
  distancia?: number
  oportunidades?: number
  // chats?: Chat[];
}

export interface RecomendacionClienteObject {
  cluster: number
  rut: string
  producto: string
  probabilidad: number
  tipo: number
  articulosObject: ArticuloObject[]
}

export interface ArticuloObject {
  _id: string
  sku: string
  categoria: string
  linea: string
  marca: string
  nombre: string
  numero_parte: string
  uen: string
  unit_id: string
}

export interface Contacto {
  contactRut: string
  nombre: string
  apellido: string
  cargo: string
  contactoDe: string
  correo?: string
  contactoId: string
  telefono?: string

  noBorder?: boolean
}

export interface ContactoDatosAgrupados {
  key: string
  contactoId: string
  nombre: string
  apellido: string
  contactoDe: string
  correos?: string[]
  telefonos?: string[]
}

export interface Direccion {
  recid?: number
  calle: string
  comuna: string
  direccionCompleta: string
  tipo: string
  numero?: string
  deptocasa?: string
  referencia?: string
  localidad: string
  lat?: any
  lng?: any
}

export interface Correo {
  correo: string
}

export interface Giro {
  codigo: string
  nombre: string
}

export interface Segmento {
  codigo: string
  nombre: string
}
export interface Subsegmento {
  codigo: string
  nombre: string
}

export interface DocumentoCobro {
  tienda: string
  nota_venta: string
  folio: string
  fechaCreacion: string
  fechaVencimiento: string
  monto: number
  abono: number
  saldo: number
  estado: string
  days?: number
}

export interface Vendedor {
  _id: number
  clasificacion: string
  nombre: string
}
