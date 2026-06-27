import { EditFaqForm } from '#/components/forms/faq'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/faqs/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.faq.getById.queryOptions({ id }))
  if (isLoading || !data) {
    return <div>Loading...</div>
  }
  return (
    <>
      <EditFaqForm faq={data} id={data._id.toString()} />
    </>
  )
}
