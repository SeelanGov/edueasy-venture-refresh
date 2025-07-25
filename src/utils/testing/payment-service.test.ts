import { supabase } from '@/integrations/supabase/client';
import { paymentService } from '@/services/paymentService';
import { configValidator } from '@/utils/configValidator';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock secure storage
vi.mock('@/utils/secureStorage', () => ({
  secureStorage: {
    setItem: vi.fn(),
    removeItem: vi.fn(),
    getItem: vi.fn(),
  },
}));

describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPaymentPlan', () => {
    it('should return correct payment plan for valid tier ID', () => {
      const plan = paymentService.getPaymentPlan('essential');
      expect(plan).toEqual({
        id: 'essential',
        name: 'Essential',
        description: 'Enhanced features for serious students',
        price_once_off: 199,
        max_applications: 3,
        max_documents: 20,
        includes_verification: true,
        includes_ai_assistance: true,
        includes_priority_support: false,
        thandi_tier: 'guidance',
      });
    });

    it('should return null for invalid tier ID', () => {
      const plan = paymentService.getPaymentPlan('invalid-tier');
      expect(plan).toBeNull();
    });
  });

  describe('getAllPaymentPlans', () => {
    it('should return all available payment plans', () => {
      const plans = paymentService.getAllPaymentPlans();
      expect(plans).toHaveLength(3);
      expect(plans.map((p) => p.id)).toEqual(['starter', 'essential', 'pro-ai']);
    });
  });

  describe('isPaymentMethodValid', () => {
    it('should return false for starter plan (free tier)', () => {
      expect(paymentService.isPaymentMethodValid('starter', 'card')).toBe(false);
      expect(paymentService.isPaymentMethodValid('starter', 'airtime')).toBe(false);
    });

    it('should return true for paid plans with valid payment methods', () => {
      const validMethods = ['card', 'airtime', 'qr', 'eft', 'store', 'payment-plan'];

      validMethods.forEach((method) => {
        expect(paymentService.isPaymentMethodValid('essential', method as any)).toBe(true);
        expect(paymentService.isPaymentMethodValid('pro-ai', method as any)).toBe(true);
      });
    });

    it('should return false for invalid payment methods', () => {
      expect(paymentService.isPaymentMethodValid('essential', 'invalid' as any)).toBe(false);
    });
  });

  describe('getAvailablePaymentMethods', () => {
    it('should return empty array for starter plan', () => {
      const methods = paymentService.getAvailablePaymentMethods('starter');
      expect(methods).toEqual([]);
    });

    it('should return all payment methods for paid plans', () => {
      const methods = paymentService.getAvailablePaymentMethods('essential');
      expect(methods).toEqual(['card', 'airtime', 'qr', 'eft', 'store', 'payment-plan']);
    });
  });

  describe('createPaymentSession', () => {
    it('should create payment session successfully', async () => {
      const mockResponse = {
        data: {
          payment_url: 'https://sandbox.payfast.co.za/eng/process',
          merchant_reference: 'test-ref-123',
          expires_at: '2025-01-20T10:00:00Z',
        },
        error: null,
      };

      (supabase.functions.invoke as any).mockResolvedValue(mockResponse);

      const session = await paymentService.createPaymentSession({
        tierId: 'essential',
        userId: 'test-user-id',
        paymentMethod: 'card',
      });

      expect(session).toEqual({
        paymentUrl: 'https://sandbox.payfast.co.za/eng/process',
        merchantReference: 'test-ref-123',
        expiresAt: '2025-01-20T10:00:00Z',
        status: 'pending',
      });

      expect(supabase.functions.invoke).toHaveBeenCalledWith('create-payment-session', {
        body: {
          tier: 'basic',
          user_id: 'test-user-id',
          payment_method: 'card',
        },
      });
    });

    it('should throw error for invalid tier', async () => {
      await expect(
        paymentService.createPaymentSession({
          tierId: 'invalid-tier',
          userId: 'test-user-id',
          paymentMethod: 'card',
        }),
      ).rejects.toThrow('Invalid tier selected');
    });

    it('should throw error for free tier', async () => {
      await expect(
        paymentService.createPaymentSession({
          tierId: 'starter',
          userId: 'test-user-id',
          paymentMethod: 'card',
        }),
      ).rejects.toThrow('Cannot create payment for free tier');
    });

    it('should throw error for invalid payment method', async () => {
      await expect(
        paymentService.createPaymentSession({
          tierId: 'essential',
          userId: 'test-user-id',
          paymentMethod: 'invalid' as any,
        }),
      ).rejects.toThrow('Invalid payment method for this tier');
    });

    it('should throw error for missing required fields', async () => {
      await expect(
        paymentService.createPaymentSession({
          tierId: '',
          userId: '',
          paymentMethod: 'card',
        }),
      ).rejects.toThrow('Missing required payment fields');
    });
  });

  describe('checkPaymentStatus', () => {
    it('should return payment status successfully', async () => {
      const mockResponse = {
        data: { status: 'paid' },
        error: null,
      };

      (supabase.functions.invoke as any).mockResolvedValue(mockResponse);

      const status = await paymentService.checkPaymentStatus('test-ref-123');
      expect(status).toBe('paid');

      expect(supabase.functions.invoke).toHaveBeenCalledWith('verify-payment-status', {
        body: { merchant_reference: 'test-ref-123' },
      });
    });

    it('should return null on error', async () => {
      (supabase.functions.invoke as any).mockRejectedValue(new Error('Network error'));

      const status = await paymentService.checkPaymentStatus('test-ref-123');
      expect(status).toBeNull();
    });
  });
});

