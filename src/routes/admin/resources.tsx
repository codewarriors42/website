import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/resources')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/resources"!</div>
}
