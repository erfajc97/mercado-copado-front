import { useMemo, useState } from 'react'
import { useAllCategoriesQuery } from '../queries/useCategoriesQuery'
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '../mutations/useCategoryMutations'
import {
  useDeleteSubcategoryMutation,
  useUpdateSubcategoryMutation,
} from '@/app/features/subcategories/mutations/useSubcategoryMutations'

export const useCategoriesHook = () => {
  const { data: categories, isLoading } = useAllCategoriesQuery()
  const { mutateAsync: createCategory } = useCreateCategoryMutation()
  const { mutateAsync: updateCategory } = useUpdateCategoryMutation()
  const { mutateAsync: deleteCategory } = useDeleteCategoryMutation()
  const { mutateAsync: updateSubcategory } = useUpdateSubcategoryMutation()
  const { mutateAsync: deleteSubcategory } = useDeleteSubcategoryMutation()

  const [viewMode, setViewMode] = useState<'collapse' | 'table'>('table')
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false)
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [subcategoryModalVisible, setSubcategoryModalVisible] = useState(false)
  const [deleteCategoryModalVisible, setDeleteCategoryModalVisible] =
    useState(false)
  const [deleteSubcategoryModalVisible, setDeleteSubcategoryModalVisible] =
    useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(
    null,
  )
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

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete)
      setDeleteCategoryModalVisible(false)
      setCategoryToDelete(null)
    }
  }

  const handleDeleteSubcategory = async () => {
    if (subcategoryToDelete) {
      await deleteSubcategory(subcategoryToDelete)
      setDeleteSubcategoryModalVisible(false)
      setSubcategoryToDelete(null)
    }
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setEditCategoryModalOpen(true)
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
    createCategoryModalOpen,
    setCreateCategoryModalOpen,
    editCategoryModalOpen,
    setEditCategoryModalOpen,
    editingCategory,
    setEditingCategory,
    subcategoryModalVisible,
    setSubcategoryModalVisible,
    deleteCategoryModalVisible,
    setDeleteCategoryModalVisible,
    deleteSubcategoryModalVisible,
    setDeleteSubcategoryModalVisible,
    editingSubcategory,
    setEditingSubcategory,
    categoryToDelete,
    setCategoryToDelete,
    subcategoryToDelete,
    setSubcategoryToDelete,
    subcategoryName,
    setSubcategoryName,
    searchText,
    setSearchText,
    subcategorySearchText,
    setSubcategorySearchText,
    expandedCategories,
    handleUpdateSubcategory,
    handleDeleteCategory,
    handleDeleteSubcategory,
    handleEditCategory,
    openEditSubcategory,
  }
}
