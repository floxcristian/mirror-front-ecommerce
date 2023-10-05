export interface CategoryApi {
  id?: string
  title: string
  url: string
  products?: number
  image?: string
  children?: CategoryApi[]
}

export interface CategoryListMenu {
  categoriaId: number
  nombre: string
  count: number
  lineas: Linea[]
}

export interface Linea {
  id: number
  nombre: string
  count: number
}

export interface CategoryMenuSimple {
  id?: string
  nombre: string
  url?: string
}

export interface CategoryColumn {
  columns: CategoryMenuSimple[]
}
