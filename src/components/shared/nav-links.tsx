import type { LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'

interface LinkItem {
  title: string
  path: string
  icon: LucideIcon
}

export function NavLinks({ links }: { links: LinkItem[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="pb-3 font-medium">
        Navigations
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {links.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link to={item.path} activeOptions={{ exact: true }}>
              {({ isActive }) => (
                <SidebarMenuButton isActive={isActive} className="h-9 px-3">
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
