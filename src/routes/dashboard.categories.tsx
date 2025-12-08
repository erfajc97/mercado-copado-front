import { createFileRoute } from '@tanstack/react-router'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'

export const Route = createFileRoute('/dashboard/categories')({
  component: DashboardCategories,
})

function DashboardCategories() {
  const { data: categories, isLoading } = useAllCategoriesQuery()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categorías</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Nueva Categoría
        </button>
      </div>
      {isLoading ? (
        <div className="text-center py-12">Cargando...</div>
      ) : categories && categories.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subcategorías
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Productos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category: any) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.subcategories?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category._count?.products || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800 mr-4">
                      Editar
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No hay categorías
        </div>
      )}
    </div>
  )
}

