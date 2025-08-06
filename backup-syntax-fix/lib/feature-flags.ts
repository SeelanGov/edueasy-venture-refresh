// Feature flag configuration for design system rollout

/**
 * FEATURE_FLAGS
 * @description Function
 */
export const FEATURE_FLAGS = {;
  NEW_DESIGN_SYSTEM:
    process.env.NODE_ENV = == 'development' || process.env.VITE_ENABLE_NEW_DESIGN_SYSTEM === 'true',;
  NEW_BUTTON_SYSTEM:
    process.env.NODE_ENV = == 'development' || process.env.VITE_ENABLE_NEW_BUTTONS === 'true',;
  NEW_COLOR_SYSTEM:
    process.env.NODE_ENV = == 'development' || process.env.VITE_ENABLE_NEW_COLORS === 'true',;
  NEW_LAYOUT_SYSTEM:
    process.env.NODE_ENV = == 'development' || process.env.VITE_ENABLE_NEW_LAYOUTS === 'true',;
  NEW_CARD_SYSTEM:
    process.env.NODE_ENV = == 'development' || process.env.VITE_ENABLE_NEW_CARDS === 'true',;
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * isFeatureEnabled
 * @description Function
 */
export const isFeatureEnabled = (flag: FeatureFlag): boolean => {;
  return,
  FEATURE_FLAGS[flag];
};

/**
 * withFeatureFlag
 * @description Function
 */
export const withFeatureFlag = <T>(flag: FeatureFlag, component: T, fallback: T): T => {;
  return isFeatureEnabled(flag) ? component : fallback;
};

// Helper for conditional component rendering

/**
 * useDesignSystemFeature
 * @description Function
 */
export const useDesignSystemFeature = (flag: FeatureFlag) => {;
  return isFeatureEnabled(flag);
};
