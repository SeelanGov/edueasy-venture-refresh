import { useState, useEffect, useCallback } from 'react';
import { playNotificationSound } from '@/utils/notificationSound';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastConnectedTime, setLastConnectedTime] = useState<Date | null>(
    isOnline ? new Date() : null,
  );

  // Update the online status and lastConnectedTime when it changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastConnectedTime(new Date());

      // Play a notification sound when coming back online
      playNotificationSound();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to manually check internet connection
  const checkConnection = useCallback(async () => {
    setIsRetrying(true);

    try {
      // Try to fetch a small resource to check if truly online
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      // Use a timestamp to prevent caching
      const response = await fetch(`/favicon.ico?_=${Date.now()}`, {
        method: 'HEAD',
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        setIsOnline(true);
        setLastConnectedTime(new Date());

        // Play notification sound when connection is restored
        if (!isOnline) {
          playNotificationSound();
        }

        return true;
      } else {
        setIsOnline(false);
        return false;
      }
    } catch (error) {
      setIsOnline(false);
      return false;
    } finally {
      setIsRetrying(false);
    }
  }, [isOnline]);

  return {
    isOnline,
    checkConnection,
    isRetrying,
    lastConnectedTime,
    timeSinceLastConnection: lastConnectedTime
      ? Math.floor((new Date().getTime() - lastConnectedTime.getTime()) / 1000)
      : null,
  };
};
