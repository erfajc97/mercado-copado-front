import { Input } from 'antd'
import { Search } from 'lucide-react'
import type { CategoriesDashboardHookReturn } from './types'

interface CategoriesFiltersProps {
  hook: CategoriesDashboardHookReturn
}

export const CategoriesFilters = ({ hook }: CategoriesFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex gap-4">
        <Input
          placeholder="Buscar categorías..."
          prefix={<Search size={16} />}
          value={hook.searchText}
          onChange={(e) => hook.setSearchText(e.target.value)}
          allowClear
          className="flex-1"
        />
        {hook.viewMode === 'table' && (
          <Input
            placeholder="Buscar subcategorías..."
            prefix={<Search size={16} />}
            value={hook.subcategorySearchText}
            onChange={(e) => hook.setSubcategorySearchText(e.target.value)}
            allowClear
            className="flex-1"
          />
        )}
      </div>
    </div>
  )
}

