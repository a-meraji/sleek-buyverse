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
        "group hover:bg-background",
        !expanded && "bg-transparent",
        className
      )} 
      {...props}
    >
      {props.children}
    </div>
  )
}

export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return <div className={cn("space-y-4", className)} {...props} />
}

export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return <div className={cn("px-3 py-2", className)} {...props} />
}

export interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return <div className={cn("space-y-1", className)} {...props} />
}

export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  return (
    <h2 className={cn("mb-2 px-4 text-lg font-semibold tracking-tight", className)} {...props} />
  )
}

export interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return <nav className={cn("space-y-1", className)} {...props} />
}

export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return <div className={cn("px-3 py-1", className)} {...props} />
}

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon
}

export function SidebarMenuButton({ className, children, icon: Icon, ...props }: SidebarMenuButtonProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center rounded-lg p-2 text-sm font-medium",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
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
      className={cn("p-2 hover:bg-accent rounded-md", className)}
      {...props}
    >
      <span className="sr-only">Toggle sidebar</span>
      {/* Add your toggle icon here */}
    </button>
  )
}