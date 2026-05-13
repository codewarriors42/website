import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import SearchBarSheet from '#/components/ui/searchbar-sheet'
import { MediaImage } from '#/components/media-image'
import { AddAlumni } from '#/components/alumni/add-alumin'
import { RemoveAlumni } from '#/components/alumni/del-alumin'
import { EditAlumni } from '#/components/alumni/edit-alumin'
import { UserInfoLoader } from '#/components/user-info-loader'

export const Route = createFileRoute('/admin/alumnis')({
  component: RouteComponent,
})

function RouteComponent() {
  const [input, setInput] = useState('')
  const trpc = useTRPC()
  const { data: results, isLoading } = useQuery(
    trpc.alumnis.getAll.queryOptions(),
  )
  return (
    <SearchBarSheet>
      <SearchBarSheet.Container className="overflow-hidden flex flex-col h-full">
        <SearchBarSheet.Head className="border-b border-white/10 p-3 sm:p-5 flex items-center gap-2 sm:gap-3 relative bg-background">
          <SearchBarSheet.InputContainer className="flex-1 flex items-center gap-2 sm:gap-3 border border-white/10 focus-within:border-white/30 bg-black/40 py-2 px-3 sm:px-4 h-11 sm:h-12 transition-none">
            <MagnifyingGlassIcon
              size={20}
              className="text-white/50 shrink-0"
              weight="bold"
            />

            <SearchBarSheet.Input
              id="alumni-search"
              name="search"
              autoFocus
              onChange={(e) => setInput(e.currentTarget.value)}
              value={input}
              placeholder="Search members..."
              autoComplete="off"
              className="bg-transparent border-none outline-none text-white text-[14px] sm:text-[15px] w-full placeholder:text-white/30 truncate"
            />

            {input.length > 0 && (
              <SearchBarSheet.ClearInput
                className="p-1 cursor-pointer shrink-0 text-white/50 hover:text-white transition-none"
                onClick={() => setInput('')}
              >
                <XIcon size={16} weight="bold" />
              </SearchBarSheet.ClearInput>
            )}

            {/* <div className="w-px h-4 sm:h-5 bg-white/10 shrink-0 mx-1" /> */}
          </SearchBarSheet.InputContainer>
          <div>
            <AddAlumni />
          </div>
        </SearchBarSheet.Head>
        <SearchBarSheet.Body className="p-6 overflow-y-auto flex flex-col gap-10 bg-background/70">
          <div>
            {isLoading && <UserInfoLoader />}
            {!isLoading &&
              results?.map((alumni) => (
                <div
                  key={alumni._id.toString()}
                  className="p-4 border border-white/10 rounded-md"
                >
                  <div>
                    <MediaImage
                      image={alumni.image as string}
                      name={alumni.name}
                      className="w-16 h-16 rounded-full object-cover mb-4"
                    />
                  </div>
                  <div className="font-bold">{alumni.name}</div>
                  <div className="text-sm text-white/50">{alumni.year}</div>
                  <div className="text-lg font-semibold">{alumni.current}</div>
                  <div>
                    <span className="text-xs text-white/50 mr-2">
                      {alumni.post}
                    </span>
                  </div>
                  <div>
                    {alumni.socials.map((social, i) => (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 mr-2"
                      >
                        {social.platform}
                      </a>
                    ))}
                  </div>
                  <div>
                    <EditAlumni
                      alumniData={{ ...alumni, id: alumni._id.toString() }}
                    />
                    <RemoveAlumni
                      info={{
                        id: alumni._id.toString(),
                        image: alumni.image as string,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </SearchBarSheet.Body>
      </SearchBarSheet.Container>
    </SearchBarSheet>
  )
}
