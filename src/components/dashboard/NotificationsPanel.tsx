import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Notification } from '@/hooks/useNotificationSystem';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { format, isThisMonth, isThisWeek, isToday, isYesterday } from 'date-fns';
import { AlertCircle, Bell, Check, Clock, Filter, MessageSquare, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

type FilterOption = 'all' | 'unread' | 'document' | 'application' | 'admin' | 'system';
type GroupBy = 'date' | 'type' | 'none';

/**
 * NotificationsPanel
 * @description Function
 */
export const NotificationsPanel = (): JSX.Element => {
  const notificationData = useNotificationSystem() || {
    notifications: [],
    unreadCount: 0,
    loading: false,
    markAsRead: () => {},
    markAllAsRead: () => {},
    deleteNotification: () => {},
    deleteAllReadNotifications: () => {},
  };
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllReadNotifications,
  } = notificationData;

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [groupBy, setGroupBy] = useState<GroupBy>('date');

  // Filter notifications based on current filter
  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter((n) => !n.is_read);
    if (filter === 'document')
      return notifications.filter((n) => n.notification_type === 'document_status');
    if (filter === 'application')
      return notifications.filter((n) => n.notification_type === 'application_status');
    if (filter === 'admin')
      return notifications.filter((n) => n.notification_type === 'admin_feedback');
    if (filter === 'system') return notifications.filter((n) => n.notification_type === 'system');
    return notifications;
  }, [notifications, filter]);

  // Group notifications based on current groupBy
  const groupedNotifications = useMemo(() => {
    if (groupBy === 'none') {
      return { '': filteredNotifications };
    }

    if (groupBy === 'type') {
      return filteredNotifications.reduce(
        (groups, notification) => {
          const type = notification.notification_type || 'other';
          const displayType = getNotificationTypeDisplay(type);

          if (!groups[displayType]) {
            groups[displayType] = [];
          }
          groups[displayType].push(notification);
          return groups;
        },
        {} as Record<string, Notification[]>,
      );
    }

    // Default: group by date
    return filteredNotifications.reduce(
      (groups, notification) => {
        const dateKey = getDateGroupKey(new Date(notification.created_at));

        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(notification);
        return groups;
      },
      {} as Record<string, Notification[]>,
    );
  }, [filteredNotifications, groupBy]);

  const getNotificationTypeDisplay = (type: string): string => {
    switch (type) {
      case 'document_status':
        return 'Document Updates';
      case 'application_status':
        return 'Application Updates';
      case 'admin_feedback':
        return 'Admin Feedback';
      case 'system':
        return 'System Notifications';
      default:
        return 'Other';
    }
  };

  const getDateGroupKey = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return 'This Week';
    if (isThisMonth(date)) return 'This Month';
    return 'Older';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'document_status':
        return <AlertCircle className="h-4 w-4 text-[#1976D2]" />;
      case 'application_status':
        return <Clock className="h-4 w-4 text-[#388E3C]" />;
      case 'admin_feedback':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-[#757575]" />;
    }
  };

  const renderNotificationContent = (notification: Notification) => {
    return (
      <div
        className={`p-4 ${notification.is_read ? 'bg-white dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20'} transition-colors duration-200`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            {getNotificationIcon(notification.notification_type)}
            <h4 className="font-medium text-sm">{notification.title}</h4>
          </div>
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
        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 ml-6">{notification.message}</p>
        <div className="flex justify-between items-center mt-2 ml-6">
          <span className="text-xs text-[#757575] dark:text-[#BDBDBD]">
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

  const renderNotificationGroups = () => {
    return Object.entries(groupedNotifications).map(([groupName, groupNotifications]) => (
      <div key={groupName} className="mb-2">
        {groupName && (
          <div className="px-4 py-2 bg-muted/50 sticky top-0 z-10">
            <h3 className="text-xs font-semibold text-muted-foreground">{groupName}</h3>
          </div>
        )}
        {groupNotifications.map((notification, i) => (
          <div key={notification.id} className="animate-fade-in">
            {renderNotificationContent(notification)}
            {i < groupNotifications.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5 flex items-center justify-center bg-[#D32F2F] animate-pulse"
              variant="destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0" align="end">
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs" onClick={markAllAsRead}>
                <Check className="h-3 w-3 mr-1" /> Mark all read
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={filter}
                  onValueChange={(value) => setFilter(value as FilterOption)}
                >
                  <DropdownMenuRadioItem value="all">All notifications</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="unread">Unread only</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="document">Document updates</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="application">
                    Application updates
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="admin">Admin feedback</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuLabel className="mt-2">Group by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={groupBy}
                  onValueChange={(value) => setGroupBy(value as GroupBy)}
                >
                  <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="type">Type</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-[#D32F2F] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10"
                  onClick={deleteAllReadNotifications}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete read notifications
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh]">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin h-6 w-6 border-2 border-cap-teal border-t-transparent rounded-full"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            renderNotificationGroups()
          ) : (
            <div className="p-8 text-center text-[#757575] dark:text-[#BDBDBD]">
              <p>No notifications</p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
