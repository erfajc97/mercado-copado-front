import { Link, createFileRoute } from '@tanstack/react-router'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@/app/features/cart/mutations/useCartMutations'
import { useCartStore } from '@/app/store/cart/cartStore'

export const Route = createFileRoute('/cart')({
  component: Cart,
})

function Cart() {
  const { data: cartItems, isLoading } = useCartQuery()
  const { updateQuantity, removeItem } = useCartStore()
  const { mutateAsync: updateItem } = useUpdateCartItemMutation()
  const { mutateAsync: removeCartItem } = useRemoveCartItemMutation()

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
        <h1 className="text-2xl font-bold mb-4">Carrito Vacío</h1>
        <p className="text-gray-600 mb-6">No tienes productos en tu carrito</p>
        <Link
          to="/"
          className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
        >
          Continuar Comprando
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Carrito</h1>
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
                className="bg-white rounded-lg shadow-md p-6 flex gap-4"
              >
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      {discount > 0 && (
                        <span className="text-gray-500 line-through mr-2">
                          ${price.toFixed(2)}
                        </span>
                      )}
                      <span className="text-xl font-bold text-green-600">
                        ${finalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 border rounded flex items-center justify-center"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 border rounded flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id, item.productId)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    ${(finalPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Resumen</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold text-center"
            >
              Proceder al Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
