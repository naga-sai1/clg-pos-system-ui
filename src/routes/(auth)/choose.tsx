import ChooseOne from '@/features/auth/choose'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/choose')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ChooseOne/>
}
