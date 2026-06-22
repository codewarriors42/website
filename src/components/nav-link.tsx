import {
  type LucideIcon,
} from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "@tanstack/react-router"

export function NavLinks({
  links,
}: {
  links: {
    title: string
    path: string
    icon: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="pb-3 font-medium">Navigations</SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {links.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className="h-9 px-3">
              <Link to={item.path}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
