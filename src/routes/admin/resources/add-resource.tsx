import { AddResourceForm } from '#/components/forms/resource'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/resources/add-resource')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <AddResourceForm />
    </div>
  )
}
