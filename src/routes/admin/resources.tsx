import { MediaImage } from '#/components/media-image'
import { AddResource } from '#/components/resource/add-resource'
import { DeleteResource } from '#/components/resource/del-resource'
import { EditResource } from '#/components/resource/edit-resource'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/resources')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(trpc.resources.getAll.queryOptions())
  return (
    <div>
      <div>
        <h1>Resources</h1>
        <p>Manage resources here.</p>
        <AddResource />
      </div>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data?.map((resource) => (
            <div
              key={resource._id.toString()}
              className="border p-4 rounded mb-4"
            >
              <h2>{resource.event}</h2>
              <p>{resource.link}</p>
              <MediaImage
                image={resource.light as string}
                name={resource.event}
                className="my-2"
              />
              <MediaImage
                image={resource.dark as string}
                name={`${resource.event} dark`}
                className="my-2"
              />

              <EditResource
                resourceData={{ ...resource, id: resource._id.toString() }}
              />
              <DeleteResource
                info={{
                  id: resource._id.toString(),
                  dark: resource.dark as string,
                  light: resource.light as string,
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
