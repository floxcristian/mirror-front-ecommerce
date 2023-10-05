export interface ComentarioArticulo {
  sku: string
  calificacion: number
  titulo?: string
  comentario?: string
  recomienda?: boolean | null
  nombre: string
  correo: string
  username?: string
  createdAt?: string
  updatedAt?: string

  tiempo?: number | string
  unidadTiempo?: string
}

export interface ResumenComentario {
  cantidad: number
  estrellas: number
  porcentaje?: number
}
