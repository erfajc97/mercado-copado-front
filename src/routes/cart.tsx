import { createFileRoute } from '@tanstack/react-router'
import { Cart } from '@/app/features/cart/Cart'

export const Route = createFileRoute('/cart')({
  component: Cart,
})
