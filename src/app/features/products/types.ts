export interface Product {
  id: string
  name: string
  description: string
  price: number
  discount: number
  categoryId: string
  subcategoryId: string
  category: {
    id: string
    name: string
  }
  subcategory: {
    id: string
    name: string
  }
  images: Array<{
    id: string
    url: string
    order: number
  }>
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  categoryId?: string
  subcategoryId?: string
  search?: string
}

