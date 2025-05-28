import { useState, useCallback } from 'react';

/**
 * Custom hook for persistent local storage state
 *
 * @param key The local storage key
 * @param initialValue The initial value (used if no value exists in storage)
 * @returns An array containing the current value and setter functions
 */
export function useLocalStorage<T>(key?: string, initialValue?: T) {
  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key || '');
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue());

  // Set to localStorage and update state
  const setValue = useCallback(
    (value: T) => {
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a browser`
        );
        return;
      }

      try {
        // Allow value to be a function for same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        window.localStorage.setItem(key || '', JSON.stringify(valueToStore));
        setStoredValue(valueToStore);
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove from localStorage
  const removeItem = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key || '');
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [initialValue, key]);

  // Generic get item from localStorage
  const getItem = useCallback((itemKey: string) => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      return window.localStorage.getItem(itemKey);
    } catch (error) {
      console.warn(`Error getting localStorage key "${itemKey}":`, error);
      return null;
    }
  }, []);

  // Generic set item to localStorage
  const setItem = useCallback((itemKey: string, value: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(itemKey, value);
    } catch (error) {
      console.warn(`Error setting localStorage key "${itemKey}":`, error);
    }
  }, []);

  return {
    value: storedValue,
    setValue,
    removeItem,
    getItem,
    setItem,
  };
}
