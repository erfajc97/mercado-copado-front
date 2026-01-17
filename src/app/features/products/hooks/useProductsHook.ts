import { useMemo } from 'react'
import { useProductsQuery } from '../queries/useProductsQuery'
import type { Category } from '@/app/features/categories/types'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'
import { useCurrency } from '@/app/hooks/useCurrency'
import { formatUSD } from '@/app/services/currencyService'
import { extractItems, extractPagination } from '@/app/helpers/parsePaginatedResponse'
import { useProductsStore } from '@/app/store/products/productsStore'
import {
  useDeleteProductMutation,
  useUpdateProductMutation,
} from '@/app/features/products/mutations/useProductMutations'

export const useProductsHook = () => {
  const {
    searchText,
    categoryFilter,
    subcategoryFilter,
    priceFilter,
    statusFilter,
    currentPage,
    pageSize,
    setSearchText,
    setCategoryFilter,
    setSubcategoryFilter,
    setPriceFilter,
    setStatusFilter,
    setCurrentPage,
    setPageSize,
    setProductToDelete,
    setDeleteModalVisible,
    setProductToEdit,
    setProductModalOpen,
  } = useProductsStore()

  // Determinar si incluir inactivos basado en el filtro de estado
  const includeInactive = statusFilter === 'all' || statusFilter === 'inactive'

  const { data: productsData, isLoading } = useProductsQuery({
    search: searchText || undefined,
    categoryId: categoryFilter || undefined,
    subcategoryId: subcategoryFilter || undefined,
    includeInactive: includeInactive,
    page: currentPage,
    limit: pageSize,
  })

  const { data: categoriesData } = useAllCategoriesQuery()
  const categories = extractItems(categoriesData) as Array<Category>
  const { mutateAsync: deleteProduct } = useDeleteProductMutation()
  const { mutateAsync: updateProduct } = useUpdateProductMutation()
  const { formatPrice, currency } = useCurrency()

  // Extraer productos y paginación de la respuesta usando helpers
  const products = useMemo(() => {
    if (!productsData) return []
    return extractItems(productsData)
  }, [productsData])

  const pagination = useMemo(() => {
    if (!productsData) return undefined
    return extractPagination(productsData)
  }, [productsData])

  const totalPages = pagination?.totalPages || 1
  const totalProducts = pagination?.total || products.length

  const subcategories = useMemo(() => {
    if (!categoryFilter) return []
    const category = categories.find((cat) => cat.id === categoryFilter)
    return category?.subcategories || []
  }, [categoryFilter, categories])

  // Filtrar por precio localmente (no está en el backend)
  const filteredProducts = useMemo(() => {
    if (products.length === 0) return []

    if (!priceFilter) return products

    return products.filter((product: any) => {
      const productPrice = Number(product.price)
      switch (priceFilter) {
        case '0-50':
          return productPrice >= 0 && productPrice <= 50
        case '50-100':
          return productPrice > 50 && productPrice <= 100
        case '100-200':
          return productPrice > 100 && productPrice <= 200
        case '200+':
          return productPrice > 200
        default:
          return true
      }
    })
  }, [products, priceFilter])

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setDeleteModalVisible(true)
  }

  const handleEditClick = (productId: string) => {
    setProductToEdit(productId)
    setProductModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    const store = useProductsStore.getState()
    if (store.productToDelete) {
      await deleteProduct(store.productToDelete)
      store.setDeleteModalVisible(false)
      store.setProductToDelete(null)
    }
  }

  const handleToggleActive = async (product: any) => {
    try {
      const currentProduct = products.find((p: any) => p.id === product.id) as any
      const currentStatus = currentProduct?.isActive ?? product.isActive
      const newStatus = !currentStatus

      await updateProduct({
        productId: product.id,
        data: { isActive: newStatus },
      })
    } catch (error) {
      console.error('Error al actualizar estado del producto:', error)
    }
  }

  // Resetear página cuando cambian los filtros
  const handleSearchChange = (value: string) => {
    setSearchText(value)
    setCurrentPage(1)
  }

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value)
    setSubcategoryFilter('')
  }

  const handleSubcategoryFilterChange = (value: string) => {
    setSubcategoryFilter(value)
    setCurrentPage(1)
  }

  const handlePriceFilterChange = (value: string) => {
    setPriceFilter(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  return {
    products: filteredProducts,
    isLoading,
    categories,
    subcategories,
    searchText,
    setSearchText: handleSearchChange,
    categoryFilter,
    setCategoryFilter: handleCategoryFilterChange,
    subcategoryFilter,
    setSubcategoryFilter: handleSubcategoryFilterChange,
    priceFilter,
    setPriceFilter: handlePriceFilterChange,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalProducts,
    handleDeleteClick,
    handleEditClick,
    handleConfirmDelete,
    handleToggleActive,
    formatPrice,
    formatUSD,
    currency,
  }
}
