import { createFileRoute, Link } from '@tanstack/react-router'
import { useTRPC } from '@/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '#/components/ui/button'
import { Plus } from 'lucide-react'
import { FaqCard } from '#/components/forms/faq/faq-card'
import { useSidebar } from '#/components/ui/sidebar'

export const Route = createFileRoute('/admin/faqs/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { open } = useSidebar()
  const trpc = useTRPC()
  const { data: faqs } = useQuery(trpc.faq.getAll.queryOptions())

  return (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h1 className="text-[15px] font-medium">FAQs</h1>
          <span className="text-sm text-muted-foreground">
            {faqs?.length ?? 0} questions
          </span>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/faqs/add-faq">
            <Plus size={13} className="mr-1" /> Add FAQ
          </Link>
        </Button>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-3 grid-cols-1 ${
          open
            ? 'sm:grid-cols-2 xl:grid-cols-3'
            : 'sm:grid-cols-2 xl:grid-cols-3'
        }`}
      >
        {faqs?.map((faq) => (
          <FaqCard key={faq.id} faq={{ ...faq, id: faq._id.toString() }} />
        ))}
      </div>
    </div>
  )
}
