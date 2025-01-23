import * as React from "react"
import { cva } from "class-variance-authority"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useSidebarContext } from "./sidebar-context"
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "./sidebar-components"

const SIDEBAR_WIDTH = "240px"
const SIDEBAR_WIDTH_MOBILE = "320px"
const SIDEBAR_WIDTH_SM = "240px"
const SIDEBAR_WIDTH_ICON = "48px"

const sidebarVariants = cva("", {
  variants: {
    variant: {
      default: "",
      floating: "mt-4",
      inset: "mt-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

interface SidebarProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: "default" | "floating" | "inset"
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, variant, ...props }, ref) => {
    const { state, collapsible, side } = useSidebarContext()

    return (
      <div
        ref={ref}
        data-state={state}
        data-collapsible={collapsible}
        data-side={side}
        data-variant={variant}
        className={cn(
          "group relative z-30 h-svh",
          sidebarVariants({ variant }),
          className
        )}
        {...props}
      >
        <Sheet
          open={state === "expanded" && collapsible === "mobile"}
          onOpenChange={(open) =>
            window.dispatchEvent(
              new CustomEvent("sidebar-mobile-open", { detail: { open } })
            )
          }
        >
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] p-0 [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
          >
            <SidebarPrimitive className="h-full">
              {props.children}
            </SidebarPrimitive>
          </SheetContent>
        </Sheet>
        <div
          style={
            {
              "--sidebar-width": variant === "inset" ? SIDEBAR_WIDTH_SM : SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            } as React.CSSProperties
          }
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
            "hover:bg-background"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed top-0 h-svh w-[--sidebar-width] transition-[width,transform] ease-linear",
            "group-data-[collapsible=offcanvas]:-translate-x-full",
            "group-data-[side=right]:right-0 group-data-[side=right]:translate-x-0 group-data-[side=right]:group-data-[collapsible=offcanvas]:translate-x-full",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
            variant === "floating" && "p-4",
            variant === "inset" && "px-4"
          )}
        >
          <div
            data-sidebar="sidebar"
            className={cn(
              "flex h-full w-full flex-col",
              "group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
              "hover:bg-background"
            )}
          >
            {props.children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  type SidebarProps,
}