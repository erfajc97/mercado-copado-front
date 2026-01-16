import { Button } from '@heroui/react'
import { Package } from 'lucide-react'
import CustomModalNextUI from '@/components/UI/customModalNextUI/CustomModalNextUI'
import { formatUSD } from '@/app/services/currencyService'

interface OrderProductsModalProps {
  isOpen: boolean
  onClose: () => void
  order: any | null
  isAdmin: boolean
  formatPrice: (price: number) => string
  currency: string
}

export const OrderProductsModal = ({
  isOpen,
  onClose,
  order,
  isAdmin,
  formatPrice,
  currency,
}: OrderProductsModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  if (!order) return null

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      isDismissable
      size="2xl"
      placement="center"
      headerContent={
        <div className="flex items-center gap-2">
          <Package size={20} className="text-coffee-dark" />
          <span className="text-coffee-darker font-bold text-lg">
            Productos de la Orden #{order.id.slice(0, 8)}
          </span>
        </div>
      }
      footerContent={
        <div className="flex justify-end w-full">
          <Button
            color="primary"
            onPress={onClose}
            className="bg-gradient-coffee border-none hover:opacity-90"
          >
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {order.items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-coffee-medium hover:shadow-coffee transition-all duration-200"
            >
              {item.product?.images?.[0]?.url && (
                <img
                  src={item.product.images[0].url}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg shadow-md"
                />
              )}
              <div className="flex-1">
                <h4 className="font-bold text-lg text-coffee-darker mb-2">
                  {item.product?.name || 'Producto eliminado'}
                </h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Cantidad:</span>{' '}
                    <span className="bg-coffee-light text-coffee-darker px-2 py-1 rounded font-bold">
                      {item.quantity}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600 font-semibold">
                      Precio unitario:
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-coffee-dark font-bold">
                        {isAdmin
                          ? formatUSD(Number(item.price))
                          : formatPrice(Number(item.price))}
                      </span>
                      {isAdmin && currency === 'ARS' && (
                        <span className="text-sm font-semibold text-coffee-medium">
                          / {formatPrice(Number(item.price))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end gap-1">
                  <p className="font-bold text-xl text-coffee-darker">
                    {isAdmin
                      ? formatUSD(Number(item.price) * item.quantity)
                      : formatPrice(Number(item.price) * item.quantity)}
                  </p>
                  {isAdmin && currency === 'ARS' && (
                    <p className="text-sm font-semibold text-coffee-medium">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Subtotal</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-coffee-medium pt-4 mt-4 bg-linear-to-r from-coffee-light/20 to-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-coffee-darker">Total:</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-coffee-dark">
                {isAdmin
                  ? formatUSD(Number(order.total))
                  : formatPrice(Number(order.total))}
              </span>
              {isAdmin && currency === 'ARS' && (
                <span className="text-lg font-semibold text-coffee-medium">
                  / {formatPrice(Number(order.total))}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomModalNextUI>
  )
}
