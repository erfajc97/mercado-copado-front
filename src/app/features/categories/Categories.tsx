import { useCallback, useState } from 'react'
import { Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import { useCategoriesHook } from './hooks/useCategoriesHook'
import { CategoriesFilters } from './components/CategoriesFilters'
import { CategoriesTable } from './components/CategoriesTable'
import { CategoriesCollapse } from './components/CategoriesCollapse'
import CreateCategoryModal from './components/modals/CreateCategoryModal'
import EditCategoryModal from './components/modals/EditCategoryModal'
import { DeleteCategoryModal } from './components/modals/DeleteCategoryModal'
import { DeleteSubcategoryModal } from './components/modals/DeleteSubcategoryModal'
import { EditSubcategoryModal } from './components/modals/EditSubcategoryModal'

export function Categories() {
  const hook = useCategoriesHook()
  const [createCategoryModalOpen, setCreateCategoryModalOpen] = useState(false)
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  const handleEditCategory = useCallback((category: any) => {
    setEditingCategory(category)
    setEditCategoryModalOpen(true)
  }, [])

  return (
    <div className="p-3 sm:p-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Gestión de Categorías</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="flat"
            onPress={() =>
              hook.setViewMode(hook.viewMode === 'table' ? 'collapse' : 'table')
            }
            className="w-full sm:w-auto"
          >
            {hook.viewMode === 'table' ? 'Vista Acordeón' : 'Vista Tabla'}
          </Button>
          <Button
            color="primary"
            startContent={<Plus size={16} />}
            onPress={() => setCreateCategoryModalOpen(true)}
            className="bg-gradient-coffee border-none hover:opacity-90 w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Nueva Categoría</span>
            <span className="sm:hidden">+ Nueva Categ</span>
          </Button>
        </div>
      </div>

      <CategoriesFilters hook={hook} />

      {hook.isLoading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : hook.categories && hook.categories.length > 0 ? (
        hook.viewMode === 'table' ? (
          <CategoriesTable
            hook={{ ...hook, openEditCategory: handleEditCategory }}
          />
        ) : (
          <CategoriesCollapse
            hook={{ ...hook, openEditCategory: handleEditCategory }}
          />
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

      <DeleteCategoryModal
        isOpen={hook.deleteCategoryModalVisible}
        onClose={() => {
          hook.setDeleteCategoryModalVisible(false)
          hook.setCategoryToDelete(null)
        }}
        onConfirm={hook.handleDeleteCategory}
        isLoading={false}
      />

      <DeleteSubcategoryModal
        isOpen={hook.deleteSubcategoryModalVisible}
        onClose={() => {
          hook.setDeleteSubcategoryModalVisible(false)
          hook.setSubcategoryToDelete(null)
        }}
        onConfirm={hook.handleDeleteSubcategory}
        isLoading={false}
      />

      <EditSubcategoryModal
        isOpen={hook.subcategoryModalVisible}
        onClose={() => {
          hook.setSubcategoryModalVisible(false)
          hook.setEditingSubcategory(null)
          hook.setSubcategoryName('')
        }}
        subcategoryName={hook.subcategoryName}
        onSubcategoryNameChange={hook.setSubcategoryName}
        onConfirm={hook.handleUpdateSubcategory}
        isLoading={false}
      />
    </div>
  )
}
