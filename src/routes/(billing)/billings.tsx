import { createFileRoute } from '@tanstack/react-router'
import BillingSystem from '@/features/billing'

export const Route = createFileRoute('/(billing)/billings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BillingSystem />
}
