// Secure storage wrapper to prevent recursion bugs
// This provides a safe interface for sessionStorage operations

/**
 * secureStorage
 * @description Function
 */
export const secureStorage = {
  getItem: (key: string): string | null => {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      console.error('Failed to get sessionStorage item:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to set sessionStorage item:', error);
    }
  },

  removeItem: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove sessionStorage item:', error);
    }
  },

  clear: (): void => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
    }
  },
};
