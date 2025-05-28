// Enhanced logger utility for production-safe logging
// In production, only errors are logged, while in development all levels are logged

/**
 * Logger interface defining the available logging methods
 */
export interface Logger {
  info: (message: string, ...optionalParams: any[]) => void;
  success: (message: string, ...optionalParams: any[]) => void;
  warn: (message: string, ...optionalParams: any[]) => void;
  error: (message: string, ...optionalParams: any[]) => void;
  debug: (message: string, ...optionalParams: any[]) => void;
}

/**
 * Logger implementation with production-safe logging
 */
const logger: Logger = {
  info: (message: string, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[INFO]', message, ...optionalParams);
    }
  },
  success: (message: string, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[SUCCESS]', message, ...optionalParams);
    }
  },
  warn: (message: string, ...optionalParams: any[]) => {
    // Warnings are logged in all environments
    console.warn('[WARN]', message, ...optionalParams);
  },
  error: (message: string, ...optionalParams: any[]) => {
    // Errors are always logged, even in production
    console.error('[ERROR]', message, ...optionalParams);
  },
  debug: (message: string, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[DEBUG]', message, ...optionalParams);
    }
  },
};

export default logger;
