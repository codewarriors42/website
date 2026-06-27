import { AddContactInfoForm } from '#/components/forms/contact-info'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/contact-info/add-contact-info')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <AddContactInfoForm />
    </div>
  )
}
