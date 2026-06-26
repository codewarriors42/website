import { AddAlumniForm } from '#/components/forms/alumnis'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/alumnis/add-alumni')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AddAlumniForm />
    </div>
  )
}
