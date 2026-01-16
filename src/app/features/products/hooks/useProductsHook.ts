import { useMemo, useState } from 'react'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'
import { useProductsQuery } from '../queries/useProductsQuery'
import {
  useDeleteProductMutation,
  useUpdateProductMutation,
} from '../mutations/useProductMutations'
import { useCurrency } from '@/app/hooks/useCurrency'
import { formatUSD } from '@/app/services/currencyService'

export const useProductsHook = () => {
  const { data: products, isLoading } = useProductsQuery({
    includeInactive: true,
  })
  const { data: categories } = useAllCategoriesQuery()
  const { mutateAsync: deleteProduct } = useDeleteProductMutation()
  const { mutateAsync: updateProduct } = useUpdateProductMutation()
  const { formatPrice, currency } = useCurrency()

  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [productToEdit, setProductToEdit] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>('')
  const [priceFilter, setPriceFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const subcategories = useMemo(() => {
    if (!categoryFilter || !categories) return []
    const category = categories.find((cat: any) => cat.id === categoryFilter)
    return category?.subcategories || []
  }, [categoryFilter, categories])

  const filteredProducts = useMemo(() => {
    if (!products) return []

    let filtered = [...products]

    if (searchText) {
      filtered = filtered.filter(
        (product: any) =>
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(
        (product: any) => product.categoryId === categoryFilter,
      )
    }

    if (subcategoryFilter) {
      filtered = filtered.filter(
        (product: any) => product.subcategoryId === subcategoryFilter,
      )
    }

    if (priceFilter) {
      filtered = filtered.filter((product: any) => {
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
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (product: any) =>
          (statusFilter === 'active' && product.isActive) ||
          (statusFilter === 'inactive' && !product.isActive),
      )
    }

    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    return filtered
  }, [
    products,
    searchText,
    categoryFilter,
    subcategoryFilter,
    priceFilter,
    statusFilter,
  ])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredProducts.slice(start, end)
  }, [filteredProducts, currentPage, pageSize])

  const totalPages = Math.ceil(filteredProducts.length / pageSize)

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setDeleteModalVisible(true)
  }

  const handleEditClick = (productId: string) => {
    setProductToEdit(productId)
    setEditModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete)
      setDeleteModalVisible(false)
      setProductToDelete(null)
    }
  }

  const handleToggleActive = async (product: any) => {
    try {
      const currentProduct = products?.find((p: any) => p.id === product.id)
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

  return {
    products: paginatedProducts,
    isLoading,
    categories,
    subcategories,
    deleteModalVisible,
    setDeleteModalVisible,
    productToDelete,
    setProductToDelete,
    editModalVisible,
    setEditModalVisible,
    productToEdit,
    setProductToEdit,
    searchText,
    setSearchText,
    categoryFilter,
    setCategoryFilter,
    subcategoryFilter,
    setSubcategoryFilter,
    priceFilter,
    setPriceFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalProducts: filteredProducts.length,
    handleDeleteClick,
    handleEditClick,
    handleConfirmDelete,
    handleToggleActive,
    formatPrice,
    formatUSD,
    currency,
  }
}
