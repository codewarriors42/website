import { AddEventForm } from '#/components/event/add-event'
import { DeleteEvent } from '#/components/event/del-event'
import { EditEventForm } from '#/components/event/edit-event'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/events')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.event.getAll.queryOptions())
  return (
    <div>
      <div>
        <h1>Events</h1>
        <p>Manage events here.</p>
        <AddEventForm />
      </div>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data?.map((event) => (
            <div key={event._id.toString()} className="border p-4 rounded mb-4">
              <h2>{event.name}</h2>
              <EditEventForm data={{ ...event, id: event._id.toString() }} />
              <DeleteEvent info={{ id: event._id.toString() }} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
