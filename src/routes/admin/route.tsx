import { AppSidebar } from '#/components/app-sidebar'
import { SidebarProvider } from '#/components/ui/sidebar'
import { TooltipProvider } from '#/components/ui/tooltip'
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
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <Outlet />
      </TooltipProvider>
    </SidebarProvider>
  )
}
