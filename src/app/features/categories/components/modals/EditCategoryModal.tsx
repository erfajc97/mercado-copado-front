import { useEffect, useRef, useState } from 'react'
import { Button } from '@heroui/react'
import { Form, Input } from 'antd'
import { Edit, Trash2 } from 'lucide-react'
import { useEditCategoryModalHook } from '../../hooks/useEditCategoryModalHook'
import { DeleteSubcategoryModal } from './DeleteSubcategoryModal'
import { EditSubcategoryModal } from './EditSubcategoryModal'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'

interface Category {
  id: string
  name: string
  subcategories?: Array<{ id: string; name: string }>
}

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category | null
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
}: EditCategoryModalProps) {
  const [form] = Form.useForm()
  const previousIsOpenRef = useRef(false)
  const [localCategory, setLocalCategory] = useState<Category | null>(category)
  const {
    newSubcategories,
    handleSubmit,
    addSubcategory,
    removeSubcategory,
    resetForm,
    isPending,
    editingSubcategoryName,
    setEditingSubcategoryName,
    editSubcategoryModalOpen,
    setEditSubcategoryModalOpen,
    handleUpdateSubcategory,
    openEditSubcategoryModal,
    deleteSubcategoryModalOpen,
    setDeleteSubcategoryModalOpen,
    handleDeleteSubcategory,
    openDeleteSubcategoryModal,
    editingSubcategoryId,
    subcategoryToDelete,
  } = useEditCategoryModalHook()

  // Sincronizar localCategory con el prop category cuando cambia
  useEffect(() => {
    if (category) {
      setLocalCategory(category)
    }
  }, [category])

  // Inicializar el formulario cuando la modal se abre (solo una vez)
  useEffect(() => {
    if (isOpen && !previousIsOpenRef.current && localCategory) {
      form.setFieldsValue({ name: localCategory.name })
      resetForm()
      previousIsOpenRef.current = true
    }
  }, [isOpen, localCategory, form, resetForm])

  // Resetear la referencia cuando la modal se cierra
  useEffect(() => {
    if (!isOpen && previousIsOpenRef.current) {
      previousIsOpenRef.current = false
    }
  }, [isOpen])

  const handleFormSubmit = async (values: any) => {
    const success = await handleSubmit(values, localCategory)
    if (success) {
      handleCancel()
    }
  }

  // Actualizar la subcategoría en el estado local cuando se edita
  const handleUpdateSubcategoryWithRefresh = async () => {
    if (!localCategory || !editingSubcategoryId) return
    
    const subcategoryIdToUpdate = editingSubcategoryId
    const newName = editingSubcategoryName.trim()
    
    try {
      // useUpdateSubcategoryMutation ya maneja sonnerResponse y invalida queries
      await handleUpdateSubcategory()
      // Actualizar el estado local inmediatamente después de la mutation exitosa
      setLocalCategory((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          subcategories: prev.subcategories?.map((sub) =>
            sub.id === subcategoryIdToUpdate
              ? { ...sub, name: newName }
              : sub,
          ),
        }
      })
    } catch (error) {
      console.error('Error updating subcategory:', error)
      // El sonner ya se muestra en la mutation onError
    }
  }

  // Eliminar la subcategoría del estado local cuando se elimina
  const handleDeleteSubcategoryWithRefresh = async () => {
    if (!localCategory || !subcategoryToDelete) return
    
    const subcategoryIdToDelete = subcategoryToDelete
    
    try {
      // useDeleteSubcategoryMutation ya maneja sonnerResponse y invalida queries
      await handleDeleteSubcategory()
      // Actualizar el estado local inmediatamente después de la mutation exitosa
      setLocalCategory((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          subcategories: prev.subcategories?.filter(
            (sub) => sub.id !== subcategoryIdToDelete,
          ),
        }
      })
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      // El sonner ya se muestra en la mutation onError
    }
  }

  const handleCancel = () => {
    form.resetFields()
    resetForm()
    previousIsOpenRef.current = false
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel()
    }
  }

  if (!localCategory) return null

  return (
    <>
      <CustomModalNextUI
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        isDismissable
        size="2xl"
        placement="center"
        headerContent="Editar Categoría"
        footerContent={
          <div className="flex gap-2 justify-end w-full">
            <Button variant="light" onPress={handleCancel} isDisabled={isPending}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={() => form.submit()}
              isLoading={isPending}
              isDisabled={isPending}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              Actualizar Categoría
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="space-y-4 mt-4"
        >
          <Form.Item
            name="name"
            label="* Nombre de la Categoría"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa el nombre de la categoría',
              },
            ]}
          >
            <Input size="large" placeholder="Ej: Electrónica" />
          </Form.Item>

          {localCategory.subcategories && localCategory.subcategories.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Subcategorías Existentes
              </label>
              <div className="space-y-2">
                {localCategory.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-2 bg-gray-50 p-3 rounded border border-gray-200"
                  >
                    <span className="flex-1 font-medium">{sub.name}</span>
                    <Button
                      variant="light"
                      size="sm"
                      isIconOnly
                      onPress={() => openEditSubcategoryModal(sub)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      color="danger"
                      variant="light"
                      size="sm"
                      isIconOnly
                      onPress={() => openDeleteSubcategoryModal(sub.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                Agregar Nuevas Subcategorías
              </label>
              <Button variant="flat" size="sm" onPress={addSubcategory}>
                + Agregar Subcategoría
              </Button>
            </div>
            {newSubcategories.map((_, index) => (
              <Form.Item
                key={index}
                name={['newSubcategories', index]}
                rules={[
                  {
                    validator: (_rule, value) => {
                      // Campo opcional: solo validar si tiene valor
                      if (!value || value.trim() === '') {
                        return Promise.resolve()
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <div className="flex gap-2">
                  <Input
                    size="large"
                    placeholder={`Nueva subcategoría ${index + 1}`}
                  />
                  {newSubcategories.length > 1 && (
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() => removeSubcategory(index)}
                      size="lg"
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              </Form.Item>
            ))}
          </div>
        </Form>
      </CustomModalNextUI>

      <EditSubcategoryModal
        isOpen={editSubcategoryModalOpen}
        onClose={() => {
          setEditSubcategoryModalOpen(false)
        }}
        subcategoryName={editingSubcategoryName}
        onSubcategoryNameChange={setEditingSubcategoryName}
        onConfirm={handleUpdateSubcategoryWithRefresh}
        isLoading={isPending}
      />

      <DeleteSubcategoryModal
        isOpen={deleteSubcategoryModalOpen}
        onClose={() => {
          setDeleteSubcategoryModalOpen(false)
        }}
        onConfirm={handleDeleteSubcategoryWithRefresh}
        isLoading={isPending}
      />
    </>
  )
}
