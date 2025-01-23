import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { useSidebarContext } from "./sidebar-context"
import { HTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps } from "react"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { expanded } = useSidebarContext()
  
  return (
    <aside
      data-expanded={expanded}
      className={cn(
        "h-screen",
        "group/sidebar",
        "overflow-hidden",
        "relative",
        "duration-300",
        "border-r",
        expanded ? "w-64 bg-white" : "w-16 bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-16 items-center border-b px-4",
        className
      )}
      {...props}
    />
  )
}

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div
      className={cn(
        "flex-1 overflow-auto",
        className
      )}
      {...props}
    />
  )
}

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      className={cn(
        "flex h-16 items-center border-t px-4",
        className
      )}
      {...props}
    />
  )
}

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 px-2 py-2",
        className
      )}
      {...props}
    />
  )
}

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  return (
    <p
      className={cn(
        "text-sm font-medium text-muted-foreground px-2",
        className
      )}
      {...props}
    />
  )
}

export interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return (
    <div
      className={cn(
        "space-y-1",
        className
      )}
      {...props}
    />
  )
}

export interface SidebarMenuProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <nav
      className={cn(
        "flex flex-col gap-1",
        className
      )}
      {...props}
    />
  )
}

export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return (
    <li
      className={cn(
        "list-none",
        className
      )}
      {...props}
    />
  )
}

export interface SidebarMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon
}

export function SidebarMenuButton({
  className,
  children,
  icon: Icon,
  ...props
}: SidebarMenuButtonProps) {
  const { expanded } = useSidebarContext()
  
  return (
    <button
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2",
        "w-full text-start",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {expanded && children}
    </button>
  )
}

export interface SidebarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { expanded, setExpanded } = useSidebarContext()
  
  return (
    <button
      className={cn("h-9 w-9 rounded-lg border", className)}
      onClick={() => setExpanded(!expanded)}
      {...props}
    >
      <span className="sr-only">Toggle sidebar</span>
      {props.children}
    </button>
  )
}
