import { createLazyFileRoute } from '@tanstack/react-router'
import Products from '@/features/products'

export const Route = createLazyFileRoute(
  '/_authenticated/inventory-management/products/'
)({
  component: Products,
})
