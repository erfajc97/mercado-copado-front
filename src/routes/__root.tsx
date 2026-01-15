import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeroUIProvider, ToastProvider } from '@heroui/react'

import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCartSync } from '../app/hooks/useCartSync'

// import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'
import type { AuthContext } from '../main'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Página no encontrada</p>
      <Link
        to="/"
        className="px-6 py-3 bg-gradient-coffee text-white rounded-lg hover:opacity-90 font-semibold shadow-coffee hover:shadow-coffee-md transition-all duration-200"
      >
        Volver al inicio
      </Link>
    </div>
  )
}

function RootComponent() {
  // Sincronizar carrito cuando el usuario inicia sesión
  useCartSync()

  return (
    <HeroUIProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <ToastProvider placement="top-right" />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      /> */}
    </HeroUIProvider>
  )
}
