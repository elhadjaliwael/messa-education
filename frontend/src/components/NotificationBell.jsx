import React, { useEffect, useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useNotificationStore from '@/store/notificationStore';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    removeNotification
  } = useNotificationStore();
  
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setOpen(false);
  };

  const handleRemoveNotification = (e, notificationId) => {
    e.stopPropagation();
    removeNotification(notificationId);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "relative transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800",
            unreadCount > 0 && "text-blue-600 dark:text-blue-400"
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white font-medium shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 shadow-lg" align="end">
       
       <div className='space-y-2'>
          <h4 className='m-4'>Notifications</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead()}
              className="text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}

       </div>
          

        <ScrollArea className="h-[320px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                No notifications yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                We'll notify you when something happens
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "group flex items-start gap-3 p-4 cursor-pointer transition-all duration-150",
                    "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    !notification.read && "bg-blue-50/50 dark:bg-blue-950/20 border-l-2 border-l-blue-500"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className={cn(
                    "mt-1 h-2 w-2 rounded-full flex-shrink-0",
                    !notification.read ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium leading-5",
                      !notification.read ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-4">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                    onClick={(e) => handleRemoveNotification(e, notification.id)}
                  >
                    <X className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}