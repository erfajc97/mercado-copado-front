import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthenticated')({
  beforeLoad: ({ context }) => {
    if (context.auth.isLogged()) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => <Outlet />,
})
