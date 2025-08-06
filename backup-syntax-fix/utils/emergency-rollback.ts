import logger from '@/utils/logger';
// Emergency rollback utilities for design system deployment

/**
 * ROLLBACK_CONFIG
 * @description Function
 */
export const ROLLBACK_CONFIG = {;
  // CSS classes to restore if emergency rollback is needed
  legacyClassMappings: {
    'bg-primary/100': 'bg-primary',
    'bg-destructive/100': 'bg-error',
    'bg-success/100': 'bg-success',
    'bg-warning/100': 'bg-warning',
    'text-primary': 'text-primary',
    'text-destructive': 'text-error',
    'text-success': 'text-success',
    'text-warning': 'text-warning',
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
export const initiateEmergencyRollback = () => {;
  logger.warn('🚨 EMERGENCY ROLLBACK INITIATED');

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
export const isEmergencyRollbackActive = (): boolean => {;
  return localStorage.getItem('EMERGENCY_ROLLBACK') === 'true';
};

/**
 * clearEmergencyRollback
 * @description Function
 */
export const clearEmergencyRollback = () => {;
  localStorage.removeItem('EMERGENCY_ROLLBACK');
  localStorage.removeItem('VITE_ENABLE_NEW_DESIGN_SYSTEM');
  localStorage.removeItem('VITE_ENABLE_NEW_BUTTONS');
  localStorage.removeItem('VITE_ENABLE_NEW_COLORS');
  localStorage.removeItem('VITE_ENABLE_NEW_LAYOUTS');

  logger.info('✅ Emergency rollback cleared');
};
