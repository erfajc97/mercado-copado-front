import { Button } from '@heroui/react'
import type { CheckoutHookReturn } from './types'

interface CheckoutSummaryProps {
  checkout: CheckoutHookReturn
  onSuccess?: () => void
}

export const CheckoutSummary = ({ checkout }: CheckoutSummaryProps) => {
  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-coffee p-6">
        <h2 className="text-xl font-bold mb-4 text-coffee-darker">
          Resumen de Orden
        </h2>
        <div className="space-y-4">
          {checkout.cartItems?.map((item: any) => {
            const finalPrice = checkout.calculateItemFinalPrice(item)
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
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.product.discount > 0 && (
                      <>
                        <span className="text-gray-400 line-through text-sm">
                          {checkout.isAdmin
                            ? checkout.formatUSD(Number(item.product.price))
                            : checkout.formatPrice(Number(item.product.price))}
                        </span>
                        {checkout.isAdmin && checkout.currency === 'ARS' && (
                          <span className="text-gray-400 line-through text-sm">
                            {checkout.formatPrice(Number(item.product.price))}
                          </span>
                        )}
                      </>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-coffee-dark font-bold">
                        {checkout.isAdmin
                          ? checkout.formatUSD(finalPrice)
                          : checkout.formatPrice(finalPrice)}{' '}
                        c/u
                      </span>
                      {checkout.isAdmin && checkout.currency === 'ARS' && (
                        <span className="text-sm font-semibold text-coffee-medium">
                          / {checkout.formatPrice(finalPrice)} c/u
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-lg font-bold text-coffee-darker">
                      {checkout.isAdmin
                        ? checkout.formatUSD(finalPrice * item.quantity)
                        : checkout.formatPrice(finalPrice * item.quantity)}
                    </span>
                    {checkout.isAdmin && checkout.currency === 'ARS' && (
                      <span className="text-sm font-semibold text-coffee-medium">
                        {checkout.formatPrice(finalPrice * item.quantity)}
                      </span>
                    )}
                  </div>
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
            <div className="flex items-center gap-2">
              <span>
                {checkout.isAdmin
                  ? checkout.formatUSD(checkout.total)
                  : checkout.formatPrice(checkout.total)}
              </span>
              {checkout.isAdmin && checkout.currency === 'ARS' && (
                <span className="text-sm font-semibold text-coffee-medium">
                  / {checkout.formatPrice(checkout.total)}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-between font-bold text-xl pt-4 border-t">
            <span>Total:</span>
            <div className="flex items-center gap-2">
              <span>
                {checkout.isAdmin
                  ? checkout.formatUSD(checkout.total)
                  : checkout.formatPrice(checkout.total)}
              </span>
              {checkout.isAdmin && checkout.currency === 'ARS' && (
                <span className="text-base font-semibold text-coffee-medium">
                  / {checkout.formatPrice(checkout.total)}
                </span>
              )}
            </div>
          </div>
        </div>

        {checkout.selectedPaymentProvider === 'PAYPHONE' ? (
          <div className="space-y-4">
            <p className="text-coffee-darker font-semibold text-center">
              Selecciona una opción de pago arriba
            </p>
            <p className="text-sm text-gray-600 text-center">
              Elige entre pagar con link o con teléfono para continuar
            </p>
          </div>
        ) : !checkout.clientTransactionId ? (
          <Button
            color="primary"
            onPress={checkout.handleCreatePaymentTransaction}
            isDisabled={
              checkout.isPending ||
              !checkout.selectedAddressId ||
              !checkout.selectedPaymentProvider ||
              (checkout.selectedPaymentProvider === 'CASH_DEPOSIT' &&
                !checkout.depositImage)
            }
            isLoading={checkout.isPending}
            className="w-full bg-gradient-coffee border-none hover:opacity-90 font-semibold mb-4 shadow-coffee hover:shadow-coffee-md"
            size="lg"
          >
            {checkout.isPending ? 'Preparando pago...' : 'Pagar'}
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-green-600 font-semibold text-center">
              Transacción creada exitosamente
            </p>
            <p className="text-sm text-gray-600 text-center">
              Completa el pago usando las opciones en la sección de Método de
              Pago
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
