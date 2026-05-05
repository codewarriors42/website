import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/profile"!</div>
}
