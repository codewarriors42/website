import { createFileRoute, Link } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import { Plus } from 'lucide-react'
import { ArchiveCard } from '#/components/forms/archive/archive-card'
import { useSidebar } from '#/components/ui/sidebar'

export const Route = createFileRoute('/admin/archives/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { open } = useSidebar()
  const trpc = useTRPC()
  const { data: archives } = useQuery(trpc.archive.getAll.queryOptions())

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-[15px] font-medium">Archives</h1>
          <span className="text-sm text-muted-foreground">
            {archives?.length ?? 0} entries
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/archives/add-archive">
            <Plus size={13} className="mr-1" /> Add archive
          </Link>
        </Button>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-3 grid-cols-1 sm:grid-cols-2 ${
          open ? 'xl:grid-cols-3' : 'xl:grid-cols-4'
        }`}
      >
        {archives?.map((a) => (
          <ArchiveCard key={a.id} a={{ ...a, id: a._id.toString() }} />
        ))}
      </div>
    </div>
  )
}
