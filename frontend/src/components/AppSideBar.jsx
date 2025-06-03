import {
    Command,
    Settings2,
    LayoutDashboardIcon,
    GraduationCapIcon,
    UsersRound,
    MessageCircleMore,

  } from "lucide-react"
  import { NavMain } from "@/components/NavMain"
  import { NavUser } from "@/components/NavUser"
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
  import useAuth from "../hooks/useAuth"

  
  export default function AppSidebar({ role = "student", ...props }) {
    const { user, logout } = useAuth()
    
    // Define role-based navigation items
    const getNavItems = (role) => {
      const commonItems = [
        {
          title: "Settings",
          url: `/${role}/settings`,
          icon: Settings2,
          items: [
            { title: "Profile", url: `/${role}/settings/profile` },
            { title: "Account", url: `/${role}/settings/account` },
            { title: "Preferences", url: `/${role}/settings/preferences` },
          ],
        },
      ]
      
      switch(role) {
        case "student":
          return [
            {
              title: "Dashboard",
              url: "/student",
              icon: LayoutDashboardIcon,
              isActive: true,
            },
            {
              title: "My Courses",
              url: "/student/courses",
              icon: GraduationCapIcon,
            },
            {
              title: "Messages",
              url: "/student/messages",
              icon: MessageCircleMore,
            },
            ...commonItems
          ]
        // TODO :Add other roles as needed
        case "admin":
          return [
            {
              title: "Dashboard",
              url: "/admin",
              icon: LayoutDashboardIcon,
              isActive: true,
            },
            {
              title: "Courses",
              url: "/admin/courses",
              icon: GraduationCapIcon,
            },
            {
              title: "Users",
              url: "/admin/users",
              icon: UsersRound,
            },
            ...commonItems
          ]
        case "teacher":
          return [
            {
              title: "Dashboard",
              url: "/teacher",
              icon: LayoutDashboardIcon,
              isActive: true,
            },
            {
              title: "Courses",
              url: "/teacher/courses",
              icon: GraduationCapIcon,
            },
            {
              title: "Messages",
              url: "/teacher/messages",
              icon: MessageCircleMore, 
            },
           ...commonItems
          ]
        case "parent":
          return [
            {
              title: "Dashboard",
              url: "/parent",
              icon: LayoutDashboardIcon,
              isActive: true,
            }, 
            ...commonItems
          ]
        default:
          return commonItems
      }
    }
    
    const data = {
      user: {
        name: user?.username || "User",
        email: user?.email || "user@example.com",
        avatar: user?.avatar || "/avatars/default.jpg",
      },
      navMain: getNavItems(role)
    }
    
    return (
      <Sidebar  collapsible="icon" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Messa Education</span>
                    <span className="truncate text-xs capitalize">{role}</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} logout={logout} />
        </SidebarFooter>
      </Sidebar>
    )
  }