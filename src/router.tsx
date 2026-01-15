import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { createRouter } from '@tanstack/react-router'
import { useAuthStore } from './app/store/auth/authStore'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import { routeTree } from './routeTree.gen'
import type { AuthState } from './app/store/auth/authStore'

export type AuthContext = Pick<
  AuthState,
  | 'token'
  | 'refreshToken'
  | 'tokenExpiration'
  | 'setToken'
  | 'removeToken'
  | 'getToken'
  | 'roles'
> & {
  isLogged: () => boolean
}

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  // Obtener el estado inicial del auth store
  const authState = useAuthStore.getState()
  const isLogged = () => Boolean(authState.token)

  const auth: AuthContext = {
    token: authState.token,
    refreshToken: authState.refreshToken,
    tokenExpiration: authState.tokenExpiration,
    setToken: authState.setToken,
    removeToken: authState.removeToken,
    getToken: authState.getToken,
    isLogged,
    roles: authState.roles,
  }

  const router = createRouter({
    routeTree,
    context: {
      ...rqContext,
      auth,
    },
    defaultPreload: 'intent',
    defaultNotFoundComponent: () => (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    ),
  })

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
