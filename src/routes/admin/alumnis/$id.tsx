import { EditAlumniForm } from '#/components/forms/alumnis'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/alumnis/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.alumni.getSingleAlumniByID.queryOptions({ id }),
  )

  if (isLoading || !data) {
    return <div>Loafin..</div>
  }
  return (
    <div className="w-full h-full flex items-center justify-center">
      <EditAlumniForm initialData={{ ...data, id: data._id.toString() }} />
    </div>
  )
}
