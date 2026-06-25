import * as React from 'react'
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { NavLinks } from '../shared/nav-links'
import { navLinks } from '@/constants/app-links'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="bg-background py-5 border-b flex items-center justify-center">
        <h1 className="text-3xl font-logo">CW</h1>
      </SidebarHeader>
      <SidebarContent className="bg-background px-2 py-5">
        <NavLinks links={navLinks} />
      </SidebarContent>
    </Sidebar>
  )
}
