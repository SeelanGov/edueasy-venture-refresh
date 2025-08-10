type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  debug(message: string, data?: unknown) {
    if (this.isDevelopment) {
      const entry = this.formatMessage('debug', message, data);
      console.debug(`[${entry.timestamp}] DEBUG: ${entry.message}`, entry.data || '');
    }
  }

  info(message: string, data?: unknown) {
    const entry = this.formatMessage('info', message, data);
    console.warn(`[${entry.timestamp}] INFO: ${entry.message}`, entry.data || '');
  }

  warn(message: string, data?: unknown) {
    const entry = this.formatMessage('warn', message, data);
    console.warn(`[${entry.timestamp}] WARN: ${entry.message}`, entry.data || '');
  }

  error(message: string, error?: unknown) {
    const entry = this.formatMessage('error', message, error);
    console.error(`[${entry.timestamp}] ERROR: ${entry.message}`, entry.data || '');

    // In production, you might want to send errors to a logging service
    if (!this.isDevelopment && error) {
      // Example: Send to error tracking service
      // this.sendToErrorService(entry);
    }
  }

  // Future enhancement: send critical errors to Supabase
  private async sendToErrorService(_entry: LogEntry) {
    // Implementation for sending to external logging service
    // Could integrate with Supabase system_error_logs table
  }
}

const logger = new Logger();
export default logger;
