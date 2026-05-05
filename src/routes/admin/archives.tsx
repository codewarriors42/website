import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/archives')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/archives"!</div>
}
