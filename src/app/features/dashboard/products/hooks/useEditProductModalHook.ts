import { useEffect, useState } from 'react'
import type { UploadFile } from 'antd'
import type { Product } from '@/app/features/products/types'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'
import { useUpdateProductMutation } from '@/app/features/products/mutations/useProductMutations'
import { useProductQuery } from '@/app/features/products/queries/useProductQuery'

interface ExtendedUploadFile extends UploadFile {
  isExisting?: boolean
  imageId?: string
}

export const useEditProductModalHook = (
  productId: string | null,
  isOpen: boolean,
) => {
  const { data: categories } = useAllCategoriesQuery()
  const { mutateAsync: updateProduct, isPending } = useUpdateProductMutation()
  const { data: product, isLoading: isLoadingProduct } = useProductQuery(
    productId || '',
    { enabled: !!productId && isOpen },
  )
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [fileList, setFileList] = useState<Array<ExtendedUploadFile>>([])

  const typedProduct: Product | undefined = product

  const subcategories =
    categories?.find((cat: any) => cat.id === selectedCategory)
      ?.subcategories || []

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (typedProduct && isOpen) {
      setSelectedCategory(typedProduct.categoryId)

      // Cargar imágenes existentes
      if (typedProduct.images.length > 0) {
        const existingImages: Array<ExtendedUploadFile> =
          typedProduct.images.map((img: any, index: number) => ({
            uid: img.id || `existing-${index}`,
            name: `imagen-${index + 1}`,
            status: 'done' as const,
            url: img.url,
            isExisting: true,
            imageId: img.id,
          }))
        setFileList(existingImages)
      } else {
        setFileList([])
      }
    }
  }, [typedProduct, isOpen])

  const getInitialValues = () => {
    if (!typedProduct) return {}
    return {
      name: typedProduct.name,
      description: typedProduct.description,
      price: Number(typedProduct.price),
      discount: Number(typedProduct.discount || 0),
      categoryId: typedProduct.categoryId,
      subcategoryId: typedProduct.subcategoryId,
      country: typedProduct.country || '',
      isActive: typedProduct.isActive,
    }
  }

  const handleSubmit = async (values: any) => {
    if (!productId) return false

    try {
      // Separar imágenes nuevas de las existentes
      const newImages = fileList
        .filter((file) => !file.isExisting && file.originFileObj)
        .map((file) => file.originFileObj) as Array<File>

      await updateProduct({
        productId,
        data: {
          name: values.name,
          description: values.description,
          price: Number(values.price),
          discount: values.discount ? Number(values.discount) : 0,
          categoryId: values.categoryId,
          subcategoryId: values.subcategoryId,
          country: values.country,
          isActive: values.isActive !== undefined ? values.isActive : true,
        },
        files: newImages.length > 0 ? newImages : undefined,
      })
      return true
    } catch (error) {
      console.error('Error updating product:', error)
      return false
    }
  }

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList)
  }

  const handleRemove = (file: ExtendedUploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid)
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
    handleRemove,
    resetForm,
    isPending,
    isLoadingProduct,
    product: typedProduct,
    getInitialValues,
  }
}
