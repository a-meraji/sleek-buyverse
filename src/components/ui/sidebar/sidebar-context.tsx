import { createContext, useContext } from "react"

interface SidebarContextValue {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

export const SidebarContext = createContext<SidebarContextValue>({
  expanded: true,
  setExpanded: () => null,
})

export const useSidebarContext = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}