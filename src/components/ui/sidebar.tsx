import { createContext, useContext, useRef, useState } from 'react'
import type {
  ComponentPropsWithRef,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react'
import { cn } from '#/lib/utils.ts'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)

interface sidebar_ctx_t {
  open: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

type SideBarRootProps = { children: ReactNode; defaultOpen?: boolean }
type SideBarSectionProps = ComponentPropsWithRef<'div'>
type SideBarButtonProps = ComponentPropsWithRef<'button'>

type SideBarCompoundComponent = (({
  children,
}: SideBarRootProps) => ReactElement) & {
  Trigger: ({
    children,
    className,
    onClick,
    type,
    ...props
  }: SideBarButtonProps) => ReactElement
  Close: ({
    children,
    className,
    onClick,
    type,
    ...props
  }: SideBarButtonProps) => ReactElement
  Container: ({
    children,
    className,
    ...props
  }: SideBarSectionProps) => ReactElement
  Header: ({
    children,
    className,
    ...props
  }: SideBarSectionProps) => ReactElement
  Body: ({ children, className, ...props }: SideBarSectionProps) => ReactElement
  Footer: ({
    children,
    className,
    ...props
  }: SideBarSectionProps) => ReactElement
  Overlay: ({ className, ...props }: SideBarSectionProps) => ReactElement
  OverLay: ({ className, ...props }: SideBarSectionProps) => ReactElement
}

const sidebar_ctx = createContext<sidebar_ctx_t | undefined>(undefined)

function useSidebarCtx() {
  const ctx = useContext(sidebar_ctx)
  if (!ctx)
    throw new Error(
      '[ContextProvider:Erorr] SideBar context provider is Missing.',
    )
  return ctx
}

const SideBarRoot = ({ children, defaultOpen = false }: SideBarRootProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const onOpen = () => setOpen(true)
  const onClose = () => setOpen(false)
  const onToggle = () => setOpen((prev) => !prev)
  return (
    <sidebar_ctx.Provider value={{ open, onOpen, onClose, onToggle }}>
      <nav className="relative">{children}</nav>
      <Overlay />
    </sidebar_ctx.Provider>
  )
}

function Trigger({
  children,
  className,
  onClick,
  type,
  ...props
}: SideBarButtonProps) {
  const { onToggle } = useSidebarCtx()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) onToggle()
  }

  return (
    <button
      type={type ?? 'button'}
      onClick={handleClick}
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  )
}

function Close({
  children,
  className,
  onClick,
  type,
  ...props
}: SideBarButtonProps) {
  const { onClose } = useSidebarCtx()

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) onClose()
  }

  return (
    <button
      type={type ?? 'button'}
      onClick={handleClick}
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  )
}

function Overlay({ className, ...props }: SideBarSectionProps) {
  const { open, onClose } = useSidebarCtx()
  const overlayRef = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const ele = overlayRef.current
    if (!ele) return
    gsap.to(ele, {
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      duration: open ? 0.3 : 0.37,
      ease: open ? 'power2.out' : 'power2.inOut',
      overwrite: true,
      force3D: true,
    })
  }, [open])
  return (
    <div
      ref={overlayRef}
      onClick={onClose}
      aria-hidden={!open}
      className={cn(
        'sidebar-overlay fixed inset-0 z-10 bg-overlay opacity-0 pointer-events-none backdrop-blur-[5px] bg-black/30',
        className,
      )}
      {...props}
    />
  )
}
const sidebarWidths = {
  base: 'w-[80vw]',
  sm: 'sm:w-[min(80vw,22rem)]',
  md: 'md:w-[clamp(18rem,19vw,22rem)]',
  lg: 'lg:w-[clamp(20rem,14vw,20rem)]',
}

function responsive(classes: Record<string, string>) {
  return Object.values(classes).join(' ')
}

function Container({ children, className, ...props }: SideBarSectionProps) {
  const { open } = useSidebarCtx()
  const containerRef = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const ele = containerRef.current
      if (!ele) return
      gsap.killTweensOf(ele)
      gsap.to(ele, {
        x: open ? 0 : '-100%',
        pointerEvents: open ? 'auto' : 'none',
        duration: open ? 0.298 : 0.299,
        ease: open ? 'back.out(1.03)' : 'back.in(1.2)',
        overwrite: true,
        force3D: true,
      })
    },
    { dependencies: [open], scope: containerRef },
  )

  return (
    <div
      ref={containerRef}
      aria-hidden={!open}
      data-open={open ? 'true' : 'false'}
      className={cn(
        'sidebar-container fixed left-0 top-0 z-20 overflow-y-auto bg-[#0f0f0f] h-full flex flex-col will-change-transform transform-gpu -translate-x-full',
        responsive(sidebarWidths),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function Header({ children, className, ...props }: SideBarSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function Body({ children, className, ...props }: SideBarSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function Footer({ children, className, ...props }: SideBarSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

const SideBar = Object.assign(SideBarRoot, {
  Trigger,
  Close,
  Container,
  Header,
  Body,
  Footer,
  Overlay,
  OverLay: Overlay,
}) as SideBarCompoundComponent

export default SideBar
