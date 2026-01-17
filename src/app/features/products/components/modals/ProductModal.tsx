import { useRef } from 'react'
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
  const previousIsOpenRef = useRef(false)
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

  // Inicializar el formulario cuando la modal se abre (solo una vez)
  if (isOpen && !previousIsOpenRef.current) {
    if (isEditMode) {
      const initialValues = getInitialValues()
      if (Object.keys(initialValues).length > 0) {
        form.setFieldsValue(initialValues)
      }
    }
    previousIsOpenRef.current = true
  }

  // Resetear la referencia cuando la modal se cierra
  if (!isOpen && previousIsOpenRef.current) {
    previousIsOpenRef.current = false
  }

  const handleFormSubmit = async (values: any) => {
    const success = await handleSubmit(values)
    if (success) {
      handleCancel()
    }
  }

  const handleCancel = () => {
    form.resetFields()
    resetForm()
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
      size="5xl"
      placement="center"
      headerContent={isEditMode ? 'Editar Producto' : 'Nuevo Producto'}
    >
      {isLoadingProduct ? (
        <div className="text-center py-8">Cargando producto...</div>
      ) : (
        <>
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

          {/* Botones */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="light"
              onPress={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={() => form.submit()}
              isLoading={isPending}
              isDisabled={isPending}
              className="flex-1 bg-gradient-coffee border-none hover:opacity-90"
            >
              {isEditMode ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </div>
        </>
      )}
    </CustomModalNextUI>
  )
}
