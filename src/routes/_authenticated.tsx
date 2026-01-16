import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLogged()) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => <Outlet />,
})
