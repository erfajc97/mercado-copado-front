import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { Select } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { getStatusColor } from '../stats/helpers/getStatusColor'
import { getStatusLabel } from '../stats/helpers/getStatusLabel'
import { getValidStatusOptions } from './data'
import { useOrderQuery } from '@/app/features/orders/queries/useOrdersQuery'
import { useUpdateOrderStatusMutation } from '@/app/features/orders/mutations/useOrderMutations'
import { useCurrency } from '@/app/hooks/useCurrency'
import { formatUSD } from '@/app/services/currencyService'

interface AdminOrderDetailProps {
  orderId: string
}

export function AdminOrderDetail({ orderId }: AdminOrderDetailProps) {
  const navigate = useNavigate()
  const { data: order, isLoading, refetch } = useOrderQuery(orderId, true)
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatusMutation()
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const { formatPrice, currency } = useCurrency()

  const handleStatusChange = async () => {
    if (!selectedStatus || !order) return

    try {
      await updateStatus({
        orderId: order.id,
        status: selectedStatus,
      })
      setSelectedStatus('')
      refetch()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-medium"></div>
        <p className="mt-4 text-coffee-darker">Cargando orden...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">Orden no encontrada</p>
        <Button
          variant="flat"
          onPress={() => navigate({ to: '/dashboard/orders' })}
          className="mt-4"
        >
          Volver a Órdenes
        </Button>
      </div>
    )
  }

  const validStatusOptions = getValidStatusOptions(order.status)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="light"
          startContent={<ArrowLeft size={18} />}
          onPress={() => navigate({ to: '/dashboard/orders' })}
        >
          Volver a Órdenes
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-coffee-darker mb-2">
              Orden #{order.id.slice(0, 8)}
            </h1>
            <p className="text-gray-600">
              Creada el{' '}
              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>

        {validStatusOptions.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cambiar Estado:
            </label>
            <div className="flex gap-2">
              <Select
                style={{ width: 200 }}
                placeholder="Seleccionar nuevo estado"
                value={selectedStatus || undefined}
                onChange={setSelectedStatus}
                options={validStatusOptions}
              />
              <Button
                color="primary"
                onPress={handleStatusChange}
                isLoading={isUpdating}
                isDisabled={!selectedStatus || isUpdating}
                className="bg-gradient-coffee border-none hover:opacity-90"
              >
                Actualizar Estado
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-coffee-darker mb-3">
              Información del Cliente
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Email:</span>{' '}
                {order.user?.email}
              </p>
              {order.user?.firstName && (
                <p>
                  <span className="font-semibold">Nombre:</span>{' '}
                  {order.user.firstName} {order.user.lastName || ''}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-coffee-darker mb-3">
              Información de Pago
            </h3>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Total:</span>{' '}
                <span className="text-xl font-bold text-green-600">
                  {formatUSD(Number(order.total))}
                </span>
              </p>
              {currency === 'ARS' && (
                <p className="text-sm text-gray-600">
                  {formatPrice(Number(order.total))}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Imagen del Depósito si existe */}
        {order.depositImageUrl && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-coffee-darker mb-3">
              Comprobante de Depósito
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <img
                src={order.depositImageUrl}
                alt="Comprobante de depósito"
                className="max-w-full h-auto rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(order.depositImageUrl, '_blank')}
              />
              <p className="text-xs text-gray-500 mt-2">
                Haz clic en la imagen para verla en tamaño completo
              </p>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-coffee-darker mb-3">
            Productos
          </h3>
          <div className="space-y-4">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                {item.product?.images?.[0]?.url && (
                  <img
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{item.product?.name}</p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatUSD(Number(item.price) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {order.address && (
          <div>
            <h3 className="text-lg font-semibold text-coffee-darker mb-3">
              Dirección de Envío
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700">
              <p>{order.address.street}</p>
              {order.address.city && (
                <p>
                  {order.address.city}
                  {order.address.state && `, ${order.address.state}`}
                </p>
              )}
              {order.address.zipCode && (
                <p>Código Postal: {order.address.zipCode}</p>
              )}
              {order.address.country && <p>{order.address.country}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
