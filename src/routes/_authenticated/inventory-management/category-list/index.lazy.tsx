import { createLazyFileRoute } from '@tanstack/react-router'
import Categories from '@/features/categories'

export const Route = createLazyFileRoute(
  '/_authenticated/inventory-management/category-list/'
)({
  component: Categories,
})
