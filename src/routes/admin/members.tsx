import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import SearchBarSheet from '#/components/ui/searchbar-sheet'
import { AddMember } from '#/components/member/add-member'
import { MediaImage } from '#/components/media-image'
import { EditMember } from '#/components/member/edit-member'
import { RemoveMember } from '#/components/member/del-member'

export const Route = createFileRoute('/admin/members')({
  component: RouteComponent,
})

function RouteComponent() {
  const [input, setInput] = useState('')
  const trpc = useTRPC()
  const { data: results } = useQuery(trpc.members.getAll.queryOptions())
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
              autoFocus
              onChange={(e) => setInput(e.currentTarget.value)}
              value={input}
              placeholder="Search members..."
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
            <AddMember />
          </div>
        </SearchBarSheet.Head>
        <SearchBarSheet.Body className="p-6 overflow-y-auto flex flex-col gap-10 bg-background/70">
          <div>
            {results?.map((member) => (
              <div
                key={member._id.toString()}
                className="p-4 border border-white/10 rounded-md"
              >
                <div>
                  <MediaImage
                    image={member.image!}
                    name={member.name}
                    className="w-16 h-16 rounded-full object-cover mb-4"
                  />
                </div>
                <div className="font-bold">{member.name}</div>
                <div className="text-sm text-white/50">{member.grade}</div>
                <div>
                  {member.roles.map((role, i) => (
                    <span key={i} className="text-xs text-white/50 mr-2">
                      {role}
                    </span>
                  ))}
                </div>
                <div>
                  {member.socials.map((social, i) => (
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
                  <EditMember
                    memberData={{
                      id: member._id.toString(),
                      name: member.name,
                      grade: member.grade,
                      roles: member.roles,
                      image: member.image as string,
                      socials: member.socials,
                    }}
                  />

                  <RemoveMember
                    info={{
                      id: member._id.toString(),
                      image: member.image as string,
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
