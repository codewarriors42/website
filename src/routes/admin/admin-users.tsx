import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/admin-users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/admin-users"!</div>
}
