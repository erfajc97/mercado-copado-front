import { Input } from 'antd'
import { Search } from 'lucide-react'
import { useCategoriesStore } from '@/app/store/categories/categoriesStore'

export const CategoriesFilters = () => {
  const {
    searchText,
    subcategorySearchText,
    setSearchText,
    setSubcategorySearchText,
  } = useCategoriesStore()

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar categorías..."
          prefix={<Search size={16} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="flex-1"
        />
        <Input
          placeholder="Buscar subcategorías..."
          prefix={<Search size={16} />}
          value={subcategorySearchText}
          onChange={(e) => setSubcategorySearchText(e.target.value)}
          allowClear
          className="flex-1"
        />
      </div>
    </div>
  )
}
