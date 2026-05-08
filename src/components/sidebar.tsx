import { app_links, nav_links } from '#/constant/app-links'
import { Link } from '@tanstack/react-router'
import { XIcon, ListIcon } from '@phosphor-icons/react'
import Sheet from './ui/sheet'

export function SideBarUI() {
  return (
    <Sheet>
      <Sheet.Trigger className="flex items-center justify-center cursor-pointer px-1 py-2">
        <ListIcon weight="bold" size={25} className="text-sidebar-foreground" />
      </Sheet.Trigger>

      <Sheet.Container className="bg-sidebar text-sidebar-foreground select-none">
        <Sheet.Header className="p-5 flex items-center justify-between border-b select-none">
          <h2 className="font-logo text-3xl pl-3 pt-2">CW</h2>
          <Sheet.Close className="p-3 bg-sidebar-accent/10 rounded-full transition-all duration-150 cursor-pointer hover:bg-sidebar-accent/20">
            <XIcon weight="bold" size={20} />
          </Sheet.Close>
        </Sheet.Header>
        <Sheet.Body className="h-full w-full p-4 overflow-y-auto flex flex-col gap-4">
          <div className="w-full flex flex-col">
            <h2 className="text-xs font-semibold px-2 py-3 text-muted-foreground">
              Admin
            </h2>
            {nav_links.map((link) => (
              <Link
                to={link.path}
                key={link.title}
                className="size-auto group"
                activeOptions={
                  link.path === '/admin' ? { exact: true } : undefined
                }
                activeProps={{
                  className:
                    'bg-sidebar-accent/70 text-sidebar-accent-foreground font-medium rounded-md',
                }}
              >
                {({ isActive }) => (
                  <Sheet.Close className="flex px-5 py-3.5 md:px-4 md:py-3 transition-all duration-150 cursor-pointer hover:bg-sidebar-accent/50 rounded-md w-full h-full items-center gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground">
                    <link.icon
                      weight={isActive ? 'fill' : 'regular'}
                      className={`w-6 h-6 md:w-5 md:h-5 ${isActive ? 'text-sidebar-accent-foreground' : ''}`}
                    />
                    <span className="text-sm font-medium">{link.title}</span>
                  </Sheet.Close>
                )}
              </Link>
            ))}
          </div>

          <div className="w-full flex flex-col pt-2 border-t border-sidebar-border">
            <h2 className="text-xs font-semibold px-2 py-3 text-muted-foreground">
              Account
            </h2>
            {app_links.map((link) => (
              <Link
                to={link.path}
                key={link.title}
                className="size-auto group"
                activeProps={{
                  className:
                    'bg-sidebar-accent text-sidebar-accent-foreground rounded-md',
                }}
              >
                {({ isActive }) => (
                  <Sheet.Close className="flex px-5 py-3.5 md:px-4 md:py-3 hover:bg-sidebar-accent/50 transition-all duration-150 cursor-pointer w-full h-full items-center gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground rounded-md">
                    <link.icon
                      weight={isActive ? 'fill' : 'regular'}
                      className={`w-6 h-6 md:w-5 md:h-5 ${isActive ? 'text-sidebar-accent-foreground' : ''}`}
                    />
                    <span className="text-sm font-medium">{link.title}</span>
                  </Sheet.Close>
                )}
              </Link>
            ))}
          </div>
        </Sheet.Body>
      </Sheet.Container>
    </Sheet>
  )
}
