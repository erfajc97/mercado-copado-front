import { useState } from 'react'
import { useUpdateCategoryMutation } from '../mutations/useCategoryMutations'
import {
  useCreateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useUpdateSubcategoryMutation,
} from '../mutations/useSubcategoryMutations'

interface Category {
  id: string
  name: string
  subcategories?: Array<{ id: string; name: string }>
}

export const useEditCategoryModalHook = () => {
  const { mutateAsync: updateCategory, isPending: isUpdatingCategory } =
    useUpdateCategoryMutation()
  const { mutateAsync: createSubcategory } = useCreateSubcategoryMutation()
  const { mutateAsync: updateSubcategory, isPending: isUpdatingSubcategory } =
    useUpdateSubcategoryMutation()
  const { mutateAsync: deleteSubcategory, isPending: isDeletingSubcategory } =
    useDeleteSubcategoryMutation()

  const [newSubcategories, setNewSubcategories] = useState<Array<string>>([''])
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<string | null>(null)
  const [editingSubcategoryName, setEditingSubcategoryName] = useState('')
  const [deleteSubcategoryModalOpen, setDeleteSubcategoryModalOpen] = useState(false)
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<string | null>(null)
  const [editSubcategoryModalOpen, setEditSubcategoryModalOpen] = useState(false)

  const handleSubmit = async (values: any, category: Category | null) => {
    if (!category) return false

    try {
      // useUpdateCategoryMutation ya maneja sonnerResponse en onSuccess y onError
      await updateCategory({
        categoryId: category.id,
        name: values.name.trim(),
      })

      const subcategoryNames = values.newSubcategories?.filter(
        (name: string) => name && name.trim() !== '',
      )

      if (subcategoryNames && subcategoryNames.length > 0) {
        // useCreateSubcategoryMutation ya maneja sonnerResponse en onSuccess y onError
        await Promise.all(
          subcategoryNames.map((name: string) =>
            createSubcategory({
              name: name.trim(),
              categoryId: category.id,
            }),
          ),
        )
      }

      return true
    } catch (error) {
      console.error('Error updating category:', error)
      return false
    }
  }

  const handleUpdateSubcategory = async () => {
    if (!editingSubcategoryId || !editingSubcategoryName.trim()) return

    try {
      await updateSubcategory({
        subcategoryId: editingSubcategoryId,
        name: editingSubcategoryName.trim(),
      })
      setEditSubcategoryModalOpen(false)
      setEditingSubcategoryId(null)
      setEditingSubcategoryName('')
      return true
    } catch (error) {
      console.error('Error updating subcategory:', error)
      return false
    }
  }

  const handleDeleteSubcategory = async () => {
    if (!subcategoryToDelete) return

    try {
      await deleteSubcategory(subcategoryToDelete)
      setDeleteSubcategoryModalOpen(false)
      setSubcategoryToDelete(null)
      return true
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      return false
    }
  }

  const openEditSubcategoryModal = (subcategory: { id: string; name: string }) => {
    setEditingSubcategoryId(subcategory.id)
    setEditingSubcategoryName(subcategory.name)
    setEditSubcategoryModalOpen(true)
  }

  const openDeleteSubcategoryModal = (subcategoryId: string) => {
    setSubcategoryToDelete(subcategoryId)
    setDeleteSubcategoryModalOpen(true)
  }

  const addSubcategory = () => {
    setNewSubcategories([...newSubcategories, ''])
  }

  const removeSubcategory = (index: number) => {
    if (newSubcategories.length > 1) {
      setNewSubcategories(newSubcategories.filter((_, i) => i !== index))
    }
  }

  const resetForm = () => {
    setNewSubcategories([''])
    setEditingSubcategoryId(null)
    setEditingSubcategoryName('')
    setSubcategoryToDelete(null)
  }

  return {
    newSubcategories,
    handleSubmit,
    addSubcategory,
    removeSubcategory,
    resetForm,
    isPending: isUpdatingCategory || isUpdatingSubcategory || isDeletingSubcategory,
    // Subcategorías existentes
    editingSubcategoryId,
    editingSubcategoryName,
    setEditingSubcategoryName,
    editSubcategoryModalOpen,
    setEditSubcategoryModalOpen,
    handleUpdateSubcategory,
    openEditSubcategoryModal,
    // Eliminación de subcategorías
    deleteSubcategoryModalOpen,
    setDeleteSubcategoryModalOpen,
    subcategoryToDelete,
    handleDeleteSubcategory,
    openDeleteSubcategoryModal,
  }
}
