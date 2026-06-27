import { createFileRoute, Link } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import { Plus } from 'lucide-react'
import { useSidebar } from '#/components/ui/sidebar'
import { ContactCard } from '#/components/forms/contact-info/contact-info-card'

export const Route = createFileRoute('/admin/contact-info/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { open } = useSidebar()
  const trpc = useTRPC()
  const { data: contacts } = useQuery(trpc.contact.getAll.queryOptions())

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-[15px] font-medium">Contacts</h1>
          <span className="text-sm text-muted-foreground">
            {contacts?.length ?? 0} entries
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/contact-info/add-contact-info">
            <Plus size={13} className="mr-1" /> Add contact
          </Link>
        </Button>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-3 grid-cols-1 sm:grid-cols-2 ${
          open ? 'xl:grid-cols-3' : 'xl:grid-cols-4'
        }`}
      >
        {contacts?.map((c, i) => (
          <ContactCard key={i} c={{ ...c, _id: c._id.toString() }} />
        ))}
      </div>
    </div>
  )
}
