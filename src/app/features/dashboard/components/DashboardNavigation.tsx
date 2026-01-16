import { Link, useLocation } from '@tanstack/react-router'
import { FolderTree, Package, ShoppingCart, Users } from 'lucide-react'

export function DashboardNavigation() {
  const location = useLocation()

  const navigationItems = [
    {
      key: 'products',
      path: '/dashboard/products',
      label: 'Productos',
      icon: Package,
      description: 'Gestionar productos, precios y disponibilidad',
      color: 'blue',
    },
    {
      key: 'categories',
      path: '/dashboard/categories',
      label: 'Categorías',
      icon: FolderTree,
      description: 'Gestionar categorías y subcategorías',
      color: 'green',
    },
    {
      key: 'orders',
      path: '/dashboard/orders',
      label: 'Órdenes',
      icon: ShoppingCart,
      description: 'Ver y gestionar todas las órdenes',
      color: 'purple',
    },
    {
      key: 'users',
      path: '/dashboard/users',
      label: 'Usuarios',
      icon: Users,
      description: 'Gestionar usuarios y sus datos',
      color: 'orange',
    },
  ]

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.path)
        const colorClasses = {
          blue: 'bg-blue-100',
          green: 'bg-green-100',
          purple: 'bg-purple-100',
          orange: 'bg-orange-100',
        }

        return (
          <Link key={item.key} to={item.path}>
            <div
              className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 border-2 ${
                active
                  ? 'border-coffee-medium'
                  : 'border-transparent hover:border-coffee-medium'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 ${colorClasses[item.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}
                >
                  <Icon size={24} className={`text-${item.color}-600`} />
                </div>
                <h3 className="font-bold text-xl text-gray-800">
                  {item.label}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
