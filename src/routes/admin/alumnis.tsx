import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/alumnis')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/alumnis"!</div>
}
