import { AlumniCard } from '#/components/forms/alumnis/alumni-card'
import { Button } from '#/components/ui/button'
import { useSidebar } from '#/components/ui/sidebar'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/admin/alumnis/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { open } = useSidebar()
  const trpc = useTRPC()
  const { data: results } = useQuery(trpc.alumni.getAll.queryOptions())

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-[15px] font-medium">Alumni</h1>
          <span className="text-sm text-muted-foreground">
            {results?.length ?? 0} alumni
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/alumnis/add-alumni">
            <Plus size={13} className="mr-1" /> Add alumni
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
        {results?.map((a) => (
          <AlumniCard
            key={a._id.toString()}
            a={{ ...a, id: a._id.toString() }}
          />
        ))}
      </div>
    </div>
  )
}
