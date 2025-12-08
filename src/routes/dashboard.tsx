import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { roles } = useAuthStore()
  const navigate = useNavigate()

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
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800"
            >
              Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/dashboard/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Productos</h3>
            <p className="text-gray-600 text-sm">Gestionar productos</p>
          </Link>
          <Link
            to="/dashboard/categories"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Categorías</h3>
            <p className="text-gray-600 text-sm">Gestionar categorías</p>
          </Link>
          <Link
            to="/dashboard/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Órdenes</h3>
            <p className="text-gray-600 text-sm">Ver todas las órdenes</p>
          </Link>
          <Link
            to="/dashboard/stats"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Estadísticas</h3>
            <p className="text-gray-600 text-sm">Ver estadísticas</p>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

