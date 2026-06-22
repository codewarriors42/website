"use client"

import { SidebarIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { useLocation } from "@tanstack/react-router"

export function SiteHeader() {
  const curr_path = useLocation();
  const { toggleSidebar } = useSidebar()
  const getPathName = () => {
    switch (curr_path.pathname) {
      case "/admin":
        return "Dashboard"
      case "/admin/members":
        return "Member"
      case "/admin/alumnis":
        return "Alumnis"
      case "/admin/events":
        return "Events"
      case "/admin/resources":
        return "Resources"
      case "/admin/faqs":
        return "FAQs"
      case "/admin/contact-info":
        return "Contact Info"
      case "/admin/archives":
        return "Archives"

    }
  }
  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4 py-2">
        <Button
          className="h-9 w-9"
          variant="ghost"
          size="default"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-10" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{getPathName()}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
