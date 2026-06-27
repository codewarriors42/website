import { createFileRoute, Link } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import { Plus } from 'lucide-react'
import { useSidebar } from '#/components/ui/sidebar'
import { ResourceCard } from '#/components/forms/resource/resource-card'

export const Route = createFileRoute('/admin/resources/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { open } = useSidebar()
  const trpc = useTRPC()
  const { data: events } = useQuery(trpc.resource.getAll.queryOptions())

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-[15px] font-medium">Resources</h1>
          <span className="text-sm text-muted-foreground">
            {events?.length ?? 0} resources
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/resources/add-resource">
            <Plus size={13} className="mr-1" /> Add resource
          </Link>
        </Button>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-3 grid-cols-1 sm:grid-cols-2 ${
          open ? 'xl:grid-cols-3' : 'xl:grid-cols-4'
        }`}
      >
        {events?.map((e, i) => (
          <ResourceCard key={i} e={{ ...e, id: e._id.toString() }} />
        ))}
      </div>
    </div>
  )
}
