"use client"

import { Link, useLocation } from "react-router-dom"
import { BookOpen, Home, Menu, MessageSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSidebar } from "../hooks/use-sidebar"

const navItems = [
  {
    title: "Home",
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

export function MobileNav() {
  const { setIsOpen } = useSidebar()
  const location = useLocation()

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link key={item.title} to={item.href} className="flex flex-1 flex-col items-center justify-center py-2">
              <item.icon
                className={cn(
                  "h-5 w-5 text-slate-500 dark:text-slate-400",
                  isActive && "text-blue-600 dark:text-blue-500",
                )}
              />
              <span
                className={cn(
                  "mt-1 text-xs text-slate-500 dark:text-slate-400",
                  isActive && "text-blue-600 dark:text-blue-500",
                )}
              >
                {item.title}
              </span>
            </Link>
          )
        })}
        <div className="flex flex-1 items-center justify-center">
          <Button
            onClick={() => setIsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 p-0 text-white shadow-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
