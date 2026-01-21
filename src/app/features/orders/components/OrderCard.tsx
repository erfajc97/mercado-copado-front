import { Link } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { Eye } from 'lucide-react'
import { getStatusLabel } from '../helpers/getStatusLabel'
import { getStatusColor } from '../helpers/getStatusColor'
import { getPaymentProviderLabel } from '../helpers/getPaymentProviderLabel'
import { formatOrderDateShort } from '../helpers/formatOrderDate'
import { formatUSD } from '@/app/services/currencyService'

interface OrderCardProps {
  order: any
  isAdmin: boolean
  formatPrice: (price: number) => string
  currency: string
  onViewProducts: (order: any, e?: React.MouseEvent | any) => void
  onPayNow: (order: any) => void
  isPaymentButtonDisabled: (order: any) => boolean
  getPaymentButtonText: (order: any) => string
}

export const OrderCard = ({
  order,
  isAdmin,
  formatPrice,
  currency,
  onViewProducts,
  onPayNow,
  isPaymentButtonDisabled,
  getPaymentButtonText,
}: OrderCardProps) => {
  return (
    <div className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link
            to="/orders/$orderId"
            params={{ orderId: order.id }}
            className="block"
          >
            <h3 className="font-semibold text-lg mb-2">
              Orden #{order.id.slice(0, 8)}
            </h3>
            <p className="text-gray-600">
              {formatOrderDateShort(order.createdAt)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {order.items.length} producto(s)
            </p>
            {order.status !== 'pending' &&
              order.payments?.[0]?.paymentProvider && (
                <p className="text-xs text-gray-500 mt-1">
                  Método de pago:{' '}
                  {getPaymentProviderLabel(order.payments[0].paymentProvider)}
                </p>
              )}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="flex flex-col items-end gap-1">
              <p className="text-xl font-bold text-green-600">
                {isAdmin
                  ? formatUSD(Number(order.total))
                  : formatPrice(Number(order.total))}
              </p>
              {isAdmin && currency === 'ARS' && (
                <p className="text-sm font-semibold text-coffee-medium">
                  {formatPrice(Number(order.total))}
                </p>
              )}
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${getStatusColor(order.status)}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              color="primary"
              startContent={<Eye size={16} />}
              onPress={() => onViewProducts(order, undefined)}
              className="bg-gradient-coffee border-none hover:opacity-90"
            >
              Ver Productos
            </Button>
            {order.status === 'pending' && (
              <Button
                variant="bordered"
                onPress={() => onPayNow(order)}
                isDisabled={isPaymentButtonDisabled(order)}
                className="border-2 border-coffee-medium text-coffee-dark hover:bg-coffee-light"
              >
                {getPaymentButtonText(order)}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
