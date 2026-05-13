import { AddFAQForm } from '#/components/faq/add-faq'
import { DeleteFAQ } from '#/components/faq/del-faq'
import { EditFAQForm } from '#/components/faq/edit-faq'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/faqs')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.faqs.getAll.queryOptions())
  return (
    <div>
      <div>
        <h1>FAQs</h1>
        <p>Manage frequently asked questions here.</p>
        <AddFAQForm />
      </div>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data?.map((faq) => (
            <div key={faq._id.toString()} className="border p-4 rounded mb-4">
              <h2>{faq.question}</h2>
              <p>{faq.answer}</p>

              <EditFAQForm data={{ ...faq, id: faq._id.toString() }} />
              <DeleteFAQ info={{ id: faq._id.toString() }} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
