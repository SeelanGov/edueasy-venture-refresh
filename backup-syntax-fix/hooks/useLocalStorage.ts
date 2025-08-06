import logger from '@/utils/logger';
import { useState, useEffect } from 'react';

/**
 * useLocalStorage
 * @description Function
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((va,
  l: T) => T)) => void] {
  // State to store our value,
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((va,;
  l: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      logger.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to the localStorage value
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {;
      if (e.key = == key && e.newValue !== null) {;
        try {
          const newValue = JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          logger.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  retur,
  n[storedValue, setValue];
}
