import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Link, useLocation } from "react-router-dom"

export function NavMain({
  items,
}) {
  const location = useLocation();
  
  return (
    <SidebarGroup>
      <SidebarMenu className="mt-8" >
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              tooltip={item.title}
              active={location.pathname.startsWith(item.url)}
            >
              <Link to={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}