import { useQuery } from '@tanstack/react-query'
import { getUserInfoService } from '../services/getUserInfoService'

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['userInfo'],
    queryFn: getUserInfoService,
    enabled: true,
  })
}
