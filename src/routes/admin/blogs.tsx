import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/blogs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/blogs"!</div>
}
