import { Link } from '@tanstack/react-router'
import { Drawer, Empty } from 'antd'
import { Button, useDisclosure } from '@heroui/react'
import { LogIn, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { useCartDrawerHook } from '../hooks/useCartDrawerHook'
import ClearCartModal from './modals/ClearCartModal'
import type { CartItem } from '@/app/store/cart/cartStore'
import AuthModal from '@/app/features/auth/components/AuthModal'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isLoadingCart,
    isClearingCart,
    items,
    total,
    itemCount,
    isAuthenticated,
    handleUpdateQuantity,
    handleRemoveItem,
    handleCheckout,
    handleClearCart,
    calculateItemPrice,
    formatPrice,
  } = useCartDrawerHook({ onClose })

  // Modal de limpiar carrito usando NextUI
  const {
    isOpen: isClearCartModalOpen,
    onOpen: onOpenClearCartModal,
    onClose: onCloseClearCartModal,
  } = useDisclosure()

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
        maskClosable={!isAuthModalOpen}
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
            <Button
              color="primary"
              className="bg-gradient-coffee border-none hover:opacity-90 rounded-lg mt-4"
              as={Link}
              to="/"
              onPress={onClose}
            >
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex justify-end px-4 pt-4">
              <Button
                variant="light"
                color="danger"
                startContent={<X size={16} />}
                onPress={onOpenClearCartModal}
                className="text-sm"
              >
                Limpiar Carrito
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item: CartItem) => {
                const finalPrice = calculateItemPrice(item)
                const mainImage =
                  item.product.images.length > 0
                    ? item.product.images[0].url
                    : ''

                return (
                  <div
                    key={item.id || item.productId}
                    className="bg-white rounded-lg shadow-coffee p-4 flex gap-3 border border-gray-200 hover:border-coffee-medium hover:shadow-coffee-md transition-all duration-200"
                  >
                    {mainImage && (
                      <img
                        src={mainImage}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base text-coffee-darker truncate mb-2">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-2 mb-3">
                        {item.product.discount > 0 && (
                          <span className="text-gray-400 line-through text-sm">
                            ${Number(item.product.price).toFixed(2)}
                          </span>
                        )}
                        <span className="text-coffee-dark font-bold text-lg">
                          ${finalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 border-2 border-coffee-medium rounded-lg overflow-hidden">
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
                            className="p-2 hover:bg-coffee-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Decrementar cantidad"
                          >
                            <Minus size={16} className="text-coffee-dark" />
                          </button>
                          <span className="px-4 py-2 text-sm font-bold text-coffee-darker min-w-10 text-center bg-coffee-light/30">
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
                            className="p-2 hover:bg-coffee-light transition-colors"
                            aria-label="Incrementar cantidad"
                          >
                            <Plus size={16} className="text-coffee-dark" />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            handleRemoveItem(item.id, item.productId)
                          }
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t-2 border-coffee-medium p-4 bg-linear-to-r from-coffee-light/20 to-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-coffee-darker">
                  Total:
                </span>
                <span className="text-2xl font-bold text-coffee-dark">
                  {formatPrice(total)}
                </span>
              </div>
              {isAuthenticated ? (
                <Button
                  color="primary"
                  size="lg"
                  className="w-full bg-gradient-coffee border-none hover:opacity-90 rounded-lg h-12 font-semibold"
                  as={Link}
                  to="/checkout"
                  onPress={onClose}
                >
                  Proceder al Checkout
                </Button>
              ) : (
                <Button
                  color="primary"
                  size="lg"
                  className="w-full bg-gradient-coffee border-none hover:opacity-90 rounded-lg h-12 font-semibold"
                  startContent={<LogIn size={18} />}
                  onPress={handleCheckout}
                >
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
        onOpenChange={(open) => {
          if (!open) {
            setIsAuthModalOpen(false)
          }
        }}
        initialMode="login"
      />

      <ClearCartModal
        isOpen={isClearCartModalOpen}
        onClose={onCloseClearCartModal}
        onConfirm={async () => {
          await handleClearCart()
          onCloseClearCartModal()
        }}
        isLoading={isClearingCart}
      />
    </>
  )
}
