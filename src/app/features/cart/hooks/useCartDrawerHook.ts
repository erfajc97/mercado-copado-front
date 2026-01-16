import { useMemo, useState } from 'react'
import { calculateItemPrice as calculateItemPriceHelper } from '../helpers/calculateItemPrice'
import type { CartItem } from '@/app/store/cart/cartStore'
import { useCartStore } from '@/app/store/cart/cartStore'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import {
  useClearCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@/app/features/cart/mutations/useCartMutations'
import { useCurrency } from '@/app/hooks/useCurrency'

interface UseCartDrawerHookProps {
  onClose: () => void
}

export const useCartDrawerHook = ({ onClose }: UseCartDrawerHookProps) => {
  const {
    items: localItems,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCartStore()
  const { token } = useAuthStore()
  const { formatPrice } = useCurrency()

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const isAuthenticated = !!token

  // Obtener carrito de BD si está autenticado
  const { data: dbCartItems, isLoading: isLoadingCart } = useCartQuery({
    enabled: isAuthenticated,
  })

  const { mutateAsync: updateCartItem } = useUpdateCartItemMutation()
  const { mutateAsync: removeCartItem } = useRemoveCartItemMutation()
  const { mutateAsync: clearCartMutation, isPending: isClearingCart } =
    useClearCartMutation()

  // Convertir items de BD al formato del store
  const convertDbItemToCartItem = (item: {
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
  }): CartItem => ({
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
  })

  // Usar carrito de BD si está autenticado, sino usar localStorage
  const items = useMemo(() => {
    if (isAuthenticated && dbCartItems) {
      return dbCartItems.map(convertDbItemToCartItem)
    }
    return localItems
  }, [isAuthenticated, dbCartItems, localItems])

  // Calcular total
  const total = useMemo(() => {
    return items.reduce((sum: number, item: CartItem) => {
      const finalPrice = calculateItemPriceHelper(
        item.product.price,
        item.product.discount,
      )
      return sum + finalPrice * item.quantity
    }, 0)
  }, [items])

  // Calcular cantidad total de items
  const itemCount = useMemo(() => {
    return items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
  }, [items])

  // Calcular precio final de un item (con descuento)
  const calculateItemPrice = (item: CartItem) => {
    return calculateItemPriceHelper(item.product.price, item.product.discount)
  }

  // Actualizar cantidad de un item
  const handleUpdateQuantity = async (
    itemId: string,
    productId: string,
    quantity: number,
  ) => {
    if (isAuthenticated) {
      try {
        await updateCartItem({ id: itemId, quantity })
      } catch (error) {
        console.error('Error updating cart:', error)
      }
    } else {
      updateQuantity(productId, quantity)
    }
  }

  // Eliminar un item del carrito
  const handleRemoveItem = async (itemId: string, productId: string) => {
    if (isAuthenticated) {
      try {
        await removeCartItem(itemId)
      } catch (error) {
        console.error('Error removing from cart:', error)
      }
    } else {
      removeItem(productId)
    }
  }

  // Manejar checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      onClose() // Cerrar drawer primero
      setIsAuthModalOpen(true)
      return
    }
    onClose()
  }

  // Limpiar carrito
  const handleClearCart = async () => {
    if (isAuthenticated) {
      try {
        await clearCartMutation()
      } catch (error) {
        console.error('Error clearing cart:', error)
      }
    } else {
      clearCart()
    }
  }

  return {
    // Estados
    isAuthModalOpen,
    setIsAuthModalOpen,
    isLoadingCart,
    isClearingCart,

    // Datos
    items,
    total,
    itemCount,
    isAuthenticated,

    // Funciones
    handleUpdateQuantity,
    handleRemoveItem,
    handleCheckout,
    handleClearCart,
    calculateItemPrice,
    formatPrice,
  }
}
