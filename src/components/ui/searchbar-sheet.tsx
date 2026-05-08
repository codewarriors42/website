import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react'
import { cn } from '#/lib/utils'

type SearchBarSheetRootProps = { children: ReactNode; defaultOpen?: boolean }
type SearchBarSectionProps = ComponentPropsWithRef<'div'>
type SearchBarSheetButtonProps = ComponentPropsWithRef<'button'>

type SearchBarCompoundComponent = (({
  children,
}: SearchBarSheetRootProps) => ReactElement) & {
  Head: ({
    children,
    className,
    ...props
  }: SearchBarSectionProps) => ReactElement
  Body: ({
    children,
    className,
    ...props
  }: SearchBarSectionProps) => ReactElement
  ClearInput: ({
    children,
    className,
    type,
    ...props
  }: SearchBarSheetButtonProps) => ReactElement
  Container: ({
    children,
    className,
    ...props
  }: SearchBarSectionProps) => ReactElement
  InputContainer: ({
    children,
    className,
    ...props
  }: SearchBarSectionProps) => ReactElement

  Input: ({
    className,
    ...props
  }: ComponentPropsWithRef<'input'>) => ReactElement
  ResultsContainer: ({
    children,
    className,
    ...props
  }: SearchBarSectionProps) => ReactElement
}

const SearchBarRoot = ({ children }: SearchBarSheetRootProps) => {
  return <div className="relative overflow-hidden">{children}</div>
}

function ClearInput({
  children,
  className,
  type,
  ...props
}: SearchBarSheetButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={cn('relative', className)}
      {...props}
    >
      {children}
    </button>
  )
}

function Container({ children, className, ...props }: SearchBarSectionProps) {
  return (
    <div
      className={cn('bg-background w-full h-full flex flex-col ', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function InputContainer({
  children,
  className,
  ...props
}: SearchBarSectionProps) {
  return (
    <div
      className={cn('relative flex items-center w-full', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function Head({ children, className, ...props }: SearchBarSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function Body({ children, className, ...props }: SearchBarSectionProps) {
  return (
    <div className={cn('w-full h-full relative', className)} {...props}>
      {children}
    </div>
  )
}

function ResultContainer({
  children,
  className,
  ...props
}: SearchBarSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function Input({ className, ...props }: ComponentPropsWithRef<'input'>) {
  return (
    <input
      className={cn('w-full h-full p-1 border-0 outline-0', className)}
      {...props}
    />
  )
}

const SearchBarSheet = Object.assign(SearchBarRoot, {
  Head,
  Body,
  ClearInput,
  Container,
  InputContainer,
  Input,
  ResultsContainer: ResultContainer,
}) as SearchBarCompoundComponent

export default SearchBarSheet
