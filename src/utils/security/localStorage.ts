import { toast } from '@/components/ui/use-toast';
// Secure localStorage utility with encryption and session management

// Simple encryption key (in production, this should be environment-specific)
const ENCRYPTION_KEY = 'edueasy-secure-storage-v1';

// Sensitive keys that should be encrypted
const SENSITIVE_KEYS = [
  'rememberedEmail',
  'user_preferences',
  'session_data',
  'auth_tokens',
  'payment_info',
];

// Session timeout (8 hours)
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

/**
 * Simple encryption/decryption for localStorage
 * Note: This is a basic implementation. For production, consider using a more robust encryption library
 */
const encrypt = (text: string): string => {
  try {
    // Simple XOR encryption with key rotation
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result); // Base64 encode
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

const decrypt = (encryptedText: string): string => {
  try {
    const decoded = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

/**
 * Check if a key contains sensitive data
 */
const isSensitiveKey = (key: string): boolean => {
  return SENSITIVE_KEYS.some((sensitiveKey) =>
    key.toLowerCase().includes(sensitiveKey.toLowerCase()),
  );
};

/**
 * Secure setItem with encryption for sensitive data
 */

/**
 * secureSetItem
 * @description Function
 */
export const secureSetItem = (key: string, value: string): void => {
  try {
    if (isSensitiveKey(key)) {
      // Encrypt sensitive data
      const encryptedValue = encrypt(value);
      localStorage.setItem(key, encryptedValue);
    } else {
      // Store non-sensitive data normally
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error('Failed to set secure localStorage item:', error);
    toast({
      title: 'Storage Error',
      description: 'Failed to save data securely',
      variant: 'destructive',
    });
  }
};

/**
 * Secure getItem with decryption for sensitive data
 */

/**
 * secureGetItem
 * @description Function
 */
export const secureGetItem = (key: string): string | null => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;

    if (isSensitiveKey(key)) {
      // Decrypt sensitive data
      return decrypt(value);
    } else {
      // Return non-sensitive data normally
      return value;
    }
  } catch (error) {
    console.error('Failed to get secure localStorage item:', error);
    return null;
  }
};

/**
 * Secure removeItem
 */

/**
 * secureRemoveItem
 * @description Function
 */
export const secureRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove localStorage item:', error);
  }
};

/**
 * Clear all secure localStorage data
 */

/**
 * secureClear
 * @description Function
 */
export const secureClear = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

/**
 * Session management utilities
 * Fixed recursion bug by using window.sessionStorage directly
 */

/**
 * secureSessionStorage
 * @description Function
 */
export const secureSessionStorage = {
  setItem: (key: string, value: string): void => {
    try {
      if (isSensitiveKey(key)) {
        const encryptedValue = encrypt(value);
        window.sessionStorage.setItem(key, encryptedValue);
      } else {
        window.sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Failed to set sessionStorage item:', error);
    }
  },

  getItem: (key: string): string | null => {
    try {
      const value = window.sessionStorage.getItem(key);
      if (!value) return null;

      if (isSensitiveKey(key)) {
        return decrypt(value);
      } else {
        return value;
      }
    } catch (error) {
      console.error('Failed to get sessionStorage item:', error);
      return null;
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

/**
 * Check if session has expired
 */

/**
 * isSessionExpired
 * @description Function
 */
export const isSessionExpired = (): boolean => {
  const sessionStart = secureGetItem('session_start');
  if (!sessionStart) return true;

  const startTime = parseInt(sessionStart, 10);
  const currentTime = Date.now();

  return currentTime - startTime > SESSION_TIMEOUT;
};

/**
 * Start a new session
 */

/**
 * startSession
 * @description Function
 */
export const startSession = (): void => {
  secureSetItem('session_start', Date.now().toString());
};

/**
 * Extend current session
 */

/**
 * extendSession
 * @description Function
 */
export const extendSession = (): void => {
  if (!isSessionExpired()) {
    startSession(); // Reset session timer
  }
};

/**
 * Clear session and sensitive data
 */

/**
 * clearSession
 * @description Function
 */
export const clearSession = (): void => {
  // Clear all sensitive data
  SENSITIVE_KEYS.forEach((key) => {
    secureRemoveItem(key);
    window.sessionStorage.removeItem(key);
  });

  // Clear session data
  secureRemoveItem('session_start');
  secureRemoveItem('rememberMe');

  // Clear sessionStorage
  window.sessionStorage.clear();
};

/**
 * Get session status
 */

/**
 * getSessionStatus
 * @description Function
 */
export const getSessionStatus = (): void => {
  const isExpired = isSessionExpired();
  const sessionStart = secureGetItem('session_start');
  const rememberMe = secureGetItem('rememberMe');

  return {
    isExpired,
    sessionStart: sessionStart ? parseInt(sessionStart, 10) : null,
    rememberMe: rememberMe === 'true',
    timeRemaining: sessionStart
      ? Math.max(0, SESSION_TIMEOUT - (Date.now() - parseInt(sessionStart, 10)))
      : 0,
  };
};

/**
 * Auto-clear expired sessions
 */

/**
 * cleanupExpiredSessions
 * @description Function
 */
export const cleanupExpiredSessions = (): void => {
  if (isSessionExpired()) {
    clearSession();
    toast({
      title: 'Session Expired',
      description: 'Your session has expired. Please log in again.',
      variant: 'destructive',
    });
  }
};

// Auto-cleanup on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', cleanupExpiredSessions);
  window.addEventListener('focus', extendSession);
}
