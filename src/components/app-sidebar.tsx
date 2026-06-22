import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { NavLinks } from "./nav-link"
import { nav_links } from "#/constant/app_links"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      {...props}
    >
      <SidebarHeader className="bg-background">
        <SidebarMenu>
          <h1 className="font-logo text-3xl m-3 border-b text-center py-3">CW</h1>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavLinks links={nav_links} />
      </SidebarContent>
    </Sidebar>
  )
}
