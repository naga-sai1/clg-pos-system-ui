import { createLazyFileRoute } from '@tanstack/react-router'
import Brands from '@/features/brands'

export const Route = createLazyFileRoute(
  '/_authenticated/inventory-management/brand-list/'
)({
  component: Brands,
})
