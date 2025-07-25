/**
 * Security utilities for data protection, input validation, and privacy compliance
 */


// Security constants
export const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  CSRF_TOKEN_LENGTH: 32,
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100,
} as const;

// Input validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^(\+27|0)[6-8][0-9]{8}$/,
  ID_NUMBER: /^[0-9]{13}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHANUMERIC_SPACES: /^[a-zA-Z0-9\s]+$/,
  NUMERIC: /^[0-9]+$/,
  DECIMAL: /^[0-9]+(\.[0-9]{1,2})?$/,
} as const;

// Sensitive data patterns for detection
export const SENSITIVE_DATA_PATTERNS = {
  ID_NUMBER: /[0-9]{13}/g,
  PHONE_NUMBER: /(\+27|0)[6-8][0-9]{8}/g,
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  CREDIT_CARD: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
  BANK_ACCOUNT: /\b\d{10,12}\b/g,
} as const;

/**
 * Input validation utilities
 */
export const inputValidation = {
  /**
   * Validate email address
   */
  isValidEmail: (email: string): boolean => {
    return VALIDATION_PATTERNS.EMAIL.test(email);
  },

  /**
   * Validate phone number (South African format)
   */
  isValidPhone: (phone: string): boolean => {
    return VALIDATION_PATTERNS.PHONE.test(phone);
  },

  /**
   * Validate ID number (South African format)
   */
  isValidIdNumber: (idNumber: string): boolean => {
    return VALIDATION_PATTERNS.ID_NUMBER.test(idNumber);
  },

  /**
   * Validate password strength
   */
  isValidPassword: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`);
    }

    if (password.length > SECURITY_CONFIG.PASSWORD_MAX_LENGTH) {
      errors.push(`Password must be no more than ${SECURITY_CONFIG.PASSWORD_MAX_LENGTH} characters long`);
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Sanitize HTML input
   */
  sanitizeHtml: (input: string): string => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  /**
   * Sanitize user input for database storage
   */
  sanitizeInput: (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  },

  /**
   * Validate file upload
   */
  isValidFile: (
    file: File,
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxSize: number = 5 * 1024 * 1024 // 5MB
  ): { valid: boolean; error?: string } => {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    return { valid: true };
  },
};

/**
 * Data encryption utilities
 */
export const encryption = {
  /**
   * Generate a secure random string
   */
  generateSecureToken: (length: number = SECURITY_CONFIG.CSRF_TOKEN_LENGTH): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Hash a string using SHA-256
   */
  async hashString(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Encrypt sensitive data (basic implementation)
   */
  encryptData: (data: string, key: string): string => {
    // This is a basic implementation - in production, use a proper encryption library
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const keyBuffer = encoder.encode(key);
    
    // Simple XOR encryption (not secure for production)
    const encrypted = new Uint8Array(dataBuffer.length);
    for (let i = 0; i < dataBuffer.length; i++) {
      encrypted[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
    }
    
    return btoa(String.fromCharCode(...encrypted));
  },

  /**
   * Decrypt sensitive data (basic implementation)
   */
  decryptData: (encryptedData: string, key: string): string => {
    // This is a basic implementation - in production, use a proper encryption library
    const decoder = new TextDecoder();
    const encrypted = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
    const keyBuffer = new TextEncoder().encode(key);
    
    // Simple XOR decryption (not secure for production)
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ keyBuffer[i % keyBuffer.length];
    }
    
    return decoder.decode(decrypted);
  },
};

/**
 * Session management utilities
 */
export const sessionManagement = {
  /**
   * Create a secure session
   */
  createSession: (userId: string, userData: any): void => {
    const sessionData = {
      userId,
      userData,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      token: encryption.generateSecureToken(),
    };

    // Store session data securely
    sessionStorage.setItem('session', JSON.stringify(sessionData));
    
    // Set session timeout
    setTimeout(() => {
      sessionManagement.destroySession();
    }, SECURITY_CONFIG.SESSION_TIMEOUT);
  },

  /**
   * Get current session
   */
  getSession: (): any => {
    const sessionData = sessionStorage.getItem('session');
    if (!sessionData) return null;

    try {
      const session = JSON.parse(sessionData);
      
      // Check if session has expired
      if (Date.now() - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
        sessionManagement.destroySession();
        return null;
      }

      // Update last activity
      session.lastActivity = Date.now();
      sessionStorage.setItem('session', JSON.stringify(session));
      
      return session;
    } catch (error) {
      console.error('Error parsing session data:', error);
      sessionManagement.destroySession();
      return null;
    }
  },

  /**
   * Destroy current session
   */
  destroySession: (): void => {
    sessionStorage.removeItem('session');
    localStorage.removeItem('session');
    
    // Clear any sensitive data
    sessionStorage.clear();
    
    // Redirect to login page
    window.location.href = '/login';
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return sessionManagement.getSession() !== null;
  },
};

/**
 * Rate limiting utilities
 */
export const rateLimiting = {
  requests: new Map<string, { count: number; resetTime: number }>(),

  /**
   * Check if request is allowed
   */
  isAllowed: (identifier: string): boolean => {
    const now = Date.now();
    const requestData = rateLimiting.requests.get(identifier);

    if (!requestData || now > requestData.resetTime) {
      // Reset or create new rate limit data
      rateLimiting.requests.set(identifier, {
        count: 1,
        resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW,
      });
      return true;
    }

    if (requestData.count >= SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    requestData.count++;
    return true;
  },

  /**
   * Get remaining requests for identifier
   */
  getRemainingRequests: (identifier: string): number => {
    const requestData = rateLimiting.requests.get(identifier);
    if (!requestData || Date.now() > requestData.resetTime) {
      return SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS;
    }
    return Math.max(0, SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS - requestData.count);
  },
};

/**
 * Privacy utilities
 */
export const privacy = {
  /**
   * Detect sensitive data in text
   */
  detectSensitiveData: (text: string): { type: string; matches: string[] }[] => {
    const results: { type: string; matches: string[] }[] = [];

    Object.entries(SENSITIVE_DATA_PATTERNS).forEach(([type, pattern]) => {
      const matches = text.match(pattern);
      if (matches) {
        results.push({
          type,
          matches: matches.map(match => this.maskSensitiveData(match, type)),
        });
      }
    });

    return results;
  },

  /**
   * Mask sensitive data
   */
  maskSensitiveData: (data: string, type: string): string => {
    switch (type) {
      case 'ID_NUMBER':
        return data.replace(/(\d{6})(\d{7})/, '$1*******');
      case 'PHONE_NUMBER':
        return data.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3');
      case 'EMAIL':
        const [local, domain] = data.split('@');
        return `${local.charAt(0)}***@${domain}`;
      case 'CREDIT_CARD':
        return data.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '**** **** **** $4');
      case 'BANK_ACCOUNT':
        return data.replace(/(\d{4})(\d{6})/, '$1******');
      default:
        return data.replace(/(.{3})(.*)/, '$1***');
    }
  },

  /**
   * Anonymize user data
   */
  anonymizeData: (data: Record<string, any>): Record<string, any> => {
    const anonymized = { ...data };
    
    // Remove or mask sensitive fields
    const sensitiveFields = ['email', 'phone', 'idNumber', 'address', 'password'];
    sensitiveFields.forEach(field => {
      if (anonymized[field]) {
        anonymized[field] = privacy.maskSensitiveData(anonymized[field], field);
      }
    });

    return anonymized;
  },
};

/**
 * CSRF protection utilities
 */
export const csrfProtection = {
  /**
   * Generate CSRF token
   */
  generateToken: (): string => {
    return encryption.generateSecureToken(SECURITY_CONFIG.CSRF_TOKEN_LENGTH);
  },

  /**
   * Validate CSRF token
   */
  validateToken: (token: string, storedToken: string): boolean => {
    return token === storedToken && token.length === SECURITY_CONFIG.CSRF_TOKEN_LENGTH;
  },

  /**
   * Add CSRF token to request headers
   */
  addTokenToHeaders: (headers: Record<string, string>): Record<string, string> => {
    const token = csrfProtection.generateToken();
    return {
      ...headers,
      'X-CSRF-Token': token,
    };
  },
};

/**
 * Security monitoring utilities
 */
export const securityMonitoring = {
  /**
   * Log security event
   */
  logSecurityEvent: (event: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }): void => {
    const securityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: sessionManagement.getSession()?.token,
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Security Event:', securityEvent);
    }

    // In production, send to security monitoring service
    // TODO: Implement security event logging service
  },

  /**
   * Detect suspicious activity
   */
  detectSuspiciousActivity: (activity: {
    type: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    frequency: number;
  }): boolean => {
    // Simple suspicious activity detection
    const suspiciousPatterns = [
      activity.frequency > 10, // Too many requests
      activity.type === 'login_failed' && activity.frequency > 3, // Multiple failed logins
      activity.type === 'file_upload' && activity.frequency > 5, // Multiple file uploads
    ];

    return suspiciousPatterns.some(pattern => pattern);
  },
};

/**
 * GDPR compliance utilities
 */
export const gdpr = {
  /**
   * Check if user has given consent
   */
  hasConsent: (consentType: string): boolean => {
    const consents = JSON.parse(localStorage.getItem('gdpr-consents') || '{}');
    return consents[consentType] === true;
  },

  /**
   * Set user consent
   */
  setConsent: (consentType: string, granted: boolean): void => {
    const consents = JSON.parse(localStorage.getItem('gdpr-consents') || '{}');
    consents[consentType] = granted;
    consents[`${consentType}_timestamp`] = new Date().toISOString();
    localStorage.setItem('gdpr-consents', JSON.stringify(consents));
  },

  /**
   * Request data deletion
   */
  requestDataDeletion: async (userId: string): Promise<boolean> => {
    try {
      // TODO: Implement data deletion API call
      securityMonitoring.logSecurityEvent({
        type: 'data_deletion_requested',
        severity: 'medium',
        description: `Data deletion requested for user ${userId}`,
        userId,
      });
      
      return true;
    } catch (error) {
      console.error('Error requesting data deletion:', error);
      return false;
    }
  },

  /**
   * Export user data
   */
  exportUserData: async (userId: string): Promise<any> => {
    try {
      // TODO: Implement data export API call
      securityMonitoring.logSecurityEvent({
        type: 'data_export_requested',
        severity: 'low',
        description: `Data export requested for user ${userId}`,
        userId,
      });
      
      return { success: true, data: null };
    } catch (error) {
      console.error('Error exporting user data:', error);
      return { success: false, error: error.message };
    }
  },
}; 