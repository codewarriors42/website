import {
  ArchiveIcon,
  ChalkboardSimpleIcon,
  CodeBlockIcon,
  FileMagnifyingGlassIcon,
  InfoIcon,
  QuestionIcon,
  UserCheckIcon,
  UserGearIcon,
  UserIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

interface LinkAttr {
  path: string
  title: string
  icon: Icon
}

export const nav_links: LinkAttr[] = [
  {
    path: '/admin',
    title: 'Dashboard',
    icon: ChalkboardSimpleIcon,
  },
  {
    path: '/admin/members',
    title: 'Members',
    icon: UserIcon,
  },
  {
    path: '/admin/alumnis',
    title: 'Alumnis',
    icon: UsersThreeIcon,
  },
  {
    path: '/admin/resources',
    title: 'Resources',
    icon: FileMagnifyingGlassIcon,
  },
  {
    path: '/admin/events',
    title: 'Events',
    icon: CodeBlockIcon,
  },
  {
    path: '/admin/archives',
    title: 'Archives',
    icon: ArchiveIcon,
  },
  {
    path: '/admin/faqs',
    title: 'FAQs',
    icon: QuestionIcon,
  },
  {
    path: '/admin/contact-info',
    title: 'Contact Info',
    icon: InfoIcon,
  },
]

export const app_links: LinkAttr[] = [
  {
    path: '/admin/profile',
    title: 'Profile',
    icon: UserGearIcon,
  },
  {
    path: '/admin/admin-users',
    title: 'Admin Users',
    icon: UserCheckIcon,
  },
]
