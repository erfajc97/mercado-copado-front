import { Input, Select } from 'antd'
import { Search } from 'lucide-react'
import { COUNTRIES } from '@/app/constants/countries'

interface UsersFiltersProps {
  searchText: string
  onSearchChange: (value: string) => void
  countryFilter: string
  onCountryFilterChange: (value: string) => void
}

export const UsersFilters = ({
  searchText,
  onSearchChange,
  countryFilter,
  onCountryFilterChange,
}: UsersFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          size="large"
          placeholder="Buscar por ID, nombre, email o documento..."
          prefix={<Search size={18} className="text-gray-400" />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
          allowClear
        />
        <Select
          size="large"
          placeholder="Filtrar por país"
          value={countryFilter || undefined}
          onChange={(value) => onCountryFilterChange(value || '')}
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={COUNTRIES}
          className="w-full sm:w-64"
        />
      </div>
    </div>
  )
}
