import { Button } from '@heroui/react'
import { Plus } from 'lucide-react'
import { useProductsHook } from './hooks/useProductsHook'
import { ProductsFilters } from './components/ProductsFilters'
import { ProductsTable } from './components/ProductsTable'
import ProductModal from './components/modals/ProductModal'
import { DeleteProductModal } from './components/modals/DeleteProductModal'
import { useProductsStore } from '@/app/store/products/productsStore'

export function Products() {
  const hook = useProductsHook()
  const {
    productModalOpen,
    deleteModalVisible,
    productToEdit,
    setProductModalOpen,
    setDeleteModalVisible,
    setProductToEdit,
    setProductToDelete,
  } = useProductsStore()

  const handleOpenProductModal = () => {
    setProductToEdit(null) // null = crear
    setProductModalOpen(true)
  }

  const handleCloseProductModal = () => {
    setProductModalOpen(false)
    setProductToEdit(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={handleOpenProductModal}
          className="bg-gradient-coffee border-none hover:opacity-90"
        >
          Nuevo Producto
        </Button>
      </div>

      <ProductsFilters hook={hook} />
      <ProductsTable hook={hook} />

      <ProductModal
        isOpen={productModalOpen}
        onClose={handleCloseProductModal}
        productId={productToEdit}
      />

      <DeleteProductModal
        isOpen={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false)
          setProductToDelete(null)
        }}
        onConfirm={hook.handleConfirmDelete}
        isLoading={false}
      />
    </div>
  )
}
