import { EditContactInfoForm } from '#/components/forms/contact-info'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/contact-info/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.contact.getById.queryOptions({ id }),
  )
  if (isLoading || !data) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <EditContactInfoForm
        contactInfo={{ ...data, _id: data._id.toString() }}
      />
    </div>
  )
}
