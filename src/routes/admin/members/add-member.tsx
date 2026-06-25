import { AddMemberForm } from '@/components/forms/member'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/members/add-member')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AddMemberForm />
    </div>
  )
}
