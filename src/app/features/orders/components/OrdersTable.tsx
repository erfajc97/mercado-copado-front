import { Link } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { Button } from '@heroui/react'
import { getStatusColor } from '../helpers/getStatusColor'
import { getStatusLabel } from '../helpers/getStatusLabel'
import { getPaymentProviderLabel } from '../helpers/getPaymentProviderLabel'
import type { Column } from '@/components/UI/table-nextui/CustomTableNextUi'
import { formatUSD } from '@/app/services/currencyService'
import CustomTableNextUi from '@/components/UI/table-nextui/CustomTableNextUi'
import CustomPagination from '@/components/UI/table-nextui/CustomPagination'

interface OrderData {
  id: string
  user?: {
    email?: string
    firstName?: string
    lastName?: string
  }
  createdAt: string
  total: number | string
  status: string
  items?: Array<{ quantity?: number }>
  payments?: Array<{
    clientTransactionId?: string
    status: string
    paymentProvider?: string
    payphoneData?: { paymentId?: string } | string
  }>
}

interface OrdersTableProps {
  orders: Array<OrderData>
  isLoading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewOrder: (orderId: string) => void
  formatDate: (date: string) => string
  onVerifyOrderPayment?: (order: OrderData) => void
  verifyingOrders?: Set<string>
}

export const OrdersTable = ({
  orders,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onViewOrder,
  formatDate,
  onVerifyOrderPayment,
  verifyingOrders = new Set(),
}: OrdersTableProps) => {
  const columns: Array<Column> = [
    {
      name: 'ID Orden',
      uid: 'id',
      width: 120,
    },
    {
      name: 'Usuario',
      uid: 'user',
    },
    {
      name: 'Fecha',
      uid: 'createdAt',
      sortable: true,
    },
    {
      name: 'Total',
      uid: 'total',
      align: 'end',
      sortable: true,
    },
    {
      name: 'Estado',
      uid: 'status',
    },
    {
      name: 'Método de pago',
      uid: 'paymentMethod',
    },
    {
      name: 'Productos',
      uid: 'items',
      align: 'center',
    },
    {
      name: 'Acciones',
      uid: 'actions',
      width: 100,
    },
  ]

  const renderCell = (order: OrderData, columnKey: React.Key) => {
    switch (columnKey) {
      case 'id':
        return (
          <Link
            to="/admin/orders/$orderId"
            params={{ orderId: order.id }}
            className="text-coffee-medium hover:text-coffee-darker font-semibold font-mono text-xs"
          >
            #{order.id.slice(0, 8)}
          </Link>
        )
      case 'user':
        return (
          <div>
            <div className="font-medium">
              {order.user?.email || 'N/A'}
            </div>
            {order.user?.firstName && (
              <div className="text-xs text-gray-500">
                {order.user.firstName} {order.user.lastName || ''}
              </div>
            )}
          </div>
        )
      case 'createdAt':
        return formatDate(order.createdAt)
      case 'total':
        return (
          <span className="font-semibold text-green-600">
            {formatUSD(Number(order.total))}
          </span>
        )
      case 'status':
        return (
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
          >
            {getStatusLabel(order.status)}
          </span>
        )
      case 'paymentMethod':
        return (
          <span className="text-sm text-gray-600">
            {order.status === 'pending'
              ? '—'
              : getPaymentProviderLabel(order.payments?.[0]?.paymentProvider)}
          </span>
        )
      case 'items':
        return (
          <span className="text-sm text-gray-600">
            {order.items?.length || 0} item(s)
          </span>
        )
      case 'actions': {
        const isPending = order.status === 'pending'
        const hasPendingPayment =
          isPending &&
          order.payments &&
          order.payments.some(
            (p) => p.clientTransactionId && p.status === 'pending',
          )
        const isVerifying = verifyingOrders.has(order.id)

        // Detectar si es un pago por link (no se puede verificar manualmente)
        let isLinkPayment = false
        const isMercadoPago = (() => {
          if (!hasPendingPayment || !order.payments) return false
          const p = order.payments.find(
            (x) => x.clientTransactionId && x.status === 'pending',
          )
          return p?.paymentProvider === 'MERCADOPAGO'
        })()
        if (hasPendingPayment && order.payments) {
          const payment = order.payments.find(
            (p) => p.clientTransactionId && p.status === 'pending',
          )
          if (payment?.payphoneData) {
            const payphoneDataRaw = payment.payphoneData
            if (typeof payphoneDataRaw === 'string') {
              try {
                const parsed = JSON.parse(payphoneDataRaw)
                isLinkPayment = !!parsed?.paymentId
              } catch (e) {
                // Ignorar error de parsing
              }
            } else if (typeof payphoneDataRaw === 'object') {
              isLinkPayment = !!payphoneDataRaw.paymentId
            }
          }
        }

        // Solo mostrar el botón de verificación para pagos por teléfono (no link, no Mercado Pago)
        const canVerify = hasPendingPayment && !isLinkPayment && !isMercadoPago

        return (
          <div className="flex gap-2">
            {canVerify && onVerifyOrderPayment && (
              <Button
                variant="solid"
                color="primary"
                size="sm"
                onPress={() => onVerifyOrderPayment(order)}
                isLoading={isVerifying}
                disabled={isVerifying}
              >
                Verificar pago
              </Button>
            )}
            <Button
              variant="light"
              size="sm"
              onPress={() => onViewOrder(order.id)}
              isIconOnly
            >
              <Eye size={16} />
            </Button>
          </div>
        )
      }
      default:
        return null
    }
  }

  const items = orders.map((order: OrderData) => ({
    ...order,
    id: order.id,
  }))

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <CustomTableNextUi
        items={items}
        columns={columns}
        renderCell={renderCell}
        loading={isLoading}
        bottomContent={
          <CustomPagination
            page={page}
            pages={totalPages}
            setPage={onPageChange}
            isLoading={isLoading}
          />
        }
      />
    </div>
  )
}
