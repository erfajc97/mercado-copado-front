import { Link, Outlet, createFileRoute, useLocation } from '@tanstack/react-router'
import { Store, Users } from 'lucide-react'
import { useAuthStore } from '@/app/store/auth/authStore'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { roles } = useAuthStore()
  const location = useLocation()

  if (roles !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6">
          Solo los administradores pueden acceder a esta sección
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-coffee text-white px-6 py-3 rounded-lg hover:opacity-90 shadow-coffee hover:shadow-coffee-md transition-all duration-200 font-semibold"
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
            <h1 className="text-2xl font-bold text-coffee-darker">
              Dashboard Admin
            </h1>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-coffee text-white px-6 py-3 rounded-lg hover:opacity-90 shadow-coffee hover:shadow-coffee-md transition-all duration-200 font-semibold"
            >
              <Store size={18} />
              <span>Volver a la Tienda</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/dashboard/products"
            className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 border-2 ${
              location.pathname.startsWith('/dashboard/products')
                ? 'border-coffee-medium'
                : 'border-transparent hover:border-blue-500'
            }`}
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
            className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 border-2 ${
              location.pathname.startsWith('/dashboard/categories')
                ? 'border-coffee-medium'
                : 'border-transparent hover:border-green-500'
            }`}
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
            className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 border-2 ${
              location.pathname.startsWith('/dashboard/orders')
                ? 'border-coffee-medium'
                : 'border-transparent hover:border-purple-500'
            }`}
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
          <Link
            to="/dashboard/users"
            className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 border-2 ${
              location.pathname.startsWith('/dashboard/users')
                ? 'border-coffee-medium'
                : 'border-transparent hover:border-orange-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-orange-600" />
              </div>
              <h3 className="font-bold text-xl text-gray-800">Usuarios</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Gestionar usuarios y sus datos
            </p>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
