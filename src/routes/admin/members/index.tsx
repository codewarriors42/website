import { createFileRoute, Link } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import { useSidebar } from '#/components/ui/sidebar'
import { Plus } from 'lucide-react'
import { MemberCard } from '#/components/forms/member/member-card'

export const Route = createFileRoute('/admin/members/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { open } = useSidebar()
  const trpc = useTRPC()
  const { data: results } = useQuery(trpc.member.getAll.queryOptions())

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-[15px] font-medium">Members</h1>
          <span className="text-sm text-muted-foreground">
            {results?.length ?? 0} members
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/members/add-member">
            <Plus size={13} className="mr-1" /> Add member
          </Link>
        </Button>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-3.5 grid-cols-2 ${
          open
            ? 'sm:grid-cols-3 xl:grid-cols-4'
            : 'sm:grid-cols-4 xl:grid-cols-5'
        }`}
      >
        {results?.map((m) => (
          <MemberCard
            key={m._id.toString()}
            m={{ ...m, id: m._id.toString() }}
          />
        ))}
      </div>
    </div>
  )
}
