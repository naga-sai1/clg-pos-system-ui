import SubCategories from '@/features/sub-categories'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/inventory-management/sub-category-list/',
)({
  component: SubCategories,
})

