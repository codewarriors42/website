import { createContext, useContext, useRef, useState, useEffect } from 'react'
import type {
  ComponentPropsWithRef,
  MouseEvent,
  ReactElement,
  ReactNode,
} from 'react'
import { Slot } from 'radix-ui'
import { cn } from '#/lib/utils.ts'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

gsap.registerPlugin(useGSAP)

interface sheet_ctx_t {
  open: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
  side: 'left' | 'bottom'
}

type SheetRootProps = {
  children: ReactNode
  defaultOpen?: boolean
  side?: 'left' | 'bottom'
}
type SheetSectionProps = ComponentPropsWithRef<'div'>
type SheetButtonProps = ComponentPropsWithRef<'button'> & { asChild?: boolean }

type SheetCompoundComponent = (({
  children,
}: SheetRootProps) => ReactElement) & {
  Trigger: ({
    children,
    className,
    onClick,
    type,
    ...props
  }: SheetButtonProps) => ReactElement
  Close: ({
    children,
    className,
    onClick,
    type,
    ...props
  }: SheetButtonProps) => ReactElement
  Container: ({
    children,
    className,
    ...props
  }: SheetSectionProps) => ReactElement
  Header: ({ children, className, ...props }: SheetSectionProps) => ReactElement
  Body: ({ children, className, ...props }: SheetSectionProps) => ReactElement
  Footer: ({ children, className, ...props }: SheetSectionProps) => ReactElement
  Overlay: ({ className, ...props }: SheetSectionProps) => ReactElement
  OverLay: ({ className, ...props }: SheetSectionProps) => ReactElement
}

const sheet_ctx = createContext<sheet_ctx_t | undefined>(undefined)

function useSheetCtx() {
  const ctx = useContext(sheet_ctx)
  if (!ctx)
    throw new Error(
      '[ContextProvider:Erorr] SideBar context provider is Missing.',
    )
  return ctx
}

const SheetRoot = ({
  children,
  defaultOpen = false,
  side = 'left',
}: SheetRootProps) => {
  const [open, setOpen] = useState(defaultOpen)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const restoreFocus = () => {
    const last = lastFocusedRef.current
    if (last && typeof last.focus === 'function') {
      last.focus()
    }
  }

  const onOpen = () => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }
  const onClose = () => {
    restoreFocus()
    setOpen(false)
  }
  const onToggle = () =>
    setOpen((prev) => {
      if (prev) {
        restoreFocus()
        return false
      }
      lastFocusedRef.current = document.activeElement as HTMLElement | null
      return true
    })

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <sheet_ctx.Provider value={{ open, onOpen, onClose, onToggle, side }}>
      <nav className="relative">{children}</nav>
      <Overlay />
    </sheet_ctx.Provider>
  )
}

function Trigger({
  children,
  className,
  onClick,
  type,
  asChild = false,
  ...props
}: SheetButtonProps) {
  const { onToggle } = useSheetCtx()
  const Comp = asChild ? Slot.Root : 'button'

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) onToggle()
  }

  return (
    <Comp
      type={type ?? 'button'}
      onClick={handleClick}
      className={cn(className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

function Close({
  children,
  className,
  onClick,
  type,
  asChild = false,
  ...props
}: SheetButtonProps) {
  const { onClose } = useSheetCtx()
  const Comp = asChild ? Slot.Root : 'button'

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) onClose()
  }

  return (
    <Comp
      type={type ?? 'button'}
      onClick={handleClick}
      className={cn(className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

function Overlay({ className, ...props }: SheetSectionProps) {
  const { open, onClose } = useSheetCtx()
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

function Container({ children, className, ...props }: SheetSectionProps) {
  const { open, side } = useSheetCtx()
  const containerRef = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const ele = containerRef.current
      if (!ele) return
      gsap.killTweensOf(ele)
      const isLeft = side === 'left'
      gsap.to(ele, {
        x: isLeft ? (open ? 0 : '-100%') : 0,
        y: !isLeft ? (open ? 0 : '100%') : 0,
        pointerEvents: open ? 'auto' : 'none',
        duration: open ? 0.298 : 0.299,
        ease: open ? 'back.out(1.03)' : 'back.in(1.2)',
        overwrite: true,
        force3D: true,
      })
    },
    { dependencies: [open, side], scope: containerRef },
  )

  const sideClasses =
    side === 'left'
      ? `left-0 top-0 h-screen -translate-x-full ${responsive(sidebarWidths)}`
      : 'left-0 bottom-0 w-full h-screen translate-y-full'

  return (
    <div
      ref={containerRef}
      aria-hidden={!open}
      data-open={open ? 'true' : 'false'}
      className={cn(
        'sidebar-container fixed z-20 overflow-y-auto bg-[#0f0f0f] flex flex-col will-change-transform transform-gpu',
        sideClasses,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function Header({ children, className, ...props }: SheetSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function Body({ children, className, ...props }: SheetSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function Footer({ children, className, ...props }: SheetSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

const Sheet = Object.assign(SheetRoot, {
  Trigger,
  Close,
  Container,
  Header,
  Body,
  Footer,
  Overlay,
  OverLay: Overlay,
}) as SheetCompoundComponent

export default Sheet