describe('ConfigValidator', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('validatePaymentConfig', () => {
    it('should validate correct payment configuration', () => {
      process.env.PAYFAST_MERCHANT_ID = '12345678';
      process.env.PAYFAST_MERCHANT_KEY = 'testkey123';
      process.env.PAYFAST_PASSPHRASE = 'testpass';
      process.env.PAYFAST_SANDBOX = 'true';
      process.env.SITE_URL = 'https://test.com';
      process.env.SUPABASE_URL = 'https://test.supabase.co';

      const config = configValidator.validatePaymentConfig();

      expect(config.payfast.merchantId).toBe('12345678');
      expect(config.payfast.merchantKey).toBe('testkey123');
      expect(config.payfast.passphrase).toBe('testpass');
      expect(config.payfast.sandbox).toBe(true);
      expect(config.site.url).toBe('https://test.com');
    });

    it('should throw error for missing environment variables', () => {
      expect(() => configValidator.validatePaymentConfig()).toThrow(
        'Missing required payment configuration environment variables',
      );
    });

    it('should throw error for invalid PayFast merchant ID', () => {
      process.env.PAYFAST_MERCHANT_ID = 'invalid';
      process.env.PAYFAST_MERCHANT_KEY = 'testkey123';
      process.env.PAYFAST_PASSPHRASE = 'testpass';
      process.env.PAYFAST_SANDBOX = 'true';
      process.env.SITE_URL = 'https://test.com';
      process.env.SUPABASE_URL = 'https://test.supabase.co';

      expect(() => configValidator.validatePaymentConfig()).toThrow(
        'Invalid payment configuration values',
      );
    });
  });

  describe('validateSupabaseConfig', () => {
    it('should validate correct Supabase configuration', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';

      const config = configValidator.validateSupabaseConfig();

      expect(config.url).toBe('https://test.supabase.co');
      expect(config.serviceKey).toBe('test-service-key');
      expect(config.anonKey).toBe('test-anon-key');
    });

    it('should throw error for missing Supabase environment variables', () => {
      expect(() => configValidator.validateSupabaseConfig()).toThrow(
        'Missing required Supabase configuration environment variables',
      );
    });

    it('should throw error for invalid Supabase URL', () => {
      process.env.SUPABASE_URL = 'invalid-url';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';

      expect(() => configValidator.validateSupabaseConfig()).toThrow('Invalid Supabase URL format');
    });
  });

  describe('getConfigStatus', () => {
    it('should return valid status for correct configuration', () => {
      process.env.PAYFAST_MERCHANT_ID = '12345678';
      process.env.PAYFAST_MERCHANT_KEY = 'testkey123';
      process.env.PAYFAST_PASSPHRASE = 'testpass';
      process.env.PAYFAST_SANDBOX = 'true';
      process.env.SITE_URL = 'https://test.com';
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';

      const status = configValidator.getConfigStatus();

      expect(status.isValid).toBe(true);
      expect(status.environment).toBe('development');
      expect(status.missingKeys).toEqual([]);
      expect(status.productionReady).toBe(false); // false because sandbox is true
    });

    it('should return invalid status for missing configuration', () => {
      const status = configValidator.getConfigStatus();

      expect(status.isValid).toBe(false);
      expect(status.missingKeys.length).toBeGreaterThan(0);
      expect(status.productionReady).toBe(false);
    });
  });
});
