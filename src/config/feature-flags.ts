// Feature Flags Configuration for EduEasy
// This file manages feature flags for controlled rollouts

export const featureFlags = {
  // VerifyID Feature Flag
  VERIFYID_ENABLED: import.meta.env.VITE_VERIFYID_ENABLED === 'true' || false,

  // Analytics Feature Flag
  ANALYTICS_ENABLED: import.meta.env.VITE_ANALYTICS_ENABLED === 'true' || false,

  // Payment Feature Flags
  PAYFAST_ENABLED: import.meta.env.VITE_PAYFAST_ENABLED === 'true' || false,

  // Development Feature Flags
  DEV_MODE: import.meta.env.VITE_DEV_MODE === 'true' || false,

  // Notification Feature Flags
  PUSH_NOTIFICATIONS_ENABLED: import.meta.env.VITE_PUSH_NOTIFICATIONS_ENABLED === 'true' || false,

  // AI Feature Flags
  THANDI_AI_ENABLED: import.meta.env.VITE_THANDI_AI_ENABLED === 'true' || false,

  // OCR Feature Flags
  OCR_ENABLED: import.meta.env.VITE_OCR_ENABLED === 'true' || false,
};

// Feature flag utility functions
export const isFeatureEnabled = (feature: keyof typeof featureFlags): boolean => {
  return featureFlags[feature];
};

export const getFeatureFlag = (feature: keyof typeof featureFlags): boolean => {
  return featureFlags[feature];
};

// Environment-specific feature overrides
export const getEnvironmentFeatures = () => {
  const env = import.meta.env.MODE;

  switch (env) {
    case 'development':
      return {
        ...featureFlags,
        VERIFYID_ENABLED: true, // Always enabled in development
        DEV_MODE: true,
      };
    case 'staging':
      return {
        ...featureFlags,
        VERIFYID_ENABLED: true, // Enabled in staging for testing
      };
    case 'production':
      return {
        ...featureFlags,
        // Production flags are controlled by environment variables
      };
    default:
      return featureFlags;
  }
};

// Feature flag validation
export const validateFeatureFlags = (): void => {
  const requiredFlags = ['VERIFYID_ENABLED'] as const;

  for (const flag of requiredFlags) {
    if (typeof featureFlags[flag] !== 'boolean') {
      console.warn(`Feature flag ${flag} is not properly configured`);
    }
  }
};

// Export default configuration
export default featureFlags;
