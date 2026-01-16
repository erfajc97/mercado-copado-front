import { useState } from 'react'
import type { UploadFile } from 'antd'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'
import { useCreateProductMutation } from '@/app/features/products/mutations/useProductMutations'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'

export const useCreateProductModalHook = () => {
  const { data: categories } = useAllCategoriesQuery()
  const { mutateAsync: createProduct, isPending } = useCreateProductMutation()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [fileList, setFileList] = useState<Array<UploadFile>>([])

  const subcategories =
    categories?.find((cat: any) => cat.id === selectedCategory)
      ?.subcategories || []

  const handleSubmit = async (values: any) => {
    try {
      const images = fileList
        .map((file) => file.originFileObj)
        .filter((file) => file !== undefined) as Array<File>

      await createProduct({
        name: values.name,
        description: values.description,
        price: Number(values.price),
        discount: values.discount ? Number(values.discount) : 0,
        categoryId: values.categoryId,
        subcategoryId: values.subcategoryId,
        country: values.country,
        isActive: values.isActive !== undefined ? values.isActive : true,
        images,
      })
      sonnerResponse('Producto creado exitosamente', 'success')
      return true
    } catch (error) {
      console.error('Error creating product:', error)
      sonnerResponse('Error al crear el producto', 'error')
      return false
    }
  }

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList)
  }

  const resetForm = () => {
    setFileList([])
    setSelectedCategory('')
  }

  return {
    categories,
    subcategories,
    selectedCategory,
    setSelectedCategory,
    fileList,
    handleSubmit,
    handleUploadChange,
    resetForm,
    isPending,
  }
}
