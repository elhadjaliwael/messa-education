"use client"

import { useState } from "react"
import { Bell, LogOut, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useSidebar } from "../hooks/use-sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function Header() {
  const { setTheme } = useTheme()
  const { isOpen, setIsOpen } = useSidebar()
  const [notifications, setNotifications] = useState(3)

  const notificationItems = [
    {
      id: 1,
      title: "New course available",
      description: "Introduction to Machine Learning is now available",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      title: "Assignment reminder",
      description: "Your Python assignment is due tomorrow",
      time: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      title: "Course completed",
      description: "You've completed Web Development Basics",
      time: "1 day ago",
      unread: true,
    },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 dark:border-slate-800 dark:bg-slate-950 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <span className="text-lg font-semibold text-blue-600 dark:text-blue-500">messa_education</span>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <span className="text-xl font-semibold text-blue-600 dark:text-blue-500">messa_education</span>
      </div>
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                  {notifications}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <div className="border-b p-3">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-auto">
              {notificationItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex gap-4 p-3 border-b last:border-0",
                    item.unread ? "bg-slate-50 dark:bg-slate-900" : "",
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full justify-center">
                Voir toutes les notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile area with avatar, username and email only */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2 py-1.5">
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">alex_lee</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">alex@example.com</p>
              </div>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
                  AL
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="text-sm font-medium">FR</span>
              <span className="sr-only">Changer de langue</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <span className="mr-2">🇫🇷</span> Français
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="mr-2">🇬🇧</span> Anglais
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="mr-2">🇦🇪</span> Arabe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Display size selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="text-sm font-medium">A</span>
              <span className="sr-only">Taille d'affichage</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <span className="text-sm">Petite</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-base">Normale</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-lg">Grande</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark mode toggle remains the same */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

import { cn } from "@/lib/utils"
