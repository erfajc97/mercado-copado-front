import { useState } from 'react'
import { useCreateCategoryMutation } from '../mutations/useCategoryMutations'
import { useCreateSubcategoryMutation } from '../mutations/useCreateSubcategoryMutation'

export const useCreateCategoryModalHook = () => {
  const { mutateAsync: createCategory, isPending: isCreatingCategory } =
    useCreateCategoryMutation()
  const { mutateAsync: createSubcategory } = useCreateSubcategoryMutation()
  const [subcategories, setSubcategories] = useState<Array<string>>([''])

  const handleSubmit = async (values: any) => {
    try {
      // useCreateCategoryMutation ya maneja sonnerResponse en onSuccess y onError
      const category = await createCategory(values.name)

      const subcategoryNames = values.subcategories?.filter(
        (name: string) => name && name.trim() !== '',
      )

      if (subcategoryNames && subcategoryNames.length > 0) {
        // useCreateSubcategoryMutation ya maneja sonnerResponse en onSuccess y onError
        await Promise.all(
          subcategoryNames.map((name: string) =>
            createSubcategory({ name: name.trim(), categoryId: category.id }),
          ),
        )
      }

      return true
    } catch (error) {
      console.error('Error creating category:', error)
      return false
    }
  }

  const addSubcategory = () => {
    setSubcategories([...subcategories, ''])
  }

  const removeSubcategory = (index: number) => {
    if (subcategories.length > 1) {
      setSubcategories(subcategories.filter((_, i) => i !== index))
    }
  }

  const resetForm = () => {
    setSubcategories([''])
  }

  return {
    subcategories,
    handleSubmit,
    addSubcategory,
    removeSubcategory,
    resetForm,
    isPending: isCreatingCategory,
  }
}
