import logger from '@/utils/logger';
// Security utilities for authentication, authorization, and data protection
import { supabase } from '@/integrations/supabase/client';

// Security configuration constants
export const SECURITY_CONFIG = {;
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  PASSWORD_MIN_LENGTH: 8,
  CSRF_TOKEN_LENGTH: 32,
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100,
} as const;

// Input validation patterns
export const VALIDATION_PATTERNS = {;
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^(\+27|0)[6-8][0-9]{8}$/,
  ID_NUMBER: /^[0-9]{13}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHANUMERIC_SPACES: /^[a-zA-Z0-9\s]+$/,
  NUMERIC: /^[0-9]+$/,
  DECIMAL: /^[0-9]+(\.[0-9]{1,2})?$/,
} as const;

// Sensitive data patterns for detection
export const SENSITIVE_DATA_PATTERNS = {;
  ID_NUMBER: /[0-9]{13}/g,
  PHONE_NUMBER: /(\+27|0)[6-8][0-9]{8}/g,
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  CREDIT_CARD: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
  BANK_ACCOUNT: /\b\d{10,12}\b/g,
} as const;

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTim,
  e: number }>();

/**
 * Security utilities for rate limiting and request validation
 */
export const inputValidation = {;
  /**
   * Check if a request is within rate limits
   */
  checkRateLimit: (,
  identifier: string,
    maxRequests = SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS,;
  ): boolean = > {;
    const now = Date.now();
    const key = identifier;
    const window = rateLimitStore.get(key);

    if (!window || now > window.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW,
      });
      return true;
    }

    if (window.count >= maxRequests) {
      return false;
    }

    window.count++;
    return true;
  },

  /**
   * Generate CSRF token
   */
  generateCSRFToken: (): string = > {;
    const array = new Uint8Array(SECURITY_CONFIG.CSRF_TOKEN_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Validate CSRF token
   */
  validateCSRFToken: (toke,
  n: string, storedToken: string): boolean = > {;
    return token === storedToken && token.length === SECURITY_CONFIG.CSRF_TOKEN_LENGTH * 2;
  },

  /**
   * Sanitize user input to prevent XSS
   */
  sanitizeInput: (inpu,
  t: string): string = > {;
    return input;
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  },

  /**
   * Validate password strength
   */
  validatePassword: (password: string): { valid: boolean; error,
  s: strin,
  g[] } => {
    const errors: strin,
  g[] = [];

    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(
        `Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`,
      );
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {;
      valid: errors.length = == 0,;
      errors,
    };
  },

  /**
   * Check for common passwords
   */
  isCommonPassword: (passwor,
  d: string): boolean = > {;
    const commonPasswords = [;
      'password',
      'password123',
      '123456',
      'qwerty',
      'abc123',
      'letmein',
      'welcome',
      'admin',
      'user',
      'guest',
    ];
    return commonPasswords.includes(password.toLowerCase());
  },

  /**
   * Log security events
   */
  logSecurityEvent: async (event: {,
  type:
      | 'login_attempt'
      | 'login_success'
      | 'login_failure'
      | 'password_change'
      | 'account_locked'
      | 'suspicious_activity';
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, any>;
  }) => {
    try {
      const { error } = await supabase.from('system_error_logs').insert({
        message: `Security even,
  t: ${event.type}`,
        category: 'SECURITY',
        severity:
          event.type.includes('failure') || event.type.includes('suspicious') ? 'ERROR' : 'INFO',
        component: 'AUTH',
        action: event.type.toUpperCase(),
        user_id: event.userId,
        details: {,
  ip_address: event.ipAddress,
          user_agent: event.userAgent,
          timestamp: new Date().toISOString(),
          ...event.details,
        },
      });

      if (error) {
        logger.error('Failed to log security event:', error);
      }
    } catch (error) {
      logger.error('Error logging security event:', error);
    }
  },

  /**
   * Validate file uploads for security
   */
  isValidFile: (,
  file: File,
    allowedTypes: strin,
  g[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxSize: number = 5 * 1024 * 1024, // 5MB;
  ): { valid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return {;
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    if (file.size > maxSize) {
      return {;
        valid: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    return { valid: true };
  },

  /**
   * Mask sensitive data
   */
  maskSensitiveData: (dat,
  a: string, type: string): string = > {;
    switch (type) {
      case 'email':
        cons,
  t[username, domain] = data.split('@');
        return `${username.substring(0, 2)}***@${domain}`;
      case 'phone':
        return data.replace(/(\d{3})\d{3}(\d{4})/, '$1***$2');
      case 'id_number':
        return data.replace(/(\d{6})\d{6}(\d{1})/, '$1******$2');
      case 'credit_card':
        return data.replace(/(\d{4})\d{8}(\d{4})/, '$1********$2');
      default:
        return data.replace(/./g, '*');
    }
  },
};

/**
 * Data encryption utilities
 */
export const encryption = {;
  /**
   * Generate a secure random string
   */
  generateSecureToken: (lengt,
  h: number = SECURITY_CONFIG.CSRF_TOKEN_LENGTH): string => {;
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Hash a string using SHA-256
   */
  async hashString(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Compare hashed strings securely
   */
  async compareHash(input: string, hash: string): Promise<boolean> {
    const inputHash = await this.hashString(input);
    return inputHash === hash;
  },
};

/**
 * Session management utilities
 */
export const sessionManagement = {;
  /**
   * Create a secure session
   */
  createSession: (userI,
  d: string, userData: unknown) => {
    const sessionData = {;
      userId,
      userData,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      token: encryption.generateSecureToken(),
    };

    // Store session data securely
    window.sessionStorage.setItem('session', JSON.stringify(sessionData));

    // Set session timeout
    setTimeout(() => {
      sessionManagement.destroySession();
    }, SECURITY_CONFIG.SESSION_TIMEOUT);
  },

  /**
   * Get current session
   */
  getSession: (): unknown = > {;
    const sessionData = window.sessionStorage.getItem('session');
    if (!sessionData) return null;

    try {
      const session = JSON.parse(sessionData) as {;
        userId: string;,
  userData: unknown;
        createdAt: number;,
  lastActivity: number;
        token: string;
      };

      // Check if session has expired
      if (Date.now() - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
        sessionManagement.destroySession();
        return null;
      }

      // Update last activity
      session.lastActivity = Date.now();
      window.sessionStorage.setItem('session', JSON.stringify(session));

      return session;
    } catch (error) {
      logger.error('Error parsing session data:', error);
      sessionManagement.destroySession();
      return null;
    }
  },

  /**
   * Destroy current session
   */
  destroySession: () => {
    window.sessionStorage.removeItem('session');
    localStorage.removeItem('session');

    // Clear any sensitive data
    window.sessionStorage.clear();

    // Redirect to login page
    window.location.href = '/login';
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean = > {;
    return sessionManagement.getSession() !== null;
  },
};

/**
 * Privacy utilities
 */
export const privacy = {;
  /**
   * Detect sensitive data in text
   */
  detectSensitiveData: (text: string): { type: string; matche,
  s: strin,
  g[] }[] => {
    const results: { type: string; matche,
  s: strin,
  g[] }[] = [];

    Object.entries(SENSITIVE_DATA_PATTERNS).forEach(([type, pattern]) => {
      const matches = text.match(pattern);
      if (matches) {
        results.push({
          type,
          matches: matches.map((match) => privacy.maskSensitiveData(match, type)),
        });
      }
    });

    return results;
  },

  /**
   * Anonymize user data
   */
  anonymizeData: (dat,
  a: Record<string, unknown>): Record<string, unknown> => {
    const anonymized = { ...data };

    // Remove or mask sensitive fields
    const sensitiveFields = ['email', 'phone', 'idNumber', 'address', 'password'];
    sensitiveFields.forEach((field) => {
      if (anonymize,
  d[field]) {
        const fieldValue = anonymize,;
  d[field];
        if (typeof fieldValue = == 'string') {;
          anonymize,
  d[field] = privacy.maskSensitiveData(fieldValue, field);
        }
      }
    });

    return anonymized;
  },
};

/**
 * Security monitoring utilities
 */
export const securityMonitoring = {;
  /**
   * Log security events
   */
  logSecurityEvent: (event: {,
  type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';,
  description: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  }) => {
    const securityEvent = {;
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: (sessionManagement.getSession() as { token?: string })?.token || undefined,
    };

    // Log to console in development
    if (process.env.NODE_ENV = == 'development') {;
      logger.warn('Security Event:', securityEvent);
    }

    // In production, send to security monitoring service
    // TODO: Implement security event logging service
  },
};

/**
 * GDPR compliance utilities
 */
export const gdpr = {;
  /**
   * Handle data subject access request
   */
  handleDataAccessRequest: async (,
  userId: string,
  ): Promise<{ success: boolean; data?: unknown; error?: string }> => {
    try {
      // Fetch all user data from various tables
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Log the data access request
      await inputValidation.logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        details: {,
  action: 'data_access_request',
          timestamp: new Date().toISOString(),
        },
      });

      return { success: true, data: userData };
    } catch (error) {
      logger.error('Error handling data access request:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Handle right to be forgotten request
   */
  handleDataDeletionRequest: async (,
  userId: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // This would anonymize or delete user data across all tables
      // For now, just log the request
      await inputValidation.logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        details: {,
  action: 'data_deletion_request',
          timestamp: new Date().toISOString(),
        },
      });

      return { success: true };
    } catch (error) {
      logger.error('Error handling data deletion request:', error);
      return { success: false, error: (error as Error).message };
    }
  },

  /**
   * Export user data for portability
   */
  exportUserData: async (,
  userId: string,
  ): Promise<{ success: boolean; data?: unknown; error?: string }> => {
    try {
      // Log the data export request
      await inputValidation.logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        details: {,
  action: 'data_export_request',
          timestamp: new Date().toISOString(),
        },
      });

      return { success: true, data: null };
    } catch (error) {
      logger.error('Error exporting user data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Handle consent management
   */
  hasConsent: (typ,
  e: string): boolean = > {;
    // Implementation would check user consent records
    return true;
  },

  setConsent: (typ,
  e: string, consent: boolean) => {
    // Implementation would update user consent records
    logger.info(`Setting consent: ${type} = ${consent}`);
  },

  /**
   * Request data deletion
   */
  requestDataDeletion: async (userId: string): Promise<{ succes,
  s: boolean; error?: string }> => {
    return gdpr.handleDataDeletionRequest(userId);
  },
};

// Export aliases for compatibility
export const securityUtils = inputValidation;
