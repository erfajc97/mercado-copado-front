import { createFileRoute } from '@tanstack/react-router'
import { CategoriesDashboard } from '@/app/features/dashboard/categories/CategoriesDashboard'

export const Route = createFileRoute('/dashboard/categories')({
  component: CategoriesDashboard,
})
