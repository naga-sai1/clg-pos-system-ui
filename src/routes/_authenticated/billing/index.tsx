import { createFileRoute } from '@tanstack/react-router'
import BillingSystem from '@/features/billing'

export const Route = createFileRoute('/_authenticated/billing/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BillingSystem />
}
