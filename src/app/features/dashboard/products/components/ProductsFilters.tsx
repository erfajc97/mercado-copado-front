import { Input, Select } from 'antd'
import { Search } from 'lucide-react'
import type { ProductsDashboardHookReturn } from './types'

const { Option } = Select

interface ProductsFiltersProps {
  hook: ProductsDashboardHookReturn
}

export const ProductsFilters = ({ hook }: ProductsFiltersProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input
          placeholder="Buscar por nombre..."
          prefix={<Search size={16} />}
          value={hook.searchText}
          onChange={(e) => {
            hook.setSearchText(e.target.value)
            hook.setCurrentPage(1)
          }}
          allowClear
        />
        <Select
          placeholder="Filtrar por categoría"
          value={hook.categoryFilter || undefined}
          onChange={(value) => {
            hook.setCategoryFilter(value)
            hook.setSubcategoryFilter('')
            hook.setCurrentPage(1)
          }}
          allowClear
          showSearch
        >
          {hook.categories?.map((category: any) => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por subcategoría"
          value={hook.subcategoryFilter || undefined}
          onChange={(value) => {
            hook.setSubcategoryFilter(value)
            hook.setCurrentPage(1)
          }}
          allowClear
          disabled={!hook.categoryFilter}
          showSearch
        >
          {hook.subcategories.map((subcategory: any) => (
            <Option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por precio"
          value={hook.priceFilter || undefined}
          onChange={(value) => {
            hook.setPriceFilter(value)
            hook.setCurrentPage(1)
          }}
          allowClear
        >
          <Option value="0-50">$0 - $50</Option>
          <Option value="50-100">$50 - $100</Option>
          <Option value="100-200">$100 - $200</Option>
          <Option value="200+">$200+</Option>
        </Select>
        <Select
          placeholder="Filtrar por estado"
          value={hook.statusFilter}
          onChange={(value) => {
            hook.setStatusFilter(value)
            hook.setCurrentPage(1)
          }}
        >
          <Option value="all">Todos</Option>
          <Option value="active">Activos</Option>
          <Option value="inactive">Inactivos</Option>
        </Select>
      </div>
    </div>
  )
}
