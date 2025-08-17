// Test feature flags configuration
export const isFeatureEnabled = (flag: string): boolean => {
  return true; // Default to enabled for tests
};

export const featureFlags = {
  VERIFYID_ENABLED: true,
  NEW_DESIGN_SYSTEM: true,
  ENHANCED_TRACKING: true,
};