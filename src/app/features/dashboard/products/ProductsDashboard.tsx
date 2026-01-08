import { useState } from 'react'
import { Button, Modal } from 'antd'
import { Plus } from 'lucide-react'
import { useProductsDashboardHook } from './hooks/useProductsDashboardHook'
import { ProductsFilters } from './components/ProductsFilters'
import { ProductsTable } from './components/ProductsTable'
import CreateProductModal from '@/components/admin/modals/CreateProductModal'
import EditProductModal from '@/components/admin/modals/EditProductModal'

export const ProductsDashboard = () => {
  const hook = useProductsDashboardHook()
  const [createProductModalOpen, setCreateProductModalOpen] = useState(false)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setCreateProductModalOpen(true)}
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

      <Modal
        title="Eliminar Producto"
        open={hook.deleteModalVisible}
        onOk={hook.handleConfirmDelete}
        onCancel={() => {
          hook.setDeleteModalVisible(false)
          hook.setProductToDelete(null)
        }}
        okText="Eliminar"
        okButtonProps={{ danger: true }}
        cancelText="Cancelar"
      >
        <p>
          ¿Estás seguro de que deseas eliminar este producto? Esta acción no se
          puede deshacer.
        </p>
      </Modal>
    </div>
  )
}
