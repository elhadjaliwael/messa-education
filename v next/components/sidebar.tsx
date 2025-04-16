"use client"

import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { BookOpen, Home, LogOut, MessageSquare, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useSidebar } from "../hooks/use-sidebar"

const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Courses",
    icon: BookOpen,
    href: "/courses",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/messages",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar()
  const location = useLocation()

  // Close sidebar when pressing escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [setIsOpen])

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 h-[70vh] transform rounded-t-2xl border-t bg-white p-6 shadow-lg transition-transform dark:border-slate-800 dark:bg-slate-950 md:hidden",
          isOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-500">EduLearn</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <ScrollArea className="mt-6 h-[calc(70vh-80px)]">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-colors hover:bg-blue-50 dark:text-slate-50 dark:hover:bg-blue-950/50",
                    isActive && "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-50",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 text-slate-500 dark:text-slate-400",
                      isActive && "text-blue-600 dark:text-blue-500",
                    )}
                  />
                  {item.title}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden w-64 shrink-0 border-r bg-white dark:border-slate-800 dark:bg-slate-950 md:block">
        <div className="flex h-full flex-col">
          <div className="p-6">{/* Logo area */}</div>
          <ScrollArea className="flex-1 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.title}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-colors hover:bg-blue-50 dark:text-slate-50 dark:hover:bg-blue-950/50",
                      isActive && "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-50",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 text-slate-500 dark:text-slate-400",
                        isActive && "text-blue-600 dark:text-blue-500",
                      )}
                    />
                    {item.title}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
          <div className="border-t p-4 dark:border-slate-800">
            <Button variant="ghost" className="flex w-full items-center justify-start gap-2 px-2 py-1.5">
              <LogOut className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
