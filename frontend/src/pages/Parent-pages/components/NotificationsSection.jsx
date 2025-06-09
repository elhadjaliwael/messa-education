import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import useNotificationStore from "@/store/notificationStore"
import { Bell, BookOpen, Award, Clock, CheckCircle, AlertTriangle, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

function NotificationsSection() {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    removeNotification 
  } = useNotificationStore()
  
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'
  
  useEffect(() => {
    fetchNotifications()
  }, [])
  
  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'read') return notification.read
    return true
  })
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_ASSIGNMENT':
        return <BookOpen className="h-4 w-4" />
      case 'ASSIGNMENT_COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'COURSE_UPDATE':
        return <Award className="h-4 w-4" />
      case 'NEW_COURSE_FROM_TEACHER':
        return <Award className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }
  
  // Get notification color based on type - Fixed for dark mode
  const getNotificationColor = (type) => {
    switch (type) {
      case 'NEW_ASSIGNMENT':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
      case 'ASSIGNMENT_COMPLETED':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100'
      case 'COURSE_UPDATE':
        return 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-100'
      case 'NEW_COURSE_FROM_TEACHER':
        return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100'
      default:
        return 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
    }
  }
  
  // Get icon background color - Fixed for dark mode
  const getIconBgColor = (type) => {
    switch (type) {
      case 'NEW_ASSIGNMENT':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      case 'ASSIGNMENT_COMPLETED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
      case 'COURSE_UPDATE':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
      case 'NEW_COURSE_FROM_TEACHER':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
      default:
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400'
    }
  }
  
  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId)
  }
  
  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }
  
  const handleRemoveNotification = (notificationId) => {
    removeNotification(notificationId)
  }
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications & Reminders
          </CardTitle>
          <CardDescription>
            Stay updated with your children's learning activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-muted-foreground">Loading notifications...</span>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications & Reminders
          </CardTitle>
          <CardDescription>
            Stay updated with your children's learning activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications & Reminders
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Stay updated with your children's learning activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filter and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className="h-8 px-3 text-xs"
            >
              All ({notifications.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
              className="h-8 px-3 text-xs"
            >
              Unread ({unreadCount})
            </Button>
            <Button
              size="sm"
              variant={filter === 'read' ? 'default' : 'outline'}
              onClick={() => setFilter('read')}
              className="h-8 px-3 text-xs"
            >
              Read ({notifications.length - unreadCount})
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMarkAllAsRead}
              className="h-8 px-3 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center p-8 bg-muted/10 rounded-lg border border-dashed border-muted">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <h3 className="font-medium text-lg mb-2">
              {filter === 'unread' ? 'No unread notifications' : 
               filter === 'read' ? 'No read notifications' : 'No notifications'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {filter === 'unread' 
                ? 'You\'re all caught up! No new notifications to review.'
                : filter === 'read'
                ? 'No notifications have been read yet.'
                : 'You don\'t have any notifications yet. They\'ll appear here when you receive them.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification._id} 
                className={`${getNotificationColor(notification.type)} ${!notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''} transition-all duration-200 hover:shadow-sm border`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`${getIconBgColor(notification.type)} p-2 rounded-full flex-shrink-0`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm leading-tight">
                          {notification.title}
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2"></span>
                          )}
                        </h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveNotification(notification._id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm mt-1 leading-relaxed opacity-90">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-xs opacity-75">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </div>
                        <div className="flex items-center gap-2">
                          {notification.data?.link && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-7 px-2 text-xs bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 border-current"
                              onClick={() => {
                                // Navigate to the link if needed
                                window.location.href = notification.data.link
                              }}
                            >
                              View
                            </Button>
                          )}
                          {!notification.read && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 px-2 text-xs hover:bg-white/50 dark:hover:bg-slate-800/50"
                              onClick={() => handleMarkAsRead(notification._id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default NotificationsSection