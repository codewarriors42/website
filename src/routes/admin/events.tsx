import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/events')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/events"!</div>
}
