import { Link, createFileRoute } from '@tanstack/react-router'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@/app/features/cart/mutations/useCartMutations'
import { useCartStore } from '@/app/store/cart/cartStore'
import { useCurrency } from '@/app/hooks/useCurrency'

export const Route = createFileRoute('/cart')({
  component: Cart,
})

function Cart() {
  const { data: cartItems, isLoading } = useCartQuery()
  const { updateQuantity, removeItem } = useCartStore()
  const { mutateAsync: updateItem } = useUpdateCartItemMutation()
  const { mutateAsync: removeCartItem } = useRemoveCartItemMutation()
  const { formatPrice } = useCurrency()

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await updateItem({ id, quantity })
      updateQuantity(id, quantity)
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const handleRemoveItem = async (id: string, productId: string) => {
    try {
      await removeCartItem(id)
      removeItem(productId)
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const calculateTotal = () => {
    if (!cartItems) return 0
    return cartItems.reduce((total: number, item: any) => {
      const price = Number(item.product.price)
      const discount = Number(item.product.discount || 0)
      const finalPrice = price * (1 - discount / 100)
      return total + finalPrice * item.quantity
    }, 0)
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Cargando...</div>
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-coffee-darker">
          Carrito Vacío
        </h1>
        <p className="text-gray-600 mb-6">No tienes productos en tu carrito</p>
        <Link
          to="/"
          className="inline-block bg-gradient-coffee text-white px-6 py-3 rounded-lg hover:opacity-90 shadow-coffee hover:shadow-coffee-md transition-all duration-200 font-semibold border-2 border-coffee-medium"
        >
          Continuar Comprando
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-coffee-darker">Mi Carrito</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item: any) => {
            const price = Number(item.product.price)
            const discount = Number(item.product.discount || 0)
            const finalPrice = price * (1 - discount / 100)
            const mainImage = item.product.images?.[0]?.url

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-coffee p-6 flex gap-4 border-2 border-gray-200 hover:border-coffee-medium hover:shadow-coffee-md transition-all duration-200"
              >
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 text-coffee-darker">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      {discount > 0 && (
                        <span className="text-gray-500 line-through mr-2 text-sm">
                          ${price.toFixed(2)}
                        </span>
                      )}
                      <span className="text-xl font-bold text-coffee-dark">
                        ${finalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 border-2 border-coffee-medium rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-coffee-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrementar cantidad"
                      >
                        <Minus size={16} className="text-coffee-dark" />
                      </button>
                      <span className="px-4 py-2 text-sm font-bold text-coffee-darker min-w-10 text-center bg-coffee-light/30">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-coffee-light transition-colors"
                        aria-label="Incrementar cantidad"
                      >
                        <Plus size={16} className="text-coffee-dark" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.productId)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      <span className="text-sm font-semibold">Eliminar</span>
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-coffee-darker">
                    ${(finalPrice * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Subtotal</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-coffee p-6 sticky top-4 border-2 border-coffee-medium">
            <h2 className="text-xl font-bold mb-4 text-coffee-darker">
              Resumen
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t-2 border-coffee-medium">
                <span className="text-coffee-darker">Total:</span>
                <span className="text-coffee-dark">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-gradient-coffee text-white py-3 rounded-lg hover:opacity-90 shadow-coffee hover:shadow-coffee-md transition-all duration-200 font-semibold text-center"
            >
              Proceder al Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
