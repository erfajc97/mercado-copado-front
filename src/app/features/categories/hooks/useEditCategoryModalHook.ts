import { useState } from 'react'
import { useUpdateCategoryMutation } from '../mutations/useCategoryMutations'
import { useCreateSubcategoryMutation } from '../mutations/useCreateSubcategoryMutation'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

interface Category {
  id: string
  name: string
  subcategories?: Array<{ id: string; name: string }>
}

export const useEditCategoryModalHook = () => {
  const { mutateAsync: updateCategory, isPending: isUpdatingCategory } =
    useUpdateCategoryMutation()
  const { mutateAsync: createSubcategory } = useCreateSubcategoryMutation()
  const [newSubcategories, setNewSubcategories] = useState<Array<string>>([''])

  const handleSubmit = async (values: any, category: Category | null) => {
    if (!category) return false

    try {
      await updateCategory({
        categoryId: category.id,
        name: values.name.trim(),
      })

      const subcategoryNames = values.newSubcategories?.filter(
        (name: string) => name && name.trim() !== '',
      )

      if (subcategoryNames && subcategoryNames.length > 0) {
        await Promise.all(
          subcategoryNames.map((name: string) =>
            createSubcategory({
              name: name.trim(),
              categoryId: category.id,
            }),
          ),
        )
      }

      sonnerResponse('Categoría actualizada exitosamente', 'success')
      return true
    } catch (error) {
      console.error('Error updating category:', error)
      sonnerResponse('Error al actualizar la categoría', 'error')
      return false
    }
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
  }

  return {
    newSubcategories,
    handleSubmit,
    addSubcategory,
    removeSubcategory,
    resetForm,
    isPending: isUpdatingCategory,
  }
}
