import { useState, useCallback } from 'react'
import { Button, Input, Modal } from 'antd'
import { Plus } from 'lucide-react'
import { useCategoriesDashboardHook } from './hooks/useCategoriesDashboardHook'
import { CategoriesFilters } from './components/CategoriesFilters'
import { CategoriesTable } from './components/CategoriesTable'
import { CategoriesCollapse } from './components/CategoriesCollapse'
import CreateCategoryModal from '@/components/admin/modals/CreateCategoryModal'
import EditCategoryModal from '@/components/admin/modals/EditCategoryModal'

export const CategoriesDashboard = () => {
  const hook = useCategoriesDashboardHook()
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false)
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  const handleEditCategory = useCallback(
    (category: any) => {
      setEditingCategory(category)
      setEditCategoryModalOpen(true)
    },
    [],
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              hook.setViewMode(hook.viewMode === 'table' ? 'collapse' : 'table')
            }
          >
            {hook.viewMode === 'table' ? 'Vista Acordeón' : 'Vista Tabla'}
          </Button>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setCreateCategoryModalOpen(true)}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Nueva Categoría
          </Button>
        </div>
      </div>

      <CategoriesFilters hook={hook} />

      {hook.isLoading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : hook.categories && hook.categories.length > 0 ? (
        hook.viewMode === 'table' ? (
          <CategoriesTable hook={{ ...hook, openEditCategory: handleEditCategory }} />
        ) : (
          <CategoriesCollapse hook={{ ...hook, openEditCategory: handleEditCategory }} />
        )
      ) : (
        <div className="text-center py-12 text-gray-500">No hay categorías</div>
      )}

      <CreateCategoryModal
        isOpen={createCategoryModalOpen}
        onClose={() => setCreateCategoryModalOpen(false)}
      />

      <EditCategoryModal
        isOpen={editCategoryModalOpen}
        onClose={() => {
          setEditCategoryModalOpen(false)
          setEditingCategory(null)
        }}
        category={editingCategory}
      />

      <Modal
        title="Editar Subcategoría"
        open={hook.subcategoryModalVisible}
        onOk={hook.handleUpdateSubcategory}
        onCancel={() => {
          hook.setSubcategoryModalVisible(false)
          hook.setEditingSubcategory(null)
          hook.setSubcategoryName('')
        }}
        okText="Actualizar"
      >
        <Input
          placeholder="Nombre de la subcategoría"
          value={hook.subcategoryName}
          onChange={(e) => hook.setSubcategoryName(e.target.value)}
          onPressEnter={hook.handleUpdateSubcategory}
        />
      </Modal>

      <Modal
        title="Eliminar Categoría"
        open={hook.deleteCategoryModalVisible}
        onOk={hook.handleDeleteCategory}
        onCancel={() => {
          hook.setDeleteCategoryModalVisible(false)
          hook.setCategoryToDelete(null)
        }}
        okText="Eliminar"
        okButtonProps={{ danger: true }}
        cancelText="Cancelar"
      >
        <p>
          ¿Estás seguro de que deseas eliminar esta categoría? Esto también
          eliminará todas sus subcategorías y productos asociados. Esta acción
          no se puede deshacer.
        </p>
      </Modal>

      <Modal
        title="Eliminar Subcategoría"
        open={hook.deleteSubcategoryModalVisible}
        onOk={hook.handleDeleteSubcategory}
        onCancel={() => {
          hook.setDeleteSubcategoryModalVisible(false)
          hook.setSubcategoryToDelete(null)
        }}
        okText="Eliminar"
        okButtonProps={{ danger: true }}
        cancelText="Cancelar"
      >
        <p>
          ¿Estás seguro de que deseas eliminar esta subcategoría? Esto también
          eliminará todos los productos asociados. Esta acción no se puede
          deshacer.
        </p>
      </Modal>
    </div>
  )
}

