import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/faqs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/faqs"!</div>
}
