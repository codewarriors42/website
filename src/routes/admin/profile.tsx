import { createFileRoute } from '@tanstack/react-router'
import { useTRPC } from '#/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { LogoutBtn } from '#/components/auth/logout-btn'

export const Route = createFileRoute('/admin/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const trpc = useTRPC()
  const { data, isLoading, error } = useQuery(trpc.auth.getInfo.queryOptions())

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6">Failed to load profile.</div>

  const { username, name, isSupreme } = data || {
    username: '-',
    name: '-',
    isSupreme: false,
  }

  const initials = (name || username)
    .split(' ')
    .map((s: string) => s.charAt(0).toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('')

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      <div className="bg-background p-6 rounded-md border border-white/10">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-xl font-bold">
            {initials || '?'}
          </div>

          <div className="flex-1">
            <div className="text-lg font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">@{username}</div>
            <div className="mt-2 text-sm">
              Role: {isSupreme ? 'Admin' : 'User'}
            </div>
          </div>

          <div>
            <LogoutBtn />
          </div>
        </div>
      </div>
    </div>
  )
}
