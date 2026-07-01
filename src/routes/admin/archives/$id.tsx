import { EditArchiveForm } from '#/components/forms/archive'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/archives/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data: archive } = useQuery(
    trpc.archive.getById.queryOptions({ id: Route.useParams().id }),
  )

  if (!archive) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <EditArchiveForm
        initialData={{ ...archive, id: archive._id.toString() }}
      />
    </div>
  )
}
