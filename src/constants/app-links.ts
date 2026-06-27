import {
  Archive,
  Contact,
  FileQuestionMark,
  LayoutDashboard,
  Library,
  Network,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface LinkAttr {
  path: string
  title: string
  icon: LucideIcon
}

export const navLinks: LinkAttr[] = [
  {
    path: '/admin',
    title: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/admin/members',
    title: 'Members',
    icon: Users,
  },
  {
    path: '/admin/alumnis',
    title: 'Alumnis',
    icon: Network,
  },
  {
    path: '/admin/resources',
    title: 'Resources',
    icon: Library,
  },
  {
    path: '/admin/archives',
    title: 'Archives',
    icon: Archive,
  },
  {
    path: '/admin/faqs',
    title: 'FAQs',
    icon: FileQuestionMark,
  },
  {
    path: '/admin/contact-info',
    title: 'Contact Info',
    icon: Contact,
  },
]
