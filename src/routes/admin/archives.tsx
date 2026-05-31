import { AddArchive } from '#/components/archive/add-archive'
import { EditArchive } from '#/components/archive/edit-archive'
import { DeleteArchive } from '#/components/archive/del-archive'
import { MediaImage } from '#/components/media-image'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/archives')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data: archives, isLoading: isLoadingArchives } = useQuery(
    trpc.archive.getAll.queryOptions(),
  )

  const { data: events = [], isLoading: isLoadingEvents } = useQuery(
    trpc.event.getAll.queryOptions(),
  )

  const isLoading = isLoadingArchives || isLoadingEvents

  const formatCategory = (c: string) => {
    switch (c) {
      case 'creative_work':
        return 'Creative Work'
      case 'creative_prompt':
        return 'Creative Prompt'
      case 'quizzes':
        return 'Quizzes'
      case 'crossword':
        return 'Crossword'
      default:
        return c
    }
  }

  const formatPlatform = (p: string) =>
    p
      .split('_')
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(' ')

  return (
    <div>
      <div>
        <h1>Archives</h1>
        <p>Manage archives here.</p>
        <AddArchive />
      </div>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          archives?.map((archive) => {
            const imageStr =
              typeof archive.image === 'string' ? archive.image : null
            const eventObj = events.find(
              (ev: any) => ev._id.toString() === archive.event,
            )
            const eventName = eventObj ? eventObj.name : archive.event

            return (
              <div
                key={archive._id.toString()}
                className="border p-4 rounded mb-4"
              >
                <div className="flex gap-4">
                  {imageStr ? (
                    <MediaImage
                      image={imageStr}
                      name={archive.title}
                      className="w-28 h-28 object-cover"
                    />
                  ) : null}

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{archive.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {archive.competition}
                    </p>

                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <strong>Category:</strong>{' '}
                        {formatCategory(archive.category)}
                      </div>
                      <div>
                        <strong>Event:</strong> {eventName}
                      </div>
                      <div>
                        <strong>Contributors:</strong> {archive.contributors}
                      </div>
                      <div>
                        <strong>Year:</strong> {archive.year}
                      </div>
                    </div>

                    {archive.links.length > 0 && (
                      <div className="mt-3">
                        <strong>Links:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {archive.links.map((l: any, i: number) => (
                            <a
                              key={i}
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 underline mr-2"
                            >
                              {formatPlatform(l.platform)}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                      <EditArchive
                        archiveData={{
                          id: archive._id.toString(),
                          title: archive.title,
                          competition: archive.competition,
                          links: archive.links,
                          category: archive.category,
                          event: archive.event,
                          contributors: archive.contributors,
                          year: archive.year,
                          image: imageStr,
                        }}
                      />

                      <DeleteArchive
                        info={{ id: archive._id.toString(), image: imageStr }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
