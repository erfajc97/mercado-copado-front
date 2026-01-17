import { useMemo } from 'react'
import { useAllCategoriesQuery } from '../queries/useCategoriesQuery'
import { useDeleteCategoryMutation } from '../mutations/useCategoryMutations'
import {
  useDeleteSubcategoryMutation,
  useUpdateSubcategoryMutation,
} from '../mutations/useSubcategoryMutations'
import {
  extractItems as extractCategories,
  extractPagination,
} from '@/app/helpers/parsePaginatedResponse'
import { useCategoriesStore } from '@/app/store/categories/categoriesStore'

export const useCategoriesHook = () => {
  // Estado desde la store
  const {
    searchText,
    subcategorySearchText,
    currentPage,
    pageSize,
    setSearchText,
    setSubcategorySearchText,
    setCurrentPage,
  } = useCategoriesStore()

  // Construir query params con paginación
  const queryParams: {
    search?: string
    page?: number
    limit?: number
  } = {
    page: currentPage,
    limit: pageSize,
  }

  if (searchText) {
    queryParams.search = searchText
  }

  const { data: categoriesData, isLoading } = useAllCategoriesQuery(queryParams)

  const { mutateAsync: deleteCategory } = useDeleteCategoryMutation()
  const { mutateAsync: updateSubcategory } = useUpdateSubcategoryMutation()
  const { mutateAsync: deleteSubcategory } = useDeleteSubcategoryMutation()

  // Extraer categorías y paginación usando helpers
  const categories = useMemo(() => {
    if (!categoriesData) return []
    return extractCategories(categoriesData)
  }, [categoriesData])

  const pagination = useMemo(() => {
    if (!categoriesData) return undefined
    return extractPagination(categoriesData)
  }, [categoriesData])

  const totalPages = pagination?.totalPages || 1

  // Filtrar subcategorías localmente (no está en el backend como filtro separado)
  const filteredCategories = useMemo(() => {
    if (categories.length === 0) return []
    if (!subcategorySearchText) return categories

    return categories.filter((category: any) =>
      category.subcategories?.some((sub: any) =>
        sub.name.toLowerCase().includes(subcategorySearchText.toLowerCase()),
      ),
    )
  }, [categories, subcategorySearchText])

  const expandedCategories = useMemo(() => {
    if (subcategorySearchText) {
      return filteredCategories.map((cat: any) => cat.id)
    }
    return []
  }, [filteredCategories, subcategorySearchText])

  // Handlers
  const handleUpdateSubcategory = async () => {
    const store = useCategoriesStore.getState()
    if (!store.editingSubcategory || !store.subcategoryName.trim()) return

    await updateSubcategory({
      subcategoryId: store.editingSubcategory.id,
      name: store.subcategoryName.trim(),
    })

    store.setEditingSubcategory(null)
    store.setSubcategoryName('')
    store.setSubcategoryModalVisible(false)
  }

  const handleDeleteCategory = async () => {
    const store = useCategoriesStore.getState()
    if (store.categoryToDelete) {
      await deleteCategory(store.categoryToDelete)
      store.setDeleteCategoryModalVisible(false)
      store.setCategoryToDelete(null)
    }
  }

  const handleDeleteSubcategory = async () => {
    const store = useCategoriesStore.getState()
    if (store.subcategoryToDelete) {
      await deleteSubcategory(store.subcategoryToDelete)
      store.setDeleteSubcategoryModalVisible(false)
      store.setSubcategoryToDelete(null)
    }
  }

  const handleEditCategory = (category: any) => {
    const store = useCategoriesStore.getState()
    store.setEditingCategory(category)
    store.setEditCategoryModalOpen(true)
  }

  const openEditSubcategory = (subcategory: any) => {
    const store = useCategoriesStore.getState()
    store.setEditingSubcategory(subcategory)
    store.setSubcategoryName(subcategory.name)
    store.setSubcategoryModalVisible(true)
  }

  const handleSearchChange = (value: string) => {
    setSearchText(value)
  }

  const handleSubcategorySearchChange = (value: string) => {
    setSubcategorySearchText(value)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return {
    categories: filteredCategories,
    isLoading,
    totalPages,
    expandedCategories,
    handleUpdateSubcategory,
    handleDeleteCategory,
    handleDeleteSubcategory,
    handleEditCategory,
    openEditSubcategory,
    handleSearchChange,
    handleSubcategorySearchChange,
    handlePageChange,
  }
}
