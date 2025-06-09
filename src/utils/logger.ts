
enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel;

  constructor() {
    // Set log level based on environment - only allow warnings and errors in production
    this.level = import.meta.env.PROD ? LogLevel.WARN : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatMessage(level: string, message: string, ...args: unknown[]): void {
    if (import.meta.env.PROD) {
      // In production, only log warnings and errors
      if (level === 'WARN' || level === 'ERROR') {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level}]`;
        console[level.toLowerCase() as 'warn' | 'error'](prefix, message, ...args);
      }
    } else {
      // In development, log everything but with less noise
      const timestamp = new Date().toLocaleTimeString();
      const prefix = `[${timestamp}] [${level}]`;
      console.log(prefix, message, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.formatMessage('DEBUG', message, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.formatMessage('INFO', message, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.formatMessage('WARN', message, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.formatMessage('ERROR', message, ...args);
    }
  }
}

const logger = new Logger();
export default logger;
