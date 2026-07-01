import { AddArchiveForm } from '#/components/forms/archive'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/archives/add-archive')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <AddArchiveForm />
    </div>
  )
}
