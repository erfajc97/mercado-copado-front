import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import { useAuthStore } from './app/store/auth/authStore.ts'
import reportWebVitals from './reportWebVitals.ts'
import type { AuthState } from './app/store/auth/authStore'

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
    auth: undefined as unknown as AuthContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

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

function App() {
  // Obtener los valores y métodos necesarios del store
  const {
    token,
    refreshToken,
    tokenExpiration,
    setToken,
    removeToken,
    getToken,
    roles,
  } = useAuthStore()
  const isLogged = () => Boolean(token)

  const auth: AuthContext = {
    token,
    refreshToken,
    tokenExpiration,
    setToken,
    removeToken,
    getToken,
    isLogged,
    roles,
  }

  return <RouterProvider router={router} context={{ auth }} />
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <App />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
