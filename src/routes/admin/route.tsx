import { SideBarUI } from '#/components/sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { session } = await context.queryClient.fetchQuery({
      ...context.trpc.auth.getSession.queryOptions(),
      staleTime: 0,
      gcTime: 0,
    })

    if (!session?.userId) {
      throw redirect({ to: '/login' })
    }

    return { session }
  },
})

function RouteComponent() {
  return (
    <div className="grid">
      <div className="border-b bg-background h-14 flex items-center justify-between p-10">
        <SideBarUI />
        <h1 className="text-3xl font-logo">CW</h1>
      </div>
      <div className="w-full min-h-svh">
        <Outlet />
      </div>
    </div>
  )
}
