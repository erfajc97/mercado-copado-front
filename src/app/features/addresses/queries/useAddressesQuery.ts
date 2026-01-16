import { useQuery } from '@tanstack/react-query'
import { getAddressesService } from '../services/getAddressesService'
import type { UseQueryOptions } from '@tanstack/react-query'

export const useAddressesQuery = (
  options?: Omit<
    UseQueryOptions<Awaited<ReturnType<typeof getAddressesService>>, Error>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddressesService(),
    ...options,
  })
}
