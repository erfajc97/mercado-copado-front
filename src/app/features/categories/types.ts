export interface Category {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
  subcategories?: Array<{
    id: string
    name: string
  }>
  _count?: {
    products?: number
  }
}
