import { useEffect, useRef } from 'react'
import { Button } from '@heroui/react'
import { Form } from 'antd'
import { useProductModalHook } from '../../hooks/useProductModalHook'
import { FormProduct } from '../FormProduct'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string | null
}

export default function ProductModal({
  isOpen,
  onClose,
  productId,
}: ProductModalProps) {
  const [form] = Form.useForm()
  const previousProductIdRef = useRef<string | null>(null)
  const {
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
    getInitialValues,
    isEditMode,
  } = useProductModalHook(productId, isOpen)

  // Inicializar el formulario cuando se abre o cambia productId
  useEffect(() => {
    if (isOpen && productId !== previousProductIdRef.current) {
      if (isEditMode && !isLoadingProduct) {
        const initialValues = getInitialValues()
        form.setFieldsValue(initialValues)
      } else {
        form.resetFields()
      }
      resetForm()
      previousProductIdRef.current = productId
    }
  }, [
    isOpen,
    productId,
    isEditMode,
    isLoadingProduct,
    form,
    getInitialValues,
    resetForm,
  ])

  const handleFormSubmit = async (values: any) => {
    const success = await handleSubmit(values)
    if (success) {
      handleCancel()
    }
  }

  const handleCancel = () => {
    form.resetFields()
    resetForm()
    previousProductIdRef.current = null
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel()
    }
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="2xl"
      placement="top"
      scrollBehavior="inside"
      headerContent={isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
      footerContent={
        <div className="flex gap-2 w-full">
          <Button
            variant="light"
            onPress={handleCancel}
            className="flex-1"
            size="sm"
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={() => form.submit()}
            isLoading={isPending}
            isDisabled={isPending}
            className="flex-1 bg-gradient-coffee border-none hover:opacity-90"
            size="sm"
          >
            {isEditMode ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </div>
      }
    >
      {isLoadingProduct ? (
        <div className="text-center py-8">Cargando producto...</div>
      ) : (
        <FormProduct
          form={form}
          categories={categories}
          subcategories={subcategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          fileList={fileList}
          handleUploadChange={handleUploadChange}
          handleRemove={handleRemove}
          isEditMode={isEditMode}
          onFinish={handleFormSubmit}
        />
      )}
    </CustomModalNextUI>
  )
}
