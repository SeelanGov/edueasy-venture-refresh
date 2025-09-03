/**
 * Configuration interface for payment-related settings
 */
export interface PaymentConfig {
  payfast: {
    merchantId: string;
    merchantKey: string;
    passphrase: string;
    sandbox: boolean;
  };
  site: {
    url: string;
    webhookUrl: string;
  };
}

/**
 * Configuration interface for Supabase settings
 */
export interface SupabaseConfig {
  url: string;
  serviceKey: string;
  anonKey: string;
}

/**
 * Main application configuration
 */
export interface AppConfig {
  payment: PaymentConfig;
  supabase: SupabaseConfig;
  environment: 'development' | 'staging' | 'production';
}

/**
 * Configuration validation errors
 */
export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public missingKeys: string[] = [],
    public invalidValues: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

/**
 * Configuration validator class
 */
export class ConfigValidator {
  private static instance: ConfigValidator;
  private config: AppConfig | null = null;

  private constructor() {}

  static getInstance(): ConfigValidator {
    if (!ConfigValidator.instance) {
      ConfigValidator.instance = new ConfigValidator();
    }
    return ConfigValidator.instance;
  }

  /**
   * Validate and return payment configuration
   */
  validatePaymentConfig(): PaymentConfig {
    const requiredKeys = [
      'PAYFAST_MERCHANT_ID',
      'PAYFAST_MERCHANT_KEY',
      'PAYFAST_PASSPHRASE',
      'PAYFAST_SANDBOX',
      'SITE_URL',
      'SUPABASE_URL',
    ];

    const missingKeys: string[] = [];
    const invalidValues: Record<string, unknown> = {};

    // Check for missing environment variables
    for (const key of requiredKeys) {
      const value = this.getEnvVar(key);
      if (!value) {
        missingKeys.push(key);
      }
    }

    if (missingKeys.length > 0) {
      throw new ConfigValidationError(
        'Missing required payment configuration environment variables',
        missingKeys,
      );
    }

    // Validate PayFast configuration
    const payfastConfig = {
      merchantId: this.getEnvVar('PAYFAST_MERCHANT_ID')!,
      merchantKey: this.getEnvVar('PAYFAST_MERCHANT_KEY')!,
      passphrase: this.getEnvVar('PAYFAST_PASSPHRASE')!,
      sandbox: this.getEnvVar('PAYFAST_SANDBOX') === 'true',
    };

    // Validate PayFast credentials format
    if (!this.isValidPayFastMerchantId(payfastConfig.merchantId)) {
      invalidValues['PAYFAST_MERCHANT_ID'] = payfastConfig.merchantId;
    }

    if (!this.isValidPayFastMerchantKey(payfastConfig.merchantKey)) {
      invalidValues['PAYFAST_MERCHANT_KEY'] = payfastConfig.merchantKey;
    }

    if (invalidValues && Object.keys(invalidValues).length > 0) {
      throw new ConfigValidationError('Invalid payment configuration values', [], invalidValues);
    }

    const config: PaymentConfig = {
      payfast: payfastConfig,
      site: {
        url: this.getEnvVar('SITE_URL')!,
        webhookUrl: `${this.getEnvVar('SUPABASE_URL')}/functions/v1/process-payment-webhook`,
      },
    };

    return config;
  }

  /**
   * Validate and return Supabase configuration
   */
  validateSupabaseConfig(): SupabaseConfig {
    const requiredKeys = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY'];

    const missingKeys: string[] = [];

    // Check for missing environment variables
    for (const key of requiredKeys) {
      const value = this.getEnvVar(key);
      if (!value) {
        missingKeys.push(key);
      }
    }

    if (missingKeys.length > 0) {
      throw new ConfigValidationError(
        'Missing required Supabase configuration environment variables',
        missingKeys,
      );
    }

    const config: SupabaseConfig = {
      url: this.getEnvVar('SUPABASE_URL')!,
      serviceKey: this.getEnvVar('SUPABASE_SERVICE_ROLE_KEY')!,
      anonKey: this.getEnvVar('SUPABASE_ANON_KEY')!,
    };

    // Validate Supabase URL format
    if (!this.isValidSupabaseUrl(config.url)) {
      throw new ConfigValidationError('Invalid Supabase URL format', [], {
        SUPABASE_URL: config.url,
      });
    }

    return config;
  }

  /**
   * Get complete application configuration
   */
  getAppConfig(): AppConfig {
    if (this.config) {
      return this.config;
    }

    this.config = {
      payment: this.validatePaymentConfig(),
      supabase: this.validateSupabaseConfig(),
      environment: this.getEnvironment(),
    };

    return this.config;
  }

  /**
   * Get environment variable safely
   */
  private getEnvVar(key: string): string | undefined {
    // Always allow env access during tests (Vitest/Jest)
    if (typeof process !== 'undefined' && process.env) {
      const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITEST_WORKER_ID;
      if (isTest) return process.env[key];
    }

    // In browser environment, avoid exposing secrets at runtime
    if (typeof window !== 'undefined') {
      return undefined;
    }

    // In Node.js environment
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }

    // In Deno environment (not available in frontend)
    // if (typeof Deno !== 'undefined') {
    //   return Deno.env.get(key);
    // }

    return undefined;
  }

  /**
   * Get current environment
   */
  private getEnvironment(): 'development' | 'staging' | 'production' {
    const env = this.getEnvVar('NODE_ENV') || this.getEnvVar('ENVIRONMENT') || 'development';

    if (env === 'production') return 'production';
    if (env === 'staging') return 'staging';
    return 'development';
  }

  /**
   * Validate PayFast merchant ID format
   */
  private isValidPayFastMerchantId(merchantId: string): boolean {
    // PayFast merchant IDs are typically numeric and 6-8 digits
    return /^\d{6,8}$/.test(merchantId);
  }

  /**
   * Validate PayFast merchant key format
   */
  private isValidPayFastMerchantKey(merchantKey: string): boolean {
    // PayFast merchant keys are typically alphanumeric and 8-16 characters
    return /^[a-zA-Z0-9]{8,16}$/.test(merchantKey);
  }

  /**
   * Validate Supabase URL format
   */
  private isValidSupabaseUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return (
        parsed.hostname.includes('supabase.co') ||
        parsed.hostname.includes('supabase.com') ||
        parsed.hostname.includes('localhost')
      );
    } catch {
      return false;
    }
  }

  /**
   * Check if configuration is valid for production
   */
  isProductionReady(): boolean {
    try {
      const config = this.getAppConfig();

      // In production, sandbox should be false
      if (config.environment === 'production' && config.payment.payfast.sandbox) {
        return false;
      }

      // All required configurations should be present
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get configuration status for debugging
   */
  getConfigStatus(): {
    isValid: boolean;
    environment: string;
    missingKeys: string[];
    productionReady: boolean;
  } {
    try {
      const config = this.getAppConfig();
      return {
        isValid: true,
        environment: config.environment,
        missingKeys: [],
        productionReady: this.isProductionReady(),
      };
    } catch (error) {
      if (error instanceof ConfigValidationError) {
        return {
          isValid: false,
          environment: this.getEnvironment(),
          missingKeys: error.missingKeys,
          productionReady: false,
        };
      }

      return {
        isValid: false,
        environment: this.getEnvironment(),
        missingKeys: ['unknown'],
        productionReady: false,
      };
    }
  }
}

// Export singleton instance

/**
 * configValidator
 * @description Validation function
 */
export const configValidator = ConfigValidator.getInstance();
