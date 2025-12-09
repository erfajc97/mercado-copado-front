import { createFileRoute } from '@tanstack/react-router'
import { ProductsDashboard } from '@/app/features/dashboard/products/ProductsDashboard'

export const Route = createFileRoute('/dashboard/products')({
  component: ProductsDashboard,
})
