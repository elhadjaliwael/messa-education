import { createContext, useContext, useState } from "react";

const SideBarContext = createContext();
export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false)
  
    return <SideBarContext.Provider value={{ isOpen, setIsOpen }}>{children}</SideBarContext.Provider>
  }
  
  export function useSidebar() {
    const context = useContext(SideBarContext)
    if (context === undefined) {
      throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
  }