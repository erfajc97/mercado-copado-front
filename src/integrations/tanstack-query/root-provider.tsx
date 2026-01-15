import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import secureStorage from '@/app/helpers/secureStorage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

const securePersister = createSyncStoragePersister({
  storage: {
    getItem: (key) => secureStorage.getItem(key) || null,
    setItem: (key, value) => secureStorage.setItem(key, value),
    removeItem: (key) => secureStorage.removeItem(key),
  },
})

persistQueryClient({
  queryClient,
  persister: securePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 horas
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      // Solo persistir queries que tengan datos y no estén en estado de error
      return query.state.status === 'success' && query.state.data !== undefined
    },
  },
})

// Función para limpiar completamente la caché y el almacenamiento persistente
export const clearAllCache = () => {
  queryClient.clear()
  // Limpiar también el almacenamiento persistente
  secureStorage.clear()
}

export function getContext() {
  return {
    queryClient,
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
