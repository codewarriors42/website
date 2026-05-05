import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/members')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/members"!</div>
}
