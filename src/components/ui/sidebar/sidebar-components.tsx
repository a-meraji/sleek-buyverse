import * as React from "react"
import { cn } from "@/lib/utils"

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed top-0 left-0 z-50 h-full bg-sidebar-background border-r border-sidebar-border",
      className
    )}
    {...props}
  />
))
Sidebar.displayName = "Sidebar"
