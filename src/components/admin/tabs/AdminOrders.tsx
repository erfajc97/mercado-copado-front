import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button, Input, Select, Table } from 'antd'
import { Eye, Search } from 'lucide-react'
import type { ColumnsType } from 'antd/es/table'
import { useAllOrdersQuery } from '@/app/features/orders/queries/useOrdersQuery'

interface OrderData {
  id: string
  total: number | string
  status: string
  createdAt: string
  user?: {
    firstName: string
    lastName?: string
    email: string
  }
  items?: Array<{ quantity: number }>
}

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'processing', label: 'Procesando' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'created', label: 'Creada' },
  { value: 'shipping', label: 'En Envío' },
  { value: 'delivered', label: 'Entregada' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  created: 'bg-gray-100 text-gray-800',
  shipping: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
}

interface AdminOrdersProps {
  onClose?: () => void
}

export default function AdminOrders({ onClose }: AdminOrdersProps) {
  const navigate = useNavigate()
  const { data: orders, isLoading } = useAllOrdersQuery()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const filteredOrders = useMemo(() => {
    if (!orders) return []

    let filtered = [...orders]

    // Filtrar por búsqueda (código de orden)
    if (searchText) {
      filtered = filtered.filter((order: OrderData) =>
        order.id.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (statusFilter) {
      filtered = filtered.filter(
        (order: OrderData) => order.status === statusFilter,
      )
    }

    // Ordenar por fecha descendente (más recientes primero)
    filtered.sort((a: OrderData, b: OrderData) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    return filtered
  }, [orders, searchText, statusFilter])

  const columns: ColumnsType<OrderData> = [
    {
      title: 'ID Orden',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span className="font-mono text-sm">#{id.slice(0, 8)}</span>
      ),
    },
    {
      title: 'Usuario',
      key: 'user',
      render: (_, record: OrderData) => {
        if (record.user) {
          return (
            <div>
              <p className="font-semibold text-coffee-darker">
                {record.user.firstName} {record.user.lastName || ''}
              </p>
              <p className="text-xs text-gray-500">{record.user.email}</p>
            </div>
          )
        }
        return <span className="text-gray-400">N/A</span>
      },
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number | string) => (
        <span className="font-bold text-coffee-dark">
          ${Number(total).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusLabel =
          statusOptions.find((opt) => opt.value === status)?.label || status
        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              statusColors[status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {statusLabel}
          </span>
        )
      },
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      },
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record: OrderData) => (
        <Button
          type="primary"
          icon={<Eye size={16} />}
          onClick={() => {
            navigate({
              to: '/admin/orders/$orderId',
              params: { orderId: record.id },
            })
            // Cerrar drawer después de navegar, especialmente importante en mobile
            if (onClose) {
              setTimeout(() => {
                onClose()
              }, 100)
            }
          }}
          className="bg-gradient-coffee border-none hover:opacity-90"
        >
          Ver Detalles
        </Button>
      ),
    },
  ]

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4 sm:mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Buscar por código de orden..."
            prefix={<Search size={16} className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            className="flex-1 w-full sm:w-auto"
          />
          <Select
            placeholder="Filtrar por estado"
            value={statusFilter || undefined}
            onChange={(value) => setStatusFilter(value || '')}
            allowClear
            size="large"
            className="w-full sm:w-48"
          >
            {statusOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredOrders}
          loading={isLoading}
          rowKey="id"
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total: ${total} órdenes`,
          }}
        />
      </div>
    </div>
  )
}
