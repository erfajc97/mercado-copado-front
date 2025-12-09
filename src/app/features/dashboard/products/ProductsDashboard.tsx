import { Link } from '@tanstack/react-router'
import { Modal } from 'antd'
import { useProductsDashboardHook } from './hooks/useProductsDashboardHook'
import { ProductsFilters } from './components/ProductsFilters'
import { ProductsTable } from './components/ProductsTable'

export const ProductsDashboard = () => {
  const hook = useProductsDashboardHook()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <Link
          to="/dashboard/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nuevo Producto
        </Link>
      </div>

      <ProductsFilters hook={hook} />
      <ProductsTable hook={hook} />

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
