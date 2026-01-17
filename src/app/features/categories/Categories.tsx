import { useCallback } from 'react'
import { Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import { useCategoriesHook } from './hooks/useCategoriesHook'
import { CategoriesFilters } from './components/CategoriesFilters'
import { CategoriesCollapse } from './components/CategoriesCollapse'
import CreateCategoryModal from './components/modals/CreateCategoryModal'
import EditCategoryModal from './components/modals/EditCategoryModal'
import { DeleteCategoryModal } from './components/modals/DeleteCategoryModal'
import { DeleteSubcategoryModal } from './components/modals/DeleteSubcategoryModal'
import { EditSubcategoryModal } from './components/modals/EditSubcategoryModal'
import { useCategoriesStore } from '@/app/store/categories/categoriesStore'

export function Categories() {
  const hook = useCategoriesHook()
  const {
    createCategoryModalOpen,
    editCategoryModalOpen,
    editingCategory,
    deleteCategoryModalVisible,
    deleteSubcategoryModalVisible,
    subcategoryModalVisible,
    subcategoryName,
    setCreateCategoryModalOpen,
    setEditCategoryModalOpen,
    setEditingCategory,
    setDeleteCategoryModalVisible,
    setDeleteSubcategoryModalVisible,
    setSubcategoryModalVisible,
    setEditingSubcategory,
    setCategoryToDelete,
    setSubcategoryToDelete,
    setSubcategoryName,
  } = useCategoriesStore()

  const handleEditCategory = useCallback((category: any) => {
    setEditingCategory(category)
    setEditCategoryModalOpen(true)
  }, [setEditingCategory, setEditCategoryModalOpen])

  return (
    <div className="p-3 sm:p-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">Gestión de Categorías</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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

      <CategoriesFilters />

      {hook.isLoading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : hook.categories.length > 0 ? (
        <CategoriesCollapse
          hook={{ ...hook, openEditCategory: handleEditCategory }}
        />
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
        isOpen={deleteCategoryModalVisible}
        onClose={() => {
          setDeleteCategoryModalVisible(false)
          setCategoryToDelete(null)
        }}
        onConfirm={hook.handleDeleteCategory}
        isLoading={false}
      />

      <DeleteSubcategoryModal
        isOpen={deleteSubcategoryModalVisible}
        onClose={() => {
          setDeleteSubcategoryModalVisible(false)
          setSubcategoryToDelete(null)
        }}
        onConfirm={hook.handleDeleteSubcategory}
        isLoading={false}
      />

      <EditSubcategoryModal
        isOpen={subcategoryModalVisible}
        onClose={() => {
          setSubcategoryModalVisible(false)
          setEditingSubcategory(null)
          setSubcategoryName('')
        }}
        subcategoryName={subcategoryName}
        onSubcategoryNameChange={setSubcategoryName}
        onConfirm={hook.handleUpdateSubcategory}
        isLoading={false}
      />
    </div>
  )
}
