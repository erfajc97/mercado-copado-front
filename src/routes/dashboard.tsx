import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/app/store/auth/authStore'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { roles } = useAuthStore()

  if (roles !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6">
          Solo los administradores pueden acceder a esta sección
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Volver al Inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard Admin</h1>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Accesos Rápidos
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard/products"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <span>📦</span>
              <span>Lista de Productos</span>
            </Link>
            <Link
              to="/dashboard/categories"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <span>📁</span>
              <span>Lista de Categorías</span>
            </Link>
            <Link
              to="/dashboard/products/new"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <span>➕</span>
              <span>Nuevo Producto</span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/dashboard/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="font-bold text-xl text-gray-800">Productos</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Gestionar productos, precios y disponibilidad
            </p>
          </Link>
          <Link
            to="/dashboard/categories"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-green-500"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="font-bold text-xl text-gray-800">Categorías</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Gestionar categorías y subcategorías
            </p>
          </Link>
          <Link
            to="/dashboard/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 border-2 border-transparent hover:border-purple-500"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="font-bold text-xl text-gray-800">Órdenes</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Ver y gestionar todas las órdenes
            </p>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
