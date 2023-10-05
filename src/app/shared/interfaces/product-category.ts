export interface ProductCategory {
  id: number
  name: string
  slug: string
  level: number
  url: string
  image: string
  on_header: boolean
  parent_id: number
  created_at: Date
  updated_at: Date
}
