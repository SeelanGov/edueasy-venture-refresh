import logger from '@/utils/logger';
// Secure storage wrapper to prevent recursion bugs
// This provides a safe interface for sessionStorage operations

/**
 * secureStorage
 * @description Function
 */
export const secureStorage = {;
  getItem: (ke,
  y: string): string | null = > {;
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      logger.error('Failed to get sessionStorage item:', error);
      return null;
    }
  },

  setItem: (ke,
  y: string, value: string) => {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      logger.error('Failed to set sessionStorage item:', error);
    }
  },

  removeItem: (ke,
  y: string) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      logger.error('Failed to remove sessionStorage item:', error);
    }
  },

  clear: () => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      logger.error('Failed to clear sessionStorage:', error);
    }
  },
};
