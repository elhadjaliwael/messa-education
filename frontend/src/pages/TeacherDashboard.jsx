import {useEffect,useRef} from 'react'
import AppSideBar from '@/components/AppSideBar'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import {
  Outlet,
} from 'react-router-dom';
import useAuth from '@/hooks/useAuth'
import useNotificationStore from '@/store/notificationStore';
import useMessageStore from '@/store/messageStore';

function TeacherDashboard() {
  const {auth} = useAuth()
  const {initializeSocket,disconnectMessageSocket} = useMessageStore()
  const {setupNotificationSocket,initializeNotificationSocket,disconnectNotificationSocket} = useNotificationStore()
  const socketsInitialized = useRef(false);
  
  useEffect(() => {
    if (!auth?.accessToken) return;

    // Initialize sockets if not already initialized
    if (!socketsInitialized.current) {
      const msgSocket = initializeSocket(auth);
      const notifSocket = initializeNotificationSocket(auth);
      setupNotificationSocket(notifSocket);
      socketsInitialized.current = true;
    }

    // Cleanup on unmount or refresh
    const handleBeforeUnload = () => {
      disconnectMessageSocket();
      disconnectNotificationSocket();
      socketsInitialized.current = false;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup on component unmount
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [auth?.accessToken, initializeSocket, initializeNotificationSocket, setupNotificationSocket, disconnectMessageSocket, disconnectNotificationSocket]);
  return (
    <SidebarProvider>
    <div className="flex h-screen w-full bg-background">
      <AppSideBar role='teacher' />
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
  )
}

export default TeacherDashboard