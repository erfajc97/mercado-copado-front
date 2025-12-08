import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Filter, Search } from 'lucide-react'
import type { Category } from '@/app/features/categories/types'
import type { Product } from '@/app/features/products/types'
import { ProductCard } from '@/app/features/products/components/ProductCard'
import { useAllCategoriesQuery } from '@/app/features/categories/queries/useCategoriesQuery'
import { useProductsQuery } from '@/app/features/products/queries/useProductsQuery'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const { data: products, isLoading } = useProductsQuery({
    categoryId: selectedCategory,
    search: searchTerm || undefined,
  })
  const { data: categories } = useAllCategoriesQuery()

  return (
    <div className="min-h-screen bg-beige-light">
      {/* Content Area */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de Filtros - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-coffee p-6 sticky top-24">
              <h2 className="text-xl font-bold text-coffee-darker mb-4 flex items-center gap-2">
                <Filter size={20} />
                Filtros
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    !selectedCategory
                      ? 'bg-gradient-coffee text-white font-semibold shadow-coffee'
                      : 'bg-gray-100 text-coffee-darker hover:bg-gray-200'
                  }`}
                >
                  Todas las categorías
                </button>
                {categories?.map((category: Category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-gradient-coffee text-white font-semibold shadow-coffee'
                        : 'bg-gray-100 text-coffee-darker hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Contenido Principal */}
          <div className="flex-1 min-w-0">
            {/* Buscador */}
            <div className="bg-white rounded-lg shadow-coffee-md p-6 mb-6">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-coffee-medium"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar productos por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-coffee-light rounded-lg focus:outline-none focus:border-coffee-medium transition-colors text-coffee-darker"
                />
              </div>

              {/* Botón de filtros para mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-coffee text-white rounded-lg shadow-coffee hover:opacity-90 transition-opacity"
              >
                <Filter size={18} />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </button>

              {/* Filtros Mobile */}
              {showFilters && (
                <div className="lg:hidden mt-4 space-y-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(undefined)
                      setShowFilters(false)
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      !selectedCategory
                        ? 'bg-gradient-coffee text-white font-semibold shadow-coffee'
                        : 'bg-gray-100 text-coffee-darker hover:bg-gray-200'
                    }`}
                  >
                    Todas las categorías
                  </button>
                  {categories?.map((category: Category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id)
                        setShowFilters(false)
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-gradient-coffee text-white font-semibold shadow-coffee'
                          : 'bg-gray-100 text-coffee-darker hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grid de Productos */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-medium"></div>
                <p className="mt-4 text-coffee-darker">Cargando productos...</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-coffee p-12 text-center">
                <p className="text-coffee-darker text-lg mb-2">
                  No se encontraron productos
                </p>
                <p className="text-gray-500 text-sm">
                  Intenta con otros filtros o términos de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
