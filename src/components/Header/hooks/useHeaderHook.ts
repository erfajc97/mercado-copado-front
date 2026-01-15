import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCartStore } from '@/app/store/cart/cartStore'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useLogoutMutation } from '@/app/features/auth/login/mutations/useLogoutMutation'
import { userInfoService } from '@/app/features/auth/login/services/userInfoService'
import { useCartQuery } from '@/app/features/cart/queries/useCartQuery'
import { getDolarBlueRate } from '@/app/services/currencyService'

export const useHeaderHook = () => {
  const { token, roles } = useAuthStore()
  const { items: cartItems } = useCartStore()
  const { mutateAsync: logout } = useLogoutMutation()
  const [itemCount, setItemCount] = useState(0)

  const isAuthenticated = !!token
  const isAdmin = roles === 'ADMIN'

  // Obtener información del usuario si está autenticado
  const { data: userInfo } = useQuery({
    queryKey: ['userInfo'],
    queryFn: userInfoService,
    enabled: isAuthenticated,
  })

  // Obtener carrito de BD si está autenticado
  const { data: dbCartItems } = useCartQuery({
    enabled: isAuthenticated,
  })

  // Obtener tasa de dólar blue - Solo para admins
  const { data: blueRate } = useQuery({
    queryKey: ['dolarBlueRate'],
    queryFn: getDolarBlueRate,
    enabled: isAdmin,
    staleTime: 60 * 60 * 1000, // Cache por 1 hora
    refetchInterval: 60 * 60 * 1000, // Refrescar cada hora
  })

  // Calcular conteo de items: usar BD si está autenticado, sino localStorage
  useEffect(() => {
    if (isAuthenticated && dbCartItems) {
      const count = dbCartItems.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0,
      )
      setItemCount(count)
    } else {
      // Calcular directamente desde cartItems para que se actualice automáticamente
      const count = cartItems.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0,
      )
      setItemCount(count)
    }
  }, [isAuthenticated, dbCartItems, cartItems])

  const handleLogout = async () => {
    await logout()
  }

  return {
    isAuthenticated,
    isAdmin,
    userInfo,
    blueRate,
    itemCount,
    handleLogout,
  }
}
