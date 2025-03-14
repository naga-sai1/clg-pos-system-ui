import { createLazyFileRoute } from '@tanstack/react-router'
import ProductsAdding from '@/features/productsadding'

export const Route = createLazyFileRoute(
  '/_authenticated/inventory-management/productsadding/',
)({
  component: ProductsAdding,
})


