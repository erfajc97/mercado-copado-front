import { createFileRoute } from '@tanstack/react-router'
import { useProductsQuery } from '@/app/features/products/queries/useProductsQuery'
import { ProductCard } from '@/app/features/products/components/ProductCard'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/products')({
  component: DashboardProducts,
})

function DashboardProducts() {
  const { data: products, isLoading } = useProductsQuery()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Productos</h2>
        <Link
          to="/dashboard/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nuevo Producto
        </Link>
      </div>
      {isLoading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="mt-2 flex gap-2">
                <Link
                  to="/dashboard/products/$productId/edit"
                  params={{ productId: product.id }}
                  className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded text-center text-sm hover:bg-yellow-600"
                >
                  Editar
                </Link>
                <button className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No hay productos
        </div>
      )}
    </div>
  )
}

