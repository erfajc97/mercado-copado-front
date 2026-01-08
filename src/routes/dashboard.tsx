import {
  Link,
  Outlet,
  createFileRoute,
  useLocation,
} from '@tanstack/react-router'
import { Sparkles, Store, Users } from 'lucide-react'
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
        {location.pathname === '/dashboard' ? (
          <div className="relative bg-linear-to-br from-coffee-light/10 via-white to-coffee-medium/5 rounded-2xl shadow-xl overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-coffee-light/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-coffee-medium/20 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-coffee-light/10 rounded-full blur-2xl"></div>
            </div>

            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[500px] p-12 text-center">
              {/* Icono animado */}
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-linear-to-br from-coffee-light to-coffee-medium rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative inline-flex items-center justify-center w-32 h-32 bg-linear-to-br from-coffee-light to-coffee-medium rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Store size={64} className="text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles
                    size={32}
                    className="text-coffee-medium animate-bounce drop-shadow-md"
                    style={{ animationDuration: '2s' }}
                  />
                </div>
              </div>

              {/* Texto de bienvenida */}
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-coffee-darker to-coffee-medium bg-clip-text text-transparent">
                ¡Bienvenido al Panel!
              </h2>
              <p className="text-xl text-gray-600 mb-2 max-w-md mx-auto">
                Gestiona tu tienda de manera eficiente
              </p>
              <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                Selecciona una de las opciones de arriba para comenzar a
                administrar tu plataforma
              </p>

              {/* Línea decorativa */}
              <div className="flex items-center gap-4 w-full max-w-md mb-8">
                <div className="flex-1 h-px bg-linear-to-r from-transparent via-coffee-light to-coffee-medium"></div>
                <div className="w-2 h-2 rounded-full bg-coffee-medium"></div>
                <div className="flex-1 h-px bg-linear-to-l from-transparent via-coffee-light to-coffee-medium"></div>
              </div>

              {/* Mensaje motivacional */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl px-6 py-4 border border-coffee-light/20 shadow-lg">
                <p className="text-sm text-gray-600 italic">
                  "La organización es la clave del éxito"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  )
}
