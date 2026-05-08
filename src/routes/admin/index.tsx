import { LogoutBtn } from '#/components/auth/logout-btn'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <LogoutBtn />
    </div>
  )
}
