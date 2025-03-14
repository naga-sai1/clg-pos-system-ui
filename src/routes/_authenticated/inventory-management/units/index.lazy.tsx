import { createLazyFileRoute } from '@tanstack/react-router'
import Units from '@/features/units'

export const Route = createLazyFileRoute(
  '/_authenticated/inventory-management/units/'
)({
  component: Units,
})
