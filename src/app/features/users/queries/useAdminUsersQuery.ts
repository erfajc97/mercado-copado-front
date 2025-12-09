import { useQuery } from '@tanstack/react-query'
import { getAdminUsersService } from '../services/getAdminUsersService'

interface AdminUsersQueryParams {
  search?: string
  country?: string
  page?: number
  limit?: number
}

export const useAdminUsersQuery = (params: AdminUsersQueryParams = {}) => {
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: () => getAdminUsersService(params),
  })
}
