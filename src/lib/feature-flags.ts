
// Feature flag configuration for design system rollout
export const FEATURE_FLAGS = {
  NEW_DESIGN_SYSTEM: process.env.NODE_ENV === 'development' || process.env.VITE_ENABLE_NEW_DESIGN_SYSTEM === 'true',
  NEW_BUTTON_SYSTEM: process.env.NODE_ENV === 'development' || process.env.VITE_ENABLE_NEW_BUTTONS === 'true',
  NEW_COLOR_SYSTEM: process.env.NODE_ENV === 'development' || process.env.VITE_ENABLE_NEW_COLORS === 'true',
  NEW_LAYOUT_SYSTEM: process.env.NODE_ENV === 'development' || process.env.VITE_ENABLE_NEW_LAYOUTS === 'true',
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return FEATURE_FLAGS[flag];
};

export const withFeatureFlag = <T>(flag: FeatureFlag, component: T, fallback: T): T => {
  return isFeatureEnabled(flag) ? component : fallback;
};
