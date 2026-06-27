import { EditResourceForm } from '#/components/forms/resource'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/resources/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const trpc = useTRPC()
  const { data: resource, isLoading } = useQuery(
    trpc.resource.getById.queryOptions({ id }),
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!resource) {
    return <div>Resource not found</div>
  }

  return (
    <div className="flex items-center justify-center h-full w-full">
      <EditResourceForm
        resource={{ ...resource, id: resource._id.toString() }}
      />
    </div>
  )
}
