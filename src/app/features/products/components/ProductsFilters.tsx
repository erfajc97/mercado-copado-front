import { Input, Select, SelectItem } from '@heroui/react'
import { Search, X } from 'lucide-react'
import type { useProductsHook } from '../hooks/useProductsHook'

interface ProductsFiltersProps {
  hook: ReturnType<typeof useProductsHook>
}

export const ProductsFilters = ({ hook }: ProductsFiltersProps) => {
  const priceOptions = [
    { key: '0-50', label: '$0 - $50' },
    { key: '50-100', label: '$50 - $100' },
    { key: '100-200', label: '$100 - $200' },
    { key: '200+', label: '$200+' },
  ]

  const statusOptions = [
    { key: 'all', label: 'Todos' },
    { key: 'active', label: 'Activos' },
    { key: 'inactive', label: 'Inactivos' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input
          placeholder="Buscar por nombre..."
          startContent={<Search size={16} className="text-gray-400" />}
          value={hook.searchText}
          onValueChange={(value) => {
            hook.setSearchText(value)
            hook.setCurrentPage(1)
          }}
          endContent={
            hook.searchText ? (
              <button
                onClick={() => {
                  hook.setSearchText('')
                  hook.setCurrentPage(1)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            ) : null
          }
          classNames={{
            input: 'text-sm',
            inputWrapper: 'h-10',
          }}
        />
        <Select
          placeholder="Filtrar por categoría"
          selectedKeys={hook.categoryFilter ? [hook.categoryFilter] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string
            hook.setCategoryFilter(value || '')
            hook.setSubcategoryFilter('')
            hook.setCurrentPage(1)
          }}
          selectionMode="single"
          disallowEmptySelection={false}
          classNames={{
            trigger: 'h-10',
          }}
        >
          {hook.categories.map((category: any) => (
            <SelectItem key={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por subcategoría"
          selectedKeys={hook.subcategoryFilter ? [hook.subcategoryFilter] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string
            hook.setSubcategoryFilter(value || '')
            hook.setCurrentPage(1)
          }}
          selectionMode="single"
          disallowEmptySelection={false}
          isDisabled={!hook.categoryFilter}
          classNames={{
            trigger: 'h-10',
          }}
        >
          {hook.subcategories.map((subcategory: any) => (
            <SelectItem key={subcategory.id}>
              {subcategory.name}
            </SelectItem>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por precio"
          selectedKeys={hook.priceFilter ? [hook.priceFilter] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string
            hook.setPriceFilter(value || '')
            hook.setCurrentPage(1)
          }}
          selectionMode="single"
          disallowEmptySelection={false}
          classNames={{
            trigger: 'h-10',
          }}
        >
          {priceOptions.map((option) => (
            <SelectItem key={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por estado"
          selectedKeys={[hook.statusFilter]}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string
            hook.setStatusFilter(value || 'all')
            hook.setCurrentPage(1)
          }}
          selectionMode="single"
          classNames={{
            trigger: 'h-10',
          }}
        >
          {statusOptions.map((option) => (
            <SelectItem key={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  )
}
