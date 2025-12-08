import { useQuery } from '@tanstack/react-query'
import { getAddressesService } from '../services/getAddressesService'

export const useAddressesQuery = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddressesService(),
  })
}

