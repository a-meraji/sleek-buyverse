import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { useSidebarContext } from "./sidebar-context"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { expanded } = useSidebarContext()
  
  return (
    <div 
      className={cn(
        "pb-12 transition-all duration-300",
        expanded ? "hover:bg-background/90" : "bg-transparent",
        className
      )} 
      {...props}
    >
      {props.children}
    </div>
  )
}

export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      {props.children}
    </div>
  )
}

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {props.children}
    </div>
  )
}

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      {props.children}
    </div>
  )
}

export interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {props.children}
    </div>
  )
}

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function SidebarGroupLabel({
  className,
  children,
  ...props
}: SidebarGroupLabelProps) {
  return (
    <p
      className={cn("mb-2 text-xs font-semibold text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export interface SidebarMenuProps extends React.HTMLAttributes<"nav"> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <nav className={cn("space-y-1", className)} {...props}>
      {props.children}
    </nav>
  )
}

export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return (
    <div className={cn("px-3 py-1", className)} {...props}>
      {props.children}
    </div>
  )
}

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarMenuButton({
  className,
  children,
  ...props
}: SidebarMenuButtonProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center rounded-lg p-2 text-sm font-medium",
        "hover:bg-accent/50 hover:text-accent-foreground",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { expanded, setExpanded } = useSidebarContext()
  
  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={cn("p-2 hover:bg-accent/50 rounded-md", className)}
      {...props}
    >
      <span className="sr-only">Toggle sidebar</span>
      {/* Add your toggle icon here */}
    </button>
  )
}