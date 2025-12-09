import { useMemo, useState } from 'react'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '@/app/features/categories/mutations/useCategoryMutations'
import {
  useDeleteSubcategoryMutation,
  useUpdateSubcategoryMutation,
} from '@/app/features/subcategories/mutations/useSubcategoryMutations'

export const useCategoriesDashboardHook = () => {
  const { data: categories, isLoading } = useAllCategoriesQuery()
  const { mutateAsync: createCategory } = useCreateCategoryMutation()
  const { mutateAsync: updateCategory } = useUpdateCategoryMutation()
  const { mutateAsync: deleteCategory } = useDeleteCategoryMutation()
  const { mutateAsync: updateSubcategory } = useUpdateSubcategoryMutation()
  const { mutateAsync: deleteSubcategory } = useDeleteSubcategoryMutation()

  const [viewMode, setViewMode] = useState<'collapse' | 'table'>('table')
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [subcategoryModalVisible, setSubcategoryModalVisible] = useState(false)
  const [deleteCategoryModalVisible, setDeleteCategoryModalVisible] =
    useState(false)
  const [deleteSubcategoryModalVisible, setDeleteSubcategoryModalVisible] =
    useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(
    null,
  )
  const [categoryName, setCategoryName] = useState('')
  const [subcategoryName, setSubcategoryName] = useState('')
  const [searchText, setSearchText] = useState('')
  const [subcategorySearchText, setSubcategorySearchText] = useState('')

  const filteredCategories = useMemo(() => {
    if (!categories) return []
    if (!searchText && !subcategorySearchText) return categories

    let filtered = categories

    if (searchText) {
      filtered = filtered.filter((category: any) =>
        category.name.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    if (subcategorySearchText) {
      filtered = filtered.filter((category: any) =>
        category.subcategories?.some((sub: any) =>
          sub.name.toLowerCase().includes(subcategorySearchText.toLowerCase()),
        ),
      )
    }

    return filtered
  }, [categories, searchText, subcategorySearchText])

  const expandedCategories = useMemo(() => {
    if (subcategorySearchText) {
      return filteredCategories.map((cat: any) => cat.id)
    }
    return []
  }, [filteredCategories, subcategorySearchText])

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return
    await createCategory(categoryName.trim())
    setCategoryName('')
    setCategoryModalVisible(false)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || !categoryName.trim()) return
    await updateCategory({
      categoryId: editingCategory.id,
      name: categoryName.trim(),
    })
    setEditingCategory(null)
    setCategoryName('')
    setCategoryModalVisible(false)
  }

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete)
      setDeleteCategoryModalVisible(false)
      setCategoryToDelete(null)
    }
  }

  const handleUpdateSubcategory = async () => {
    if (!editingSubcategory || !subcategoryName.trim()) return
    await updateSubcategory({
      subcategoryId: editingSubcategory.id,
      name: subcategoryName.trim(),
    })
    setEditingSubcategory(null)
    setSubcategoryName('')
    setSubcategoryModalVisible(false)
  }

  const handleDeleteSubcategory = async () => {
    if (subcategoryToDelete) {
      await deleteSubcategory(subcategoryToDelete)
      setDeleteSubcategoryModalVisible(false)
      setSubcategoryToDelete(null)
    }
  }

  const openEditCategory = (category: any) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setCategoryModalVisible(true)
  }

  const openEditSubcategory = (subcategory: any) => {
    setEditingSubcategory(subcategory)
    setSubcategoryName(subcategory.name)
    setSubcategoryModalVisible(true)
  }

  return {
    categories: filteredCategories,
    isLoading,
    viewMode,
    setViewMode,
    categoryModalVisible,
    setCategoryModalVisible,
    subcategoryModalVisible,
    setSubcategoryModalVisible,
    deleteCategoryModalVisible,
    setDeleteCategoryModalVisible,
    deleteSubcategoryModalVisible,
    setDeleteSubcategoryModalVisible,
    editingCategory,
    setEditingCategory,
    editingSubcategory,
    setEditingSubcategory,
    categoryToDelete,
    setCategoryToDelete,
    subcategoryToDelete,
    setSubcategoryToDelete,
    categoryName,
    setCategoryName,
    subcategoryName,
    setSubcategoryName,
    searchText,
    setSearchText,
    subcategorySearchText,
    setSubcategorySearchText,
    expandedCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleUpdateSubcategory,
    handleDeleteSubcategory,
    openEditCategory,
    openEditSubcategory,
  }
}

