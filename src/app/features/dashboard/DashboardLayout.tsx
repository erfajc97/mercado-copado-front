import { Link, useLocation } from '@tanstack/react-router'
import { Store, Users } from 'lucide-react'
import DashboardStats from './stats/DashboardStats'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-coffee-darker">
              Dashboard Admin
            </h1>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-coffee text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:opacity-90 shadow-coffee hover:shadow-coffee-md transition-all duration-200 font-semibold text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <Store size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Volver a la Tienda</span>
              <span className="sm:hidden">Tienda</span>
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
        {(() => {
          const isDashboardHome =
            location.pathname === '/dashboard' ||
            location.pathname === '/dashboard/dashboard'
          const isAnyCardSelected =
            location.pathname.startsWith('/dashboard/products') ||
            location.pathname.startsWith('/dashboard/categories') ||
            location.pathname.startsWith('/dashboard/orders') ||
            location.pathname.startsWith('/dashboard/users')

          return isDashboardHome || !isAnyCardSelected ? (
            <DashboardStats />
          ) : (
            children
          )
        })()}
      </div>
    </div>
  )
}
