import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    console.log(!context.auth.isLogged())
    if (!context.auth.isLogged()) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => <Outlet />,
})
