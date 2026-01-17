import { useRef, useState } from 'react'
import type { UploadFile } from 'antd'
import type { Product } from '@/app/features/products/types'
import type { Category } from '@/app/features/categories/types'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/app/features/products/mutations/useProductMutations'
import { useProductQuery } from '@/app/features/products/queries/useProductQuery'
import { extractItems } from '@/app/helpers/parsePaginatedResponse'

interface ExtendedUploadFile extends UploadFile {
  isExisting?: boolean
  imageId?: string
}

export const useProductModalHook = (
  productId: string | null,
  isOpen: boolean,
) => {
  const { data: categoriesData } = useAllCategoriesQuery()
  const categories = extractItems(categoriesData) as Array<Category>
  
  const isEditMode = !!productId
  
  // Mutations
  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProductMutation()
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProductMutation()

  // Query para cargar producto si estamos editando
  const { data: product, isLoading: isLoadingProduct } = useProductQuery(
    productId || '',
    { enabled: isEditMode && isOpen },
  )

  const typedProduct: Product | undefined = product
  const previousProductIdRef = useRef<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [fileList, setFileList] = useState<Array<ExtendedUploadFile>>([])

  // Inicializar cuando el producto cambia o se abre el modal (solo en modo edición)
  if (isEditMode && typedProduct && isOpen && previousProductIdRef.current !== productId) {
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
    previousProductIdRef.current = productId
  }

  // Resetear cuando se cierra el modal
  if (!isOpen && previousProductIdRef.current !== null) {
    previousProductIdRef.current = null
  }

  // Obtener subcategorías basadas en la categoría seleccionada
  const subcategories =
    categories.find((cat) => cat.id === selectedCategory)
      ?.subcategories || []

  // Obtener valores iniciales para el formulario (solo en modo edición)
  const getInitialValues = () => {
    if (!isEditMode || !typedProduct) return {}
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

  // Manejar submit del formulario
  const handleSubmit = async (values: any) => {
    try {
      if (isEditMode) {
        // Modo edición
        if (!productId) return false

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
      } else {
        // Modo creación
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
      }
      return true
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, error)
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
    previousProductIdRef.current = null
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
    isPending: isCreating || isUpdating,
    isLoadingProduct: isEditMode ? isLoadingProduct : false,
    getInitialValues,
    isEditMode,
  }
}
