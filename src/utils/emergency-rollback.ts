// Emergency rollback utilities for design system deployment

/**
 * ROLLBACK_CONFIG
 * @description Function
 */
export const ROLLBACK_CONFIG = {
  // CSS classes to restore if emergency rollback is needed
  legacyClassMappings: {
    'bg-blue-500': 'bg-primary',
    'bg-red-500': 'bg-error',
    'bg-green-500': 'bg-success',
    'bg-yellow-500': 'bg-warning',
    'text-blue-600': 'text-primary',
    'text-red-600': 'text-error',
    'text-green-600': 'text-success',
    'text-yellow-600': 'text-warning',
  },

  // Components to disable if issues are detected
  rollbackComponents: ['Button', 'StatusBadge', 'Card', 'PageLayout'],

  // Critical pages that must work during rollback
  criticalPages: ['/login', '/register', '/dashboard', '/application-form', '/admin'],
};


/**
 * initiateEmergencyRollback
 * @description Function
 */
export const initiateEmergencyRollback = (): void => {
  console.warn('🚨 EMERGENCY ROLLBACK INITIATED');

  // Set feature flags to disable new design system
  localStorage.setItem('EMERGENCY_ROLLBACK', 'true');
  localStorage.setItem('VITE_ENABLE_NEW_DESIGN_SYSTEM', 'false');
  localStorage.setItem('VITE_ENABLE_NEW_BUTTONS', 'false');
  localStorage.setItem('VITE_ENABLE_NEW_COLORS', 'false');
  localStorage.setItem('VITE_ENABLE_NEW_LAYOUTS', 'false');

  // Reload the page to apply rollback
  window.location.reload();
};


/**
 * isEmergencyRollbackActive
 * @description Function
 */
export const isEmergencyRollbackActive = (): boolean => {
  return localStorage.getItem('EMERGENCY_ROLLBACK') === 'true';
};


/**
 * clearEmergencyRollback
 * @description Function
 */
export const clearEmergencyRollback = (): void => {
  localStorage.removeItem('EMERGENCY_ROLLBACK');
  localStorage.removeItem('VITE_ENABLE_NEW_DESIGN_SYSTEM');
  localStorage.removeItem('VITE_ENABLE_NEW_BUTTONS');
  localStorage.removeItem('VITE_ENABLE_NEW_COLORS');
  localStorage.removeItem('VITE_ENABLE_NEW_LAYOUTS');

  console.log('✅ Emergency rollback cleared');
};
