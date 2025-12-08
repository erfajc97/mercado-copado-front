import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Button, Drawer, Empty } from 'antd'
import { LogIn, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import AuthModal from './auth/AuthModal'
import type { CartItem } from '@/app/store/cart/cartStore'
import { useCartStore } from '@/app/store/cart/cartStore'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@/app/features/cart/mutations/useCartMutations'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items: localItems, updateQuantity, removeItem } = useCartStore()
  const { token } = useAuthStore()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const isAuthenticated = !!token

  // Obtener carrito de BD si está autenticado
  const { data: dbCartItems, isLoading: isLoadingCart } = useCartQuery({
    enabled: isAuthenticated,
  })
  const { mutateAsync: updateCartItem } = useUpdateCartItemMutation()
  const { mutateAsync: removeCartItem } = useRemoveCartItemMutation()

  // Usar carrito de BD si está autenticado, sino usar localStorage
  const items = useMemo(() => {
    if (isAuthenticated && dbCartItems) {
      // Convertir items de BD al formato del store
      return dbCartItems.map(
        (item: {
          id: string
          productId: string
          quantity: number
          product: {
            id: string
            name: string
            price: number | string
            discount: number | string
            images: Array<{ url: string }>
          }
        }) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            id: item.product.id,
            name: item.product.name,
            price: Number(item.product.price),
            discount: Number(item.product.discount),
            images: item.product.images,
          },
        }),
      )
    }
    return localItems
  }, [isAuthenticated, dbCartItems, localItems])

  const total = useMemo(() => {
    return items.reduce(
      (
        sum: number,
        item: {
          product: { price: number; discount: number }
          quantity: number
        },
      ) => {
        const price = Number(item.product.price)
        const discount = Number(item.product.discount)
        const finalPrice = price * (1 - discount / 100)
        return sum + finalPrice * item.quantity
      },
      0,
    )
  }, [items])

  const itemCount = items.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0,
  )

  const handleUpdateQuantity = async (
    itemId: string,
    productId: string,
    quantity: number,
  ) => {
    if (isAuthenticated) {
      try {
        await updateCartItem({ id: itemId, quantity })
        // La query se invalidará automáticamente
      } catch (error) {
        console.error('Error updating cart:', error)
      }
    } else {
      updateQuantity(productId, quantity)
    }
  }

  const handleRemoveItem = async (itemId: string, productId: string) => {
    if (isAuthenticated) {
      try {
        await removeCartItem(itemId)
        // La query se invalidará automáticamente
      } catch (error) {
        console.error('Error removing from cart:', error)
      }
    } else {
      removeItem(productId)
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true)
      return
    }
    onClose()
    // Navigation will be handled by Link component
  }

  return (
    <>
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <ShoppingCart size={24} className="text-coffee-dark" />
            <span className="text-coffee-darker font-bold text-lg">
              Mi Carrito
            </span>
            {itemCount > 0 && (
              <span className="bg-coffee-medium text-white text-xs font-bold px-2 py-1 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
        }
        placement="right"
        onClose={onClose}
        open={isOpen}
        size={400}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        {isLoadingCart ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-medium"></div>
            <p className="mt-4 text-coffee-darker">Cargando carrito...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <Empty
              description={
                <span className="text-gray-500">Tu carrito está vacío</span>
              }
            />
            <Link to="/" onClick={onClose}>
              <Button
                type="primary"
                className="bg-gradient-coffee border-none hover:opacity-90 rounded-lg mt-4"
              >
                Continuar Comprando
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item: CartItem) => {
                const finalPrice =
                  Number(item.product.price) *
                  (1 - Number(item.product.discount) / 100)
                const mainImage =
                  item.product.images.length > 0
                    ? item.product.images[0].url
                    : ''

                return (
                  <div
                    key={item.id || item.productId}
                    className="bg-white rounded-lg shadow-coffee p-4 flex gap-3"
                  >
                    {mainImage && (
                      <img
                        src={mainImage}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-coffee-darker truncate mb-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-2">
                        {item.product.discount > 0 && (
                          <span className="text-gray-400 line-through text-xs">
                            ${Number(item.product.price).toFixed(2)}
                          </span>
                        )}
                        <span className="text-coffee-dark font-bold">
                          ${finalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                handleUpdateQuantity(
                                  item.id,
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                            }}
                            disabled={item.quantity <= 1}
                            className="p-1 hover:bg-coffee-light rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrementar cantidad"
                          >
                            <Minus size={16} className="text-coffee-dark" />
                          </button>
                          <span className="px-3 py-1 text-sm font-semibold text-coffee-darker min-w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              handleUpdateQuantity(
                                item.id,
                                item.productId,
                                item.quantity + 1,
                              )
                            }}
                            className="p-1 hover:bg-coffee-light rounded-r-lg transition-colors"
                            aria-label="Incrementar cantidad"
                          >
                            <Plus size={16} className="text-coffee-dark" />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveItem(item.id, item.productId)
                          }
                          className="text-red-500 hover:text-red-700 p-1"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-coffee-darker">
                  Total:
                </span>
                <span className="text-xl font-bold text-coffee-dark">
                  ${total.toFixed(2)}
                </span>
              </div>
              {isAuthenticated ? (
                <Link to="/checkout" onClick={onClose}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    className="bg-gradient-coffee border-none hover:opacity-90 rounded-lg h-12 font-semibold"
                  >
                    Proceder al Checkout
                  </Button>
                </Link>
              ) : (
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={handleCheckout}
                  className="bg-gradient-coffee border-none hover:opacity-90 rounded-lg h-12 font-semibold flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Iniciar Sesión para Continuar
                </Button>
              )}
            </div>
          </div>
        )}
      </Drawer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </>
  )
}
