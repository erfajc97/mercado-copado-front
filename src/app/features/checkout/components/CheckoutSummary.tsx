import { ButtonPayPhone } from '@/app/components/payphone/components/ButtonPayPhone'

import type { CheckoutHookReturn } from './types'

interface CheckoutSummaryProps {
  checkout: CheckoutHookReturn
  onSuccess: () => void
}

export const CheckoutSummary = ({ checkout, onSuccess }: CheckoutSummaryProps) => {
  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-coffee p-6">
        <h2 className="text-xl font-bold mb-4 text-coffee-darker">
          Resumen de Orden
        </h2>
        <div className="space-y-4">
          {checkout.cartItems?.map((item: any) => {
            const price = Number(item.product.price)
            const discount = Number(item.product.discount || 0)
            const finalPrice = price * (1 - discount / 100)
            const mainImage =
              item.product.images && item.product.images.length > 0
                ? item.product.images[0].url
                : null
            return (
              <div
                key={item.id}
                className="flex gap-4 p-3 bg-gray-50 rounded-lg"
              >
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-coffee-darker mb-1">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">Cantidad:</span>
                    <span className="bg-coffee-medium text-white px-2 py-1 rounded-full text-sm font-bold">
                      x{item.quantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {discount > 0 && (
                      <span className="text-gray-400 line-through text-sm">
                        {checkout.formatPrice(price)}
                      </span>
                    )}
                    <span className="text-coffee-dark font-bold">
                      {checkout.formatPrice(finalPrice)} c/u
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-coffee-darker">
                    {checkout.formatPrice(finalPrice * item.quantity)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Total and Payment */}
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
        <h2 className="text-xl font-bold mb-4">Total</h2>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{checkout.formatPrice(checkout.total)}</span>
          </div>
          <div className="flex justify-between font-bold text-xl pt-4 border-t">
            <span>Total:</span>
            <span>{checkout.formatPrice(checkout.total)}</span>
          </div>
        </div>

        {!checkout.clientTransactionId ? (
          <button
            onClick={checkout.handleCreatePaymentTransaction}
            disabled={
              checkout.isPending ||
              !checkout.selectedAddressId ||
              !checkout.selectedPaymentMethodId
            }
            className="w-full bg-gradient-coffee text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold mb-4 shadow-coffee hover:shadow-coffee-md transition-all duration-200"
          >
            {checkout.isPending ? 'Preparando pago...' : 'Pagar'}
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold">
              Transacción creada exitosamente
            </p>
            <ButtonPayPhone
              amount={checkout.transactionTotal}
              addressId={checkout.selectedAddressId}
              paymentMethodId={checkout.selectedPaymentMethodId}
              clientTransactionId={checkout.clientTransactionId}
              onSuccess={onSuccess}
            />
          </div>
        )}
      </div>
    </div>
  )
}

