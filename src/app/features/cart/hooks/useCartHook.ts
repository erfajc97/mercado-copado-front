import { useMemo } from 'react'
import { calculateItemPrice as calculateItemPriceHelper } from '../helpers/calculateItemPrice'
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from '@/app/features/cart/mutations/useCartMutations'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import { useCurrency } from '@/app/hooks/useCurrency'

export const useCartHook = () => {
  const { data: cartItems, isLoading } = useCartQuery()
  const { mutateAsync: updateItem } = useUpdateCartItemMutation()
  const { mutateAsync: removeCartItem } = useRemoveCartItemMutation()
  const { formatPrice } = useCurrency()

  // Calcular total
  const total = useMemo(() => {
    if (!cartItems) return 0
    return cartItems.reduce((sum: number, item: any) => {
      const finalPrice = calculateItemPriceHelper(
        item.product.price,
        item.product.discount || 0,
      )
      return sum + finalPrice * item.quantity
    }, 0)
  }, [cartItems])

  // Actualizar cantidad de un item
  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      await updateItem({ id, quantity })
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  // Eliminar un item del carrito
  const handleRemoveItem = async (id: string) => {
    try {
      await removeCartItem(id)
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  // Calcular precio final de un item (con descuento)
  const calculateItemPrice = (item: any) => {
    return calculateItemPriceHelper(
      item.product.price,
      item.product.discount || 0,
    )
  }

  return {
    cartItems,
    isLoading,
    total,
    formatPrice,
    handleUpdateQuantity,
    handleRemoveItem,
    calculateItemPrice,
  }
}
