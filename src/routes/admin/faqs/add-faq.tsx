import { AddFaqForm } from '#/components/forms/faq'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/faqs/add-faq')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AddFaqForm />
    </div>
  )
}
