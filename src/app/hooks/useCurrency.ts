import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/app/store/auth/authStore'
import { userInfoService } from '@/app/features/auth/login/services/userInfoService'
import {
  formatARS,
  formatUSD,
  getDolarBlueRate,
} from '@/app/services/currencyService'

interface UseCurrencyReturn {
  formatPrice: (amount: number) => string
  convertPrice: (amount: number) => number
  currency: 'USD' | 'ARS'
  isLoading: boolean
  /** Indica si el usuario está en Argentina */
  isArgentina: boolean
  /** País del usuario */
  userCountry: string
}

/**
 * Hook para manejar conversión y formateo de moneda según el país del usuario
 * - Si el usuario es de Argentina: convierte a ARS usando dólar blue
 * - Si el usuario es de otro país: muestra en USD
 * - Si no está autenticado: usa Argentina por defecto
 */
export function useCurrency(): UseCurrencyReturn {
  const { token } = useAuthStore()
  const isAuthenticated = !!token

  // Obtener información del usuario para saber su país
  const { data: userInfo, isLoading: isLoadingUser } = useQuery({
    queryKey: ['userInfo'],
    queryFn: userInfoService,
    enabled: isAuthenticated,
  })

  // Determinar el país del usuario (default a Argentina)
  const userCountry = userInfo?.country || 'Argentina'
  const isArgentina = userCountry === 'Argentina'

  // Obtener tasa de dólar blue (solo si es necesario)
  const { data: blueRate, isLoading: isLoadingRate } = useQuery({
    queryKey: ['dolarBlueRate'],
    queryFn: getDolarBlueRate,
    enabled: isArgentina,
    staleTime: 60 * 60 * 1000, // Cache por 1 hora
    refetchInterval: 60 * 60 * 1000, // Refrescar cada hora
  })

  const formatPrice = useMemo(() => {
    return (amount: number): string => {
      if (isArgentina && blueRate) {
        const arsAmount = amount * blueRate
        return formatARS(arsAmount)
      }
      return formatUSD(amount)
    }
  }, [isArgentina, blueRate])

  const convertPrice = (amount: number): number => {
    if (isArgentina && blueRate) {
      return amount * blueRate
    }
    return amount
  }

  return {
    formatPrice,
    convertPrice,
    currency: isArgentina ? 'ARS' : 'USD',
    isLoading:
      (isAuthenticated && isLoadingUser) || (isArgentina && isLoadingRate),
    isArgentina,
    userCountry,
  }
}
