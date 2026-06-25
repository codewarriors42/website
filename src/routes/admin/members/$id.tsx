import { useTRPC } from '#/integrations/trpc/react'
import { EditMemberForm } from '@/components/forms/member'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/members/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.member.getSingleMemberByID.queryOptions({ id }),
  )

  if (isLoading || !data) {
    return <div>Loafin..</div>
  }
  return (
    <div className="w-full h-full flex items-center justify-center">
      <EditMemberForm data={{ ...data, id: data._id.toString() }} />
    </div>
  )
}
