import { Link } from '@tanstack/react-router'
import { Store } from 'lucide-react'
import { DashboardNavigation } from '@/app/features/dashboard/components/DashboardNavigation'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
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
        <DashboardNavigation />
        {children}
      </div>
    </div>
  )
}
