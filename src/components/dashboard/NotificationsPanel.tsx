
import { useState } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotificationSystem, Notification } from "@/hooks/useNotificationSystem";

export const NotificationsPanel = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotificationSystem();
  const [open, setOpen] = useState(false);

  const renderNotificationContent = (notification: Notification) => {
    return (
      <div className={`p-4 ${notification.is_read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          <Button 
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={(e) => {
              e.stopPropagation();
              deleteNotification(notification.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(notification.created_at), 'MMM d, h:mm a')}
          </span>
          {!notification.is_read && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 text-xs px-2"
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(notification.id);
              }}
            >
              <Check className="h-3 w-3 mr-1" /> Mark read
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5 flex items-center justify-center bg-red-500" 
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" /> Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-[60vh]">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-cap-teal border-t-transparent rounded-full"></div>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification, i) => (
              <div key={notification.id}>
                {renderNotificationContent(notification)}
                {i < notifications.length - 1 && <Separator />}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p>No notifications</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
