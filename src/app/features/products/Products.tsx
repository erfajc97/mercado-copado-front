import { useState } from 'react'
import { Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import { useProductsHook } from './hooks/useProductsHook'
import { ProductsFilters } from './components/ProductsFilters'
import { ProductsTable } from './components/ProductsTable'
import CreateProductModal from './components/modals/CreateProductModal'
import EditProductModal from './components/modals/EditProductModal'
import { DeleteProductModal } from './components/modals/DeleteProductModal'

export function Products() {
  const hook = useProductsHook()
  const [createProductModalOpen, setCreateProductModalOpen] = useState(false)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={() => setCreateProductModalOpen(true)}
          className="bg-gradient-coffee border-none hover:opacity-90"
        >
          Nuevo Producto
        </Button>
      </div>

      <ProductsFilters hook={hook} />
      <ProductsTable hook={hook} />

      <CreateProductModal
        isOpen={createProductModalOpen}
        onClose={() => setCreateProductModalOpen(false)}
      />

      <EditProductModal
        isOpen={hook.editModalVisible}
        onClose={() => {
          hook.setEditModalVisible(false)
          hook.setProductToEdit(null)
        }}
        productId={hook.productToEdit}
      />

      <DeleteProductModal
        isOpen={hook.deleteModalVisible}
        onClose={() => {
          hook.setDeleteModalVisible(false)
          hook.setProductToDelete(null)
        }}
        onConfirm={hook.handleConfirmDelete}
        isLoading={false}
      />
    </div>
  )
}
