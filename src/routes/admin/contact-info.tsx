import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/contact-info')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/contact-info"!</div>
}
