import { Input, Select } from 'antd'
import { Search } from 'lucide-react'

const { Option } = Select

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'created', label: 'Creada' },
  { value: 'processing', label: 'Procesando' },
  { value: 'shipping', label: 'En Envío' },
  { value: 'delivered', label: 'Entregada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'paid_pending_review', label: 'Pago en Revisión' },
]

interface OrdersFiltersProps {
  searchText: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
}

export const OrdersFilters = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: OrdersFiltersProps) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          size="large"
          placeholder="Buscar por ID de orden o email de usuario..."
          prefix={<Search size={18} className="text-gray-400" />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1"
          allowClear
        />
        <Select
          size="large"
          placeholder="Filtrar por estado"
          value={statusFilter || undefined}
          onChange={(value) => onStatusFilterChange(value || '')}
          allowClear
          className="w-full sm:w-64"
        >
          {ORDER_STATUSES.map((status) => (
            <Option key={status.value} value={status.value}>
              {status.label}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  )
}
