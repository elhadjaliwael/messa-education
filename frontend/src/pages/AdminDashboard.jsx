import React from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import AppSideBar from '@/components/AppSideBar'
function AdminDashboard() {
  return (
    <div>
      <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSideBar role='admin' />
        <SidebarInset className="flex flex-col flex-1 w-full min-w-0">
          <header className="flex h-16 shrink-0 items-center gap-2 w-full border-b border-border">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 pt-6 w-full">
            <div className="w-full">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
      {/* Add your admin dashboard content here */}
    </div>
  )
}

export default AdminDashboard