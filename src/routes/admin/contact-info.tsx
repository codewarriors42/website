import { AddContactForm } from '#/components/contact/add-contact'
import { DeleteContact } from '#/components/contact/del-contact'
import { EditContactForm } from '#/components/contact/edit-contact'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/contact-info')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.contact.getAll.queryOptions())
  return (
    <div>
      <div>
        <h1>Contact Info</h1>
        <p>Manage contact information here.</p>
        <AddContactForm />
      </div>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data?.map((contact) => (
            <div
              key={contact._id.toString()}
              className="border p-4 rounded mb-4"
            >
              <h2>{contact.post}</h2>
              <p>{contact.mail}</p>

              <EditContactForm
                data={{ ...contact, id: contact._id.toString() }}
              />
              <DeleteContact info={{ id: contact._id.toString() }} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
