import { cn } from '#/lib/utils'
import type { ComponentPropsWithRef, ReactElement } from 'react'

type CardRootProps = ComponentPropsWithRef<'div'>
type CardSectionProps = ComponentPropsWithRef<'div'>
type CardTitleProps = ComponentPropsWithRef<'h3'>
type CardDescriptionProps = ComponentPropsWithRef<'p'>

type CardCompoundComponent = (({
  children,
  className,
  ...props
}: CardRootProps) => ReactElement) & {
  Container: ({
    children,
    className,
    ...props
  }: CardSectionProps) => ReactElement
  Head: ({ children, className, ...props }: CardSectionProps) => ReactElement
  Body: ({ children, className, ...props }: CardSectionProps) => ReactElement
  Footer: ({ children, className, ...props }: CardSectionProps) => ReactElement
  Title: ({ children, className, ...props }: CardTitleProps) => ReactElement
  Description: ({
    children,
    className,
    ...props
  }: CardDescriptionProps) => ReactElement
  ExtraInfo: ({
    children,
    className,
    ...props
  }: CardSectionProps) => ReactElement
}

const CardRoot = ({ children, className, ...props }: CardRootProps) => {
  return (
    <div className={cn('relative', className)} {...props}>
      {children}
    </div>
  )
}

function Container({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function Head({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function Body({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function Footer({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

function Title({ children, className, ...props }: CardTitleProps) {
  return (
    <h3 className={cn('line-clamp-1', className)} {...props}>
      {children}
    </h3>
  )
}

function Description({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p className={cn('line-clamp-2', className)} {...props}>
      {children}
    </p>
  )
}

function ExtraInfo({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}

const Card = Object.assign(CardRoot, {
  Container,
  Head,
  Body,
  Footer,
  Title,
  Description,
  ExtraInfo,
}) as CardCompoundComponent

export default Card
