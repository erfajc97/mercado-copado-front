import { useQuery } from '@tanstack/react-query'
import { userInfoService } from '@/app/features/auth/login/services/userInfoService'

interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
  isVerified: boolean
  role: string
}

interface UseUserVerificationReturn {
  isVerified: boolean
  email: string | undefined
  isLoading: boolean
  isError: boolean
  user: UserInfo | undefined
}

/**
 * Hook para verificar el estado de verificación del email del usuario.
 */
export const useUserVerification = (): UseUserVerificationReturn => {
  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery<UserInfo>({
    queryKey: ['userInfo'],
    queryFn: userInfoService,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
  })

  return {
    isVerified: userInfo?.isVerified ?? false,
    email: userInfo?.email,
    isLoading,
    isError,
    user: userInfo,
  }
}
