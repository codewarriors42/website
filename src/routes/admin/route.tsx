import { AppSidebar } from '@/components/layout/app-sidebar'
import { SiteHeader } from '@/components/layout/sidebar-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="overflow-clip">
      <SidebarProvider>
        <TooltipProvider>
          <AppSidebar />
        </TooltipProvider>
        <SidebarInset>
          <SiteHeader />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
